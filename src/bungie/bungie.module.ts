import destinyService from './destinyService';

let moduleName = 'dimBungie';

angular.module(moduleName, [])
  .factory('dimDestinyService', destinyService);

export default moduleName;
