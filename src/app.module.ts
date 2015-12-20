/// <reference path="../typings/angularjs/angular.d.ts" />

import bungieModule from './bungie/bungie.module'
import runFn from './app.run'
import configFn from './app.config'

let app = angular.module('starter',
  [
    'ionic',
    'ngCordova',
    bungieModule
  ])
  .run(runFn)
  .config(configFn);

export default app;
