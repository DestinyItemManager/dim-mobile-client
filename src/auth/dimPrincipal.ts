/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts"/>

import IPrincipal from "./iprincipal";
import IIdentity from "./iidentity";
import BungieIdentity from "./bungieIdentity";
import IDestinyService from "../bungie/idestinyService";

/**
 * Class representing the current Identity context and authorizations.
 */
export default class DimPrincipal implements IPrincipal {
  private _http: ng.IHttpService;
  private _q: ng.IQService;
  private _log;
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

  constructor($http: ng.IHttpService, $q: ng.IQService, $log, cookieParser, destinyService: IDestinyService) {
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
    this._log.trace("hasIdentity :: Checking if pricipal has an identity.");

    let result = !_.isEmpty(this._identity);

    this._log.debug("hasIdentity :: Does the principal have an identity?", result);

    return result;
  }

  /**
  * Returns true if the Identity associated with the Principal can access the
  * Destiny API.
  */
  public get isAuthenticated(): boolean {
    this._log.trace("isAuthenticated :: Checking if identity is authenticated.");

    let result = this._authenticated;

    this._log.debug("isAuthenticated :: Is identity authenticated?", result);

    return result;
  }

  /**
  * Returns true if any one of the roles parameter matches one of the uses roles.
  */
  public isInAnyRole(roles:Array<string>): boolean {
    this._log.trace("isInAnyRole :: Checking for role membership.");

    let result = (_.has(this._identity, "_roles") && _.isArray(this._identity.roles) && _.isArray(roles)) ? _.some(roles, this.isInRole, this) : false;

    this._log.debug("isInAnyRole :: Is the identity in any of the passed roles?", roles, result)

    return result;
  }

  /**
  * Returns true if the role parameter matches one of the user's roles.
  */
  public isInRole(role:string): boolean {
    this._log.trace("isInRole :: Checking for role membership.");

    let result = (_.has(this._identity, "_roles") && _.isArray(this._identity.roles) && _.isString(role)) ? _.contains(this._identity.roles, role) : false;

    this._log.debug("isInRole :: Is the identity a member of the role?", role, result);

    return result;
  }


  /**
  * Extracts the 'bungled' token from a cookie.
  */
  private getTokenFromCookie(cookie: string): string {
    this._log.trace("getTokenFromCookie :: Getting bungled token from the cookie.");

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
    var self = this;
    self._log.trace("getCookieFromReference :: Preparing promise to process browser reference.");

    return this._q((resolve, reject) => {
      self._log.trace("getCookieFromReference :: Executing script against the browser reference.");
      ref.executeScript({
          code: "document.cookie"
      }, (result) => {
          self._log.trace("getCookieFromReference :: Processing the cookie.");
          let cookie = "";

          if ((result || "").toString().indexOf("bungled") > -1) {
            if (_.isArray(result) && _.size(result) > 0) {
              cookie = result[0];
            } else if (_.isString(result)) {
              cookie = result;
            }
          }

          self._log.debug("getCookieFromReference :: Result from proccessing cookie from browser reference", cookie);
          resolve(cookie);
      });
    });
  }

  /**
  * Retrieves the 'bungled' token from Bunige.net, if available.
  */
  private async getBungieNetToken(): Promise<string> {
    let self = this;

    self._log.trace("getBungieNetToken :: Getting token from Bungie.net.");

    let cookie;
    let token;

    try {
      cookie = await this._q<string>((resolve, reject) => {
        self._log.trace("getBungieNetToken :: Loading lightweight endpoint from bungie.net.");

        // Lightweight endpoint on Bungie.net to get an http response.
        let ref = window.open('https://www.bungie.net/help', '_blank', 'location=no,hidden=yes');

        self._log.trace("getBungieNetToken :: Browser reference opened.");
        self._log.trace("getBungieNetToken :: Adding 'loadstop' listener to ref.");

        ref.addEventListener('loadstop', async function(event) {
          self._log.debug("getBungieNetToken :: Within the loadstop event.", event);
          self._log.trace("getBungieNetToken :: Running script to get document cookie from opened page.");

          try {
            let token = await self.getCookieFromReference.bind(self, ref)();
            resolve(token);
          } catch (err) {
            self._log.error("getBungieNetToken :: There was an error while trying to access the 'bungled' token from Bungie.net.", err);
            reject(err);
          } finally {
            self._log.trace("getBungieNetToken :: Closing the browser reference.");
            ref.close();
            self._log.trace("getBungieNetToken :: Closed the browser reference.");
          }
        });

        ref.addEventListener('loaderror', (event) => {
          let msg = "getBungieNetToken :: There was an error loading a page from Bungie.net.";

          self._log.error(msg, event);

          self._log.trace("getBungieNetToken :: Closing the browser reference.");
          ref.close();
          self._log.trace("getBungieNetToken :: Closed the browser reference.");

          reject(new Error(msg));
        });
      });
    } catch (err) {
      self._log.error("getBungieNetToken :: There was an error getting the cookie from Bungie.net", err);
      cookie = "";
    }

    try {
      token = await self.getTokenFromCookie(cookie);
    } catch (err) {
      self._log.error("getBungieNetToken :: There was an error reading the 'bungled' token from the cookie.", err);
      token = "";
    }

    return token;
  }

