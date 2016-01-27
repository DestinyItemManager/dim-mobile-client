/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts"/>

import AuthorizationService from "../auth/authorizationService.service";
import DimPrincipal from "../auth/dimPrincipal";
import BungieIdentity from "../auth/bungieIdentity";

export default class SigninCtrl {
  private _http: ng.IHttpService;
  private _q: ng.IQService;
  private _log: ng.ILogService;
  private _cookieString: string;
  private _auth: AuthorizationService;
  private _token: string;
  private _principal: DimPrincipal;
  private _scope: ng.IScope;
  private _state: ng.ui.IStateService;
  private _cookieParser;
  private _history;
  private _rootScope;

  static $inject = [
    "$http",
    "$q",
    "$log",
    "dimAuthorizationService",
    "dimPrincipal",
    "$scope",
    "$state",
    "dimCookieParser",
  "$ionicHistory",
"$rootScope"];

  constructor($http: ng.IHttpService,
    $q: ng.IQService,
    $log: ng.ILogService,
    authorization: AuthorizationService,
    principal: DimPrincipal,
    $scope: ng.IScope,
    $state: ng.ui.IStateService,
    cookieParser,
  $ionicHistory,
$rootScope) {

    this._http = $http;
    this._q = $q;
    this._log = $log["getInstance"]("shell.SigninCtrl");;
    this._auth = authorization;
    this._token = "";
    this._principal = principal;
    this._scope = $scope;
    this._state = $state;
    this._cookieParser = cookieParser;
    this._history = $ionicHistory;
    this._rootScope = $rootScope;
  }

  /**
  * Signs the user out of Bungie.net
  */
  public signOut() {
    this.processSignout();
  }

  /**
  * Signs the user into Bungie.net.
  */
  public signIn(platform: string) {
    this._rootScope["tracker"].addPromise(this.processSignin(platform));
  }

  /**
  * Signs the user into Bungie.net.
  */
  public processSignout() {

  }

  /**
  * Returns the Bungie.net prefered platform signin string.
  */
  private getSigninPlatform(platform:string) {
    switch (platform.toLowerCase()) {
      case "psn":
        return "Psnid";
      case "xbl":
        return "Xuid";
      default:
        throw new Error(`Invalid platform ID: ${ platform }`);
    }
  }

  /**
  * Extracts the token from the cookie.
  */
  private getTokenFromCookie(cookie: string): string {
    let cookieObj = this._cookieParser.parse(cookie);

    if (_.has(cookieObj, "bungled")) {
      return cookieObj.bungled;
    } else {
      return "";
    }
  }

  /**
  * Extracts the token from the browser reference object.
  */
  private processReference(ref): ng.IPromise<string> {
    let self = this;
    let deferred = self._q.defer<string>();
    let token = "";

    if (!_.isEmpty(ref)) {

      self._log.debug("Adding 'loadstop' listener to ref.");

      // Handles the closing of the browser reference.  Checks to see if the
      // token was able to be retrieved from this reference before it was closed.
      ref.addEventListener("exit", (event) => {
        self._log.debug("The browser ref is closing.");

        if (_.size(token) === 0) {
          self._log.debug("There was no token found in browser reference.");

          deferred.resolve("");
        }
      });

      self._log.debug("Adding 'loaderror' listener to ref.");

      ref.addEventListener("loaderror", (event) => {
        self._log.debug("The browser ref had an error.");
        ref.close();
      });

      self._log.debug("Adding 'loadstop' listener to ref.");

      // Attempts to get a cookie from each page load in the browser reference.
      ref.addEventListener("loadstop", (event) => {
        self._log.debug("Running script to get document cookie.");

        var refResult = ref.executeScript(
          {
            code: "document.cookie"
          },
          (result) => {
            self._log.debug("Got the result from the loaded page.", result);

            if ((result || "").toString().indexOf("bungled") > -1) {
              if (_.isArray(result) && (_.size(result) > 0) && _.isString(result[0])) {
                token = self.getTokenFromCookie(result[0]);
              } else if (_.isString(result)) {
                token = self.getTokenFromCookie(result);
              }
            }

            if (_.size(token) > 0) {
              self._log.debug("Token found; hide the page.", token);
              ref.close();
              deferred.resolve(token);
            } else {
              self._log.debug("No token found; show the page.");
              ref.show();
            }
          }
        );

        self._log.debug("RefResult: ", refResult);
      });
    } else {
      let msg = "The parameter 'ref' was empty.";
      self._log.debug(msg);
      deferred.reject(msg);
    }

    return deferred.promise;
  }

  /**
   * Processes the browser reference to the signin page on Bungie.net
   */
  private async getTokenFromBungieLogin(platform: string): Promise<string> {
    let self = this;
    let token: string;

    this._log.debug("Opening a window.");

    //let ref = window.open(`https://www.bungie.net/en/User/SignIn/${ this.getSigninPlatform(platform) }`, "_blank", "location=yes,hidden=yes");
    let ref = window.open(`https://www.bungie.net/en/User/SignIn/${ this.getSigninPlatform(platform) }`, "_blank", "location=yes");

    try {
      token = await self.processReference(ref);

      // TODO
      // If no token, then the signin page could have self-closed if already authenticated and never redirected to bungie.net.
      // Log into Bunige.net to check for a token if this is the case.
    } catch (err) {
      token = "";
    }

    return token;
  }

  /**
   * Processes the token, updates the Principal and Identity, and updates the
   * DestinyService with the signed in token.
   */
  private async processSignin(platform: string): Promise<void> {
    let self = this;
    let token: string;

    this._log.info("Attempting to log into Bungie.net.", platform);

    try {
      token = await this.getTokenFromBungieLogin(platform);

      if (_.size(token) > 0) {
        await this._principal.identity(true);



        this._log.info("Login was successful.");



                        if (this._principal.isAuthenticated) {
                          this._history.nextViewOptions({
                            disableBack: true
                          });

                          if (_.has(this._rootScope, "redirectToState")) {
                            this._state.go(this._rootScope["redirectToState"].name, this._rootScope["redirectToState"].params)
                          } else {
                            this._state.go("welcome");
                          }
                        }


      } else {
        this._log.info("Login was unsuccessful.");
      }
    } catch (err) {
    } finally {
    }
  }
};
