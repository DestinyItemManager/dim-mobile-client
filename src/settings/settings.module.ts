/// <reference path="../../typings/angularjs/angular.d.ts" />

import SettingsService from "./settingsService.service";

let moduleName = "dimSettings";

angular.module(moduleName, [])
  .service("dimSettingsService", SettingsService)
  .run(["$log", function($log) {
    $log.info(`Loaded '${ moduleName }' module.`);
  }]);

export default moduleName;
