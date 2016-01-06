/// <reference path="../../typings/angularjs/angular.d.ts" />

export default class AppCtrl {
  static $inject = ["$ionicPlatform", "$cordovaSplashscreen", "$log", "$timeout"];

  constructor($ionicPlatform: ionic.platform.IonicPlatformService, $cordovaSplashscreen, $log, $timeout) {
    $ionicPlatform.ready(function() {
      // Hides splash screen
      if (window.cordova) {
        $timeout(function() {
          $cordovaSplashscreen.hide();
        }, 1000);
      } else {
        $log.getInstance("AppCtrl").debug("constructor :: Cordova not found.");
      }
    });
  }
};
