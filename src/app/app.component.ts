import {Component} from '@angular/core';
import 'firebase/auth';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'cs-root',
  templateUrl: 'app.component.html',
  styles: []
})

export class AppComponent {
  appLoader = false;
  locale = 'en-US'

  tabsList = [{
    'id': 'home',
    'name': 'Home',
    'url': ''
  }, {
    'id': 'about',
    'name': 'About',
    'url': 'about'
  }, {
    'id': 'team',
    'name': 'People',
    'url': 'team'
  }, {
    'id': 'faq',
    'name': 'FAQ',
    'url': 'faq'
  }, {
    'id': 'media',
    'name': 'Media',
    'url': 'media'
  },]

  constructor(private router: Router, private activatedRoute: ActivatedRoute, translateService: TranslateService) {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.locale = queryParams.locale;
      console.log(this.locale)
      translateService.use(this.locale);
    })
  }
}
