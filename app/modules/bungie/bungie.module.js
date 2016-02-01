import angular from 'angular';
import destinyService from './destinyService.service';

let moduleName = 'dimBungieNetApiServices';

angular.module(moduleName, [])
  .service('dimDestinyService', destinyService)
  .run(runFn);

function runFn($log) {
  'ngInject';

  $log.info(`Loaded '${ moduleName }' module.`);
}

export default moduleName;
