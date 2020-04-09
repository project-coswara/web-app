import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'cs-root',
  templateUrl: 'app.component.html',
  styles: []
})

export class AppComponent implements OnInit {
  appLoader = true;

  ngOnInit() {
    this.appLoader = false;
  }
}
