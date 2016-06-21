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
  }

  getSigninPlatform(platform) {
    switch (platform.toLowerCase()) {
      case 'psn':
        return 'Psnid';
      case 'xbl':
        return 'Xuid';
      default:
        throw new Error(`Invalid platform ID: ${ platform }`);
    }
  }

  showLoginDialog() {
    this.loginEvent.next();
  }


  showLogin(platform) {
    console.log('showLogin');

    let ref = cordova.InAppBrowser.open(`https://www.bungie.net/en/User/SignIn/${ this.getSigninPlatform(platform) }`, '_blank', 'location=yes,hidden=yes,clearcache=yes,clearsessioncache=yes');

    return new Promise((resolve, reject) => {
      console.log('new Promise');

      let resolved = false;

      ref.addEventListener('exit', (result) => {
        console.log('exit', result);
      });

      ref.addEventListener('loaderror', (result) => {
        console.log('loaderror', result);
      });

      ref.addEventListener('loadstop', (result) => {
        console.log('loadstop', result);

        ref.executeScript({ code: 'document.cookie' },
          (result) => {
            console.log('executeScript', result);

            let token = '';

            if (!_.isEmpty(result)) {
              let cookie = cookieParser.parse(result[0]);

              if (_.has(cookie, 'bungled')) {
                token = cookie.bungled;
                // this.principal.authenticate(new BungieIdentity(token));
              }
            }

            if (_.size(token) > 0) {
              if (!resolved) {
                resolve(token);
                resolved = true;
              }
            } else {
              ref.show();
            }
          }
        );
      });

      // Attempts to get a cookie from each page load in the browser reference.
      ref.addEventListener('loadstart', (result) => {
        console.log('loadstart', result);

        ref.executeScript({ code: 'document.cookie' },
          (result) => {
            console.log('executeScript', result);

            let token = '';

            if (!_.isEmpty(result)) {
              let cookie = cookieParser.parse(result[0]);

              if (_.has(cookie, 'bungled')) {
                token = cookie.bungled;
                // this.principal.authenticate(new BungieIdentity(token));
              }
            }

            if (_.size(token) > 0) {
              if (!resolved) {
                resolve(token);
                resolved = true;
              }
            }
          }
        );
      });
    })
    .then((token) => {
      ref.close();
      ref = undefined;

      return token;
    });
  }
}
