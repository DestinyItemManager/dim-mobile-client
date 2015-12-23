/// <reference path="../../typings/angularjs/angular.d.ts" />

import destinyService from "./destinyService.service";

let moduleName = "dimBungie";

angular.module(moduleName, [])
  .service("dimDestinyService", destinyService);

export default moduleName;
