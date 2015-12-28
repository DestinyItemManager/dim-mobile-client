/// <reference path="../../typings/angularjs/angular.d.ts" />

import ISettingsService from "./ISettingsService";

export default class SettingsService implements ISettingsService {
  private _http: ng.IHttpService;
  private _q: ng.IQService;

  static $inject = ["$http", "$q"];

  constructor($http: ng.IHttpService, $q: ng.IQService) {
    this._http = $http;
    this._q = $q;
  }
};
