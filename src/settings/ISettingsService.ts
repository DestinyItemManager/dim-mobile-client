/// <reference path="../../typings/angularjs/angular.d.ts" />

interface ISettingsService {
  getSetting(key?:string): ng.IPromise<any>;
  saveSetting(key, value): ng.IPromise<any>;
}

export default ISettingsService;
