class ConfigService {
  constructor($q, $log) {
    'ngInject';

    this.$q = $q;
    this.$log = $log.getInstance('dimApp.config.ConfigService');
  }
}

export default ConfigService;
