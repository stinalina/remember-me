import { Component } from "@angular/core";

type PricingModel = {
  title: string,
  features: string[],
  costPerMonth: number
}

@Component({
  selector: 'reme-pricing',
  templateUrl: 'pricing.component.html',
  styles: [],
  imports: [
  ] 
})
export class PricingComponent {
  public readonly pricings: PricingModel[] = [
    {
      title: 'Free',
      features: [
        '3 Erinnerungen pro Monat erstellen',
        'Erinnerungen bearbeiten und löschen'
      ],
      costPerMonth: 0
    },
    {
      title: 'Basic',
      features: [
        '5 Erinnerungen pro Monat erstellen',
        'Schalte die gesamte Bearbeitungspalette im Editor frei',
        'Deine Erinnerungen werden archiviert, sodass du sie wieder rehydrieren kannst'
      ],
      costPerMonth: 5
    },
    {
      title: 'Premium',
      features: [
        'Unbegrenzt viele Erinnerungen erstellen',
        'Pinne einen Anhang an deine Erinnerungsmail',
        'Schalte Emojis für deine Erinnerungen frei',
        'Setzte Freunde ins CC'
      ],
      costPerMonth: 10
    }
  ];

  private readonly maxFeaturesIndex = Math.max(...this.pricings.map(item => item.features.length));
  public readonly indexArray = new Array(this.maxFeaturesIndex).fill(0);
}