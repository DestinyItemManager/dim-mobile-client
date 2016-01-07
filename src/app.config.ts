/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/angular-ui-router/angular-ui-router.d.ts" />

export default function appConfig(
  $stateProvider: angular.ui.IStateProvider,
  $urlRouterProvider: angular.ui.IUrlRouterProvider) {

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise("/welcome");

    $stateProvider
      .state("root", {
        abstract: true,
        template: "<ion-nav-view></ion-nav-view>",
        url: "",
        controller: "dimAppCtrl as app",
      })
      .state("menu", {
        parent: "root",
        abstract: true,
        url: "",
        templateUrl: "templates/shell-menu.html"
      })
      .state("welcome", {
        parent: "menu",
        url: "/welcome",
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
            templateUrl: 'templates/items.html',
            controller: "dimItemsCtrl as vm"
          }
        }
      })
      .state("characters", {
        parent: "menu",
        url: "/characters",
        views: {
          'menuContent': {
            templateUrl: 'templates/characters.html'
          }
        }
      })
      .state("signinPreload", {
        cache: false,
        parent: "menu",
        abstract: true,
        url: "",
        views: {
          'menuContent': {
            template: "<ion-nav-view></ion-nav-view>"
          }
        },
        resolve: {
          identity: ["$state", "$ionicHistory", "$q", "dimPrincipal", "$rootScope", function($state, $ionicHistory, $q, principal, $rootScope) {
            return $q.when(principal.identity(true))
              .then(function(identity) {
                console.debug("preload", identity);

                if (principal.isAuthenticated) {
                  $ionicHistory.nextViewOptions({
                    disableBack: true
                  });

                  if (_.has($rootScope, "redirectToState")) {
                    $state.go($rootScope["redirectToState"].name, $rootScope["redirectToState"].params)
                  } else {
                    $state.go("welcome");
                  }
                }

                return identity;
            });
          }]
        }
      })
      .state("signin", {
        cache: false,
        parent: "signinPreload",
        url: "/signin",
        templateUrl: 'templates/signin.html',
        controller: "dimSigninCtrl as vm",
        resolve: {
          getIdentity: ["identity", "$state", function(identity, $state) {
            console.debug("signin", identity);
            return identity;
          }]
        }
      })
      .state("signout", {
        cache: false,
        parent: "menu",
        url: "/signout",
        resolve: {
          signout: function ($state, $q, $log, $ionicHistory, dimPrincipal) {
            $log.debug("Signing out.");
            return $q((resolve, reject) => {
              let ref = window.open("https://www.bungie.net/en/User/SignOut", "_blank", "location=yes,hidden=yes,clearsessioncache=yes");

              ref.addEventListener("loadstop", function(event) {
                ref.close();
              });

              ref.addEventListener("loaderror", function(event) {
                ref.close();
              });

              ref.addEventListener("exit", function(event) {
                resolve();
              });
            })
            .then(function() {
              window["cookies"].clear(function() {
                console.log("Cookies cleared!");
              });
            })
            .then(function() {
              return $q(function(resolve, reject) {
                setTimeout(function() {
                  dimPrincipal.identity(true);
                  resolve();
                }, 50);
              });
            })
            .then(function() {
              $ionicHistory.nextViewOptions({
                disableBack: true
              });

              $state.go("welcome");
            // .then(function() {
            //   setTimeout(() => window.location.reload(), 50);
            // });
          });
        }
      }
    });
}
