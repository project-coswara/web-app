import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";

import {LanguageDialogComponent} from "./language-dialog";

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

  constructor(public infoDialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute, translateService: TranslateService) {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.locale = queryParams.locale || this.locale;
      translateService.use(this.locale);
      this.infoDialog.closeAll();
      if (false && !queryParams.locale) {
        this.infoDialog.open(LanguageDialogComponent).afterClosed().subscribe((locale) => {
          if (locale) {
            this.router.navigate([], {
              queryParams: {
                locale: locale
              },
              queryParamsHandling: 'merge'
            }).then();
          }
        })
      } else {
        this.infoDialog.closeAll();
      }
    })
  }
}
