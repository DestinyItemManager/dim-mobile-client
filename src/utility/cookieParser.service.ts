/// <reference path="../../typings/angularjs/angular.d.ts" />

export default class CookieParser {
  static factory($log: ng.ILogService, $window: ng.IWindowService) {
    return $window["cookieManager"];
  }
};
