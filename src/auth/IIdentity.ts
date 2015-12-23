interface IIdentity {
  authenticate(): ng.IPromise<any>;
  deauthenticate(): ng.IPromise<any>;
  cookie: ng.IPromise<any>;
};

export default IIdentity;
