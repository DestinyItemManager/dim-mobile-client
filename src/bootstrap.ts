import mainModule from "./app.module";

angular.element(document).ready(function() {
	if (window.cordova) {
		document.addEventListener('deviceready', function() {
			angular.bootstrap(document.body, [mainModule.name]);
		}, false);
	} else {
		angular.bootstrap(document.body, [mainModule.name]);
	}
});
