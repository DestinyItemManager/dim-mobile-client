/// <reference path="../../typings/angularjs/angular.d.ts" />

import bungieModule from '../bungie/bungie.module'
import DimPrinciple from './dimPrinciple'
import BungieIdentity from './bungieIdentity';

let moduleName = 'dimAuth';

angular.module(moduleName, [
    bungieModule
  ])
  .service('dimPrinciple', DimPrinciple)
  .service('dimIdentity', BungieIdentity);

export default moduleName;
