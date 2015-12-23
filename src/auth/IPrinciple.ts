import IIdentity from "./IIdentity";

interface IPrinciple {
  hasIdentity: boolean;
  isAuthenticated: boolean;
  identity: ng.IPromise<IIdentity>;
  authenticate(IIdentity): any;
  deauthenticate(): any;
}

export default IPrinciple;
