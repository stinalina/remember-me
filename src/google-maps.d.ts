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
