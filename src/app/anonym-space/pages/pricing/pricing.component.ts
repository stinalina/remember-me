import { ChangeDetectionStrategy, Component } from "@angular/core";
import {NgTemplateOutlet} from '@angular/common';

type PricingModel = {
  title: string;
  features: string[];
  costPerMonth: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'reme-pricing',
  templateUrl: 'pricing.component.html',
  styleUrl: 'pricing.component.scss',
  imports: [
    NgTemplateOutlet
  ]  
})
export class PricingComponent {
  public activeCardIndex = 1;
  
  public readonly pricings: PricingModel[] = [
    {
      title: 'Free',
      features: [
        '3 Erinnerungen pro Monat',
        'Erinnerungen jederzeit bearbeiten & löschen'
      ],
      costPerMonth: 0
    },
    {
      title: 'Basic',
      features: [
        '5 Erinnerungen pro Monat',
        'Voller Zugriff auf alle Editor-Tools',
        'Erinnerungen archivieren & jederzeit reaktivieren'
      ],
      costPerMonth: 5
    },
    {
      title: 'Premium',
      features: [
        'Unbegrenzte Erinnerungen',
        'Anhänge und Standorte nutzen',
        'Freunde einfach ins CC setzen'
      ],
      costPerMonth: 10
    }
  ];

  private readonly maxFeaturesIndex = Math.max(...this.pricings.map(item => item.features.length));
  public readonly indexArray = new Array(this.maxFeaturesIndex).fill(0);
}