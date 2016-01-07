/// <reference path="../../typings/angularjs/angular.d.ts" />

import bungieModule from "../bungie/bungie.module";
import authModule from "../auth/auth.module";
import utilityModule from "../utility/utility.module";
import AppCtrl from "./app.controller";
import SigninCtrl from "./signin.controller";
import SigninPreloadService from "./signinPreload.service";
import ItemsCtrl from "./items.controller";

let moduleName = "dimShell";

angular.module(moduleName, [
    "ionic",
    "ngCordova",
    bungieModule,
    authModule,
    utilityModule
  ])
  .controller("dimAppCtrl", AppCtrl)
  .controller("dimItemsCtrl", ItemsCtrl)
  .controller("dimSigninCtrl", SigninCtrl)
  .service("dimSigninPreloadService", SigninPreloadService)
  .run(["$log", function($log) {
    $log.info(`Loaded '${ moduleName }' module.`);
  }]);

export default moduleName;
