/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="./IIdentity.ts"/>
/// <reference path="./IPrinciple.ts"/>

import IPrinciple from "./IPrinciple";
import IIdentity from "./IIdentity";
import BungieIdentity from "./BungieIdentity";

export default class Principle implements IPrinciple {
  private _http: any; // WeakMap<IPrinciple, ng.IHttpService>
  private _q: any; // WeakMap<IPrinciple, ng.IQService>
  private _authenticated: boolean;
  private _identity: IIdentity | void;

  static $inject = ['$http', '$q'];

  constructor($http: ng.IHttpService, $q: ng.IQService) {
    this._http.set(this, $http);
    this._q.set(this, $q);
    this._authenticated = false;
    this._identity = null;
  }

  isAuthenticated(): boolean {
    return this._authenticated;
  }

  getIdentity(): IIdentity {
    return null;
  }
};
