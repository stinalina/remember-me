import { InjectionToken } from "@angular/core";
import { NgxEditorModule, Toolbar } from "ngx-editor";
import { schema } from 'ngx-editor/schema';

//https://sibiraj-s.github.io/ngx-editor/configuration/
export const EDITOR_CONFIG_TOKEN = new InjectionToken<{}>('editor.config', {
  providedIn: 'root',
  factory: () => ({
    content: 'html',
    history: true,
    keyboardShortcuts: true,
    inputRules: true,
    plugins: [], //https://prosemirror.net/docs/guide/#state
    schema, //https://prosemirror.net/examples/schema/
    nodeViews: {}, //https://prosemirror.net/docs/guide/#state,
    attributes: {}, // https://prosemirror.net/docs/ref/#view.EditorProps.attributes
    linkValidationPattern: '',
    parseOptions: {}, // https://prosemirror.net/docs/ref/#model.ParseOptions
  }),
});

export const EDITOR_TOOLBAR_MIN_CONFIG_TOKEN = new InjectionToken<Toolbar>(
'editor.toolbar.min.config', {
  providedIn: 'root',
  factory: () => [
    ['bold', 'italic'],
    ['underline', 'text_color'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['align_left', 'align_center'],
  ]
});

export const EDITOR_TOOLBAR_EXTENDEND_CONFIG_TOKEN = new InjectionToken<Toolbar>(
  'editor.toolbar.extended.config', {
    providedIn: 'root',
    factory: () => [
      ['bold', 'italic'],
      ['underline', 'strike'],
      ['code', 'blockquote'],
      ['ordered_list', 'bullet_list'],
      [{ heading: ['h1', 'h2', 'h3', 'h4'] }],
      ['link', 'image'],
      // or, set options for link:
      //[{ link: { showOpenInNewTab: false } }, 'image'],
      ['text_color', 'background_color'],
      ['align_left', 'align_center', 'align_right', 'align_justify'],
      ['horizontal_rule', 'format_clear', 'indent', 'outdent'],
      ['superscript', 'subscript'],
      ['undo', 'redo'],
      //TODO emojis, anhänge etc.
    ]
  });
