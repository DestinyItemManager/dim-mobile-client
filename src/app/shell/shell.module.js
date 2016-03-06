import angular from 'angular';
import uiRouter from 'angular-ui-router';

import bungieNetPlatform from '../bungieNetPlatform/bungieNetPlatform.module.js';
import auth from '../auth/auth.module.js';

import MenuController from './menu.controller.js';
import RootController from './root.controller.js';
import CharactersController from './characters.controller.js';
import CharacterController from './character.controller.js';
import routingConfig from './routing.config.js';

let shellModule = angular.module('dimApp.shell', [
  uiRouter,
  auth.name,
  bungieNetPlatform.name
])
  .controller('dimRootCtrl', RootController)
  .controller('dimMenuCtrl', MenuController)
  .controller('dimCharactersCtrl', CharactersController)
  .controller('dimCharacterCtrl', CharacterController)
  .config(routingConfig);

export default shellModule;
