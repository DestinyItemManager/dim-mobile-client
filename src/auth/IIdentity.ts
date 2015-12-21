interface IIdentity {
  login(): ng.IPromise<any>;
  logout(): ng.IPromise<any>;
};

export default IIdentity;
