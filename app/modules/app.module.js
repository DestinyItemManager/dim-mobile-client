import angular from 'angular';
import authModule from './auth/auth.module.js';
import shellModule from './shell/shell.module.js';
import platformReady from './app.run.platformReady.js';
import stateChangeStart from './app.run.stateChangeStart.js';
import logging from './app.run.logging.js';
import config from './app.config.js';

let app = angular.module('dimApp', [
  'ionic',
  'ngCordova',
  'ui.router',
  'angular-logger',
  'ajoslin.promise-tracker',
  authModule,
  shellModule
])
  .run(platformReady)
  .run(stateChangeStart)
  .run(logging)
  .config(config);

export default app;
