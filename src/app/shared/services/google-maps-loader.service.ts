import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

export type GoogleMapsLoadErrorCode =
  | 'NOT_BROWSER'
  | 'MISSING_API_KEY'
  | 'AUTH_FAILURE'
  | 'SCRIPT_LOAD_ERROR'
  | 'TIMEOUT'
  | 'PLACES_UNAVAILABLE';

export interface GoogleMapsLoadResult {
  success: boolean;
  code?: GoogleMapsLoadErrorCode;
  detail?: string;
}

declare global {
  interface Window {
    gm_authFailure?: () => void;
    google?: {
      maps?: {
        importLibrary?: (libraryName: string) => Promise<unknown>;
        places?: {
          AutocompleteService: new () => {
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
          PlacesService: new (container: HTMLElement) => {
            getDetails: (
              request: { placeId: string; fields: string[] },
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
          Autocomplete: new (
            input: HTMLInputElement,
            options?: {
              fields?: string[];
              types?: string[];
            }
          ) => {
            addListener: (eventName: string, handler: () => void) => { remove: () => void };
            getPlace: () => {
              name?: string;
              formatted_address?: string;
              geometry?: {
                location?: {
                  lat: () => number;
                  lng: () => number;
                };
              };
            };
          };
        };
      };
    };
  }
}

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private loadPromise?: Promise<GoogleMapsLoadResult>;

  private async ensurePlacesAutocompleteAvailable(): Promise<boolean> {
    if (window.google?.maps?.places?.Autocomplete) {
      return true;
    }

    if (window.google?.maps?.importLibrary) {
      try {
        await window.google.maps.importLibrary('places');
      } catch {
        return false;
      }
    }

    if (window.google?.maps?.places?.Autocomplete) {
      return true;
    }

    const maxChecks = 30;
    const delayMs = 100;
    for (let i = 0; i < maxChecks; i += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, delayMs));
      if (window.google?.maps?.places?.Autocomplete) {
        return true;
      }
    }

    return false;
  }

  public loadPlacesApi(apiKey: string): Promise<GoogleMapsLoadResult> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve({
        success: false,
        code: 'NOT_BROWSER',
        detail: 'Google Places ist nur im Browser verfügbar.',
      });
    }

    if (!apiKey || apiKey.trim().length === 0) {
      return Promise.resolve({
        success: false,
        code: 'MISSING_API_KEY',
        detail: 'Kein Google Maps API-Key gesetzt.',
      });
    }

    if (window.google?.maps?.places?.Autocomplete) {
      return Promise.resolve({ success: true });
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise<GoogleMapsLoadResult>((resolve) => {
      const timeoutMs = 12000;
      let settled = false;
      const finish = (result: GoogleMapsLoadResult): void => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timeoutId);
        window.gm_authFailure = previousAuthFailure;
        resolve(result);
      };

      const previousAuthFailure = window.gm_authFailure;
      window.gm_authFailure = () => {
        previousAuthFailure?.();
        finish({
          success: false,
          code: 'AUTH_FAILURE',
          detail: 'Google Maps API hat die Authentifizierung abgelehnt (z. B. Key, Referrer oder Billing).',
        });
      };

      const timeoutId = window.setTimeout(() => {
        finish({
          success: false,
          code: 'TIMEOUT',
          detail: `Google Maps Script hat nicht innerhalb von ${timeoutMs / 1000}s geladen.`,
        });
      }, timeoutMs);

      const existingScript = this.document.getElementById('google-maps-js-api');
      if (existingScript) {
        if (window.google?.maps) {
          void this.ensurePlacesAutocompleteAvailable().then((available) => {
            finish(
              available
                ? { success: true }
                : {
                    success: false,
                    code: 'PLACES_UNAVAILABLE',
                    detail: 'Script geladen, aber Places Autocomplete ist nicht verfügbar.',
                  },
            );
          });
          return;
        }

        existingScript.addEventListener('load', () => {
          void this.ensurePlacesAutocompleteAvailable().then((available) => {
            finish(
              available
                ? { success: true }
                : {
                    success: false,
                    code: 'PLACES_UNAVAILABLE',
                    detail: 'Script geladen, aber Places Autocomplete ist nicht verfügbar.',
                  },
            );
          });
        }, { once: true });
        existingScript.addEventListener('error', () => {
          finish({
            success: false,
            code: 'SCRIPT_LOAD_ERROR',
            detail: 'Google Maps Script konnte nicht geladen werden.',
          });
        }, { once: true });
        return;
      }

      const script = this.document.createElement('script');
      script.id = 'google-maps-js-api';
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&loading=async`;
      script.addEventListener('load', () => {
        void this.ensurePlacesAutocompleteAvailable().then((available) => {
          finish(
            available
              ? { success: true }
              : {
                  success: false,
                  code: 'PLACES_UNAVAILABLE',
                  detail: 'Script geladen, aber Places Autocomplete ist nicht verfügbar.',
                },
          );
        });
      }, { once: true });
      script.addEventListener('error', () => {
        finish({
          success: false,
          code: 'SCRIPT_LOAD_ERROR',
          detail: 'Google Maps Script konnte nicht geladen werden.',
        });
      }, { once: true });

      this.document.head.appendChild(script);
    });

    return this.loadPromise;
  }
}