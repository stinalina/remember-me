# Technologien & Infrastruktur

## Frontend & Styling  
### 1. DaisyUI / Tailwind CSS  
Ein Design- und Komponenten-Framework für Utility-first CSS: Tailwind CSS liefert die Basis („utility-classes“), und daisyUI baut darauf auf und stellt vordefinierte Komponentenklassen wie `btn`, `card` bereit, sodass schneller und sauberer UI aufgebaut werden kann. :contentReference[oaicite:2]{index=2}  
Dokumentation: https://daisyui.com/docs/install/cli/ :contentReference[oaicite:3]{index=3}  

### 2. Barrierefreiheit (Accessibility)  
Barrierefreiheit ist ein Querschnittsthema: z. B. semantisches HTML, ARIA-Attribute, Tastaturnavigation, Farbkontraste etc. Diese Anforderungen sind integraler Bestandteil beim Frontend-Entwurf mit Angular & Styling.  

## Frontend Framework  
### 3. Angular 20  
Unser Framework für das Frontend: Angular in Version 20 bringt u. a. Standalone Components als Standard, optionaler Zoneless Change Detection und moderne Template-Features – ideal für modularere und performantere Web-Apps. :contentReference[oaicite:5]{index=5}  
Dokumentation: https://angular.io/docs (siehe Angular 20)  

## End-to-End Testing  
### 4. Playwright (E2E)  
Für automatisierte End-to-End Tests nutzen wir Playwright: Browser­übergreifend, unterstützt Chromium, Firefox und WebKit, bietet Auto-Waits, Trace Viewer, gute Suite-Integration – damit sichern wir unsere UI-Flows ab. :contentReference[oaicite:7]{index=7}  
Dokumentation: https://playwright.dev  

## Backend / API  
### 5. GraphQL + Hasura  
Für die API-Schicht nutzen wir Hasura GraphQL Engine: Das verbindet eine Daten­bank (z. B. PostgreSQL) mit einem sofort verfügbaren GraphQL API-Layer (Queries, Mutations, Subscriptions, Role-basierte Autorisierung). :contentReference[oaicite:9]{index=9}  
Dokumentation: https://hasura.io/docs/2.0/index/  

### 6. PostgreSQL  
Als relationale Daten­bank setzen wir PostgreSQL ein – leistungsfähig, etabliert, mit guter Open-Source-Gemeinschaft. :contentReference[oaicite:11]{index=11}  
Dokumentation: https://www.postgresql.org/docs/  

### 7. Azure Functions (Light Backend)  
Für serverlose leichte Backend-Services oder Events nutzen wir Azure Functions: Ereignis­gesteuert, skalierbar, ideal für Microservices oder kleine Endpunkte. :contentReference[oaicite:13]{index=13}  
Dokumentation: https://learn.microsoft.com/azure/azure-functions/  

## Sicherheit & Identität  
### 8. Keycloak  
Für Authentifizierung & Autorisierung verwenden wir Keycloak: SSO, OAuth2/OpenID Connect, Benutzer­verwaltung, Rollen etc. :contentReference[oaicite:15]{index=15}  
Dokumentation: https://www.keycloak.org/documentation  

## DevOps / Infrastruktur / Monitoring  
### 9. GitHub Workflows CI/CD  
Zur Automatisierung von Build, Test, Deployment setzen wir auf GitHub Actions: direkt in GitHub integrierbar, flexibel für CI/CD-Pipelines. :contentReference[oaicite:17]{index=17}  
Dokumentation: https://docs.github.com/actions  

### 10. Monitoring Azure  
Für Überwachung, Logs, Metriken unserer Infrastruktur nutzen wir die Monitoring-Dienste von Microsoft Azure – z. B. Azure Monitor, Application Insights etc. (Dokumentation direkt bei Azure)  

### 11. MCP Server  
Der MCP-Server dient als Context- und Tool-Provider innerhalb des Protokolls: Er stellt einem oder mehreren Clients (z. B. Agenten, IDEs) kontextuelle Daten, Werkzeuge und Prompt-Bausteine zur Verfügung und erlaubt so z. B. eine standardisierte Integration von KI-Systemen mit externen Datenquellen und Services. 
Dokumentation: https://modelcontextprotocol.io/specification/draft/architecture/index
 
## KI / Assistenz  
### 12. AI für Autovervollständigung  
Zur Verbesserung der Entwickler­produktivität und Code-Qualität setzen wir KI-basierte Autovervollständigung (z. B. IDE-Plugins, Code-Assistants) ein – falls ein spezifisches Produkt genutzt wird, Dokumentation entsprechend verlinken.

---
