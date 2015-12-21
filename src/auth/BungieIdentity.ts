import IIdentity from "./IIdentity";

class BungieIdentity implements IIdentity {
  private _q: any; // WeakMap<IPrinciple, ng.IQService>

  constructor($q: ng.IQService) {
    this._q.set(this, $q);

  }

  login(): ng.IPromise<any> {
    return this._q.get(this).when(null);
  }

  logout(): ng.IPromise<any> {
    return this._q.get(this).when(null);
  }
}

export default BungieIdentity;
