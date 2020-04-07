import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";

import { User } from "firebase";

@Injectable({
  providedIn: 'root'
})

export class UserDataService {
  private metaData = new BehaviorSubject<any>('META_DATA');
  private userData = new BehaviorSubject<any>('USER_DATA');

  clearMetaData() {
    this.metaData.next(null);
  }

  clearUserData() {
    this.userData.next(null);
  }

  getMetaData(): Observable<any> {
    return this.metaData.asObservable();
  }

  getUserData(): Observable<any> {
    return this.userData.asObservable();
  }

  sendMetaData(metaData) {
    this.metaData.next(metaData);
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
    } else {
      this.userData.next(null);
    }
  }
}
