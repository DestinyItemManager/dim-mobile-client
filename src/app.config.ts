export default function appConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      controller: 'dimAppCtrl as app'
    })
    .state('app.items', {
      url: '/items',
      templateUrl: 'templates/items.html'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/items');
}
