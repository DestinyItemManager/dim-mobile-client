/// <reference path="../../typings/angularjs/angular.d.ts" />

import bungieModule from '../bungie/bungie.module'
import Principle from './Principle'

let moduleName = 'dimAuth';

angular.module(moduleName, [
    bungieModule
  ])
  .factory('dimPrinciple', Principle);

export default moduleName;
