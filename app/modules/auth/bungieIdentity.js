class BungieIdentity {
  constructor(token, user) {
    this.token = token;
    this.user = user;
    this.roles.push('Guardian');
  }

  get token() {
    return this._token;
  }

  get user() {
    return this._user;
  }

  get roles() {
    return this._roles;
  }
}

export default BungieIdentity;
