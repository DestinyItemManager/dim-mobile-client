/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/angular-ui-router/angular-ui-router.d.ts" />

export default function appConfig(
  $stateProvider: angular.ui.IStateProvider,
  $urlRouterProvider: angular.ui.IUrlRouterProvider) {

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise("/dim/app/items");

  $stateProvider
    .state("root", {
      url: "/dim",
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
      url: "/app",
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
      cache: false,
      parent: "menu",
      url: "/signin",
      data: {
        roles: []
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/signin.html',
          controller: "dimSigninCtrl as vm",
        }
      }
    })
    .state("signout", {
      cache: false,
      parent: "menu",
      url: "/signout",
      data: {
        roles: []
      },
      resolve: {
        signout: function ($state, $q, $log) {
          $log.debug("Signing out.");
          return $q((resolve, reject) => {
            let ref = window.open("https://www.bungie.net/en/User/SignOut/", "_blank", "location=yes,hidden=yes");

            ref.addEventListener("loadstop", function(event) {
              ref.close();
              resolve();
            });
          }).then(function() {
            $state.go('items');
          });
        }
      }
    });
}
