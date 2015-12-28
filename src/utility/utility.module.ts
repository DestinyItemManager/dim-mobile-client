/// <reference path="../../typings/angularjs/angular.d.ts" />

import PromiseTracker from "./promiseTracker.service";

let moduleName = "dimUtility";

angular.module(moduleName, [
    "ajoslin.promise-tracker"
  ])
  .factory("dimPromiseTracker", ["$log", "promiseTracker", PromiseTracker.factory]);

export default moduleName;
