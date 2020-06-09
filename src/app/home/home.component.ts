import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'cs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})

export class HomeComponent {
  locale = null

  constructor(activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe((queryParams) => {
      this.locale = queryParams.locale || this.locale
    })
  }
}
