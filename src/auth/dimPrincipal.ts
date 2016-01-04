/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts"/>

import IPrincipal from "./IPrincipal";
import IIdentity from "./IIdentity";
import BungieIdentity from "./bungieIdentity";
import IDestinyService from "../bungie/IDestinyService";

/**
 * Class representing the current Identity context and authorizations.
 */
export default class DimPrincipal implements IPrincipal {
  private _http: ng.IHttpService;
  private _q: ng.IQService;
  private _log: ng.ILogService;
  private _authenticated: boolean;
  private _identity: IIdentity;
  private _cookieParser;
  private _destinyService: IDestinyService;

  static $inject = [
    "$http",
    "$q",
    "$log",
    "dimCookieParser",
    "dimDestinyService"];

  constructor($http: ng.IHttpService, $q: ng.IQService, $log: ng.ILogService, cookieParser, destinyService: IDestinyService) {
    this._http = $http;
    this._q = $q;
    this._log = $log["getInstance"]("auth.DimPrincipal");
    this._authenticated = false;
    this._identity = null;
    this._cookieParser = cookieParser;
    this._destinyService = destinyService;
  }

  /**
  * Returns true if the Principal has an Identity.
  */
  public get hasIdentity(): boolean {
    return !_.isEmpty(this._identity);
  }

  /**
  * Returns true if the Identity associated with the Principal can access the
  * Destiny API.
  */
  public get isAuthenticated(): boolean {
    return this._authenticated;
  }

  /**
  * Returns true if any one of the roles parameter matches one of the uses roles.
  */
  public isInAnyRole(roles:Array<string>): boolean {
    if (!this._authenticated || !this._identity.roles) {
      return false;
    }

    for (var i = 0; i < roles.length; i++) {
      if (this.isInRole(roles[i])) {
        return true;
      }
    }

    return false;
  }

  /**
  * Returns true if the role parameter matches one of the user's roles.
  */
  public isInRole(role:string): boolean {
    if (!this._authenticated || !this._identity.roles) {
      return false;
    }

    return this._identity.roles.indexOf(role) != -1;
  }


  /**
  * Extracts the 'bungled' token from a cookie.
  */
  private getTokenFromCookie(cookie: string): string {
    let cookieObj = this._cookieParser.parse(cookie);

    if (_.has(cookieObj, "bungled")) {
      return cookieObj["bungled"];
    } else {
      return "";
    }
  }

  /**
  * Extracts the cookie from the browser reference object.
  */
  private getCookieFromReference(ref): ng.IPromise<string> {
    return this._q(function(resolve, reject) {
      ref.executeScript({
        code: "document.cookie"
      }, (result) => {
          if ((result || "").toString().indexOf("bungled") > -1) {
            if (_.isArray(result) && _.size(result) > 0) {
              resolve(result[0]);
              return;
            } else if (_.isString(result)) {
              resolve(result);
            } else {
              resolve("");
            }
          } else {
            resolve("");
          }
        });
    });
  }

  /**
  * Retrieves the 'bungled' token from Bunige.net, if available.
  */
  private getBungieNetToken(): ng.IPromise<string> {
    let self = this;
    let promise = this._q((resolve, reject) => {
      self._log.debug("Loading lightweight endpoint from bungie.net");

      // Lightweight endpoint on Bungie.net to get an http response.
      let ref = window.open('https://www.bungie.net/help', '_blank', 'location=no,hidden=yes');

      ref.addEventListener('loadstop', async function(event) {
        self._log.debug(event);

        try {
          let token = await self.getCookieFromReference.bind(self, ref)();
          resolve(token);
        } catch (e) {
          let msg = "There was an error while trying to access the token from Bungie.net.";
          self._log.error(msg, e);
          reject(new Error(msg));
        } finally {
          ref.close();
        }
      });

      ref.addEventListener('loaderror', function(event) {
        self._log.debug(event);

        let msg = "There was an error loading a page from Bungie.net.";

        self._log.error(msg, event);
        ref.close();
        reject(new Error(msg));
      });
    })
    .then(this.getTokenFromCookie.bind(self))
    .catch((error) => {
      this._log.error(error);

      return "";
    });

    return promise;
  }

  /**
  * Validates that a token can access the Destiny API.  Necessary since tokens
  * are on every response from Bungie.net.  Having a 'bungled' token doesn't
  * guarantee that you can access the Destiny API.
  */
  private async isTokenValid(token: string): Promise<any> {
    let result;
    let bnetUserData = null;
    let isValid = false;
    let tempInstance = this._destinyService.getInstance(token);

    this._log.debug("Testing token to see if it can get data from Bungie.net.");

    tempInstance.token = token;

    try {
      result = await tempInstance.getBungieNetUser();
      isValid = (<any>result.data).ErrorCode === 1;

      if (isValid) {
        bnetUserData = result.data.Response;
      }
    } catch (e) {
      this._log.error("The token validation request failed", e, result);
      isValid = false;
    }

    return bnetUserData;
  }

  /**
  * Creates an Identity object based on the available Bungie.net cookie. It will
  * short-circuit if there is an Identity already on the Principal.  The 'force'
  * argument can be used to make the function to get a new Identity object.
  */
  public async identity(force?: boolean): Promise<IIdentity> {
    let token;

    // Force the resolution of the identy from an available token.
    if (force) {
      this._identity = null;
    }

    // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
    if (!_.isEmpty(this._identity)) {
      this._log.debug("Found existing identity.");
      return this._identity;
    }

    try {
      this._log.debug("Getting token from Bungie.net.");
      token = await this.getBungieNetToken();
    } catch (e) {
      this._log.warn("Unable to get a bungie token from Bungie.net.", e);
    }

    try {
      if (_.size(token) > 0) {
        this._log.debug("A token has been found.", token);

        let identity = new BungieIdentity(token);
        await this.authenticate(identity);
      }
    } catch (e) {
      console.warn("There was an error getting the identity.", e);
      this.authenticate(null);
    }

    return this._identity;
  }

  /**
  * Tests the Identity to see if it is able to access the Destiny API.
  */
  public async authenticate(identity: IIdentity) {
    this._log.debug("Authenticating identity.", identity);

    let isValid = false;

    if (!_.isEmpty(identity)) {
      if (!_.isEmpty(identity.token)) {
        try {
          let testDestinyService = this._destinyService.getInstance(identity.token);
          let bungieUserData = await testDestinyService.getBungieNetUser();
          isValid = (<any>bungieUserData.data).ErrorCode === 1;
          this._log.debug("Is the identity signed into Bungie.net: ", isValid);

          if (isValid) {
            identity = new BungieIdentity(identity.token, bungieUserData.data.Response);
          }
        } catch (e) {
          this._log.error("There was a problem authenticating the token.", e);
        } finally {
          this._authenticated = isValid;
        }
      }
    }

    this._identity = identity;
    this._destinyService.token = (!_.isEmpty(this._identity) && _.has(this._identity, "token")) ? this._identity.token : "";
  }

  /**
  * Signs out of the Destiny API and attempts to get a new token and Identity.
  */
  public async deauthenticate() {
    this.authenticate(null);
  }
};
