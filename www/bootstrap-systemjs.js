System.config({
  baseURL: '/js',
  defaultJSExtensions: true
});
window.cookieLib = null;

System.import('./lib/cookie/index').then(function(result) {
  window.cookieManager = result;
  System.import('./js/bootstrap');
});
