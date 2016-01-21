/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts"/>

import AuthorizationService from "../auth/authorizationService.service";
import DimPrincipal from "../auth/dimPrincipal";
import BungieIdentity from "../auth/bungieIdentity";
import SettingsService from "../settings/settingsService";
import SyncService from "../sync/syncService";

export default class ItemsCtrl {
  private _q: ng.IQService;
  private _log: ng.ILogService;
  private _principal: DimPrincipal;
  private _settings: SettingsService;
  private _sync: SyncService;
  private _scope: ng.IScope;

  public displayName;
  public data;

  private _state;

  static $inject = [
    "$q",
    "$log",
    "dimPrincipal",
    "$scope",
    "$state",
    "dimSettingsService",
    "SyncService"
  ];

  constructor(
    $q: ng.IQService,
    $log: ng.ILogService,
    principal: DimPrincipal,
    settings: SettingsService,
    sync: SyncService,
    $scope: ng.IScope,
    $state)
  {

    // Private class variables
    this._q = $q;
    this._log = $log["getInstance"]("shell.SigninCtrl");
    this._principal = principal;
    this._settings = settings;
    this._sync = sync;
    this._scope = $scope;
    this._state = $state;

    let self = this;

    this._settings.getSetting()
      .then(function(s) {
        self.settings = s;
      });

    this._principal.identity()
      .then(function(identity) {
        self.displayName = identity.user.user.displayName;
      });

    this._scope.$on("$stateChangeSuccess", function updatePage() {
      self.now = (new Date()).toLocaleString();
    });
  }

  public save(key) {
    _settings.saveSetting(key, this.data[key]);
  }

  public showSync() {
    return _sync.disconnected();
  }

  public driveSync() {
    _sync.authorize().then((data) => {
      this.data = data;
//    $rootScope.$broadcast('dim-settings-updated');
    });
  }
}
