/// <reference path="../../typings/angularjs/angular.d.ts" />

import bungieModule from '../bungie/bungie.module'
import appCtrl from './app.controller';
import signinCtrl from './signin.controller';

let moduleName = 'dimShell';

angular.module(moduleName, [
    'ionic',
    'ngCordova',
    bungieModule
  ])
  .controller('dimAppCtrl', appCtrl)
  .controller('dimSigninCtrl', signinCtrl);

export default moduleName;
