System.config({
  baseURL: '/js',
  defaultJSExtensions: true
});
window.cookieLib = null;

System.import('./lib/cookie/index').then(function(result) {
  window.cookieManager = result;
  System.import('./js/bootstrap');
});

if (!!window["chrome"]) {
  console.info(["%c██████╗ ██╗███╗   ███╗\n",
  "██╔══██╗██║████╗ ████║\n",
  "██║  ██║██║██╔████╔██║\n",
  "██║  ██║██║██║╚██╔╝██║\n",
  "██████╔╝██║██║ ╚═╝ ██║\n",
  "╚═════╝ ╚═╝╚═╝     ╚═╝\n",
  "                      \n",
  "Destiny Item Manager v4 Alpha, 2016\n",
  "http://destinyitemmanager.com\n",
  "http://twitter.com/ThisIsDIM\n\n"].join(''), "font-family: monospace");
} else {
  console.info("Destiny Item Manager v4 Alpha, 2016\nhttp://destinyitemmanager.com\nhttp://twitter.com/ThisIsDIM\n\n");
}
