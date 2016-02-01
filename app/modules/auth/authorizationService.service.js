import _ from 'lodash';

class AuthorizationService {
  constructor($log, principal) {
    'ngInject';

    this.$log = $log.getInstance('auth.AuthorizationService');
    this.principal = principal;
  }

  /**
   * Used to verify a visitor can view a resource.  Creates an identity object
   * based on available credentials (cookies) if an identity is not present.
   * Verifies the identity can access Destiny API resources.
   */
  async authorize() {
    let self = this;
    let result = false;
    let fnName = 'authorize ::';

    self.$log.trace(`${ fnName } Start`);

    try {
      let identity = await this.principal.identity();
      result = !_.isEmpty(identity);
    } catch (e) {
      self.$log.error(`{ fnName } There was an error while getting an identity.`, e);
      result = false;
    }

    return result;
  }
}

export default AuthorizationService;
