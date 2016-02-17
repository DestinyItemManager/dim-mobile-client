import appBanner from './app-banner.html';
import appBannerLofi from './app-banner-lofi.html';

function consoleAppBanner($log, $window) {
  'ngInject';

  // DIM Console Banner
  if ($window.chrome) {
    $log.info('%c' + appBanner, 'font-family: monospace');
  } else {
    $log.info(appBannerLofi);
  }
}

export default consoleAppBanner;
