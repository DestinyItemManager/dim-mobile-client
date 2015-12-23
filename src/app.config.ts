/// <reference path="../typings/angular-ui-router/angular-ui-router.d.ts" />

export default function appConfig($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise("/items");

  $stateProvider
    .state("root", {
      abstract: true,
      url: "",
      template: "<ion-nav-view></ion-nav-view>",
      // controller: "dimAppCtrl as app",
      resolve: {
        authorize: ["dimAuthorizationService",
          function(authorization) {
            return authorization.authorize();
          }
        ]
      }
    })
    .state("items", {
      parent: "root",
      url: "/items",
      data: {
        roles: ['Guardian']
      },
      templateUrl: "templates/items.html"
    })
    .state("signin", {
      parent: "root",
      url: "/signin",
      data: {
        roles: []
      },
      template: `<ion-view view-title="Sign In">
        <ion-content>
          <h1>Sign In</h1>
        </ion-content>
      </ion-view>`
    });
}
