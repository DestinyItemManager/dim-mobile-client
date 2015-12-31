/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../typings/ionic/ionic.d.ts" />
/// <reference path="../typings/cordova/cordova.d.ts" />
/// <reference path="../typings/cordova-ionic/cordova-ionic.d.ts" />

import AuthorizationService from "./auth/authorizationService.service";
import IPrinciple from "./auth/IPrinciple";

Run.$inject = [
    "$ionicPlatform",
    "$timeout",
    "$cordovaSplashscreen",
    "$rootScope",
    "$state",
    "$stateParams",
    "dimAuthorizationService",
    "dimPrinciple",
    "$log"];

function Run(
  $ionicPlatform: ionic.platform.IonicPlatformService,
  $timeout: ng.ITimeoutService,
  $cordovaSplashscreen: any,
  $rootScope: ng.IRootScopeService,
  $state: angular.ui.IStateService,
  $stateParams: angular.ui.IStateParamsService,
  authorizationService: AuthorizationService,
  principal: IPrinciple,
  $log: ng.ILogService) {

  //$log = $log["getInstance"]("app.Run");

  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      window.StatusBar.styleDefault();
    }
  });

  $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
    $rootScope["toState"] = toState;
    $rootScope["toStateParams"] = toStateParams;

    if (principal.hasIdentity) {
      $log.debug('In app.run.');
      authorizationService.authorize();
    }
  });
}

export default Run;
