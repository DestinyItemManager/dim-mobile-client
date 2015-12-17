'use strict';

var _app = require('./app.module');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.element(document).ready(function () {
    angular.bootstrap(document, [_app2.default.name]);
});