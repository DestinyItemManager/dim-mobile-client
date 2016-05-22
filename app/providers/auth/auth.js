import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {
    static get parameters() {
        return [[Http]]
    }

    constructor(http) {
        this.http = http;
        this.data = null;
        this._loggedInSource = new Subject();
        this.loggedInSrc = this._loggedInSource.asObservable();
    }

    load() {
        window.setTimeout(() => {
          this._loggedInSource.next(true)
        }, 2000);
    }
}
