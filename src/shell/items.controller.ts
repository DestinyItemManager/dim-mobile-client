/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts"/>

import AuthorizationService from "../auth/authorizationService.service";
import DimPrincipal from "../auth/dimPrincipal";
import BungieIdentity from "../auth/bungieIdentity";

export default class ItemsCtrl {
  private _q: ng.IQService;
  private _log: ng.ILogService;
  private _principal: DimPrincipal;
  private _scope: ng.IScope;

  public displayName;
  public gamertag;
  public psnId;
  public clanName;
  public clanMotto;
  public now;
  public nowScope;

  private _state;

  static $inject = [
    "$q",
    "$log",
    "dimPrincipal",
    "$scope",
    "$state"
  ];

  constructor(
    $q: ng.IQService,
    $log: ng.ILogService,
    principal: DimPrincipal,
    $scope: ng.IScope,
    $state)
  {

    // Private class variables
    this._q = $q;
    this._log = $log["getInstance"]("shell.SigninCtrl");
    this._principal = principal;
    this._scope = $scope;
    this._state = $state;

    let self = this;

    principal.identity()
      .then(function(identity) {
        self.displayName = identity.user.user.displayName;
        self.psnId = identity.user.psnId;
        self.gamertag = identity.user.gamerTag;
        self.clanName = identity.user.clans[0].detail.name;
        self.clanMotto = identity.user.clans[0].detail.motto;
        self.now = (new Date()).toLocaleString();
        self.nowScope = (new Date()).toLocaleString();
      });

    this._scope.$on("$stateChangeSuccess", function updatePage() {
      self.now = (new Date()).toLocaleString();
    });
  }
}
