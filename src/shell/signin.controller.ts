/// <reference path="../../typings/angularjs/angular.d.ts" />

export default class SigninCtrl {
  private _q: ng.IQService;

  static $inject = ['$q'];

  constructor($q: ng.IQService) {
    this._q = $q;
  }

  public signIn(platform: string): void {
    window.alert(platform);
    this.getCookieFromPlatform(platform);

    switch (platform) {
      case 'psn': {
        break;
      }
      case 'xbl': {
        break;
      }
    }
  }

  private getCookieFromPlatform(platform: string): ng.IPromise<string> {
    return this._q((resolve, reject) => {
      let browserRef = window.open('http://bungie.net', '_blank', 'hidden=yes');

      browserRef.addEventListener('loadstop', function (event) {
        try {
          browserRef.executeScript({
            code: 'document.cookie'
          }, function (result) {
            if ((result || "").toString().indexOf("bungled") > -1) {
              alert(result);
              resolve(result);
            }
          });
        } catch (e) {
          console.log(e);
          reject(e.toString());
        }
      });
    });
  }
};
