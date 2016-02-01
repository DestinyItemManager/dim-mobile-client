import _ from 'lodash';

class DestinyService {

  constructor($http, $q, $log) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    this.$log = $log.getInstance('bungie.DestinyService');
    this.apiKey = '57c5ff5864634503a0340ffdfbeb20c0';
    this.token = '';
  }

  getInstance(token) {
    this.$log.info('Getting a new instance of DestinyService.', token);

    let service = new DestinyService(this.$http, this.$q, this.$log);

    if (!_.isEmpty(token)) {
      service.token = token;
    }

    return service;
  }

  get token() {
    return this.token;
  }

  set token(token) {
    this.token = token;
  }

  async getBungieNetUser() {
    let request;
    let result;
    let fnName = 'getBungieNetUser ::';

    request = {
      method: 'GET',
      url: 'https://www.bungie.net/Platform/User/GetBungieNetUser/',
      headers: {
        'X-API-Key': this.apiKey,
        'x-csrf': this.token
      },
      withCredentials: true
    };

    this.$log.debug(`${ fnName } Creating http request.`, request);

    try {
      result = await this.$http(request);

      this.$log.debug(`${ fnName } HTTP request was successful.`, result);
    } catch (err) {
      this.$log.debug(`${ fnName } The request failed.`, err, request, result);
      throw err;
    }

    if (result.data.ErrorCode !== 1) {
      let msg = 'The request failed with an ErrorCode.';
      this.$log.debug(`${ fnName } ${ msg }`, request, result);
      throw new Error(msg);
    }

    return result.data.Response;
  }

  getMembershipId(platform, platformUserId) {
    return this.$q.when(platformUserId);
  }

  getAccountDetails(membershipId) {
    return this.$q.when(membershipId);
  }

  getCharacterInventory(membershipId, characterId) {
    return this.$q.when([membershipId, characterId]);
  }

  getAccountVault(platform) {
    return this.$q.when(platform);
  }
}

export default DestinyService;
