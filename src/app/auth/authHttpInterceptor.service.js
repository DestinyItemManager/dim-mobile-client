import _ from 'lodash';
import HttpInterceptor from './httpInterceptor.js';

class AuthHttpInterceptor extends HttpInterceptor {
  constructor($q, $log) {
    'ngInject';

    super();
    this.$q = $q;
    //this.$log = $log.getInstance('dimApp.auth.AuthHttpInterceptor');
    this.$log = $log;
  }

  response(result) {
    if (_.has(result, 'data.ErrorCode') && (result.data.ErrorCode !== 1)) {
      switch (result.data.ErrorCode) {
        case 99:
          this.$log.debug('Log into Bungie.net.');
          // Kill session and redirect to login.
          break;
        case 36:
          this.$log.debug('Throttled.');
          // Trottled.
          break;
        case 5:
          this.$log.debug('Maintenance window.');
          // Maintenance window.
          break;
      }
    }

    return result;
  }
}

export default AuthHttpInterceptor;
