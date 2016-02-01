import angular from 'angular';
import bungieModule from '../bungie/bungie.module.js';
import authModule from '../auth/auth.module.js';
import utilityModule from '../utility/utility.module.js';
import AppCtrl from './app.controller.js';
import SigninCtrl from './signin.controller.js';
import SigninPreloadService from './signinPreload.service.js';
import ItemsCtrl from './items.controller.js';

let moduleName = 'dimShell';

angular.module(moduleName, [
  'ionic',
  'ngCordova',
  bungieModule,
  authModule,
  utilityModule
])
  .controller('dimAppCtrl', AppCtrl)
  .controller('dimItemsCtrl', ItemsCtrl)
  .controller('dimSigninCtrl', SigninCtrl)
  .service('dimSigninPreloadService', SigninPreloadService)
  .run(runFn);

function runFn($log) {
  'ngInject';

  $log.info(`Loaded '${ moduleName }' module.`);
}

export default moduleName;
