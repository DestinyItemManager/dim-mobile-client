import mainModule from './app.module';

angular.element(document).ready(function() {
    angular.bootstrap(document, [mainModule.name]);
});
