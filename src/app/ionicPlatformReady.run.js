function ionicPlatformReady($window, $ionicPlatform, $cordovaKeyboard, $cordovaStatusbar) {
  'ngInject';

  $ionicPlatform.ready(() => {
    if ($window.cordova) {
      if ($cordovaKeyboard) {
        $cordovaKeyboard.hideAccessoryBar(true);
        $cordovaKeyboard.disableScroll(true);
      }

      if($cordovaStatusbar) {
        $cordovaStatusbar.overlaysWebView(true);
        $cordovaStatusbar.style(1); // Default style.
      }
    }
  });
}

export default ionicPlatformReady;
