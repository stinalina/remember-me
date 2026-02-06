import { Component } from "@angular/core";
import * as dsgvo from '../../assets/text/dsgvo.txt';

@Component({
  selector: 'dsgvo-agb',
  templateUrl: 'dsgvo.component.html',
  styles: [],
  imports: []
})
export class DSGVOComponent {
  public readonly content = dsgvo.default;
}