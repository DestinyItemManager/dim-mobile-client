import angular from 'angular';

import ConfigService from './configService.service.js';

let configModule = angular.module('dimApp.config', [])
  .service('dimConfigService', ConfigService);

export default configModule;
