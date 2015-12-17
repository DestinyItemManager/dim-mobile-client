/// <reference path="../typings/angularjs/angular.d.ts" />

import runFn from './app.run'
import configFn from './app.config'

let app = angular.module('starter',
  [
    'ionic',
    'ngCordova'
  ])
  .run(runFn)
  .config(configFn);
 
export default app;
