import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { AbstractControl, FormsModule } from '@angular/forms';
import { email, form, FormField, maxLength, required, validate } from '@angular/forms/signals';
import { MemberService } from '@app/personal-space/utils/member.service';
import { GoogleMapsLoaderService, GoogleMapsLoadErrorCode } from '@app/shared/services/google-maps-loader.service';
import { TypewriterActionType, TypewriterEffectService } from '@app/shared/services/typewriter-effect.service';
import { UserService } from '@app/shared/services/user.service';
import { environment } from '@environments/environment';
import { Notification_Insert_Input } from '@hasura/generated';
import { CheckboxComponent } from '@root/src/app/shared/utils/checkbox/checkbox.component';
import { LocalStorageService } from '@services/local-storage.service';
import { NotificationService } from '@services/notification.service';
import { ToastService, ToastType } from '@services/toast.service';
import { AuthService } from '@shared/utils/authentication/auth.service';
import { INotification } from '@shared/utils/models/notification.model';
import { IUser } from '@shared/utils/models/user.model';
import { EDITOR_TOOLBAR_MIN_CONFIG_TOKEN } from '@shared/utils/token/editor-config.token';
import { SESSION_STORAGE } from '@shared/utils/token/storage.token';
import { Utils } from '@shared/utils/utils';
import { htmlContentValidator } from '@shared/utils/validators/html-content.validator';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { catchError, EMPTY, finalize, switchMap } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-notification-editor',
  templateUrl: 'notification-editor.component.html',
  styleUrl: 'notification-editor.component.scss',
  imports: [
    CheckboxComponent,
    NgxEditorModule,
    NgTemplateOutlet,
    FormField,
    FormsModule
  ] 
})
export class NotificationEditorComponent implements OnInit, OnDestroy {
  public readonly editorMode = input<'create' | 'edit'>('create');
  public readonly defaultMail = input<string | undefined>(undefined);
  public readonly notification = input<INotification | undefined>(undefined);
  public readonly notificationChanged = output<INotification | undefined>();

  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly memberService = inject(MemberService);
  private readonly userService = inject(UserService);
  private readonly sessionStorage = inject(SESSION_STORAGE);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly toastService = inject(ToastService);
  private readonly typewriterEffectService = inject(TypewriterEffectService);
  private readonly googleMapsLoaderService = inject(GoogleMapsLoaderService);
  
  protected readonly isLoggedIn = this.authService.isAuthenticated.asReadonly();
  private readonly freeNotificationsLimit = this.userService.freeNotificationsLimit;
  private readonly limitReached = signal<boolean>(false);
  protected readonly locationInputElement = viewChild<ElementRef<HTMLInputElement>>('locationInputElement');
  protected readonly locationQuery = signal<string>('');
  protected readonly locationSuggestions = signal<{ placeId: string; primaryText: string; secondaryText: string; description: string }[]>([]);
  protected readonly locationDropdownOpen = signal<boolean>(false);
  protected readonly locationSelectionFailed = signal<boolean>(false);
  protected readonly selectedLocationLabel = signal<string>('');
  protected readonly placesAutocompleteWarning = signal<string | null>(null);
  private readonly googleMapsApiKey = environment.GOOGLE_MAPS_API_KEY;
  private autocompleteInitialized = false; // Guard gegen doppelte Initialisierung im effect
  private autocompleteService?: {
    getPlacePredictions: (
      request: { input: string; types?: string[] },
      callback: (
        predictions: {
          description?: string;
          place_id?: string;
          structured_formatting?: { main_text?: string; secondary_text?: string };
        }[] | null,
        status: string,
      ) => void,
    ) => void;
  };
  private placesService?: {
    getDetails: (
      request: {
        placeId: string;
        fields: string[];
      },
      callback: (
        place: {
          name?: string;
          formatted_address?: string;
          geometry?: {
            location?: {
              lat: () => number;
              lng: () => number;
            };
          };
        } | null,
        status: string,
      ) => void,
    ) => void;
  };
  private suggestionFetchTimeoutId?: ReturnType<typeof setTimeout>;
  private closeDropdownTimeoutId?: ReturnType<typeof setTimeout>;

  public readonly editor: Editor = new Editor();
  public readonly toolbar: Toolbar = inject(EDITOR_TOOLBAR_MIN_CONFIG_TOKEN);

