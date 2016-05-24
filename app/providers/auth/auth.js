import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs/Subject';
import DimPrincipal from './dim-principal';

@Injectable()
export class AuthProvider {
  static get parameters() {
    return [[DimPrincipal]]
  }

  constructor(principal) {
    this.principal = principal;

    this._loggedInSource = new Subject();
    this.loggedInSrc = this._loggedInSource.asObservable();
  }

  getVisitor() {
    return null;
  }

  isVisitorLoggedIn() {
    return false;
  }

  load() {
    window.setTimeout(() => {
      this._loggedInSource.next(true)
    }, 2000);
  }
}
