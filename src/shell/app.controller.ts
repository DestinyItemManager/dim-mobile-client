/// <reference path="../../typings/angularjs/angular.d.ts" />

export default class AppCtrl {
  static $inject = ["$ionicPlatform", "$cordovaSplashscreen", "$log"];

  constructor($ionicPlatform: ionic.platform.IonicPlatformService, $cordovaSplashscreen, $log) {
    $ionicPlatform.ready(function() {
      // Hides splash screen
      if (window.cordova) {
        setTimeout(function() {
          $cordovaSplashscreen.hide();
        }, 1000);
      } else {
        $log.getInstance("AppCtrl").debug("constructor :: Cordova not found.");
      }
    });
  }
};
