/// <reference path="../../typings/angularjs/angular.d.ts" />

import ISettingsService from "./isettingsService";
import SyncService from "../sync/syncService";

export default class SettingsService implements ISettingsService {
  private _http: ng.IHttpService;
  private _q: ng.IQService;
  private _sync: SyncService;

  static $inject = ["$http", "$q", "SyncService"];

  constructor(
    $http: ng.IHttpService,
    $q: ng.IQService,
    sync: SyncService)
  {
    this._http = $http;
    this._q = $q;
    this._sync = sync;
  }

  private saveSettings() {
    loadSettings();
//      .then(function(settings) {
//        var data = {};
//
//        data["settings-v1.0"] = settings;
//
//        SyncService.set(data);
//      });
  }


  private loadSettings(): ng.IPromise<any> {
    return this._q.when(null);
//    settingState = {
//      hideFilteredItems: false,
//      itemDetails: false,
//      itemStat: false,
//      condensed: false,
//      characterOrder: 'mostRecent',
//      itemSort: 'primaryStat',
//      charCol: 3,
//      vaultCol: 4
//    };
//
//    if (currentSettings !== null) {
//      return $q.when(currentSettings);
//    } else {
//      return $q(function(resolve, reject) {
//        function processStorageSettings(data) {
//          if (_.has(data, "settings-v1.0")) {
//            currentSettings = data["settings-v1.0"];
//
//            var currentKeys = _.keys(currentSettings);
//            var defaultKeys = _.keys(settingState);
//            var diff = _.difference(defaultKeys, currentKeys);
//
//            _.each(diff, function(key) {
//              if ((key === 'charCol') && currentSettings.condensed) {
//                currentSettings.charCol = 4;
//              } else if ((key === 'vaultCol') && currentSettings.condensed) {
//                currentSettings.vaultCol = 6;
//              } else {
//                currentSettings[key] = settingState[key];
//              }
//
//            });
//
//            if (diff.length > 0) {
//              saveSettings();
//            }
//          } else {
//            currentSettings = _.clone(settingState);
//
//            saveSettings()
//          }
//
//          resolve(currentSettings);
//        }
//
//        SyncService.get().then(processStorageSettings);
//      });
//    }
  }

  public getSetting(key?:string): ng.IPromise<any> {
    return loadSettings();
//      .then(function(settings) {
//        if (_.isUndefined(key)) {
//          return settings;
//        } else if (_.has(settings, key)) {
//          return _.propertyOf(settings)(key);
//        } else if (_.has(settingState, key)) {
//          // Found default
//          settings[key] = settingState[key];
//          saveSetting(key, settingState[key]);
//        } else {
//          return $q.reject("The key is not defined in the settings.");
//        }
//      });
  }

  public saveSetting(key, value): ng.IPromise<any> {
    return loadSettings();
//      .then(function(settings) {
//        settings[key] = value;
//        var data = {};
//        var kvp = {};
//
//        kvp[key] = value;
//
//        data["settings-v1.0"] = settings;
//
//        SyncService.set(data);
//        $rootScope.$broadcast('dim-settings-updated', kvp);
//      });
  }
};
