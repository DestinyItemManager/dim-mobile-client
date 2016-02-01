import _ from 'lodash';

class StateChangeStart {
  constructor($rootScope, $state, $stateParams, dimAuthorizationService, dimPrincipal, $log) {
    'ngInject';

    let fnName = 'stateChangeStart ::';

    $log = $log.getInstance('app.run.stateChangeStart');

    function stateHasRoles(state) {
      return (_.has(state, 'data.roles') && _.isArray(state.data.roles) && (_.size(state.data.roles) > 0));
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      $log.trace(`${ fnName } Start.`);
      $log.debug(`${ fnName } Changing State: ${ toState.name }`, toState, toParams);

      if (stateHasRoles(toState)) {
        $log.debug(`${ fnName } Route has roles`, toState.data.roles);

        if (dimPrincipal.isAuthenticated) {
          $log.trace(`${ fnName } User is authenticated.`);

          if (!dimPrincipal.isInAnyRole(toState.data.roles)) {
            $log.info(`${ fnName } Authorization required; access denied.`);
            $log.debug(`${ fnName } The identity did not have the required role(s).`, dimPrincipal);

            // should go to an access-denied page.
            event.preventDefault();

            $state.go('signin', {
              accessdenied: true
            });
          }
        } else {
          $log.info(`${ fnName } Authorization required; redirecting to 'Sign In'.`);

          event.preventDefault();

          $rootScope['redirectToState'] = {
            name: toState.name,
            params: toParams
          };

          $state.go('signin', {
            state: {
              name: toState.name,
              params: toParams
            }
          });
        }
      } else {
        $log.debug(`${ fnName } Route has no roles`, []);
      }

      $log.trace(`${ fnName } End`);
    });
  }
}

export default StateChangeStart;
