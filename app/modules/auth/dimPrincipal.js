import _ from 'lodash';
import BungieIdentity from './bungieIdentity.js';

/**
 * Class representing the current Identity context and authorizations.
 */
class DimPrincipal {
  constructor($http, $q, $log, dimCookieParser, dimDestinyService) {
    this.$http = $http;
    this.$q = $q;
    this.$log = $log['getInstance']('auth.DimPrincipal');
    this.cookieParser = dimCookieParser;
    this.destinyService = dimDestinyService;
    this.authenticated = false;
    this.identity = null;
  }

  /**
  * Returns true if the Principal has an Identity.
  */
  get hasIdentity() {
    this.$log.trace('hasIdentity :: Checking if pricipal has an identity.');

    let result = !_.isEmpty(this.identity);

    this.$log.debug('hasIdentity :: Does the principal have an identity?', result);

    return result;
  }

  /**
  * Returns true if the Identity associated with the Principal can access the
  * Destiny API.
  */
  get isAuthenticated() {
    this.$log.trace('isAuthenticated :: Checking if identity is authenticated.');

    let result = this.authenticated;

    this.$log.debug('isAuthenticated :: Is identity authenticated?', result);

    return result;
  }

  /**
  * Returns true if any one of the roles parameter matches one of the uses roles.
  */
  isInAnyRole(roles) {
    this.$log.trace('isInAnyRole :: Checking for role membership.');

    let result = (_.has(this.identity, '_roles') && _.isArray(this.identity.roles) && _.isArray(roles)) ? _.some(roles, this.isInRole, this) : false;

    this.$log.debug('isInAnyRole :: Is the identity in any of the passed roles?', roles, result);

    return result;
  }

  /**
  * Returns true if the role parameter matches one of the user's roles.
  */
  isInRole(role) {
    this.$log.trace('isInRole :: Checking for role membership.');

    let result = (_.has(this.identity, '_roles') && _.isArray(this.identity.roles) && _.isString(role)) ? _.contains(this.identity.roles, role) : false;

    this.$log.debug('isInRole :: Is the identity a member of the role?', role, result);

    return result;
  }


  /**
  * Extracts the 'bungled' token from a cookie.
  */
  getTokenFromCookie(cookie) {
    this.$log.trace('getTokenFromCookie :: Getting bungled token from the cookie.');

    let cookieObj = this.cookieParser.parse(cookie);

    if (_.has(cookieObj, 'bungled')) {
      return cookieObj['bungled'];
    } else {
      return '';
    }
  }

  /**
  * Extracts the cookie from the browser reference object.
  */
  getCookieFromReference(ref) {
    var self = this;
    self.$log.trace('getCookieFromReference :: Preparing promise to process browser reference.');

    return this.$q((resolve) => {
      self.$log.trace('getCookieFromReference :: Executing script against the browser reference.');
      ref.executeScript({
        code: 'document.cookie'
      }, (result) => {
        self.$log.trace('getCookieFromReference :: Processing the cookie.');
        let cookie = '';

        if ((result || '').toString().indexOf('bungled') > -1) {
          if (_.isArray(result) && _.size(result) > 0) {
            cookie = result[0];
          } else if (_.isString(result)) {
            cookie = result;
          }
        }

        self.$log.debug('getCookieFromReference :: Result from proccessing cookie from browser reference', cookie);
        resolve(cookie);
      });
    });
  }

