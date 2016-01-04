/// <reference path="../typings/angularjs/angular.d.ts" />

import authModule from "./auth/auth.module";
import shellModule from "./shell/shell.module";
import platformReady from "./app.run.platformReady";
import stateChangeStart from "./app.run.stateChangeStart";
import logging from "./app.run.logging";
import config from "./app.config";

let app = angular.module("dimApp",
  [
    "ionic",
    "ngCordova",
    "ui.router",
    "angular-logger",
    authModule,
    shellModule
  ])
  .run(platformReady)
  .run(stateChangeStart)
  .run(logging)
  .config(config);

export default app;
