/// <reference path="../../typings/angularjs/angular.d.ts" />

export default class SigninCtrl {
  private _q: ng.IQService;
  private _http: ng.IHttpService;
  private _cookieString: string;
  private _apiKey: string;

  static $inject = ['$q', '$http'];

  constructor($q: ng.IQService, $http: ng.IHttpService) {
    this._q = $q;
    this._http = $http;
    this._apiKey = "57c5ff5864634503a0340ffdfbeb20c0";
  }

  public async signIn(platform: string) {
    let cookie = await this.getCookieFromPlatform(platform);

    if (cookie !== "") {
      window.alert("found user.");
    }

    return await this.showLogin(platform, cookie);
  }

  private readCookie(cname) {
    //tgd.localLog("trying to read cookie passed " + savedCookie);
    var name = cname + "=";
    var ca = (this._cookieString || "").toString().split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    //tgd.localLog("found no match");
    return "";
  }

  private showLogin(platform: string, cookie: string): ng.IPromise<string> {
    let self = this;

    return this._q((resolve, reject) => {
      let browserRef = window.open('https://www.bungie.net/en/User/SignIn/Xuid', '_blank', 'location=yes');

      browserRef.addEventListener('loadstop', function(event) {
        browserRef.close();

        let request: ng.IRequestConfig = {
          method: 'GET',
          url: 'https://www.bungie.net/Platform/User/GetBungieNetUser/',
          headers: {
            'X-API-Key': self._apiKey,
            'x-csrf': cookie
          },
          withCredentials: true
        };

        resolve(self._http(request).then(function(result) {
          window.alert(JSON.stringify(result.data["ErrorCode"]));
        }));
      });
    });
  }

  private getCookieFromPlatform(platform: string): ng.IPromise<string> {
    let self = this;
    return this._q((resolve, reject) => {
      let browserRef = window.open('https://www.bungie.net/help', '_blank', 'location=no,hidden=yes');
      //let browserRef = window.open('https://www.bungie.net/help', '_blank', 'location=yes');
      //let browserRef = window.open('https://www.bungie.net/help', '_self');

      browserRef.addEventListener('loadstop', function (event) {
        try {
          browserRef.executeScript({
            code: 'document.cookie'
          }, function (result) {
            if ((result || "").toString().indexOf("bungled") > -1) {
              alert(result.toString());
              self._cookieString = result.toString();
              alert(self.readCookie.bind(self)("bungled"));
              browserRef.close();
              resolve(self.readCookie.bind(self)("bungled"));
            } else {
              alert("");
              browserRef.close();
              resolve("");
            }
          });
        } catch (e) {
          console.log(e);
          browserRef.close();
          reject(e.toString());
        }
      });
    });
  }
};
