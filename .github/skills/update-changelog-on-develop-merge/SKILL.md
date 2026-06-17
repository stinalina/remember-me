---
name: update-changelog-on-develop-merge
description: 'Aktualisiert docs/CHANGELOG.md bei Merge eines Branches in develop. Use when: merge to develop, PR merge, release notes, changelog update, Zusammenfassung von Features/Fixes/Refactors.'
argument-hint: 'Welche Branch- oder PR-Aenderungen wurden nach develop gemerged?'
user-invocable: true
disable-model-invocation: false
---

# Changelog bei Merge nach develop aktualisieren

## Ziel

Diese Skill erstellt oder aktualisiert den Eintrag in `docs/CHANGELOG.md`, sobald ein Branch in `develop` gemerged wurde.

## Wann verwenden

- Ein Feature-, Fix- oder Refactor-Branch wurde in `develop` gemerged.
- Es gibt einen abgeschlossenen PR/Merge und die Aenderungen sollen dokumentiert werden.
- Es wird eine nachvollziehbare Historie der Aenderungen fuer das Team benoetigt.

## Eingaben

- Merge-Kontext: Branchname, PR-Titel, optional PR-Nummer
- Zusammenfassung der Aenderungen (Features, Fixes, Breaking Changes)
- Datum des Merges

## Vorgehen

1. Pruefe, ob ein Merge nach `develop` stattgefunden hat und welche Aenderungen enthalten sind.
2. Sammle die Aenderungen in vier Kategorien:
   - Added
   - Changed
   - Fixed
   - Removed
3. Entscheide das Zielsegment im Changelog:
   - Falls `docs/CHANGELOG.md` leer ist: initialen Abschnitt anlegen.
   - Falls bereits ein `Unreleased`-Bereich existiert: dort neue Punkte ergaenzen.
   - Falls kein `Unreleased`-Bereich existiert: einen neuen `Unreleased`-Bereich am Anfang anlegen.
4. Schreibe praezise, nutzerorientierte Stichpunkte pro Kategorie.
5. Verweise optional auf PR/Branch in Klammern, z. B. `(PR #123, feature/login)`.
6. Speichere die Datei in `docs/CHANGELOG.md`.

## Entscheidungslogik

- Wenn keine relevanten Produktaenderungen enthalten sind (nur Formatierung/Tooling ohne Verhaltensaenderung):
  - Fuege keinen fachlichen Punkt hinzu oder notiere eine kurze technische Aenderung unter `Changed`.
- Wenn Breaking Changes enthalten sind:
  - Kennzeichne den Punkt explizit mit `BREAKING:` am Satzanfang.
- Wenn unklare Aenderungen vorliegen:
  - Erst Rueckfrage zu fachlicher Wirkung, dann Changelog schreiben.

## Qualitaetskriterien

- Jeder Punkt beschreibt die Wirkung, nicht nur interne Implementierungsdetails.
- Keine doppelten Eintraege fuer dieselbe Aenderung.
- Konsistente Zeitform und Sprache innerhalb eines Eintrags.
- Kategorien `Added/Changed/Fixed/Removed` nur verwenden, wenn sie Inhalte haben.
- Datei bleibt gut lesbar und chronologisch nachvollziehbar.

## Fertig wenn

- `docs/CHANGELOG.md` wurde aktualisiert.
- Alle merge-relevanten Aenderungen sind mindestens einer Kategorie zugeordnet.
- Der Eintrag ist fuer Teammitglieder ohne PR-Kontext verstaendlich.

## Beispiel-Prompts

- `/update-changelog-on-develop-merge PR #142 wurde in develop gemerged: neue Login-Validierung und Fehlerbehebung bei Passwort-Reset.`
- `/update-changelog-on-develop-merge Branch feature/notifications wurde nach develop gemerged. Bitte CHANGELOG aktualisieren.`