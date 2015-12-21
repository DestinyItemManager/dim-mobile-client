/// <reference path="../../typings/angularjs/angular.d.ts" />

import bungieModule from '../bungie/bungie.module'
import appCtrl from './app.controller';

let moduleName = 'dimShell';

angular.module(moduleName, [
    'ionic',
    'ngCordova',
    bungieModule
  ])
  .controller('dimAppCtrl', appCtrl);

export default moduleName;
