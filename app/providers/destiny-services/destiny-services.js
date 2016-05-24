import { Injectable } from '@angular/core';
import { Headers, Http, RequestMethod, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { DimPrincipal } from '../auth/dim-principal';

@Injectable()
export class DestinyServices {
  static get parameters() {
    return [[Http], [DimPrincipal]]
  }

  constructor(http, principal) {
    this._http = http;
    this._principal = principal;
    // TODO: If the principal is passed, create a relationship with an observable.
    this._apiKey = '57c5ff5864634503a0340ffdfbeb20c0';
    this._token = '';
    this.data= null;
  }

  get token() {
    if (_.isUndefined(this._principal)) {
      return this._token;
    } else {
      return this._principal.identity.token;
    }
  }

  set token(token) {
    this._token = token;
  }

  getBungieNetUser() {
    return new Promise(resolve => {
      // request = {
      //   method: 'GET',
      //   url: 'https://www.bungie.net/Platform/User/GetBungieNetUser/',
      //   headers: {
      //     'X-API-Key': this.apiKey,
      //     'x-csrf': this.token
      //   },
      //   withCredentials: true
      // };
      let options = new RequestOptions();

      options.headers = new Headers();
      options.headers.append('X-API-Key', this._apiKey);
      options.headers.append('x-csrf', this.token);

      this._http.get('https://www.bungie.net/Platform/User/GetBungieNetUser/', options)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          resolve(this.data);
        });
    });
  }
}
