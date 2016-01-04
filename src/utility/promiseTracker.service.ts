declare var promiseTracker:any;

/// <reference path="../../typings/angularjs/angular.d.ts" />

export default class PromiseTrackerService {
  static instance = undefined;

  static factory($log, promiseTracker) {
    $log.getInstance("PromiseTrackerService").trace("factory :: Getting PromiseTracker from factory.");

    if (!PromiseTrackerService.instance) {
      PromiseTrackerService.instance = promiseTracker();
    }

    return PromiseTrackerService.instance;
  }
};

PromiseTrackerService.factory.$inject = ["$log", "promiseTracker"];
