declare var promiseTracker:any;

/// <reference path="../../typings/angularjs/angular.d.ts" />

export default class PromiseTrackerService {
  static instance = undefined;

  static factory($log: ng.ILogService, promiseTracker) {
    $log.debug("Getting PromiseTracker from factory.");

    if (!PromiseTrackerService.instance) {
      PromiseTrackerService.instance = promiseTracker();
    }

    return PromiseTrackerService.instance;
  }
};
