import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cs-content',
  template: `
    <div class="content-container" fxLayout="column" fxFill>
      <ng-content class="scroll-container"></ng-content>
    </div>
  `,
  styleUrls: []
})
export class ContentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
