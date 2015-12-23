/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />

import IDestinyService from "./IDestinyService";

export default class DestinyService implements IDestinyService {
  private _http: ng.IHttpService;
  private _q: ng.IQService;

  static $inject = ['$http', '$q'];

  constructor($http: ng.IHttpService, $q: ng.IQService) {
    this._http = $http;
    this._q = $q;
  }

  getBungieNetUser(): ng.IPromise<any>  {
    return this._q.when(null);
  }

  getMembershipId(platform: any, platformUserId: any): ng.IPromise<any>  {
    return this._q.when(null);
  }

  getAccountDetails(membershipId: any): ng.IPromise<any>  {
    return this._q.when(null);
  }

  getCharacterInventory(membershipId: any, characterId: any): ng.IPromise<any>  {
    return this._q.when(null);
  }

  getAccountVault(platform: any): ng.IPromise<any> {
    return this._q.when(null);
  }
};
