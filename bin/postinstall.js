var fs = require('fs-extra');
	
fs.copy('./node_modules/babel-polyfill/dist/polyfill.min.js', './www/lib/babel-polyfill/dist/polyfill.min.js', function (err) {
  if (err) return console.error(err)
  
  console.log("Copied babel-polyfill to /www/lib.");
});