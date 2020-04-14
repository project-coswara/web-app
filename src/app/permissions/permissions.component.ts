import { Component, OnInit } from '@angular/core';
import {error} from "util";
import {Router} from "@angular/router";

@Component({
  selector: 'cs-no-permission',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.less']
})

export class PermissionsComponent implements OnInit {
  permissionsLoader: boolean = true;
  permissionsLoaderText: string = 'Checking permissions...';
  errorCode = 'unknown';
  domainName = window.location.origin;

  constructor(private router: Router) { }

  ngOnInit() {
    try {
      let initTimeOut = setTimeout(() => {
        this.errorCode = 'unsupported';
        this.permissionsLoader = false;
      }, 5000);

      this.permissionsLoaderText = 'Requesting permissions..'
      navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
        stream.stop();
        this.router.navigate(['']).then();
      }).catch((error) => {
        if (error.message == 'Permission denied') {
          this.errorCode = 'blocked'
          clearTimeout(initTimeOut);
        } else if (error.message == 'Permission dismissed') {
          this.errorCode = 'blocked'
          clearTimeout(initTimeOut);
        } else {
          this.errorCode = 'unsupported';
          console.error(error);
        }
        this.permissionsLoader = false;
      })
    } catch (e) {
      console.error(e.stackTrace());
      this.errorCode = 'unsupported';
      this.permissionsLoader = false;
    }
  }
}
