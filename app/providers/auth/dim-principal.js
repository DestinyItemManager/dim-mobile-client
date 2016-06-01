import { Injectable } from '@angular/core';
import { Platform, Storage, SqlStorage } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import * as cookieParser from 'cookie';
import { BungieIdentity } from './bungie-identity';
import { DestinyServices } from '../destiny-services/destiny-services';

@Injectable()
export class DimPrincipal {
  static get parameters() {
    return [[Http], [Platform]]
  }

  constructor(http, platform) {
    this._http = http;
    this._platform = platform;
    this._storage = new Storage(SqlStorage);
    this._authenticated = false;
    this._identity = null;

    this._inAppBrowserEvents = {
      loadstart: 'loadstart',
      loadstop: 'loadstop',
      loaderror: 'loaderror',
      exit: 'exit'
    };
  }

  /*
   * Returns true if the Identity associated with the Principal can access the
   * Destiny API.
   */
  get isAuthenticated() {
    return this._authenticated;
  }

  /*
   * Returns true if the Principal has an Identity.
   */
  get hasIdentity() {
    return !_.isEmpty(this._identity);
  }

  identity(force) {
    let _token = '';

    // Force the resolution of the identy from an available token.
    if (force) {
      this._identity = null;
    }

    // check and see if we have retrieved the identity data from the server.
    // If we have, reuse it by immediately resolving
    if (!_.isEmpty(this._identity)) {
      return new Promise((resolve, reject) => {
        resolve(this._identity);
      });
    }

    return this.getBungleToken()
      .then((token) => {
        if (_.isString(token) && _.size(token) > 0) {
          this.authenticate(new BungieIdentity(token));
        } else {
          this.authenticate(null);
        }

        return this._identity;
      })
      .catch((error) => {
        this.authenticate(null);
        throw error;
      });
  }

  authenticate(identity) {
    let hasToken = (_.isString(identity.token) && _.size(identity.token) > 0);

    if (hasToken) {
      this._authenticated = false;
      this._identity = identity;
      let test_identity_service = new DestinyServices(this._http);
      test_identity_service.token = identity.token;
      test_identity_service.getBungieNetUser()
        .then((result) => {
          console.log(result);

          if (result.ErrorCode === 1) {
            this._authenticated = true;
            this._identity._data = result.Response;
          }
        });
    } else {
      this._authenticated = false;
      this._identity = null;
    }
  }

  getBungleToken() {
    let self = this;

    return this._platform.ready()
      .then(() => {
        return self._storage.get('bungled-token');
      })
      .then((result) => {
        if (!_.isUndefined(result)) {
          return result;
        } else {
          let _token = '';
          return self.getBungleTokenFromBungie()
            .then((token) => {
              _token = token;
              return this._storage.set('bungled-token', token);
            })
            .then(() => {
              return _token;
            })
            .catch((error) => {
              throw error;
            });
        }
      })
      .then((token) => {
        console.log(token);
        return token;
      })
      .catch((error) => {
        throw error;
      });
  }

  getBungleTokenFromBungie() {
    let self = this;

    return this._platform.ready()
      .then(() => {
        return new Promise((resolve, reject) => {
          // Open a hidden browser to Bungie.net to get the user's token from the cookie.
          let ref = cordova.InAppBrowser.open('https://www.bungie.net/help', '_blank', 'location=no,hidden=yes');

          // When the page has stopped loading...
          ref.addEventListener(self._inAppBrowserEvents.loadstop,
            (event) => {
              // Attempt to get the cookie...
              ref.executeScript({ code: 'document.cookie' },
                (result) => {
                  // If successful, we should have a cookie in the result.
                  try {
                    if (!_.isEmpty(result)) {
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
                    if (!_.isUndefined(ref)) {
                      ref.close();
                      ref = undefined;
                    }
                  }
                });
            });

          ref.addEventListener(self._inAppBrowserEvents.loaderror, (event) => {
            reject('');

            if (!_.isUndefined(ref)) {
              ref.close();
              ref = undefined;
            }
          });
        });
      });
  }
}