  private readonly notificationModel = linkedSignal(() => {
    const notification = this.notification();
    let dueDate = notification?.dueDate;
    if (dueDate) {
      dueDate = new DatePipe('en-US').transform(dueDate, 'yyyy-MM-dd')!;
    }
    return ({
      subject: notification?.subject ?? '',
      additionalInfo: '',
      content: notification?.content ?? '',
      mail: notification?.mail ?? this.defaultMail() ?? this.localStorageService.getUserMail ?? '',
      dateTime: dueDate ?? Utils.tomorrow,
      isDraft: notification?.isDraft ?? false,
      isArchived: notification?.isArchived ?? false,
      locationCoordinates: notification?.extras.locationCoordinates ?? '',
      locationName: notification?.extras.locationName ?? '',
    })
  });
  
  protected readonly notificationForm = form(this.notificationModel, (path) => {
    maxLength(path.subject, 100);
    required(path.content);
    validate(path.content, ({ value }) => {
      const errors = htmlContentValidator()({ value: value() } as AbstractControl);
      if (errors?.['required']) {
        return {
          kind: 'required',
          message: 'Inhalt darf nicht leer sein',
        };
      }

      if (errors?.['minlength']) {
        return {
          kind: 'minlength',
          message: 'Inhalt ist zu kurz',
        };
      }

      return null;
    });

    required(path.mail);
    email(path.mail);
    validate(path.mail, ({ value }) => {
      if (this.editorMode() === 'edit') {
        return null;
      }

      const notificationCount = this.isLoggedIn()
        ? this.memberService.createdNotificationsThisMonthCount()
        : this.localStorageService.getSendedNotificationCount(value());
      const limitReached = notificationCount >= this.freeNotificationsLimit();
      if (limitReached) {
        return {
          kind: 'freeLimitReached',
          message: 'Limit für Benachrichtigungen diesen Monat erreicht',
        };
      }

      return null;
    });

    required(path.dateTime);
    validate(path.dateTime, ({ value }) => {
      if (value() < this.tomorrow) {
        return {
          kind: 'minDate',
          message: 'Datum muss in der Zukunft liegen',
        };
      }

      return null;
    });

    validate(path.locationCoordinates, ({ value }) => {
      const locationCoordinates = value().trim();
      if (!locationCoordinates) {
        return null;
      }

      const locationPattern = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
      if (!locationPattern.test(locationCoordinates)) {
        return {
          kind: 'invalidLocation',
          message: 'Bitte wähle einen Ort aus den Google-Vorschlägen.',
        };
      }

      return null;
    });
  });

  protected readonly retry = signal<boolean>(false);
  protected readonly sendingNotification = signal<boolean>(false);
  protected readonly placeholderSubject = 'Grüße von Notify!';

  public readonly typedPlaceholder = signal('');
  public readonly showPlaceholderAnimation = linkedSignal(() => this.editorMode() === 'create');

  private readonly tomorrow = Utils.tomorrow;

