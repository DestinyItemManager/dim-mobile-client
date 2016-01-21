/// <reference path="../../typings/angularjs/angular.d.ts" />

interface ISyncService {
  authorize(): ng.IPromise<any>;
  load(force?: boolean): ng.IPromise<any>;
  save(): ng.IPromise<any>;
  remove();
  disconnected(): boolean;
}

export default ISyncService;
