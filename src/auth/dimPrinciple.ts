/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />

import IPrinciple from "./IPrinciple";
import IIdentity from "./IIdentity";
import BungieIdentity from "./bungieIdentity";

export default class DimPrinciple implements IPrinciple {
  private _http: ng.IHttpService;
  private _q: ng.IQService;
  private _authenticated: boolean;
  private _identity: IIdentity;

  static $inject = ["$http", "$q"];

  constructor($http: ng.IHttpService, $q: ng.IQService) {
    this._http = $http;
    this._q = $q;
    this._authenticated = false;
    this._identity = null;
  }

  public get hasIdentity(): boolean {
    return angular.isDefined(this._identity);
  }

  public get isAuthenticated(): boolean {
    return this._authenticated;
  }

  public get identity(): ng.IPromise<IIdentity> {
    return this._q.when(this._identity);
  }

  public async authenticate(cookie?: string) {
    this._identity = new BungieIdentity(this._q, cookie);
    return await this._identity.authenticate();
  }

  public async deauthenticate() {
    return await this._identity.deauthenticate();
  }
};
