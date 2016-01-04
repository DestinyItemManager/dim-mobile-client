import IIdentity from "./IIdentity";

interface IPrincipal {
  hasIdentity: boolean;
  isAuthenticated: boolean;
  isInRole(role: string): boolean;
  isInAnyRole(roles: Array<string>): boolean;
  identity(force?: boolean): Promise<IIdentity>;
  authenticate(IIdentity): any;
  deauthenticate(): any;
}

export default IPrincipal;
