/// <reference path="../../typings/angularjs/angular.d.ts" />

export default class AppCtrl {
  static $inject = ["$rootScope", "$ionicPlatform", "$log", "promiseTracker"];

  constructor($rootScope, $ionicPlatform: ionic.platform.IonicPlatformService, $log, promiseTracker) {
    $ionicPlatform.ready(function() {
      if (!window.cordova) {
        $log.getInstance("AppCtrl").debug("constructor :: Cordova not found.");
      }
    });

    $rootScope.tracker = promiseTracker();
  }
};
