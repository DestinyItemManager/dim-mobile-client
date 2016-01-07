/// <reference path="../../typings/angularjs/angular.d.ts" />

export default class AppCtrl {
  static $inject = ["$ionicPlatform", "$log"];

  constructor($ionicPlatform: ionic.platform.IonicPlatformService, $log) {
    $ionicPlatform.ready(function() {
      if (!window.cordova) {
        $log.getInstance("AppCtrl").debug("constructor :: Cordova not found.");
      }
    });
  }
};
