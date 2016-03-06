import angular from 'angular';
import bungieNetPlatform from '../bungieNetPlatform/bungieNetPlatform.module.js'

import authHttpInterceptorConfig from './authHttpInterceptor.config.js';
import AuthHttpInterceptor from './authHttpInterceptor.service.js';

let authModule = angular.module('dimApp.auth', [
  bungieNetPlatform.name
])
  .service('dimAuthHttpInterceptor', AuthHttpInterceptor)
  .config(authHttpInterceptorConfig);

export default authModule;
