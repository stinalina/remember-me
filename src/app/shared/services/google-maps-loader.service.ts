import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { catchError, first, from, interval, map, Observable, of, switchMap, take } from 'rxjs';

export type GoogleMapsLoadErrorCode =
  | 'NOT_BROWSER'
  | 'MISSING_API_KEY'
  | 'AUTH_FAILURE'
  | 'SCRIPT_LOAD_ERROR'
  | 'TIMEOUT'
  | 'PLACES_UNAVAILABLE';

type LoadState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'ready' }
  | { readonly status: 'error'; readonly code: GoogleMapsLoadErrorCode; readonly detail: string };

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _state = signal<LoadState>({ status: 'idle' });

  readonly isLoaded = computed(() => this._state().status === 'ready');
  readonly isLoading = computed(() => this._state().status === 'loading');
  readonly loadError = computed(() => {
    const state = this._state();
    return state.status === 'error' ? { code: state.code, detail: state.detail } : null;
  });

  public loadPlacesApi(apiKey: string): void {
    if (this._state().status !== 'idle') {
      return;
    };
    this.startLoad(apiKey);
  }

  private startLoad(apiKey: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      this._state.set({ status: 'error', code: 'NOT_BROWSER', detail: 'Google Places ist nur im Browser verfügbar.' });
      return;
    }
    if (!apiKey || apiKey.trim().length === 0) {
      this._state.set({ status: 'error', code: 'MISSING_API_KEY', detail: 'Kein Google Maps API-Key gesetzt.' });
      return;
    }
    if (window.google?.maps?.places?.Autocomplete) {
      this._state.set({ status: 'ready' });
      return;
    }

    this._state.set({ status: 'loading' });
    this.attachScript(apiKey);
  }

  private attachScript(apiKey: string): void {
    const timeoutMs = 12000;
    let settled = false;

    const finish = (next: Extract<LoadState, { status: 'ready' | 'error' }>): void => {
      if (settled) {
        return;
      };
      settled = true;
      clearTimeout(timeoutId);
      window.gm_authFailure = previousAuthFailure;
      this._state.set(next);
    };

    const previousAuthFailure = window.gm_authFailure;
    window.gm_authFailure = () => {
      previousAuthFailure?.();
      finish({ status: 'error', code: 'AUTH_FAILURE', detail: 'Google Maps API hat die Authentifizierung abgelehnt (z. B. Key, Referrer oder Billing).' });
    };

    const timeoutId = window.setTimeout(() => {
      finish({ status: 'error', code: 'TIMEOUT', detail: `Google Maps Script hat nicht innerhalb von ${timeoutMs / 1000}s geladen.` });
    }, timeoutMs);

    const onLoad = (): void => {
      this.ensurePlacesAutocompleteAvailable().subscribe(available =>
        finish(available
          ? { status: 'ready' }
          : { status: 'error', code: 'PLACES_UNAVAILABLE', detail: 'Script geladen, aber Places Autocomplete ist nicht verfügbar.' }
        )
      );
    };

    const onError = (): void =>
      finish({ status: 'error', code: 'SCRIPT_LOAD_ERROR', detail: 'Google Maps Script konnte nicht geladen werden.' });

    const existingScript = this.document.getElementById('google-maps-js-api');
    if (existingScript) {
      if (window.google?.maps) { onLoad(); return; }
      existingScript.addEventListener('load', onLoad, { once: true });
      existingScript.addEventListener('error', onError, { once: true });
      return;
    }

    const script = this.document.createElement('script');
    script.id = 'google-maps-js-api';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&loading=async`;
    script.addEventListener('load', onLoad, { once: true });
    script.addEventListener('error', onError, { once: true });
    this.document.head.appendChild(script);
  }

  private ensurePlacesAutocompleteAvailable(): Observable<boolean> {
    if (window.google?.maps?.places?.Autocomplete) {
      return of(true);
    }

    const afterImport$ = window.google?.maps?.importLibrary
      ? from(window.google.maps.importLibrary('places')).pipe(catchError(() => of(null)))
      : of(null);

    return afterImport$.pipe(
      switchMap(() => {
        if (window.google?.maps?.places?.Autocomplete) {
          return of(true);
        }

        // Alle 100 ms prüfen, max. 30× (= 3 Sekunden)
        return interval(100).pipe(
          take(30),
          map(() => Boolean(window.google?.maps?.places?.Autocomplete)),
          first(available => available, false),
        );
      }),
    );
  }
}