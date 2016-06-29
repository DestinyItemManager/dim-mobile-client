import { Injectable, EventEmitter } from "@angular/core";
import { InAppBrowser, InAppBrowserRef } from "ionic-native";
import * as _ from "lodash";
import * as cookie from "cookie";
import { DimPrincipal } from "./dim-principal";
import { BungieIdentity } from "./bungie-identity";

@Injectable()
export class AuthenticationService {
  private inAppBrowserRef: InAppBrowserRef = undefined;
  public loginEvent: EventEmitter<Boolean>;

  constructor(
    public principal: DimPrincipal
  ) {
    this.loginEvent = new EventEmitter<Boolean>();
  }

  private getSigninPlatform(platform) {
    switch (platform.toLowerCase()) {
      case "psn":
        return "Psnid";
      case "xbl":
        return "Xuid";
      default:
        throw new Error(`Invalid platform ID: ${platform}`);
    }
  }

  inAppBrowserCallback(resolve, reject, result) {
    console.log("inAppBrowserCallback");
    let script = {
      code: "document.cookie"
    };

    if (!_.isUndefined(this.inAppBrowserRef)) {
      this.inAppBrowserRef.executeScript(script, this.inAppBrowserExecuteScriptCallback.bind(this, resolve, reject, result.type));
    } else {
      reject("InAppBrowser is missing.");
    }
  }

  private inAppBrowserExecuteScriptCallback(resolve, reject, type, result) {
    console.log("_inAppBrowserExecuteScriptCallback");
    let token = "";

    if (!_.isEmpty(result)) {
      let bungieCookie = cookie.parse(result[0]);

      if (_.has(bungieCookie, "bungled")) {
        token = bungieCookie["bungled"];
        // this.principal.authenticate(new BungieIdentity(token));
      }
    }

    if (_.size(token) > 0) {
      resolve(token);
    } else {
      if (type === "loadstop") {
        this.inAppBrowserRef.show();
      }
    }
  }

  private getTokenFromBungieNetSignin(platform) {
    console.log("getTokenFromBungieNetSignin");

    let url = `https://www.bungie.net/en/User/SignIn/${this.getSigninPlatform(platform)}`;
    let target = "_blank";
    let options = "location=yes,hidden=yes,clearcache=yes,clearsessioncache=yes";

    let signinPromise;

    if (_.isUndefined(this.inAppBrowserRef)) {
      this.inAppBrowserRef = InAppBrowser.open(url, target, options);

      signinPromise = new Promise((resolve, reject) => {
        this.inAppBrowserRef.addEventListener("loadstart", this.inAppBrowserCallback.bind(this, resolve.bind(this), reject.bind(this)));
        this.inAppBrowserRef.addEventListener("loadstop", this.inAppBrowserCallback.bind(this, resolve.bind(this), reject.bind(this)));
      });
    } else {
      signinPromise = new Promise((resolve, reject) => {
        reject("InAppBrowser is in use.");
      });
    }

    return signinPromise
      .then((token) => {
        if (!_.isUndefined(this.inAppBrowserRef)) {
          this.inAppBrowserRef.close();
          this.inAppBrowserRef = undefined;
        }

        return token;
      })
      .catch(() => {
        if (!_.isUndefined(this.inAppBrowserRef)) {
          this.inAppBrowserRef.close();
          this.inAppBrowserRef = undefined;
        }
      });
  }

  showLoginDialog() {
    this.loginEvent.next(true);
  }

  login(platform) {
    return this.getTokenFromBungieNetSignin(platform);
  }
}
