/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />

import IPrinciple from "./IPrinciple";

export default class AuthorizationService {
  private _rootScope: ng.IRootScopeService;
  private _state: angular.ui.IState;
  private _principal: IPrinciple;

  static $inject = ['$rootScope', '$state', 'dimPrinciple'];

  constructor($rootScope: ng.IRootScopeService, $state: angular.ui.IState, dimPrinciple: IPrinciple) {
    this._rootScope = $rootScope;
    this._state = $state;
    this._principal = dimPrinciple;
  }

   authorize(): any {
    return this._principal.hasIdentity;
  }
};
