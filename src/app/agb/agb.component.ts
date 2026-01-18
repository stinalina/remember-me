import { Component } from "@angular/core";

@Component({
  selector: 'reme-agb',
  templateUrl: 'agb.component.html',
  styles: [],
  imports: []
})
export class AGBComponent {
  public readonly userName = 'Alice';
  public readonly content = '<strong>Important</strong> Test <u>content</u>';
}