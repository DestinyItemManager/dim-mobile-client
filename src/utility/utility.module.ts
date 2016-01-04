/// <reference path="../../typings/angularjs/angular.d.ts" />

import PromiseTracker from "./promiseTracker.service";
import CookieParser from "./cookieParser.service";

let moduleName = "dimUtility";

angular.module(moduleName, [
    "ajoslin.promise-tracker",
    "angular-logger"
  ])
  .run(["$log", function($log) {
    $log.info(`Loaded '${ moduleName }' module.`);
    $log.logLevels['*'] = $log.LEVEL.DEBUG;
  }])
  .factory("dimPromiseTracker", PromiseTracker.factory)
  .factory("dimCookieParser", CookieParser.factory);

export default moduleName;
