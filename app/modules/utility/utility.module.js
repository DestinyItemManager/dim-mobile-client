import angular from 'angular';
import PromiseTracker from './promiseTracker.service';
import CookieParser from './cookieParser.service';

let moduleName = 'dimUtility';

angular.module(moduleName, [
  'ajoslin.promise-tracker',
  'angular-logger'
])
  .factory('dimPromiseTracker', PromiseTracker.factory)
  .factory('dimCookieParser', CookieParser.factory)
  .run(runFn);

function runFn($log) {
  'ngInject';

  $log.info(`Loaded '${ moduleName }' module.`);
  $log.logLevels['*'] = $log.LEVEL.DEBUG;
}

export default moduleName;
