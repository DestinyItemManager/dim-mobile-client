/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts"/>

import AuthorizationService from "../auth/authorizationService.service";

export default class SigninCtrl {
  private _http: ng.IHttpService;
  private _q: ng.IQService;
  private _log: ng.ILogService;
  private _cookieString: string;
  private _auth: AuthorizationService;
  private _token: string;

  public tracker: any;

  static $inject = ['$http', '$q', '$log', 'dimAuthorizationService', 'dimPromiseTracker'];

  constructor($http: ng.IHttpService, $q: ng.IQService, $log: ng.ILogService, authorization: AuthorizationService, tracker: any) {
    this._http = $http;
    this._q = $q;
    this._log = $log;
    this._auth = authorization;
    this._token = "";

    this.tracker = tracker;

    // async functions return promises.  We can use promises with our
    // indeterminate progress indicator.
    this.tracker.addPromise(this.init());
  }

  private async init(): Promise<void> {
    let token:string = "";

    try {
      token = await this._auth.getBungieNetToken();
    } catch (e) {
      let msg = "Unable to get a bungie token from Bungie.net.";
      this._log.warn(msg, e);
    }

    if (_.size(token) > 0) {
      this._log.debug("A token has been found.", token);

      let isTokenValid = await this._auth.IsTokenValid(token);

      this._log.debug("Is the token valid?", isTokenValid);
    }

    // TODO If token is found and the token is valid, then redriect back to the
    // initial page or the items page.
  }

  public async signOut(): Promise<any> {
    return this._q((resolve, reject) => {
      let ref = window.open('https://www.bungie.net/en/User/SignOut/', '_blank', 'location=yes,hidden=yes');

      ref.addEventListener('loadstop', function(event) {
        ref.close();
        resolve();
      });
    });
  }

  public signIn(platform: string) {
    this.tracker.addPromise(this._q.when(this.showLogin(platform)));
  }

  private async showLogin(platform: string): Promise<{}> {
    let self = this;

    return this._q((resolve, reject) => {
      let ref = window.open('https://www.bungie.net/en/User/SignIn/Xuid', '_blank', 'location=yes,hidden=yes');

      // If the loaded page has the 'bungled' header, then the user is
      // authenticated.  If the loaded page does not have a 'bungled' header,
      // then we're on a platform sign in page.

      // It is assumed that the init() function checks for a 'bungled' header
      // so if we have a 'bungled' header when we open this page, then the user
      // must be authenticated, so we can attempt a test.

      var deferedLoadstop = self._q.defer();
      var deferedExit = self._q.defer();

      var results = [deferedLoadstop.promise, deferedExit.promise];

      // Test every page load for the 'bungled' header.
      ref.addEventListener('loadstop', function(event) {
        alert("loadstop");
        try {
          ref.executeScript({
            code: 'document.cookie'
          }, async function(result) {
              let token = await self._auth.getCookieFromReference(ref);
              token = self._auth.getTokenFromCookie(token);

              if (token === "") {
                alert("loadstop - no token");
                ref.show();
                deferedLoadstop.resolve();
              } else {
                alert("loadstop - found token - " + token);
                ref.close();

                alert(await self._auth.IsTokenValid(token));
                deferedLoadstop.resolve();
              }
            });
        } catch (e) {
          console.log(e);
          reject(e.toString());
          deferedLoadstop.resolve();
        }
      });

      // Test closed window for the 'bungled' header.
      ref.addEventListener('exit', (event) => {
        alert("exit");

        deferedExit.resolve();
      });

      resolve(self._q.all(results).then(function() {
        alert("end promise.");
        ref.close();
      }));
    });
  }
};
