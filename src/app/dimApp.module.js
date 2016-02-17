import angular from 'angular';

import 'script!moment/min/moment.min.js';
import 'script!sprintf-js/dist/sprintf.min.js';
import 'script!angular-logger/dist/logger.min.js';

import ionicPlatformReady from './ionicPlatformReady.run';
import consoleAppBanner from './consoleAppBanner.run';
import appConfig from './dimApp.config';

export default angular.module('starter', [
  'ionic',
  'ngCordova',
  'logger'
])
.config(appConfig)
.run(consoleAppBanner)
.run(ionicPlatformReady);
