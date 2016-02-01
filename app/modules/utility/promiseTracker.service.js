class PromiseTrackerService {
  static factory($log, promiseTracker) {
    'ngInject';

    $log.getInstance('PromiseTrackerService').trace('factory :: Getting PromiseTracker from factory.');

    return promiseTracker();
  }
}

export default PromiseTrackerService;
