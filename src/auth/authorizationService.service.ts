/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts" />

import IPrinciple from "./IPrinciple";

export default class AuthorizationService {
  private _http: ng.IHttpService;
  private _q: ng.IQService;
  private _log: ng.ILogService;
  private _rootScope: ng.IRootScopeService;
  private _state: angular.ui.IStateService;
  private _timeout: ng.ITimeoutService;
  private _principal: IPrinciple;
  private _returnToState: any;
  private _returnToStateParams: any;
  private _apikey: string;

  static $inject = ["$http", "$q", "$log", "$rootScope", "$state", '$timeout', "dimPrinciple"];

  constructor(
    $http: ng.IHttpService,
    $q: ng.IQService,
    $log: ng.ILogService,
    $rootScope: ng.IRootScopeService,
    $state: angular.ui.IStateService,
    $timeout: ng.ITimeoutService,
    dimPrinciple: IPrinciple) {

    this._http = $http;
    this._q = $q;
    this._log = $log;
    this._rootScope = $rootScope;
    this._state = $state;
    this._timeout = $timeout;
    this._principal = dimPrinciple;
    this._returnToState = undefined;
    this._apikey = "57c5ff5864634503a0340ffdfbeb20c0";
  }

  public getCookieFromBrowserReference(result: any): string {
    this._log.debug(result);

    if ((result || "").toString().indexOf("bungled") > -1) {
      if (_.isArray(result) && _.size(result) > 0) {
        return result[0];
      } else if (_.isString(result)) {
        return result;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  getLocalToken(): ng.IPromise<string> {
    return this._q.when("");
  }

  getBungieNetToken(): ng.IPromise<string> {
    let self = this;

    return this._q((resolve, reject) => {
      // Lightweight endpoint on Bungie.net to get an http response.
      let browserRef = window.open('https://www.bungie.net/help', '_blank', 'location=no,hidden=yes');

      let loadListener = browserRef.addEventListener('loadstop', function (event) {
        try {
          browserRef.executeScript({
            code: 'document.cookie'
          }, (result) => {
            resolve(self.getCookieFromBrowserReference.bind(self, result)());
            browserRef.removeEventListener('loadstop', () => {});
            browserRef.close();
          });
        } catch (e) {
          console.log(e);
          browserRef.removeEventListener('loadstop', () => {});
          browserRef.close();
          reject(e.toString());
        }
      });
    })
    .then(function(result) {
      let cookieObj = window["cookieManager"].parse(result);

      if (_.has(cookieObj, "bungled")) {
        return cookieObj["bungled"];
      }

      return "";
    })
    .catch(function(error) {
      console.log(error);

      return "";
    });
  }

  public testToken(token: string): ng.IPromise<boolean> {
    let self = this;

    return this._q(function(resolve, reject) {
      let request: ng.IRequestConfig = {
        method: 'GET',
        url: 'https://www.bungie.net/Platform/User/GetBungieNetUser/',
        headers: {
          'X-API-Key': self._apikey,
          'x-csrf': token
        },
        withCredentials: true
      };

      var promise = self._http(request)
        .then(function(result) {
          console.log(result);
          return result.data["ErrorCode"] === 1;
        });

      resolve(promise);
    });
  }

  authorize(): ng.IPromise<any> {
    // Checks for an authenticated identity.  If there is none, the user is
    // redirected to sign in to resolve a user.
    return this._q((resolve, reject) => {
      let authenticated = this._principal.isAuthenticated;

      if (!authenticated) {
        this._rootScope["returnToState"] = this._rootScope["toState"];
        this._rootScope["returnToStateParams"] = this._rootScope["toStateParams"];

        this._timeout(() => {
          this._state.go("signin");
        }, 0);
      }

      resolve();
    });
  }
};
