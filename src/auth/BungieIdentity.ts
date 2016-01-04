import IIdentity from "./IIdentity";

class BungieIdentity implements IIdentity {
  private _token: string;
  private _user;
  private _roles: Array<string> = new Array<string>();

  static $inject = [];

  constructor(token: string, user?) {
    this._token = token;
    this._user = user;
    this._roles.push("Guardian");
  }

  public get token() {
    return this._token;
  }

  public get user() {
    return this._user;
  }

  public get roles(): Array<string> {
    return this._roles;
  }
}

export default BungieIdentity;
