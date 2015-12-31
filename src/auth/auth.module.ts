/// <reference path="../../typings/angularjs/angular.d.ts" />

import bungieModule from "../bungie/bungie.module";
import utilityModule from "../utility/utility.module";
import DimPrinciple from "./dimPrinciple";
import BungieIdentity from "./bungieIdentity";
import AuthorizationService from "./authorizationService.service";

let moduleName = "dimAuth";

angular.module(moduleName, [
    bungieModule,
    utilityModule
  ])
  .service("dimPrinciple", DimPrinciple)
  .service("dimIdentity", BungieIdentity)
  .service("dimAuthorizationService", AuthorizationService)
  .run(["$log", function($log) {
    $log.info(`Loaded '${ moduleName }' module.`);
  }]);

export default moduleName;
