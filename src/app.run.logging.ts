Run.$inject = ["$log"];

function Run($log) {
  $log.info("Loaded 'dimApp' module.");
  $log.logLevels['*'] = $log.LEVEL.DEBUG;
  $log.logLevels['*'] = $log.LEVEL.INFO;
}

export default Run;
