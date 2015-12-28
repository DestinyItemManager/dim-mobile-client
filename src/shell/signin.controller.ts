/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts"/>

import AuthorizationService from "../auth/authorizationService.service";

export default class SigninCtrl {
  private _http: ng.IHttpService;
  private _q: ng.IQService;
  private _log: ng.ILogService;
  private _cookieString: string;
  private _apiKey: string;
  private _auth: AuthorizationService;
  private _token: string;

  public tracker: any;

  static $inject = ['$http', '$q', '$log', 'dimAuthorizationService', 'dimPromiseTracker'];

  constructor($http: ng.IHttpService, $q: ng.IQService, $log: ng.ILogService, authorization: AuthorizationService, tracker: any) {
    this._http = $http;
    this._q = $q;
    this._log = $log;
    this._apiKey = "57c5ff5864634503a0340ffdfbeb20c0";
    this._auth = authorization;
    this._token = "";

    this.tracker = tracker;

    this.init();
  }

  private init(): void {
    let token:string = "";
    let self = this;

    var promise = this._q(async function(resolve, reject) {
      try {
        let token = await self._auth.getBungieNetToken();
      } catch(e) {
        this._log.error('Unable to get bungie token.');
        return;
      }

      let isTokenValid = await self._auth.testToken(token);

      // TODO If token is found and the token is valid, then redriect back to the
      // initial page or the items page.

      resolve(null);
    });

    this.tracker.addPromise(promise);
  }

  public async signOut(): Promise<any> {
    return this._q((resolve, reject) => {
      let browserRef = window.open('https://www.bungie.net/en/User/SignOut/', '_blank', 'location=yes');

      browserRef.addEventListener('loadstop', function(event) {
        browserRef.close();
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
      let browserRef = window.open('https://www.bungie.net/en/User/SignIn/Xuid', '_blank', 'location=yes,hidden=yes');

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
      browserRef.addEventListener('loadstop', function (event) {
        alert("loadstop");
        try {
          browserRef.executeScript({
            code: 'document.cookie'
          }, async function r(result) {
            let token = self._auth.getCookieFromBrowserReference.bind(self, result)();

            if (token === "") {
              alert("loadstop - no token");
              browserRef.show();
              deferedLoadstop.resolve();
            } else {
              alert("loadstop - found token");
              browserRef.close();

              alert(await self._auth.testToken(token));
              deferedLoadstop.resolve();
            }
          });
        } catch (e) {
          console.log(e);
          reject(e.toString());
          deferedLoadstop.resolve();
        }

        // try {
        //   browserRef.executeScript({
        //     code: 'document.cookie'
        //   }, (result) => {
        //     resolve(self._auth.getCookieFromBrowserReference.bind(self, result)());
        //   });
        // } catch (e) {
        //   console.log(e);
        //   browserRef.close();
        //   reject(e.toString());
        // }
      });

      // Test closed window for the 'bungled' header.
      browserRef.addEventListener('exit', (event) => {
        alert("exit");

        deferedExit.resolve();
      });

      resolve(self._q.all(results).then(function() {
  alert("end promise.");
  browserRef.close();
}));

      // browserRef.addEventListener('loadstop', function(event) {
      //   browserRef.close();
      //
      //   let request: ng.IRequestConfig = {
      //     method: 'GET',
      //     url: 'https://www.bungie.net/Platform/User/GetBungieNetUser/',
      //     headers: {
      //       'X-API-Key': self._apiKey,
      //       'x-csrf': self._token
      //     },
      //     withCredentials: true
      //   };
      //
      //   resolve(self._http(request).then(function(result) {
      //     window.alert(JSON.stringify(result.data["ErrorCode"]));
      //
      //     resolve();
      //   }));
      // });
    });
  }
};
