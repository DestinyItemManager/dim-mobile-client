import _ from 'lodash';

class DestinyService {
  constructor($q, $http, $log) {
    'ngInject';

    this.$q = $q;
    this.$http = $http;
    this.$log = $log.getInstance('dimApp.bungieNetPlatform.DestinyService');
    this.apiKey = '57c5ff5864634503a0340ffdfbeb20c0';
    this.token = '';
  }

  getInstance(token) {
    this.$log.info('Getting a new instance of DestinyService.', token);

    let service = new DestinyService(this.$q, this.$http, this.$log);

    if (!_.isEmpty(token)) {
      service.token = token;
    }

    return service;
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
}

export default DestinyService;
