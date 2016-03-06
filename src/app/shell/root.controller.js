class RootController {
  constructor($log) {
    'ngInject';

    this.$log = $log.getInstance('shell.RootController');
  }

  goHome() {
    return null;
  }
}

export default RootController;
