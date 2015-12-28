declare var promiseTracker:any;

/// <reference path="../../typings/angularjs/angular.d.ts" />

export default class PromiseTrackerService {
  static instance: any;

  static factory($log: ng.ILogService, promiseTracker: any) {
    PromiseTrackerService.instance = promiseTracker();
    return PromiseTrackerService.instance;
  }
};
