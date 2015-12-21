/// <reference path="../typings/angularjs/angular.d.ts" />

import authModule from './auth/auth.module'
import shellModule from './shell/shell.module'
import runFn from './app.run'
import configFn from './app.config'

let app = angular.module('starter',
  [
    'ionic',
    'ngCordova',
    authModule,
    shellModule
  ])
  .run(runFn)
  .config(configFn);

export default app;
