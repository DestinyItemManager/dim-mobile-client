'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bungie = require('./bungie/bungie.module');

var _bungie2 = _interopRequireDefault(_bungie);

var _app = require('./app.run');

var _app2 = _interopRequireDefault(_app);

var _app3 = require('./app.config');

var _app4 = _interopRequireDefault(_app3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = angular.module('starter', ['ionic', 'ngCordova', _bungie2.default]).run(_app2.default).config(_app4.default); /// <reference path="../typings/angularjs/angular.d.ts" />

exports.default = app;