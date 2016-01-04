/// <reference path="../../typings/angularjs/angular.d.ts" />

interface IDestinyService {
  token: string;
  getInstance(token?:string): IDestinyService;
  getBungieNetUser(): Promise<any>;
  getMembershipId(platfrom, patformUserId): ng.IPromise<any>;
  getAccountDetails(membershipId): ng.IPromise<any>;
  getCharacterInventory(membershipId, characterId): ng.IPromise<any>;
  getAccountVault(platform, membershipId): ng.IPromise<any>;
}

export default IDestinyService;
