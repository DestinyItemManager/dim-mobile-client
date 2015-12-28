/// <reference path="../../typings/angularjs/angular.d.ts" />

import PromiseTrackerService from "../utility/promiseTracker.service";

export default class AppCtrl {
  static $inject = ["$ionicPlatform", "$cordovaSplashscreen"];

  constructor($ionicPlatform: ionic.platform.IonicPlatformService, $cordovaSplashscreen) {
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
