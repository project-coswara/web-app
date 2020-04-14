import {Component, Input, OnInit} from '@angular/core';

import { environment } from "../../environments/environment";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'cs-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})

export class NavbarComponent implements OnInit{
  name = environment.title;
  @Input('tabs') tabs;

  constructor() { }

  ngOnInit() { }
}
