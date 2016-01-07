/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts"/>

import AuthorizationService from "../auth/authorizationService.service";
import DimPrincipal from "../auth/dimPrincipal";
import BungieIdentity from "../auth/bungieIdentity";

export default class SigninPreloadCtrl {
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

  static $inject = [
    "$http",
    "$q",
    "$log",
    "dimAuthorizationService",
    "dimPrincipal",
    "$scope",
    "$state",
    "dimCookieParser"
  ];

  constructor(
    $http: ng.IHttpService,
    $q: ng.IQService,
    $log: ng.ILogService,
    authorization: AuthorizationService,
    principal: DimPrincipal,
    $scope: ng.IScope,
    $state: ng.ui.IStateService,
    cookieParser
  ) {

    // Private class variables
    this._http = $http;
    this._q = $q;
    this._log = $log["getInstance"]("shell.SigninCtrl");;
    this._auth = authorization;
    this._principal = principal;
    this._scope = $scope;
    this._state = $state;
    this._cookieParser = cookieParser;

    function preload() {
      return this._q.when(null);
    }
  }
}
