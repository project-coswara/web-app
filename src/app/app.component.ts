import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'cs-root',
  templateUrl: 'app.component.html',
  styles: []
})

export class AppComponent implements OnInit {
  appLoader = true;

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
    'id': 'contact',
    'name': 'Contact',
    'url': 'contact'
  }, ]

  ngOnInit() {
    this.appLoader = false;
  }
}
