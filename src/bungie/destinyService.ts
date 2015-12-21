/// <reference path="../../typings/angularjs/angular.d.ts" />

interface IDestinyService {
  getBungieNetUser(): ng.IPromise<any>;
  getMembershipId(platform: any, platformUserId: any): ng.IPromise<any>;
  getAccountDetails(membershipId: any): ng.IPromise<any>;
  getCharacterInventory(membershipId: any, characterId: any): ng.IPromise<any>;
  getAccountVault(platform: any): ng.IPromise<any>;
}

export default class DestinyService implements IDestinyService {
  private $http: ng.IHttpService;
  private $q: ng.IQService;

  static $inject = ['$http', '$q'];

  constructor($http: ng.IHttpService, $q: ng.IQService) {
    this.$http = $http;
    this.$q = $q;
  }

  getBungieNetUser() {
    return this.$q.when(null);
  }

  getMembershipId(platform: any, platformUserId: any) {
    return this.$q.when(null);
  }

  getAccountDetails(membershipId: any) {
    return this.$q.when(null);
  }

  getCharacterInventory(membershipId: any, characterId: any) {
    return this.$q.when(null);
  }

  getAccountVault(platform: any) {
    return this.$q.when(null);
  }
};
