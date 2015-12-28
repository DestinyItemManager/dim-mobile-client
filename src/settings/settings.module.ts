/// <reference path="../../typings/angularjs/angular.d.ts" />

import SettingsService from "./settingsService.service";

let moduleName = "dimSettings";

angular.module(moduleName, [])
  .service("dimSettingsService", SettingsService);

export default moduleName;
