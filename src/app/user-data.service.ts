import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";

import { User } from "firebase";

@Injectable({
  providedIn: 'root'
})

export class UserDataService {
  private appData = new BehaviorSubject<any>('USER_APPDATA');
  private userData = new BehaviorSubject<any>('USER_DATA');

  clearAppData() {
    this.appData.next(null);
  }

  clearUserData() {
    this.userData.next(null);
  }

  getAppData(): Observable<any> {
    return this.appData.asObservable();
  }

  getUserData(): Observable<any> {
    return this.userData.asObservable();
  }

  sendAppData(metaData) {
    this.appData.next(metaData);
  }

  sendUserData(firebaseUser: User) {
    if(firebaseUser) {
      this.userData.next({
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        uid: firebaseUser.uid,
        verified: firebaseUser.emailVerified,
        photoURL: firebaseUser.photoURL
      });
    }
    else {
      this.userData.next(null);
    }
  }
}
