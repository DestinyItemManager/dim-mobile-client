/// <reference path="../../typings/angularjs/angular.d.ts" />

import destinyService from "./destinyService.service";

let moduleName = "dimBungieNetApiServices";

angular.module(moduleName, [])
  .service("dimDestinyService", destinyService)
  .run(["$log", function($log) {
    $log.info(`Loaded '${ moduleName }' module.`);
  }]);

export default moduleName;
