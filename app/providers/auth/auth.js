import { Injectable } from '@angular/core';
import { Platform, Storage, SqlStorage } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import * as cookieParser from 'cookie';

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {
  static get parameters() {
    return [[Http], [Platform]]
  }

  constructor(http, platform) {
    this.http = http;
    this.platform = platform;
    this.storage = new Storage(SqlStorage);
    this.data = null;
    this._loggedInSource = new Subject();
    this.loggedInSrc = this._loggedInSource.asObservable();

    this.InAppBrowserEvents = {
      loadstart: 'loadstart',
      loadstop: 'loadstop',
      loaderror: 'loaderror',
      exit: 'exit'
    };
  }

  getBungleToken() {
    let self = this;

    return this.platform.ready()
      .then(() => {
        return self.storage.get('bungie-token');
      })
      .then((result) => {
        if (!_.isEmpty(result)) {
          return result;
        } else {
          let _token = '';
          return self.getBungleTokenFromBungie()
            .then((token) => {
              _token = token;
              return this.storage.set('bungie-token', token);
            })
            .then(() => {
              return _token;
            })
            .catch((error) => {
              throw error;
            });
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  getBungleTokenFromBungie() {
    let self = this;

    return this.platform.ready()
      .then(() => {
        return new Promise((resolve, reject) => {
          // Open a hidden browser to Bungie.net to get the user's token from the cookie.
          let ref = cordova.InAppBrowser.open('https://www.bungie.net/help', '_blank', 'location=no,hidden=yes');

          // When the page has stopped loading...
          ref.addEventListener(self.InAppBrowserEvents.loadstop,
            (event) => {
              // Attempt to get the cookie...
              ref.executeScript({ code: 'document.cookie' },
                (result) => {
                  // If successful, we should have a cookie in the result.
                  try {
                    if (_.isArray(result) && _.size(result) > 0) {
                      let cookie = cookieParser.parse(result[0]);

                      if (_.has(cookie, 'bungled')) {
                        resolve(cookie.bungled);
                      } else {
                        // Cookie did not contain a bungled token. Unexepected...
                        reject('');
                      }
                    } else {
                      // No result was returned from executeScript. Unexepected...
                      reject('');
                    }
                  } catch (e) {
                    // Very unexepected...
                    reject('');
                  } finally {
                    ref.close();
                    ref = undefined;
                  }
                });
            });

          ref.addEventListener(self.InAppBrowserEvents.loaderror, (event) => {
            reject('');
            ref.close();
            ref = undefined;
          });
        });
      });
  }

  getRemoteLoginStatus() {
    return getBungleTokenFromBungie();
  }

  load() {
    window.setTimeout(() => {
      this._loggedInSource.next(true)
    }, 2000);
  }
}
