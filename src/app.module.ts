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
    "ajoslin.promise-tracker",
    authModule,
    shellModule
  ])
  .run(platformReady)
  .run(stateChangeStart)
  .run(logging)
  .config(config)
  .factory("dimInitAuthentication", ["$q", "$log", function($q, $log) {
    var log = $log.getInstance("dimInitAuthentication");
    var deferred = $q.defer();
    var promise = deferred.promise
      .catch(function(error) {
        log.error("There was an error while authentiating the visitor.", error);
      });
    var service = {
      deferred: deferred,
      promise: promise
    };

    return service;
}]);

export default app;
