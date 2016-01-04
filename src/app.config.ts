/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/angular-ui-router/angular-ui-router.d.ts" />

export default function appConfig(
  $stateProvider: angular.ui.IStateProvider,
  $urlRouterProvider: angular.ui.IUrlRouterProvider) {

  let initialStateName = "welcome";
  let initialStateUrl = "/welcome";

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise(initialStateUrl);

  $stateProvider
    .state("root", {
      abstract: true,
      template: "<ion-nav-view></ion-nav-view>",
      url: "",
      controller: "dimAppCtrl as app",
      resolve: {
        init: ["dimInitAuthentication", function(init) {
          return init.promise;
        }]
      }
      // controller: "dimAppCtrl as app",
      // resolve: {
      //   authorize: ["dimAuthorizationService", "$log",
      //     function(authorization, $log) {
      //       $log.info("hi");
      //       //return authorization.authorize();
      //     }
      //   ]
      // }
    })
    .state("menu", {
      parent: "root",
      abstract: true,
      url: "",
      templateUrl: "templates/shell-menu.html",
    })
    .state(initialStateName, {
      parent: "menu",
      url: initialStateUrl,
      views: {
        'menuContent': {
          templateUrl: 'templates/welcome.html'
        }
      }
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
            $state.go(initialStateName);
          });
        }
      }
    });
}
