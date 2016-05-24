import { Injectable } from '@angular/core';

@Injectable()
export class BungieIdentity {
  constructor(token = null, data = null) {
    this._token = token;
    this._data = data;
  }

  get token() {
    return this._token;
  }

  get data() {
    return this._data;
  }
}

export default BungieIdentity;
