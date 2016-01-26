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
        templateUrl: 'templates/root.html',
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
            var a = $q.when(principal.identity(true))
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

            $rootScope["tracker"].addPromise(a);

            return a;
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
          signout: function ($state, $q, $log, $ionicHistory, dimPrincipal, $rootScope) {
            $log.debug("Signing out.");

            var a = $q((resolve, reject) => {
              let ref = window.open("https://www.bungie.net/en/User/SignOut", "_blank", "location=yes,hidden=yes");

              ref.addEventListener("loadstop", function(event) {

                              console.error("Clearing Cookies.");

                              ref.executeScript(
                                {
                                  code: `function clearListCookies()
                    {
                      var cookies = document.cookie.split(";");
                      for (var i = 0; i < cookies.length; i++) {
                        var spcook = cookies[i].split("=");
                        deleteCookie(spcook[0]);
                      }
                      function deleteCookie(cookiename) {
                        var d = new Date();
                        d.setDate(d.getDate() - 1);
                        var expires = ";expires=" + d;
                        var name = cookiename;
                        //alert(name);
                        var value = "";
                        document.cookie = name + "=" + value + expires + ";";
                      }

                      window.location.reload(true);
                    }

                    clearListCookies();`
                                },
                                (result) => {
                                  console.error(JSON.stringify(result));
                                  ref.close();
                                }
                              );

                              console.error("Done Clearing Cookies.");

              });

              ref.addEventListener("loaderror", function(event) {
                ref.close();
              });

              ref.addEventListener("exit", function(event) {
                resolve();
              });
            })
            .catch(function(a) {
              console.error(JSON.stringify(a));
            })
            .then(function() {
              window["cookies"].clear(function() {
                console.log("Cookies cleared!");
              });
            })
            .then(function() {
              return $q(function(resolve, reject) {
                resolve(dimPrincipal.identity(true));
              });
            })
            .then(function() {
              $ionicHistory.nextViewOptions({
                disableBack: true
              });

              $state.go("welcome");
          });

          $rootScope["tracker"].addPromise(a);

          return a;
        }
      }
    });
}
