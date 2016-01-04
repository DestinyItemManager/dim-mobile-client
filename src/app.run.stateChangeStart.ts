/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angular-ui-router/angular-ui-router.d.ts"/>

import AuthorizationService from "./auth/authorizationService.service";
import IPrincipal from "./auth/IPrincipal";

Run.$inject = [
    "$rootScope",
    "$state",
    "$stateParams",
    "dimAuthorizationService",
    "dimPrincipal",
    "$log"];

function Run(
  $rootScope: ng.IRootScopeService,
  $state: angular.ui.IStateService,
  $stateParams: angular.ui.IStateParamsService,
  authorizationService: AuthorizationService,
  principal: IPrincipal,
  $log: ng.ILogService) {

  $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
    $rootScope["toState"] = toState;
    $rootScope["toStateParams"] = toStateParams;

    if (principal.hasIdentity) {
      $log.debug('In app.run.');
      authorizationService.authorize();
    }
  });
}

export default Run;
