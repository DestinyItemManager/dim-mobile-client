/// <reference path="../../typings/angularjs/angular.d.ts" />

export default class CookieParser {
  static factory($log, $window) {
    return $window.cookieManager;
  }
};

CookieParser.factory.$inject = ["$log", "$window"];
