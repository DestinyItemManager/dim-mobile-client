class AppCtrl {
  constructor($ionicPlatform, $log) {
    'ngInject';

    $ionicPlatform.ready(() => {
      if (!window.cordova) {
        $log.getInstance('AppCtrl').debug('constructor :: Cordova not found.');
      }
    });
  }
}

export default AppCtrl;
