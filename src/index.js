import angular from 'angular';
import dimAppModule from './app/dimApp.module';

import './styles.scss';

// Bootstrap DIM's angular modules.
angular.element(document).ready(() => {
  if (window.cordova) {
    document.addEventListener('deviceready', function() {
      angular.bootstrap(document.body, [dimAppModule.name]);
    }, false);
  } else {
    angular.bootstrap(document.body, [dimAppModule.name]);
  }
});
