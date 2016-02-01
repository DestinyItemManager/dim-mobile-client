/*eslint-disable no-console, no-unused-vars */

import angular from 'angular';
import appModule from './app.module.js';

// Banner in console log.
if (window.chrome) {
  console.info('%c' + require('./app-banner.html'), 'font-family: monospace');
} else {
  console.info(require('./app-banner-lofi.html'));
}

// Bootstrap DIM's angular modules.
angular.element(document).ready(() => {
  if (window.cordova) {
    document.addEventListener('deviceready', function() {
      angular.bootstrap(document.body, [appModule.name]);
    }, false);
  } else {
    angular.bootstrap(document.body, [appModule.name]);
  }
});
