/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../../typings/node/node.d.ts" />

import IPrinciple from "./IPrinciple";

export default class AuthorizationService {
  private _q: ng.IQService;
  private _rootScope: ng.IRootScopeService;
  private _state: angular.ui.IStateService;
  private _timeout: ng.ITimeoutService;
  private _principal: IPrinciple;
  private _returnToState: any;
  private _returnToStateParams: any;

  static $inject = ["$q", "$rootScope", "$state", '$timeout', "dimPrinciple"];

  constructor(
    $q: ng.IQService,
    $rootScope: ng.IRootScopeService,
    $state: angular.ui.IStateService,
    $timeout: ng.ITimeoutService,
    dimPrinciple: IPrinciple) {

    this._q = $q;
    this._rootScope = $rootScope;
    this._state = $state;
    this._timeout = $timeout;
    this._principal = dimPrinciple;
    this._returnToState = undefined;
  }

  authorize(): ng.IPromise<any> {
    return this._q((resolve, reject) => {
      let authenticated = this._principal.isAuthenticated;

      if (angular.isDefined(this._rootScope["toState"].data.roles) && (this._rootScope["toState"].data.roles.length > 0)) {
        if (!authenticated) {
          this._rootScope["returnToState"] = this._rootScope["toState"];
          this._rootScope["returnToStateParams"] = this._rootScope["toStateParams"];

          this._timeout(() => {
            this._state.go("signin");
          }, 0);
        }
      }
      resolve('');
    });
  }
};
