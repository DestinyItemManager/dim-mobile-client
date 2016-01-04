Run.$inject = ["$log"];

function Run($log: any) {
  $log.info("Loaded 'dimApp' module.");
  // $log.logLevels['*'] = $log.LEVEL.INFO;
}

export default Run;
