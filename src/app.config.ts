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
            templateUrl: 'templates/items.html'
          }
        }
      })
      .state("characters", {
        parent: "menu",
        url: "/characters",
        views: {
          'menuContent': {
            templateUrl: 'templates/items.html'
          }
        }
      })
      .state("getIdentity", {
        cache: false,
        parent: "menu",
        abstract: true,
        views: {
          'menuContent': {
            template: "<ion-nav-view></ion-nav-view>"
          }
        },
        resolve: {
          identity: ["$state", "$ionicHistory", "$q", function($state, $ionicHistory, $q) {
            return $q(function(resolve, reject) {
              $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
              });

              $state.go("welcome");
              return null;
            });
          }]
        }
      })
      .state("signin", {
        cache: false,
        parent: "getIdentity",
        url: "/signin",
        templateUrl: 'templates/signin.html',
        controller: "dimSigninCtrl as vm",
        resolve: {
          getIdentity: function(identity) {
            return identity;
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
              $state.go("welcome");
            });
          }
        }
      });
}
