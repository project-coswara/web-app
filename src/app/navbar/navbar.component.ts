import { Component, OnInit } from '@angular/core';

import { environment } from "../../environments/environment";

@Component({
  selector: 'cs-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})

export class NavbarComponent implements OnInit{
  name = environment.title;

  constructor() {}
  ngOnInit() {
  }
}
