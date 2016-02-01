class SigninPreloadCtrl {
  constructor($q) {
    'ngInject';

    this.$q = $q;
  }

  preload() {
    return this.$q.when(null);
  }
}

export default SigninPreloadCtrl;
