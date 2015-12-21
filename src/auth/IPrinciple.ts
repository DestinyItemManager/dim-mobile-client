import IIdentity from "./IIdentity";

interface IPrinciple {
  isAuthenticated(): boolean;
  getIdentity(): IIdentity;
}

export default IPrinciple;
