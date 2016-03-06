class CharactersController {
  constructor($log, dimDestinyService) {
    'ngInject';

    this.$log = $log.getInstance('shell.CharactersController');

    dimDestinyService.getBungieNetUser();
  }

  goHome() {
    return null;
  }
}

export default CharactersController;
