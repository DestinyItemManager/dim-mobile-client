import IIdentity from "./IIdentity";

class BungieIdentity implements IIdentity {
  private _token: string;
  private _user: Object;

  static $inject = [];

  constructor(token: string, user: Object) {
    this._token = token;
    this._user = user;
  }
}

export default BungieIdentity;
