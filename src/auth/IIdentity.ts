interface IIdentity {
  // authenticate(): ng.IPromise<any>;
  // deauthenticate(): ng.IPromise<any>;
   token: string;
   user;
   roles: Array<string>;
};

export default IIdentity;
