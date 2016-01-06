/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts" />

import IPrincipal from "./IPrincipal";
import IDestinyService from "../bungie/IDestinyService";

export default class AuthorizationService {
  private _http: ng.IHttpService;
  private _q: ng.IQService;
  private _log;
  private _rootScope: ng.IRootScopeService;
  private _state: angular.ui.IStateService;
  private _timeout: ng.ITimeoutService;
  private _principal: IPrincipal;
  private _cookieParser;
  private _destinyService: IDestinyService;
  private _ionicHistory: ionic.navigation.IonicHistoryService;

  private _returnToState;
  private _returnToStateParams;

  static $inject = [
    "$http",
    "$q",
    "$log",
    "$rootScope",
    "$state",
    "$timeout",
    "dimPrincipal",
    "dimCookieParser",
    "dimDestinyService",
    "$ionicHistory"];

  constructor(
    $http: ng.IHttpService,
    $q: ng.IQService,
    $log,
    $rootScope: ng.IRootScopeService,
    $state: angular.ui.IStateService,
    $timeout: ng.ITimeoutService,
    principal: IPrincipal,
    cookieParser,
    destinyService: IDestinyService,
    $ionicHistory: ionic.navigation.IonicHistoryService) {

    this._http = $http;
    this._q = $q;
    this._log = $log.getInstance("auth.AuthorizationService");
    this._rootScope = $rootScope;
    this._state = $state;
    this._timeout = $timeout;
    this._principal = principal;
    this._cookieParser = cookieParser;
    this._destinyService = destinyService;
    this._ionicHistory = $ionicHistory;

    this._returnToState = undefined;
  }

  /**
   * Used to verify a visitor can view a resource.  Creates an identity object
   * based on available credentials (cookies) if an identity is not present.
   * Verifies the identity can access Destiny API resources.
   */
  async authorize() {
    let self = this;

    self._log.trace("authorize :: Start");

    return this._principal.identity()
      .then(function(identity) {
        return true;
      });
  }
    // this._log.debug('Verifying user authorization.');
    // let self = this;
    //
    // return this._principal.identity()
    //   .then(function() {
    //     // Checks for an authenticated identity.  If there is none, the user is
    //     // redirected to sign in to resolve a user.
    //
    //     let authenticated = self._principal.isAuthenticated;
    //
    //     self._log.debug("Is the user authenticated? ", authenticated);
    //
    //     let state = self._rootScope["toState"];
    //     let params = self._rootScope["toStateParams"];
    //     let data = state.data;
    //
    //     // Does the endpoint have a role requirement?  Does the identity have the role?
    //     if ((data.roles) && (data.roles.length > 0) && (!self._principal.isInAnyRole(data.roles))) {
    //       self._log.debug("The state the user is navigating to:", state, params);
    //
    //       if (!authenticated) {
    //         self._log.debug('Authorization not found; redirecting to Sign in.');
    //
    //         self._rootScope["returnToState"] = state;
    //         self._rootScope["returnToStateParams"] = params;
    //
    //         self._timeout(() => {
    //           self._ionicHistory.nextViewOptions({
    //              disableBack: true
    //           });
    //
    //           self._state.go("signin");
    //         }, 0);
    //       } else {
    //         // Send the visitor to an access denied page.
    //       }
    //     }
    //   });
};
