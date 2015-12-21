/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/ionic/ionic.d.ts" />
/// <reference path="../typings/cordova/cordova.d.ts" />
/// <reference path="../typings/cordova-ionic/cordova-ionic.d.ts" />

runIonicPlatfrom.$inject = ['$ionicPlatform', '$timeout', '$cordovaSplashscreen'];

function runIonicPlatfrom($ionicPlatform: ionic.platform.IonicPlatformService, $timeout: ng.ITimeoutService, $cordovaSplashscreen) {
  $ionicPlatform.ready(function() {
    // Hides splash screen
    if (window.cordova) {
      setTimeout(function() {
        $cordovaSplashscreen.hide();
      }, 1000);
    }

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      window.StatusBar.styleDefault();
    }
  });
}

export default runIonicPlatfrom;
