/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />

import IDestinyService from "./IDestinyService";

export default class DestinyService implements IDestinyService {
  private _http: ng.IHttpService;
  private _q: ng.IQService;
  private _log: ng.ILogService;
  private _apikey: string;
  private _token: string;
  private _enhancedLogger;

  static $inject = ["$http", "$q", "$log"];

  constructor($http: ng.IHttpService, $q: ng.IQService, $log: ng.ILogService) {
    this._http = $http;
    this._q = $q;
    this._enhancedLogger = $log;
    this._log = $log["getInstance"]("bungie.DestinyService");
    this._apikey = "57c5ff5864634503a0340ffdfbeb20c0";
    this._token = "";
  }

  public getInstance(token?:string): IDestinyService {
    this._log.info("Getting a new instance of DestinyService.", token);

    let service = new DestinyService(this._http, this._q, this._enhancedLogger);

    if (!_.isEmpty(token)) {
      service.token = token;
    }

    return service;
  }

  public get token() {
    return this._token;
  }

  public set token(token: string) {
    this._token = token;
  }

  public async getBungieNetUser(): Promise<any> {
    let request: ng.IRequestConfig;
    let result: ng.IHttpPromiseCallbackArg<any>;

    request = {
      method: 'GET',
      url: 'https://www.bungie.net/Platform/User/GetBungieNetUser/',
      headers: {
        'X-API-Key': this._apikey,
        'x-csrf': this._token
      },
      withCredentials: true
    };

    this._log.debug("Creating http request.", request);

    try {
      result = await this._http(request);

      this._log.debug("Http request was successful.", result);
    } catch (e) {
      this._log.error("The request failed.", e, request, result);
      throw e;
    }

    return result;
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
