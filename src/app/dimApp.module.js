import angular from 'angular';
import uiRouter from 'angular-ui-router';

import ionicPlatformReady from './ionicPlatformReady.run.js';
import consoleAppBanner from './consoleAppBanner.run.js';
import logEnhancerConfig from './logEnhancer.config.js';

// Modules
import shellModule from './shell/shell.module.js';

// Webpack Script Import for Logging
import 'script!moment/min/moment.min.js';
import 'script!sprintf-js/dist/sprintf.min.js';
import 'script!angular-logger/dist/angular-logger.min.js';

export default angular.module('dimApp', [
  'ionic',
  'ngCordova',
  'angular-logger',
  uiRouter,
  shellModule.name
])
  .config(logEnhancerConfig)
  .run(consoleAppBanner)
  .run(ionicPlatformReady);