  /**
  * Creates an Identity object based on the available Bungie.net cookie. It will
  * short-circuit if there is an Identity already on the Principal.  The 'force'
  * argument can be used to make the function get a new Identity object.
  */
  public async identity(force?: boolean): Promise<IIdentity> {
    let token;

    this._log.trace("identity :: Getting an Identity object.");

    // Force the resolution of the identy from an available token.
    if (force) {
      this._log.trace("identity :: Forced to get a new identity object.");
      this._identity = null;
    }

    // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
    if (!_.isEmpty(this._identity)) {
      this._log.trace("identity :: Identity defined on principal. Returning identity.");
      return this._identity;
    }

    try {
      this._log.trace("identity :: There is no identity object on the principal. Getting the token from bungie.net.");
      token = await this.getBungieNetToken();
    } catch (err) {
      this._log.info("identity :: There was an exception while retrieving the 'bungled' token from Bungie.net.", err);
    }

    try {
      if (_.size(token) > 0) {
        this._log.debug("identity :: A 'bungled' token has been found.", token);

        // Verify if the token is authorized on Bungie.net to make private API requests.
        await this.authenticate(new BungieIdentity(token));
      } else {
        this._log.info("identity :: Unable to get a 'bungled' token from Bungie.net.");
        await this.authenticate(null);
      }
    } catch (err) {
      this._log.warn("identity :: There was an error authenticating the identity.", err);

      // Resets the identity to null.
      await this.authenticate(null);
    }

    return (this._identity);
  }

  /**
  * Tests the Identity to see if it is able to access the Destiny API.
  */
  public async authenticate(identity: IIdentity) : Promise<boolean> {
    this._log.debug("authenticate :: Authenticating identity.", identity);

    let hasToken = (_.has(identity, "_token") && _.size(identity.token) > 0);

    this._log.debug("authenticate :: Checking if identity has a token.", hasToken);

    if (hasToken) {
      try {
        this._identity = identity;

        this._log.trace("authenticate :: Getting an instance of the Destiny API Service for this token.");

        // Get an instance of the Destiny API Service w/ the identity token.
        let testService = this._destinyService.getInstance(identity.token);
        // Test a private API request with the new identity token.
        let bungieUserData = await testService.getBungieNetUser();

        this._log.debug("authenticate :: Recieved Bungie.net user data.", bungieUserData);

        // If it was successful, we have an authenticated identity.
        let authenticated = !_.isEmpty(bungieUserData);

        this._log.debug("authenticate :: Is the identity signed into Bungie.net: ", authenticated);

        if (authenticated) {
          this._authenticated = authenticated;
          // New identity object created with the new user data.
          this._identity = identity = new BungieIdentity(identity.token, bungieUserData);
          // Destiny API Service token is updated to the new identity.
          this._destinyService.token = identity.token;
        }
      } catch (err) {
        this._log.debug("authenticate :: There was a problem authenticating the token.", err);
        this._authenticated = false;
        this._identity = null;
        this._destinyService.token = "";
      }
    } else if (identity === null){
      this._log.trace("authenticate :: Removing identity.");
      this._authenticated = false;
      this._identity = null;
      this._destinyService.token = "";
    }

    return this._authenticated;
  }

  /**
  * Signs out of the Destiny API and attempts to get a new token and Identity.
  */
  public async deauthenticate() {
    this.authenticate(null);
  }
};
