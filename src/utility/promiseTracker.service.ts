declare var promiseTracker:any;

/// <reference path="../../typings/angularjs/angular.d.ts" />

export default class PromiseTrackerService {
  static instance: any = undefined;

  static factory($log: ng.ILogService, promiseTracker: any) {
    $log.debug("Getting PromiseTracker from factory.");

    if (!PromiseTrackerService.instance) {
      PromiseTrackerService.instance = promiseTracker();
    }

    return PromiseTrackerService.instance;
  }
};
