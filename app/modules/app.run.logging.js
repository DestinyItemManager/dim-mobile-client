class Logging {
  constructor($log) {
    'ngInject';
    $log.info(`Loaded 'dimApp' module.`);
    $log.logLevels['*'] = $log.LEVEL.TRACE;
    //$log.logLevels['*'] = $log.LEVEL.DEBUG;
    //$log.logLevels['*'] = $log.LEVEL.INFO;
  }
}

export default Logging;
