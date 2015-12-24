/// <reference path="../../typings/angularjs/angular.d.ts" />

import bungieModule from "../bungie/bungie.module"
import AppCtrl from "./app.controller";
import SigninCtrl from "./signin.controller";

let moduleName = "dimShell";

angular.module(moduleName, [
    "ionic",
    "ngCordova",
    bungieModule
  ])
  .controller("dimAppCtrl", AppCtrl)
  .controller("dimSigninCtrl", SigninCtrl);

export default moduleName;
