class ItemsCtrl {
  constructor($log, dimPrincipal, $scope, $state) {
    // Private class variables
    this.$log = $log['getInstance']('shell.SigninCtrl');
    this.principal = dimPrincipal;
    this.$scope = $scope;
    this.$state = $state;

    let self = this;

    self.principal.identity()
      .then((identity) => {
        self.displayName = identity.user.user.displayName;
        self.psnId = identity.user.psnId;
        self.gamertag = identity.user.gamerTag;
        self.clanName = identity.user.clans[0].detail.name;
        self.clanMotto = identity.user.clans[0].detail.motto;
        let today = new Date();
        self.now = today.toLocaleString();
        self.nowScope = today.toLocaleString();
      });

    this.$scope.$on('$stateChangeSuccess', () => {
      let today = new Date();
      self.now = today.toLocaleString();
    });
  }
}

export default ItemsCtrl;
