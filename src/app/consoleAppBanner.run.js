import appBannerAsciiArt from './appBannerAsciiArt.html';
import appBannerText from './appBannerText.html';

function consoleAppBanner($log, $window) {
  'ngInject';

  // DIM Console Banner
  if ($window.chrome) {
    $window.console.info(appBannerAsciiArt, 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;', 'color: #E8A534;', 'color: black;');
  } else {
    $log.info(appBannerText);
  }
}

export default consoleAppBanner;
