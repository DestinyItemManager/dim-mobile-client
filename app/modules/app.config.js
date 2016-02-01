import _ from 'lodash';

class Config {
  constructor($stateProvider, $urlRouterProvider, $log) {
    'ngInject';

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/welcome');

    $stateProvider
      .state('root', {
        abstract: true,
        templateUrl: 'templates/root.html',
        url: '',
        controller: 'dimAppCtrl as app'
      })
      .state('menu', {
        parent: 'root',
        abstract: true,
        url: '',
        templateUrl: 'templates/shell-menu.html'
      })
      .state('welcome', {
        parent: 'menu',
        url: '/welcome',
        views: {
          'menuContent': {
            templateUrl: 'templates/welcome.html'
          }
        }
      })
      .state('items', {
        parent: 'menu',
        url: '/items',
        data: {
          roles: ['Guardian']
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/items.html',
            controller: 'dimItemsCtrl as vm'
          }
        }
      })
      .state('characters', {
        parent: 'menu',
        url: '/characters',
        views: {
          'menuContent': {
            templateUrl: 'templates/characters.html'
          }
        }
      })
      .state('signinPreload', {
        cache: false,
        parent: 'menu',
        abstract: true,
        url: '',
        views: {
          'menuContent': {
            template: '<ion-nav-view></ion-nav-view>'
          }
        },
        resolve: {
          identity: ['$state', '$ionicHistory', '$q', 'dimPrincipal', '$rootScope', function($state, $ionicHistory, $q, principal, $rootScope) {
            var a = $q.when(principal.identity(true))
              .then(function(identity) {
                $log.debug('preload', identity);

                if(principal.isAuthenticated) {
                  $ionicHistory.nextViewOptions({
                    disableBack: true
                  });

                  if(_.has($rootScope, 'redirectToState')) {
                    $state.go($rootScope['redirectToState'].name, $rootScope['redirectToState'].params);
                  } else {
                    $state.go('welcome');
                  }
                }

                return identity;
              });

            $rootScope['tracker'].addPromise(a);

            return a;
          }]
        }
      })
      .state('signin', {
        cache: false,
        parent: 'signinPreload',
        url: '/signin',
        templateUrl: 'templates/signin.html',
        controller: 'dimSigninCtrl as vm',
        resolve: {
          getIdentity: ['identity', '$state', function(identity) {
            $log.debug('signin', identity);
            return identity;
          }]
        }
      })
      .state('signout', {
        cache: false,
        parent: 'menu',
        url: '/signout',
        resolve: {
          signout: function($state, $q, $log, $ionicHistory, dimPrincipal, $rootScope) {
            $log.debug('Signing out.');

            var a = $q((resolve) => {
              let ref = window.open('https://www.bungie.net/en/User/SignOut', '_blank', 'location=yes,hidden=yes');

              ref.addEventListener('loadstop', () => {
                ref.close();
              });

              ref.addEventListener('loaderror', () => {
                ref.close();
              });

              ref.addEventListener('exit', () => {
                resolve();
              });
            })
            .catch((a) => {
              $log.error(JSON.stringify(a));
            })
            .then(() => {
              window['cookies'].clear(function() {
                $log.log('Cookies cleared!');
              });
            })
            .then(function() {
              return $q((resolve) => {
                resolve(dimPrincipal.identity(true));
              });
            })
            .then(function() {
              $ionicHistory.nextViewOptions({
                disableBack: true
              });

              $state.go('welcome');
            });

            $rootScope['tracker'].addPromise(a);

            return a;
          }
        }
      });
  }
}

export default Config;
