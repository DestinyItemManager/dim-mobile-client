/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts"/>

import AuthorizationService from "../auth/authorizationService.service";
import DimPrinciple from "../auth/dimPrinciple";
import BungieIdentity from "../auth/bungieIdentity";

export default class SigninCtrl {
  private _http: ng.IHttpService;
  private _q: ng.IQService;
  private _log: ng.ILogService;
  private _cookieString: string;
  private _auth: AuthorizationService;
  private _token: string;
  private _principal: DimPrinciple;
  private _scope: ng.IScope;
  private _state: ng.ui.IStateService;
  private _cookieParser: any;

  public tracker: any;

  static $inject = [
    "$http",
    "$q",
    "$log",
    "dimAuthorizationService",
    "dimPromiseTracker",
    "dimPrinciple",
    "$scope",
    "$state",
    "dimCookieParser"];

  constructor($http: ng.IHttpService,
    $q: ng.IQService,
    $log: ng.ILogService,
    authorization: AuthorizationService,
    tracker: any,
    principle: DimPrinciple,
    $scope: ng.IScope,
    $state: ng.ui.IStateService,
    cookieParser: any) {

    this._http = $http;
    this._q = $q;
    this._log = $log["getInstance"]("shell.SigninCtrl");;
    this._auth = authorization;
    this._token = "";
    this._principal = principle;
    this._scope = $scope;
    this._state = $state;
    this._cookieParser = cookieParser;

    this.tracker = tracker;
  }

  /**
  * Signs the user out of Bungie.net
  */
  public signOut() {
    this.tracker.addPromise(this.processSignout());
  }

  /**
  * Signs the user into Bungie.net.
  */
  public signIn(platform: string) {
    this.tracker.addPromise(this.processSignin(platform));
  }

  /**
  * Signs the user into Bungie.net.
  */
  public processSignout(): ng.IPromise<void> {
    return this._q<void>((resolve, reject) => {
      let ref = window.open("https://www.bungie.net/en/User/SignOut/", "_blank", "location=yes,hidden=yes");

      ref.addEventListener("loadstop", function(event) {
        ref.close();
        resolve();
      });
    });
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
  private processReference(ref: any): ng.IPromise<string> {
    let self = this;
    let deferred = self._q.defer<string>();
    let token = "";

    if (!_.isEmpty(ref)) {
      this._log.debug("Adding 'loadstop' listener to ref.");

      // Attempts to get a cookie from each page load in the browser reference.
      ref.addEventListener("loadstop", (event) => {
        this._log.debug("Running script to get document cookie.");

        ref.executeScript(
          {
            code: "document.cookie"
          },
          (result) => {
            this._log.debug("Got the result from the loaded page.");

            if ((result || "").toString().indexOf("bungled") > -1) {
              if (_.isArray(result) && (_.size(result) > 0) && _.isString(result[0])) {
                token = self.getTokenFromCookie(result[0]);
              } else if (_.isString(result)) {
                token = self.getTokenFromCookie(result);
              }
            }

            if (_.size(token) > 0) {
              this._log.debug("Token found; hide the page.", token);
              deferred.resolve(token);
              ref.close();
            } else {
              this._log.debug("No token found; show the page.");
              ref.show();
            }
          });
      });

      // Handles the closing of the browser reference.  Checks to see if the
      // token was able to be retrieved from this reference before it was closed.
      ref.addEventListener("exit", (event) => {
        this._log.debug("The browser ref is closing.");

        if (_.size(token) === 0) {
          this._log.debug("There was no token found in browser reference.");

          deferred.resolve("");
        }
      });
    } else {
      let msg = "The parameter 'ref' was empty.";
      this._log.debug(msg);
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

    let ref = window.open(`https://www.bungie.net/en/User/SignIn/${ this.getSigninPlatform(platform) }`, "_blank", "location=yes,hidden=yes");

    try {
      token = await self.processReference(ref);
    } catch (err) {
      token = "";
    }

    return token;
  }

  /**
   * Processes the token, updates the Principle and Identity, and updates the
   * DestinyService with the signed in token.
   */
  private async processSignin(platform: string): Promise<void> {
    let self = this;
    let token: string;

    this._log.info("Attempting to log into Bungie.net.", platform);

    try {
      token = await this.getTokenFromBungieLogin(platform);

      if (_.size(token) > 0) {
        this._log.info("Login was successful.");
      } else {
        this._log.info("Login was unsuccessful.");
      }
    } catch (err) {
    } finally {
    }





    //
    // return deferred.promise
    //   .then(function(token) {
    //     if (token.length > 0) {
    //       return self._principal.identity(true)
    //         .then(function(identity) {
    //           return self._principal.authenticate(identity);
    //         })
    //         .then(function() {
    //           if (self._scope["returnToState"])
    //             self._state.go(self._scope["returnToState"].name, self._scope["returnToStateParams"]);
    //           else
    //             self._state.go("items");
    //
    //           return null;
    //         });
    //     }
    //   });
  }
};
