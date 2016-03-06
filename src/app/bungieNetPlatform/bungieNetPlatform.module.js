import angular from 'angular';

import DestinyService from './DestinyService.service.js';

let bungieNetPlatformModule = angular.module('dimApp.bungieNetPlatform', [])
  .service('dimDestinyService', DestinyService);

export default bungieNetPlatformModule;