  /**
  * Retrieves the 'bungled' token from Bunige.net, if available.
  */
  async getBungieNetToken() {
    let self = this;

    self.$log.trace('getBungieNetToken :: Getting token from Bungie.net.');

    let cookie;
    let token;

    try {
      cookie = await this.$q((resolve, reject) => {
        self.$log.trace('getBungieNetToken :: Loading lightweight endpoint from bungie.net.');

        // Lightweight endpoint on Bungie.net to get an http response.
        let ref = window.open('https://www.bungie.net/help', '_blank', 'location=no,hidden=yes');

        self.$log.trace('getBungieNetToken :: Browser reference opened.');
        self.$log.trace(`getBungieNetToken :: Adding 'loadstop' listener to ref.`);

        ref.addEventListener('loadstop', async function(event) {
          self.$log.debug('getBungieNetToken :: Within the loadstop event.', event);
          self.$log.trace('getBungieNetToken :: Running script to get document cookie from opened page.');

          try {
            let token = await self.getCookieFromReference.bind(self, ref)();
            resolve(token);
          } catch (err) {
            self.$log.error(`getBungieNetToken :: There was an error while trying to access the 'bungled' token from Bungie.net.`, err);
            reject(err);
          } finally {
            self.$log.trace('getBungieNetToken :: Closing the browser reference.');
            ref.close();
            self.$log.trace('getBungieNetToken :: Closed the browser reference.');
          }
        });

        self.$log.trace(`getBungieNetToken :: Adding 'loaderror' listener to ref.`);

        ref.addEventListener('loaderror', (event) => {
          let msg = 'getBungieNetToken :: There was an error loading a page from Bungie.net.';

          self.$log.error(msg, event);

          self.$log.trace('getBungieNetToken :: Closing the browser reference.');
          ref.close();
          self.$log.trace('getBungieNetToken :: Closed the browser reference.');

          reject(new Error(msg));
        });

        // setTimeout(function(ref) {
          // self.$log.trace('getBungieNetToken :: Reloading.');
          // ref.executeScript({
          //     code: 'document.location.refresh()'
          // }, () => {});
        // }, 5000);
      });
    } catch (err) {
      self.$log.error('getBungieNetToken :: There was an error getting the cookie from Bungie.net', err);
      cookie = '';
    }

    try {
      token = await self.getTokenFromCookie(cookie);
    } catch (err) {
      self.$log.error(`getBungieNetToken :: There was an error reading the 'bungled' token from the cookie.`, err);
      token = '';
    }

    return token;
  }

  /**
  * Creates an Identity object based on the available Bungie.net cookie. It will
  * short-circuit if there is an Identity already on the Principal.  The 'force'
  * argument can be used to make the function get a new Identity object.
  */
  async identity(force) {
    let token;

    this.$log.trace('identity :: Getting an Identity object.');

    // Force the resolution of the identy from an available token.
    if (force) {
      this.$log.trace('identity :: Forced to get a new identity object.');
      this.identity = null;
    }

    // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
    if (!_.isEmpty(this.identity)) {
      this.$log.trace('identity :: Identity defined on principal. Returning identity.');
      return this.identity;
    }

    try {
      this.$log.trace('identity :: There is no identity object on the principal. Getting the token from bungie.net.');
      token = await this.getBungieNetToken();
    } catch (err) {
      this.$log.info(`identity :: There was an exception while retrieving the 'bungled' token from Bungie.net.`, err);
    }

    try {
      if (_.size(token) > 0) {
        this.$log.debug(`identity :: A 'bungled' token has been found.`, token);

        // Verify if the token is authorized on Bungie.net to make API requests.
        await this.authenticate(new BungieIdentity(token));
      } else {
        this.$log.info(`identity :: Unable to get a 'bungled' token from Bungie.net.`);
        await this.authenticate(null);
      }
    } catch (err) {
      this.$log.warn('identity :: There was an error authenticating the identity.', err);

      // Resets the identity to null.
      await this.authenticate(null);
    }

    return (this.identity);
  }

  /**
  * Tests the Identity to see if it is able to access the Destiny API.
  */
  async authenticate(identity) {
    this.$log.debug('authenticate :: Authenticating identity.', identity);

    let hasToken = (_.has(identity, '_token') && _.size(identity.token) > 0);

    this.$log.debug('authenticate :: Checking if identity has a token.', hasToken);

    if (hasToken) {
      try {
        this.identity = identity;

        this.$log.trace('authenticate :: Getting an instance of the Destiny API Service for this token.');

        // Get an instance of the Destiny API Service w/ the identity token.
        let testService = this.destinyService.getInstance(identity.token);
        // Test a API request with the new identity token.
        let bungieUserData = await testService.getBungieNetUser();

        this.$log.debug('authenticate :: Recieved Bungie.net user data.', bungieUserData);

        // If it was successful, we have an authenticated identity.
        let authenticated = !_.isEmpty(bungieUserData);

        this.$log.debug('authenticate :: Is the identity signed into Bungie.net: ', authenticated);

        if (authenticated) {
          this.authenticated = authenticated;
          // New identity object created with the new user data.
          this.identity = identity = new BungieIdentity(identity.token, bungieUserData);
          // Destiny API Service token is updated to the new identity.
          this.destinyService.token = identity.token;
        }
      } catch (err) {
        this.$log.debug('authenticate :: There was a problem authenticating the token.', err);
        this.authenticated = false;
        this.identity = null;
        this.destinyService.token = '';
      }
    } else if (identity === null){
      this.$log.trace('authenticate :: Removing identity.');
      this.authenticated = false;
      this.identity = null;
      this.destinyService.token = '';
    }

    return this.authenticated;
  }

  /**
  * Signs out of the Destiny API and attempts to get a new token and Identity.
  */
  async deauthenticate() {
    this.authenticate(null);
  }
}

export default DimPrincipal;