  constructor() {
    
    this.googleMapsLoaderService.loadPlacesApi(this.googleMapsApiKey);

    effect(() => {
      if (this.limitReached() && this.editorMode() === 'create') {
        this.resetForm();
        this.typewriterEffectService.setActions([
          { type: TypewriterActionType.PAUSE, duration: 1000 },
          { type: TypewriterActionType.TYPE, text: 'Maximum of free notifications reached for this month.' },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.PAUSE, duration: 2000 },
          { type: TypewriterActionType.TYPE, text: ' Do you want to create more notifications?' },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.TYPE, text: ' Just hold on!' },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.TYPE, text: ' *Reason: This is still in development mode and every request to the database costs money.' },
        ]);
        this.showPlaceholderAnimation.set(true);
        this.typewriterEffectService.animatePlaceholder(this.updatePlaceholder.bind(this));
      }
    });

    effect(() => {
      const locationInputRef = this.locationInputElement();
      if (!locationInputRef) return;

      const error = this.googleMapsLoaderService.loadError();
      if (error) {
        this.placesAutocompleteWarning.set(this.mapPlacesLoadError(error.code));
        return;
      }

      if (!this.googleMapsLoaderService.isLoaded()) return; // Effect läuft erneut sobald isLoaded() true wird

      if (this.autocompleteInitialized) return;
      this.autocompleteInitialized = true;
      this.placesAutocompleteWarning.set(null);
      if (!window.google?.maps?.places) return;
      this.autocompleteService = new window.google.maps.places.AutocompleteService();
      this.placesService = new window.google.maps.places.PlacesService(locationInputRef.nativeElement);
    });
  }

  public ngOnInit(): void {
    if (!this.checkIfMaxSendedNotificationCountIsReached()) {
      this.restoreDraftIfExists();
    
      if (this.showPlaceholderAnimation()) {
        this.typewriterEffectService.setActions([
          { type: TypewriterActionType.PAUSE, duration: 1000 },
          { type: TypewriterActionType.TYPE, text: 'Im März diesmal wirklich dran denken Tickets für das Sommerfes' },
          { type: TypewriterActionType.PAUSE, duration: 3000 },
          { type: TypewriterActionType.DELETE, count: 13 },
          { type: TypewriterActionType.TYPE, text: 'Rock am Ring zu kaufen.' },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.PAUSE, duration: 500 },
          { type: TypewriterActionType.TYPE, text: ' Manu auc' },
          { type: TypewriterActionType.DELETE, count: 3 },
          { type: TypewriterActionType.TYPE, text: 'und <u>Felix</u> auch einladen.' },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.PAUSE, duration: 2000 },
          { type: TypewriterActionType.TYPE, text: ' Für Lisa die <strong>Mütze</strong> mitbringen, die sie beim Weihnachtsmarktbesuch vergessen hat.' },
          { type: TypewriterActionType.PAUSE, duration: 3000 },
          { type: TypewriterActionType.LINEBREAK },
          { type: TypewriterActionType.TYPE, text: ' Deadline ist der <strong>14.03</strong>!' },
        ]);
        this.typewriterEffectService.animatePlaceholder(this.updatePlaceholder.bind(this));
      }
    }

    const initialLocation = this.notificationModel().locationCoordinates;
    const initialLocationName = this.notificationModel().locationName;
    this.locationQuery.set(initialLocationName || initialLocation);
    this.selectedLocationLabel.set(initialLocationName || initialLocation);
  }

  public ngOnDestroy(): void {
    const form = this.notificationModel();
    if (this.editorMode() == 'create' && form.content && form.content.length > 0) {
      this.sessionStorage.setItem('notificationDraft', JSON.stringify(form));
    }
    if (this.suggestionFetchTimeoutId) {
      clearTimeout(this.suggestionFetchTimeoutId);
    }
    if (this.closeDropdownTimeoutId) {
      clearTimeout(this.closeDropdownTimeoutId);
    }
    this.editor.destroy();
  }

  private restoreDraftIfExists(): void {
    const draft = this.sessionStorage.getItem('notificationDraft');
    if (draft) {
      const parsedDraft = JSON.parse(draft) as Partial<ReturnType<typeof this.notificationModel>>;
      this.notificationModel.update((current) => ({
        ...current,
        ...parsedDraft,
      }));
      const locationCoordinates = parsedDraft.locationCoordinates ?? '';
      const locationName = parsedDraft.locationName ?? locationCoordinates;
      this.locationQuery.set(locationName);
      this.selectedLocationLabel.set(locationName);
      this.showPlaceholderAnimation.set(false);
    }
  }

  private mapPlacesLoadError(code: GoogleMapsLoadErrorCode | undefined): string {
    switch (code) {
      case 'MISSING_API_KEY':
        return 'Google Places ist nicht konfiguriert: kein API-Key gesetzt.';
      case 'AUTH_FAILURE':
        return 'Google Maps Authentifizierung fehlgeschlagen. Prüfe API-Key, HTTP-Referrer, aktivierte APIs und Billing.';
      case 'SCRIPT_LOAD_ERROR':
        return 'Google Maps Script konnte nicht geladen werden. Prüfe CSP und Netzwerkzugriff auf maps.googleapis.com.';
      case 'TIMEOUT':
        return 'Google Maps Script-Timeout. Prüfe Netzwerk, Werbeblocker/Privacy-Tools und Firewall.';
      case 'PLACES_UNAVAILABLE':
        return 'Google Maps wurde geladen, aber Places ist nicht verfügbar. Aktiviere Places API (und ggf. Places API New) im gleichen Projekt.';
      case 'NOT_BROWSER':
        return 'Google Places ist nur im Browser verfügbar.';
      default:
        return 'Google Places konnte nicht geladen werden. Prüfe API-Key, Billing und Referrer.';
    }
  }

  private updateNotification(): void {
    const notification = this.notification();
    if (!notification) {
      this.toastService.showToast('Error updating notification. Please try again.', ToastType.Error);
      this.retry.set(true);
      this.notificationChanged.emit(undefined);
      return;
    }

    const formValue = this.notificationModel();
    const updatedNotification = {
      id: notification!.id,
      createdAt: notification!.createdAt,
      subject: formValue.subject || this.placeholderSubject,
      content: formValue.content,
      dueDate: formValue.dateTime.toString(),
      isDraft: formValue.isDraft,
      isArchived: formValue.isArchived,
      mail: formValue.mail,
      extras: {
        locationCoordinates: formValue.locationCoordinates || undefined,
        locationName: formValue.locationName || undefined,
      },
    } satisfies INotification;

    this.resetForm();
    this.notificationChanged.emit(updatedNotification);
  }

  private createNotification(): void {
    const formValue = this.notificationModel();
    const mail = formValue.mail;
    const notification = {
      Subject: formValue.subject || this.placeholderSubject,
      Content: formValue.content,
      DueDate: formValue.dateTime.toString(),
      IsDraft: formValue.isDraft,
      IsArchived: formValue.isArchived,
      UserId: this.userService.currUser()?.userId,
      Mail: mail,
    } satisfies Notification_Insert_Input;

    (notification as { Extras?: INotification['extras'] }).Extras = {
      locationCoordinates: formValue.locationCoordinates || undefined,
      locationName: formValue.locationName || undefined,
    };

    this.sendingNotification.set(true)
    this.userService.getUserByMailOrCreateUserIfNotExists(mail).pipe(
      switchMap((user: IUser) => this.notificationService.createNotification(notification, user)),
      catchError((error) => {
        console.error(`Error creating notification.\n Error message: ${error.message}\n Stack trace: ${error.stack}`);
        this.toastService.showToast('Error creating notification. Please try again.', ToastType.Error);
        this.retry.set(true);
        this.notificationChanged.emit(undefined);
        return EMPTY;
      }),
      finalize(() => {
        this.sendingNotification.set(false);
        this.retry.set(false);
      })
    ).subscribe((result) => {
      this.resetForm();
      this.localStorageService.setUserMail(mail);

      if (!this.authService.isAuthenticated()) {
        this.localStorageService.increaseSendedNotificationCount();
        if (this.checkIfMaxSendedNotificationCountIsReached()) {
          this.toastService.showToast(
            'Max amount of notifications reached this month',
            ToastType.Warning,
            10000
          );
        }
      } else {
        // localStorage is handled by dialogClose event
      }

      this.notificationChanged.emit(result);
    });
  }

  public processSubmit(event: Event): void {
    event.preventDefault();

    if (this.notificationModel().additionalInfo.length > 0) {
      this.toastService.showToast('Bot detected. If you are not a bot, please try again.', ToastType.Error);
      this.notificationForm.additionalInfo().value.set('');
      return;
    }

    if (this.notificationForm().invalid()) {
      console.error('Form is invalid. Please check the input fields.');
      console.dir(this.notificationForm());
      return;
    }

    if (this.locationQuery().trim().length > 0 && this.notificationForm.locationCoordinates().value().trim().length === 0) {
      this.locationSelectionFailed.set(true);
      return;
    }

    if (this.editorMode() === 'edit') {
      this.updateNotification();
    } else {
      this.createNotification();
    }
  }

  private checkIfMaxSendedNotificationCountIsReached(): boolean {
    const count = this.isLoggedIn()
      ? this.memberService.createdNotificationsThisMonthCount()
      : this.localStorageService.getSendedNotificationCount(this.localStorageService.getUserMail ?? '');
    const limitReached = count >= this.freeNotificationsLimit();
    this.limitReached.set(limitReached);
    return limitReached;
  }

  private updatePlaceholder(text: string): void {
    this.typedPlaceholder.set(text);
  }

  protected onContentChange(content: string): void {
    this.notificationForm.content().value.set(content ?? '');
  }

  protected onLocationInputChange(value: string): void {
    this.locationQuery.set(value);
    this.locationSelectionFailed.set(false);
    this.notificationForm.locationCoordinates().value.set('');
    this.notificationForm.locationName().value.set(value.trim());
    if (value.trim().length === 0) {
      this.locationSuggestions.set([]);
      this.locationDropdownOpen.set(false);
      this.selectedLocationLabel.set('');
      return;
    }

    this.fetchLocationSuggestions(value.trim());
  }

  protected clearLocation(): void {
    this.locationQuery.set('');
    this.locationSuggestions.set([]);
    this.locationDropdownOpen.set(false);
    this.locationSelectionFailed.set(false);
    this.selectedLocationLabel.set('');
    this.notificationForm.locationCoordinates().value.set('');
    this.notificationForm.locationName().value.set('');
  }

  protected onLocationInputFocus(): void {
    if (this.locationSuggestions().length > 0) {
      this.locationDropdownOpen.set(true);
    }
  }

  protected onLocationInputBlur(): void {
    this.closeDropdownTimeoutId = setTimeout(() => {
      this.locationDropdownOpen.set(false);
    }, 150);
  }

  protected selectLocationSuggestion(
    suggestion: { placeId: string; primaryText: string; secondaryText: string; description: string },
    event: MouseEvent,
  ): void {
    event.preventDefault();
    if (this.closeDropdownTimeoutId) {
      clearTimeout(this.closeDropdownTimeoutId);
    }

    if (!this.placesService) {
      this.locationSelectionFailed.set(true);
      return;
    }

    this.placesService.getDetails(
      {
        placeId: suggestion.placeId,
        fields: ['formatted_address', 'geometry', 'name'],
      },
      (place, status) => {
        if (status !== 'OK' || !place) {
          this.locationSelectionFailed.set(true);
          return;
        }

        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();
        if (lat === undefined || lng === undefined) {
          this.locationSelectionFailed.set(true);
          this.notificationForm.locationCoordinates().value.set('');
          return;
        }

        const coordinates = `${lat.toFixed(6)},${lng.toFixed(6)}`;
        const locationName = place.formatted_address || place.name || suggestion.description || coordinates;
        this.locationSelectionFailed.set(false);
        this.notificationForm.locationCoordinates().value.set(coordinates);
        this.notificationForm.locationName().value.set(locationName);
        this.locationQuery.set(locationName);
        this.selectedLocationLabel.set(locationName);
        this.locationSuggestions.set([]);
        this.locationDropdownOpen.set(false);
      },
    );
  }

  private fetchLocationSuggestions(input: string): void {
    if (!this.autocompleteService) {
      return;
    }

    if (this.suggestionFetchTimeoutId) {
      window.clearTimeout(this.suggestionFetchTimeoutId);
    }

    this.suggestionFetchTimeoutId = setTimeout(() => {
      this.autocompleteService?.getPlacePredictions(
        {
          input,
        },
        (predictions, status) => {
          if (status !== 'OK' || !predictions?.length) {
            this.locationSuggestions.set([]);
            this.locationDropdownOpen.set(false);
            return;
          }

          const mappedSuggestions = predictions
            .filter((prediction) => !!prediction.place_id)
            .map((prediction) => ({
              placeId: prediction.place_id as string,
              primaryText: prediction.structured_formatting?.main_text || prediction.description || '',
              secondaryText: prediction.structured_formatting?.secondary_text || '',
              description: prediction.description || '',
            }));

          this.locationSuggestions.set(mappedSuggestions);
          this.locationDropdownOpen.set(mappedSuggestions.length > 0);
        },
      );
    }, 180);
  }

  protected hasMailError(kind: string): boolean {
    return this.notificationForm.mail().errors().some((error) => error.kind === kind);
  }

  public resetForm(): void {
    this.notificationModel.set({
      subject: '',
      additionalInfo: '',
      content: '',
      mail: this.localStorageService.getUserMail ?? '',
      dateTime: this.tomorrow,
      isDraft: false,
      isArchived: false,
      locationCoordinates: '',
      locationName: '',
    });
    this.locationQuery.set('');
    this.locationSuggestions.set([]);
    this.locationDropdownOpen.set(false);
    this.locationSelectionFailed.set(false);
    this.selectedLocationLabel.set('');
  }
}