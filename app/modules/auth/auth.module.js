import angular from 'angular';
import bungieModule from '../bungie/bungie.module';
import utilityModule from '../utility/utility.module';
import Principal from './dimPrincipal';
import Identity from './bungieIdentity';
import AuthorizationService from './authorizationService.service';

let moduleName = 'dimAuthorizationModule';

angular.module(moduleName, [
  bungieModule,
  utilityModule
])
  .service('dimPrincipal', Principal)
  .service('dimIdentity', Identity)
  .service('dimAuthorizationService', AuthorizationService)
  .run(runFn);

function runFn($log) {
  'ngInject';

  $log.info(`Loaded '${ moduleName }' module.`);
}

export default moduleName;
