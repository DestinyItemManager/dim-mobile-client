/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/ionic/ionic.d.ts" />
/// <reference path="../typings/cordova/cordova.d.ts" />
/// <reference path="../typings/cordova-ionic/cordova-ionic.d.ts" />

Run.$inject = [
    "$ionicPlatform",
    "$timeout",
    "$cordovaSplashscreen",
    "$log"];

function Run(
  $ionicPlatform: ionic.platform.IonicPlatformService,
  $timeout: ng.ITimeoutService,
  $cordovaSplashscreen: any,
  $log: any) {

  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      window.StatusBar.styleDefault();
    }
  });
}

export default Run;
