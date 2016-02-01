import _ from 'lodash';

class SigninCtrl {
  constructor($http, $q, $log, dimAuthorizationService, dimPrincipal, $scope, $state, dimCookieParser, $ionicHistory, $rootScope, dimPromiseTracker) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    this.$log = $log['getInstance']('shell.SigninCtrl');
    this.auth = dimAuthorizationService;
    this.principal = dimPrincipal;
    this.$scope = $scope;
    this.$state = $state;
    this.cookieParser = dimCookieParser;
    this.$ionicHistory = $ionicHistory;
    this.$rootScope = $rootScope;
    this.promiseTracker = dimPromiseTracker;
  }

  /**
  * Signs the user out of Bungie.net
  */
  signOut() {
    this.processSignout();
  }

  /**
  * Signs the user into Bungie.net.
  */
  signIn(platform) {
    this.promiseTracker.addPromise(this.processSignin(platform));
  }

  /**
  * Signs the user into Bungie.net.
  */
  processSignout() {

  }

  /**
  * Returns the Bungie.net prefered platform signin string.
  */
  getSigninPlatform(platform) {
    switch (platform.toLowerCase()) {
    case 'psn':
      return 'Psnid';
    case 'xbl':
      return 'Xuid';
    default:
      throw new Error(`Invalid platform ID: ${ platform }`);
    }
  }

  /**
  * Extracts the token from the cookie.
  */
  getTokenFromCookie(cookie) {
    let cookieObj = this.cookieParser.parse(cookie);

    if (_.has(cookieObj, 'bungled')) {
      return cookieObj.bungled;
    } else {
      return '';
    }
  }

  /**
  * Extracts the token from the browser reference object.
  */
  processReference(ref) {
    let self = this;
    let deferred = self.$q.defer();
    let token = '';

    if (!_.isEmpty(ref)) {

      self.$log.debug(`Adding 'loadstop' listener to ref.`);

      // Handles the closing of the browser reference.  Checks to see if the
      // token was able to be retrieved from this reference before it was closed.
      ref.addEventListener('exit', () => {
        self.$log.debug('The browser ref is closing.');

        if (_.size(token) === 0) {
          self.$log.debug('There was no token found in browser reference.');

          deferred.resolve('');
        }
      });

      self.$log.debug(`Adding 'loaderror' listener to ref.`);

      ref.addEventListener('loaderror', () => {
        self.$log.debug('The browser ref had an error.');
        ref.close();
      });

      self.$log.debug(`Adding 'loadstop' listener to ref.`);

      // Attempts to get a cookie from each page load in the browser reference.
      ref.addEventListener('loadstop', () => {
        self.$log.debug('Running script to get document cookie.');

        var refResult = ref.executeScript(
          {
            code: 'document.cookie'
          },
          (result) => {
            self.$log.debug('Got the result from the loaded page.', result);

            if ((result || '').toString().indexOf('bungled') > -1) {
              if (_.isArray(result) && (_.size(result) > 0) && _.isString(result[0])) {
                token = self.getTokenFromCookie(result[0]);
              } else if (_.isString(result)) {
                token = self.getTokenFromCookie(result);
              }
            }

            if (_.size(token) > 0) {
              self.$log.debug('Token found; hide the page.', token);
              ref.close();
              deferred.resolve(token);
            } else {
              self.$log.debug('No token found; show the page.');
              ref.show();
            }
          }
        );

        self.$log.debug('RefResult: ', refResult);
      });
    } else {
      let msg = `The parameter 'ref' was empty.`;
      self.$log.debug(msg);
      deferred.reject(msg);
    }

    return deferred.promise;
  }

  /**
   * Processes the browser reference to the signin page on Bungie.net
   */
  async getTokenFromBungieLogin(platform) {
    let self = this;
    let token;

    this.$log.debug('Opening a window.');

    //let ref = window.open(`https://www.bungie.net/en/User/SignIn/${ this.getSigninPlatform(platform) }`, '_blank', 'location=yes,hidden=yes');
    let ref = window.open(`https://www.bungie.net/en/User/SignIn/${ this.getSigninPlatform(platform) }`, '_blank', 'location=yes');

    try {
      token = await self.processReference(ref);

      // TODO
      // If no token, then the signin page could have self-closed if already authenticated and never redirected to bungie.net.
      // Log into Bunige.net to check for a token if this is the case.
    } catch (err) {
      token = '';
    }

    return token;
  }

  /**
   * Processes the token, updates the Principal and Identity, and updates the
   * DestinyService with the signed in token.
   */
  async processSignin(platform) {
    let self = this;
    let token;

    self.$log.info('Attempting to log into Bungie.net.', platform);

    token = await self.getTokenFromBungieLogin(platform);

    if (_.size(token) > 0) {
      await self.principal.identity(true);

      self.$log.info('Login was successful.');

      if (self.principal.isAuthenticated) {
        self.$ionicHistory.nextViewOptions({
          disableBack: true
        });

        if (_.has(self.$rootScope, 'redirectToState')) {
          self.$state.go(self.$rootScope['redirectToState'].name, self.$rootScope['redirectToState'].params);
        } else {
          self.$state.go('welcome');
        }
      }
    } else {
      self.$log.info('Login was unsuccessful.');
    }
  }
}

export default SigninCtrl;
