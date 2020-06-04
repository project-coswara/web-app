import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'language-dialog',
  templateUrl: 'language-dialog.html',
  styleUrls: ['language-dialog.less']
})

export class LanguageDialogComponent {
  languageList = [{
    name: 'english',
    locale: 'en-US'
  }, {
    name: 'hindi',
    locale: 'hi-IN'
  }, {
    name: 'bengali',
    locale: 'bn-IN'
  }, {
    name: 'kannada',
    locale: 'ka-IN'
  // }, {
  //   name: 'malayalam',
  //   locale: 'ml-IN'
  }, {
    name: 'marathi',
    locale: 'ma-IN'
  }, {
    name: 'tamil',
    locale: 'ta-IN'
  }, {
    name: 'telugu',
    locale: 'te-IN'
  }]

  locale = null;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.locale = queryParams.locale;
    })
  }a
}
