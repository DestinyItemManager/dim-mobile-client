import IIdentity from "./IIdentity";

interface IPrinciple {
  hasIdentity: boolean;
  isAuthenticated: boolean;
  isInRole(role: string): boolean;
  isInAnyRole(roles: Array<string>): boolean;
  identity(force?: boolean): Promise<IIdentity>;
  authenticate(IIdentity): any;
  deauthenticate(): any;
}

export default IPrinciple;
