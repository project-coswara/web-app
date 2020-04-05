import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

import { values } from "../../../../../src/environments/environment";

@Component({
  selector: 'cs-collect-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})

export class DetailsComponent implements OnInit {
  selectedIndex = 0;
  travelled = 'no';
  forms = {
    'personal': new FormGroup({
      'age': new FormControl(),
      'gender': new FormControl(),
    }),
    'current_address': new FormGroup({
      'country': new FormControl(),
      'state': new FormControl(),
      'locality': new FormControl()
    }),
    'health': new FormGroup({
      'status': new FormControl()
    })
  };

  option_values = values;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  submit_meta_data = function () {
    this.router.navigateByUrl('/record').then(r => {
      console.debug('Redirecting to record page!');
    });
  }

}
