export default function appConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      templateUrl: 'templates/menu.html'
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app');
}
