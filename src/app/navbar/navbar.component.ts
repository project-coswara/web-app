import {Component, Input} from '@angular/core';

import {environment} from "../../environments/environment";

@Component({
  selector: 'cs-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})

export class NavbarComponent {
  name = environment.title;
  @Input('tabs') tabs;

  constructor() {
  }
}
