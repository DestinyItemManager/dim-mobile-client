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
  .config(config)
  .config(["$provide", function ($provide) {
    $provide.decorator("$state", ["$delegate", "$log", function ($delegate, $log) {
      // let's locally use 'state' name
      var state = $delegate;

      // let's extend this object with new function
      // 'baseGo', which in fact, will keep the reference
      // to the original 'go' function
      state.baseGo = state.go;

      // here comes our new 'go' decoration
      var go = function (to, params, options) {
        let debug = $log.debug.bind(null, `Changing State: ${ to }`);

        if (params) {
          debug = debug.bind(params);
        }

        if (options) {
          debug = debug.bind(options);
        }

        debug();

        // return processing to the 'baseGo' - original
        this.baseGo(to, params, options);
      };

      // assign new 'go', right now decorating the old 'go'
      state.go = go;

      return $delegate;
    }]);
  }]);

export default app;
