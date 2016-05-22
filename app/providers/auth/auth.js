import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import * as cookie from 'cookie';

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
    this.data = null;
    this._loggedInSource = new Subject();
    this.loggedInSrc = this._loggedInSource.asObservable();
  }

  getRemoteLoginStatus() {
    var self = this;
    return this.platform.ready()
      .then(() => {
        return new Promise((resolve, reject) => {
          let ref = cordova.InAppBrowser.open('https://www.bungie.net/help', '_blank', 'location=no,hidden=yes');

          ref.addEventListener('loadstop', (event) => {
            var loop = setInterval(() => {
              ref.executeScript({
                  code: "document.cookie"
                },
                (result) => {
                  let cookieValue = "";

                  if ((result || "")
                    .toString()
                    .indexOf("bungled") > -1) {
                    if (_.isArray(result) && _.size(result) > 0) {
                      cookieValue = result[0];
                    } else if (_.isString(result)) {
                      cookieValue = result;
                    }
                  }

                  var cookieObject = cookie.parse(cookieValue);

                  try {
                    resolve(cookieObject['bungled']);
                  } catch (err) {
                    reject("no cookie.");
                  }

                  clearInterval(loop);
                  ref.close();
                });
            });
          });

          ref.addEventListener('loaderror', (event) => {
            reject("loaderror");
            ref.close();
          });
        });
      });
  }

  load() {
    window.setTimeout(() => {
      this._loggedInSource.next(true)
    }, 2000);
  }
}
