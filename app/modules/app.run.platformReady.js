class PlatformReady {
  constructor($ionicPlatform) {
    'ngInject';

    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        window.cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        window.StatusBar.styleDefault();
      }
    });
  }
}

export default PlatformReady;
