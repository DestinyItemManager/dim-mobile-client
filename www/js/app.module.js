'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _app = require('./app.run');

var _app2 = _interopRequireDefault(_app);

var _app3 = require('./app.config');

var _app4 = _interopRequireDefault(_app3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/// <reference path="../typings/angularjs/angular.d.ts" />

var app = angular.module('starter', ['ionic', 'ngCordova']).run(_app2.default).config(_app4.default);
exports.default = app;