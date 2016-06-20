import { Injectable, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs/Subject';
import { DimPrincipal } from './dim-principal';
import { BungieIdentity } from './bungie-identity';
import * as cookieParser from 'cookie';

@Injectable()
export class AuthServices {
  static get parameters() {
    return [[DimPrincipal]]
  }

  constructor(principal) {
    this.principal = principal;
    this.loginEvent = new EventEmitter();

    this._inAppBrowserEvents = {
      loadstart: 'loadstart',
      loadstop: 'loadstop',
      loaderror: 'loaderror',
      exit: 'exit'
    };
  }

  getSigninPlatform() {
    return 'Xuid';
  }

  showLoginDialog() {
    this.loginEvent.next();
  }


  showLogin(platform) {
    let ref = cordova.InAppBrowser.open(`https://www.bungie.net/en/User/SignIn/${ this.getSigninPlatform(platform) }`, '_blank', 'location=yes');

    // Attempts to get a cookie from each page load in the browser reference.
    ref.addEventListener('loadstop', () => {
      ref.executeScript({ code: 'document.cookie' },
        (result) => {
          let token = '';

          if (!_.isEmpty(result)) {
            let cookie = cookieParser.parse(result[0]);

            if (_.has(cookie, 'bungled')) {
              token = cookie.bungled;
              this.principal.authenticate(new BungieIdentity(token));
              console.log(token);
            }
          }

          if (_.size(token) > 0) {
            ref.close();
          } else {
            ref.show();
          }
        }
      );
    });
  }
}
