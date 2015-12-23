import IIdentity from "./IIdentity";

class BungieIdentity implements IIdentity {
  private _q: ng.IQService;
  private _cookie: string;

  static $inject = ['$q'];

  constructor($q: ng.IQService, cookie: string) {
    this._q = $q;
    this._cookie = cookie;
  }

  public authenticate(): ng.IPromise<any> {
    return this._q.when(null);
  }

  public deauthenticate(): ng.IPromise<any> {
    return this._q.when(null);
  }

  public get cookie(): ng.IPromise<any> {
    if (angular.isDefined(this._cookie)) {
      return this._q.when(this._cookie);
    } else {
      return this._q.when(null);
    }
  }
}

export default BungieIdentity;
