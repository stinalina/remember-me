import { Component } from "@angular/core";
import * as agbs from '../../assets/text/agb.txt';

@Component({
  selector: 'reme-agb',
  templateUrl: 'agb.component.html',
  styles: [],
  imports: []
})
export class AGBComponent {
  public readonly content = agbs.default;
}