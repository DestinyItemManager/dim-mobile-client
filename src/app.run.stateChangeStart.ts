/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angular-ui-router/angular-ui-router.d.ts"/>
/// <reference path="../typings/lodash/lodash.d.ts"/>

import AuthorizationService from "./auth/authorizationService.service";
import IPrincipal from "./auth/iprincipal";

Run.$inject = [
    "$rootScope",
    "$state",
    "$stateParams",
    "dimAuthorizationService",
    "dimPrincipal",
    "$log",
    "dimInitAuthentication",
    "$timeout"];

function Run(
  $rootScope: ng.IRootScopeService,
  $state: angular.ui.IStateService,
  $stateParams: angular.ui.IStateParamsService,
  authService: AuthorizationService,
  principal: IPrincipal,
  $log) {
    $log = $log.getInstance("app.run.stateChangeStart");

    function stateHasRoles(state) {
      return (_.has(state, "data.roles") && _.isArray(state.data.roles) && (_.size(state.data.roles) > 0));
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      $log.trace("on$stateChangeStart :: Start");
      $log.debug(`on$stateChangeStart :: Changing State: ${ toState.name }`, toState, toParams);

      if (stateHasRoles(toState)) {
        $log.debug("on$stateChangeStart :: Route has roles", toState.data.roles);

        if (principal.isAuthenticated) {
          $log.trace("on$stateChangeStart :: User is authenticated.");

          if (!principal.isInAnyRole(toState.data.roles)) {
            $log.info("Authorization required; access denied.");
            $log.debug("on$stateChangeStart :: The identity did not have the required role(s).", principal);

            // should go to an access-denied page.
            event.preventDefault();

            $state.go('signin', {
              accessdenied: true
            });
          }
        } else {
          $log.info("Authorization required; redirecting to 'Sign In'.");

          event.preventDefault();

          $rootScope["redirectToState"] = {
            name: toState.name,
            params: toParams
          };

          $state.go("signin", {
            state: {
              name: toState.name,
              params: toParams
            }
          });
        }
      } else {
        $log.debug("on$stateChangeStart :: Route has no roles", []);
      }

      $log.trace("on$stateChangeStart :: End");
    });
}

export default Run;
