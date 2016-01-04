/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts" />

import IPrincipal from "./IPrincipal";
import IDestinyService from "../bungie/IDestinyService";

export default class AuthorizationService {
  private _http: ng.IHttpService;
  private _q: ng.IQService;
  private _log: ng.ILogService;
  private _rootScope: ng.IRootScopeService;
  private _state: angular.ui.IStateService;
  private _timeout: ng.ITimeoutService;
  private _principal: IPrincipal;
  private _tracker: any;
  private _cookieParser: any;
  private _destinyService: IDestinyService;
  private _ionicHistory: ionic.navigation.IonicHistoryService;

  private _apikey: string;
  private _returnToState: any;
  private _returnToStateParams: any;

  static $inject = [
    "$http",
    "$q",
    "$log",
    "$rootScope",
    "$state",
    "$timeout",
    "dimPrincipal",
    "dimPromiseTracker",
    "dimCookieParser",
    "dimDestinyService",
    "$ionicHistory"];

  constructor(
    $http: ng.IHttpService,
    $q: ng.IQService,
    $log: ng.ILogService,
    $rootScope: ng.IRootScopeService,
    $state: angular.ui.IStateService,
    $timeout: ng.ITimeoutService,
    principal: IPrincipal,
    tracker: any,
    cookieParser: any,
    destinyService: IDestinyService,
    $ionicHistory: ionic.navigation.IonicHistoryService) {

    this._http = $http;
    this._q = $q;
    this._log = $log["getInstance"]("auth.AuthorizationService");
    this._rootScope = $rootScope;
    this._state = $state;
    this._timeout = $timeout;
    this._principal = principal;
    this._tracker = tracker;
    this._cookieParser = cookieParser;
    this._destinyService = destinyService;
    this._ionicHistory = $ionicHistory;

    this._returnToState = undefined;
    this._apikey = "57c5ff5864634503a0340ffdfbeb20c0";
  }

  // getLocalToken(): ng.IPromise<string> {
  //   return this._q.when("");
  // }
  //
  // public getTokenFromCookie(cookie: string): string {
  //   let cookieObj = this._cookieParser.parse(cookie);
  //
  //   if (_.has(cookieObj, "bungled")) {
  //     return cookieObj["bungled"];
  //   } else {
  //     return "";
  //   }
  // }
  //
  // public getCookieFromReference(ref: any): ng.IPromise<string> {
  //   return this._q(function(resolve, reject) {
  //     ref.executeScript({
  //       code: "document.cookie"
  //     }, (result) => {
  //       if ((result || "").toString().indexOf("bungled") > -1) {
  //         if (_.isArray(result) && _.size(result) > 0) {
  //           resolve(result[0]);
  //           return ;
  //         } else if (_.isString(result)) {
  //           resolve(result);
  //         } else {
  //           resolve("");
  //         }
  //       } else {
  //         resolve("");
  //       }
  //     });
  //   });
  // }
  //
  // public getBungieNetToken(): ng.IPromise<string> {
  //   this._log.debug("Getting token from bungie.net");
  //
  //   let self = this;
  //   let promise = this._q((resolve, reject) => {
  //     self._log.debug("Loading lightweight endpoint from bungie.net");
  //
  //     // Lightweight endpoint on Bungie.net to get an http response.
  //     let ref = window.open('https://www.bungie.net/help', '_blank', 'location=no,hidden=yes');
  //
  //     ref.addEventListener('loadstop', async function(event) {
  //       self._log.debug(event);
  //
  //       try {
  //         let token = await self.getCookieFromReference.bind(self, ref)();
  //         resolve(token);
  //       } catch (e) {
  //         let msg = "There was an error while trying to access the token from Bungie.net.";
  //         self._log.error(msg, e);
  //         reject(new Error(msg));
  //       } finally {
  //         ref.close();
  //       }
  //     });
  //
  //     ref.addEventListener('loaderror', function(event) {
  //       self._log.debug(event);
  //
  //       let msg = "There was an error loading a page from Bungie.net.";
  //
  //       self._log.error(msg, event);
  //       ref.close();
  //       reject(new Error(msg));
  //     });
  //   })
  //   .then(this.getTokenFromCookie.bind(self))
  //   .catch((error) => {
  //     this._log.error(error);
  //
  //     return "";
  //   });
  //
  //   return promise;
  // }
  //
  // /**
  //  * Validates a 'bungled' token by checking to see if it can make a successful
  //  * Destiny API request.
  //  */
  // public async IsTokenValid(token: string): Promise<boolean> {
  //   let result;
  //   let isValid = false;
  //
  //   this._log.debug("Testing token to see if it can get data from Bungie.net.");
  //
  //   this._destinyService.token = token;
  //
  //   try {
  //     result = await this._destinyService.getBungieNetUser();
  //     isValid = (<any>result.data).ErrorCode === 1;
  //   } catch (e) {
  //     this._log.error("The token validation request failed", e, result);
  //     isValid = false;
  //   }
  //
  //   return isValid;
  // }

  /**
   * Used to verify a visitor can view a resource.  Creates an identity object
   * based on available credentials (cookies) if an identity is not present.
   * Verifies the identity can access Destiny API resources.
   */
  authorize(): Promise<void> {
    this._log.debug('Verifying user authorization.');
    let self = this;

    return this._principal.identity()
      .then(function() {
        // Checks for an authenticated identity.  If there is none, the user is
        // redirected to sign in to resolve a user.

        let authenticated = self._principal.isAuthenticated;

        self._log.debug("Is the user authenticated? ", authenticated);

        let state = self._rootScope["toState"];
        let params = self._rootScope["toStateParams"];
        let data = state.data;

        // Does the endpoint have a role requirement?  Does the identity have the role?
        if ((data.roles) && (data.roles.length > 0) && (!self._principal.isInAnyRole(data.roles))) {
          self._log.debug("The state the user is navigating to:", state, params);

          if (!authenticated) {
            self._log.debug('Authorization not found; redirecting to Sign in.');

            self._rootScope["returnToState"] = state;
            self._rootScope["returnToStateParams"] = params;

            self._timeout(() => {
              self._ionicHistory.nextViewOptions({
                 disableBack: true
              });

              self._state.go("signin");
            }, 0);
          } else {
            // Send the visitor to an access denied page.
          }
        }
      });
  }
};
