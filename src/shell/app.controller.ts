/// <reference path="../../typings/angularjs/angular.d.ts" />

export default class AppCtrl {
  static $inject = ["$ionicPlatform", "$cordovaSplashscreen"];

  constructor($ionicPlatform: ionic.platform.IonicPlatformService, $cordovaSplashscreen: any) {
    $ionicPlatform.ready(function() {
      // Hides splash screen
      if (window.cordova) {
        setTimeout(function() {
          $cordovaSplashscreen.hide();
        }, 1000);
      } else {
        console.log("Cordova not found.");
      }
    });
  }
};
