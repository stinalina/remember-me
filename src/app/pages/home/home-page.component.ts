import { Component, computed, OnDestroy, OnInit, signal } from "@angular/core";

type Slogan = {
  title: string;
  description: string;
  fazit: string;
}

@Component({
  selector: 'reme-home',
  templateUrl: 'home-page.component.html',
  styles: [],
  imports: []
})
export class HomePage implements OnInit, OnDestroy {
  private readonly slogans: Slogan[] = [
    {
      title: "Dein Kopf ist voll genug.",
      description: "Notizen landen überall – nur nicht da, wo du sie brauchst. Erstelle eine Notiz, leg den Zeitpunkt fest, wir erinnern dich genau dann.",
      fazit: "👉 Kein Kalender-Chaos. Kein Vergessen."
    },
    {
      title: "Todo's raus aus dem Kalender. Klarheit rein.",
      description: "Dein Kalender ist für Termine da, nicht für Gedankenfetzen. Mit unseren Notizen bekommst du Erinnerungen genau dann, wenn sie relevant sind.",
      fazit: "👉 Ordnung, die mitdenkt."
    },
    {
      title: "Reisepläne? Erstmal festhalten.",
      description: "Du weißt schon, wohin die nächste Reise gehen soll, aber buchen ist noch zu früh? Schreib auf, wohin es geht und welche Highlights du erleben willst – wir erinnern dich rechtzeitig.",
      fazit: "👉 Inspiration sichern. Sehenswürdigkeiten nicht verpassen."
    },
    {
      title: "Vergessen war gestern.",
      description: "Notieren, terminieren, abschalten. Wir erinnern dich – du behältst den Fokus.",
      fazit: "👉 Dein Kalender bleibt sauber. Dein Kopf auch."
    },
    {
      title: "Später merken. Jetzt leben.",
      description: "Rezept entdeckt? Geschenkidee gehabt? Konzert angekündigt? Notiz schreiben, Zeitpunkt festlegen – wir melden uns.",
      fazit: "👉 Kein Kalender. Kein Stress. Kein Vergessen."
    },
    {
      title: "Für alles, was nicht sofort wichtig ist – aber wichtig bleibt.",
      description: "Geschenkideen, Deadlines, Tickets, Rezepte. Ein Ort für Gedanken, die später zählen.",
      fazit: "👉 Erinnerungen, genau dann, wenn du sie brauchst."
    },
    {
      title: "Aussäen mit System.",
      description: "Ob Tomaten, Erdbeeren oder Kräuter: Wir erinnern dich pünktlich zum Start der Pflanzsaison, was dein Plan war. Ganz ohne Kalenderstress.",
      fazit: "👉 Alles parat, wenn’s ans Säen geht."
    },
    {
      title: "Dein digitales Kurzzeitgedächtnis.",
      description: "Behalte den Kopf frei und lass dir Gedanken zurückbringen. Nicht zu früh. Nicht zu spät.",
      fazit: "👉 Smart organisiert statt überplant."
    },
    {
      title: "Chaos entsteht im Kopf – Ordnung in der App.",
      description: "Statt alles im Kalender zu parken: Notieren. Terminieren. Zur richtigen Zeit erinnern lassen.",
      fazit: "👉 Für Studium, Selbstständigkeit & Alltag."
    },
    {
      title: "Weißt du noch? – Ja.",
      description: "Ob Konzerttickets, Geburtstagsgeschenke oder Lernnotizen – wir erinnern dich, bevor es zu spät ist.",
      fazit: "👉 Vergessen war gestern."
    },
    {
      title: "Eine App für all die ‚nicht vergessen‘-Momente.",
      description: "Kein Termin. Keine To-do-Liste. Nur eine Erinnerung, wenn es Sinn macht.",
      fazit: "👉 Klar. Einfach. Effektiv."
    },
    {
      title: "Dein Kalender ist voll genug.",
      description: "Ideen gehören nicht zwischen Meetings. Sie brauchen nur einen Moment – später.",
      fazit: "👉 Mehr Fokus. Weniger Ballast."
    },
    {
      title: "Merken ist einfach. Erinnern lassen ist smarter.",
      description: "Von Lernstoff bis Lieblingsrezept. Alles zur richtigen Zeit zurück.",
      fazit: "👉 Organisation, die sich an dich anpasst."
    }
  ];

  private cycleDuration = 5000;      
  private readonly updateFrequency = 50;   

  private progressInterval?: number;
  private availableSlogans: Slogan[] = this.slogans;
  private sloganIndex: number = Math.floor(Math.random() * this.availableSlogans.length);

  public readonly currentSlogan = signal<Slogan>(this.availableSlogans[this.sloganIndex]);
  public readonly progressValue = signal<number>(0);
  private readonly elapsedTime = signal<number>(0);

  public readonly progressPercentage = computed(() =>
     (this.elapsedTime() / this.cycleDuration) * 100
  );

  public ngOnInit(): void {
    this.progressInterval = window.setInterval(() => {
      this.elapsedTime.update(time => time + this.updateFrequency);

      if (this.elapsedTime() >= this.cycleDuration) {
        if (this.availableSlogans.length === 0) {
          this.availableSlogans = this.slogans;
        }
        this.sloganIndex = Math.floor(Math.random() * this.availableSlogans.length);
        this.currentSlogan.set(this.availableSlogans[this.sloganIndex]);
        this.availableSlogans = this.availableSlogans.filter((_, index) => index !== this.sloganIndex);
        if (this.currentSlogan().description.length > 100) {
          this.cycleDuration = 7000;
        }
        this.elapsedTime.set(0);
      }
    }, this.updateFrequency);
  }

  public ngOnDestroy(): void {
    clearInterval(this.progressInterval);
  }
}