# RememberMe – Webclient

Eine Angular-Web-App, mit der Nutzer Erinnerungsbenachrichtigungen erstellen und verwalten können (sobald der Anmeldebereich umgesetzt wurde).

**Live:** [www.reme-notify.de](https://www.reme-notify.de)
---

## Tech-Stack

| Bereich | Technologie |
|---|---|
| Frontend | Angular 20, Standalone Components |
| Styling | Tailwind CSS, DaisyUI |
| Rich-Text-Editor | ngx-editor |
| API | GraphQL (Apollo Angular) + Hasura |
| Datenbank | PostgreSQL |
| Serverless Backend | [Azure Functions](https://github.com/stinalina/az-functions) |
| E2E-Tests | Playwright |
| Unit-Tests | Karma / Jasmine |
| CI/CD | GitHub Actions |
| Monitoring | Azure Monitor / Application Insights |

---


<img width="1892" height="906" alt="image" src="https://github.com/user-attachments/assets/127542ad-6fab-45f9-8c69-f504f5b60868" />
<img width="1895" height="907" alt="image" src="https://github.com/user-attachments/assets/c7ab303c-cdf4-4880-88ec-2663806120ee" />

---

## ToastService als npm-Package

Der ToastService wurde in die Angular-Library `toast-service` ausgelagert (`/projects/toast-service`).

Build der Library:

```bash
npx ng build toast-service
```

Nach dem Build liegt das veröffentlichbare Paket unter:

`dist/toast-service`

### Veröffentlichung auf npmjs.com

1. Bei npm einloggen: `npm login`
2. In den Build-Ordner wechseln: `cd dist/toast-service`
3. Paket veröffentlichen: `npm publish --access public`

Quelle (offizielle npm-Dokumentation):
https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry
