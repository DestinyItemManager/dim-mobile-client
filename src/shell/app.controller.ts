/// <reference path="../../typings/angularjs/angular.d.ts" />

import PromiseTrackerService from "../utility/promiseTracker.service";

export default class AppCtrl {
  static $inject = ["$ionicPlatform", "$cordovaSplashscreen", "$log"];

  constructor($ionicPlatform: ionic.platform.IonicPlatformService, $cordovaSplashscreen, $log: ng.ILogService) {
    $ionicPlatform.ready(function() {
      // Hides splash screen
      if (window.cordova) {
        setTimeout(function() {
          $cordovaSplashscreen.hide();
        }, 1000);
      } else {
        $log.log("Cordova not found.");
      }
    });
  }
};
