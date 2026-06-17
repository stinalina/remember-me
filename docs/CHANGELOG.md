# Changelog 
Vorläufige Version eines Changelogs. 
Autogenerirte können bereits hier betrachtet werden: https://github.com/stinalina/remember-me/releases/tag/v1.0.0

## v1.1.0
### Bugfixes
- Toasts sind immer im Vordergrund und verschwinden nicht hinter der Toolbar
- Der NotificationCounter hat auch beim Update einer Notiz hochgezählt
- 
### Features
- Searchbar in der Notizübersicht. Hier wird nach dem Notiz Titel gefiltert
- Date von wann bis wann die Website gepflegt wird steht nun im Footer
- Submit on Enter für Login
- Eine Notiz kann nun auf Entwurf gesetzt werden. Das Fälligkeitsdatum ist dann nicht mehr gültig
- Die Avatar Auswahl wurde vergößert und 5 neue ergänzt
- Für große Bildschirme (ab 2000px weite) werden die Notizen in 4 Spalten statt 3 angezeigt
- Im Footer steht nun ein Link zu diesen ReleaseNotes

### Sonstiges
- Die Projektstruktur wurde neu gedacht
- Workflow für ReleaseTags wurde eingeführt
- Das Repo wurde für die Mitarbeit von github Copilot fit gemacht

## v1.2.0
### Bugfixes
- Notifications auf Entwurf konnten nicht bearbeitet werden, wenn das DueDate in der Vergangenheit lag

### Features
- Searchbar filtert nun nicht nur Titel sondern auch Content
- Alte Notes bekommen nun ein Remark und können dann entweder gelöscht oder archiviert werden
- Such-Filter für nur Entwürfe oder nur Archivierte Notes anzeigen
- Die Statistik-Page wurde eingeführt