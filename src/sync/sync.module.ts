/// <reference path="../../typings/angularjs/angular.d.ts" />

import SyncService from "./syncService.service";

let moduleName = "dimSyncService";

angular.module(moduleName, [])
  .service("dimSyncService", SyncService)
  .run(["$log", function($log) {
    $log.info(`Loaded '${ moduleName }' module.`);
  }]);

export default moduleName;
