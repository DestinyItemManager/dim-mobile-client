import angular from 'angular';
import SettingsService from './settingsService.service';

let moduleName = 'dimSettings';

angular.module(moduleName, [])
  .service('dimSettingsService', SettingsService)
  .run(runFn);

function runFn($log) {
  'ngInject';

  $log.info(`Loaded '${ moduleName }' module.`);
}

export default moduleName;
