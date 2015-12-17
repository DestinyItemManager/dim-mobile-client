'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = appConfig;
function appConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
        url: '/app',
        templateUrl: 'templates/menu.html'
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app');
}