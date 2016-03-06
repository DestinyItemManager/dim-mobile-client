import rootTemplate from './root.html';
import menuTemplate from './menu.html';
import charactersTemplate from './characters.html';

function routes($stateProvider, $urlRouterProvider) {
  'ngInject';

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/characters');

  $stateProvider.state('root', {
    abstract: true,
    controller: 'dimRootCtrl as root',
    data: {
      roles: ['authenticated']
    },
    template: rootTemplate,
    url: '/'
  })
  .state('menu', {
    abstract: true,
    controller: 'dimMenuCtrl as menu',
    parent: 'root',
    template: menuTemplate
  })
  .state('itemDashboard', {
    controller: 'dimCharactersCtrl as characters',
    parent: 'menu',
    template: charactersTemplate,
    url: 'characters'
  });
}

export default routes;
