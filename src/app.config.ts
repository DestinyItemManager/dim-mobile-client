/// <reference path="../typings/angular-ui-router/angular-ui-router.d.ts" />

export default function appConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise("/items");

  $stateProvider
    .state("root", {
      url: "",
      abstract: true,
      template: "<ion-nav-view></ion-nav-view>",
      controller: "dimAppCtrl as app",
      resolve: {
        authorize: ["dimAuthorizationService",
          function(authorization) {
            return authorization.authorize();
          }
        ]
      }
    })
    .state("menu", {
      parent: "root",
      url: "",
      abstract: true,
      templateUrl: "templates/shell-menu.html",
    })
    .state("items", {
      parent: "menu",
      url: "/items",
      data: {
        roles: ['Guardian']
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/items.html'
        }
      }
    })
    .state("signin", {
      parent: "root",
      url: "/signin",
      controller: "dimSigninCtrl as vm",
      data: {
        roles: []
      },
      templateUrl: 'templates/signin.html'
      // views: {
      //   'menuContent': {
      //     templateUrl: 'templates/signin.html'
      //   }
      // }
    });
}
