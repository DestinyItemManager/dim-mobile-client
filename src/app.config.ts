/// <reference path="../typings/angular-ui-router/angular-ui-router.d.ts" />

export default function appConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/items');

  $stateProvider
    .state('root', {
      abstract: true,
      controller: 'dimAppCtrl as app',
      resolve: {
        authorize: ['authorization',
          function(authorization) {
            return authorization.authorize();
          }
        ]
      }
    })
    .state('root.items', {
      url: '/items',
      templateUrl: 'templates/items.html'
    })
    .state('root.signin', {
      url: '/signin',
      templateUrl: 'templates/signin.html'
    });
}
