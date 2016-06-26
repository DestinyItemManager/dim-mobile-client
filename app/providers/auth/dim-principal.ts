import { Injectable } from "@angular/core";
import { Platform, Storage, SqlStorage } from "ionic-angular";
import { Http } from "@angular/http";
import { InAppBrowser } from "ionic-native";
import "rxjs/add/operator/map";
import * as _ from "lodash";
import * as cookie from "cookie";
import { DestinyServices } from "../destiny-services/destiny-services";
import { BungieIdentity } from "./bungie-identity";

@Injectable()
export class DimPrincipal {
  private storage: Storage;
  private authenticated: boolean;
  private identity: BungieIdentity;

  constructor(
    private http: Http,
    private platform: Platform
  ) {
    this.authenticated = false;
    this.identity = null;

    platform.ready()
      .then(() => {
        this.storage = new Storage(SqlStorage);
      });
  }

  /*
   * Returns true if the Identity associated with the Principal can access the
   * Destiny API.
   */
  get isAuthenticated() {
    return this.authenticated;
  }

  /*
   * Returns true if the Principal has an Identity.
   */
  get hasIdentity() {
    return !_.isEmpty(this.identity);
  }

  getIdentity(force: Boolean = false): Promise<BungieIdentity> {
    let token = "";

    // Force the resolution of the identy from an available token.
    if (force) {
      this.identity = null;
    }

    // check and see if we have retrieved the identity data from the server.
    // If we have, reuse it by immediately resolving
    if (!_.isEmpty(this.identity)) {
      return new Promise((resolve, reject) => {
        resolve(this.identity);
      });
    }

    return this.getBungletoken()
      .then((token) => {
        if (_.isString(token) && _.size(token) > 0) {
          this.authenticate(token);
        } else {
          this.authenticate(null);
        }

        return this.identity;
      })
      .catch((error) => {
        this.authenticate(null);
        throw error;
      });
  }

  authenticate(token) {
    let hastoken = (_.isString(token) && _.size(token) > 0);

    if (hastoken) {
      this.authenticated = false;
      let testidentity_service = new DestinyServices(this.http);
      testidentity_service.token = token;
      testidentity_service.getBungieNetUser()
        .then((result: any) => {
          if (result.ErrorCode === 1) {
            this.authenticated = true;
            this.identity = new BungieIdentity(token, result.Response);
          }
        });
    } else {
      this.authenticated = false;
      this.identity = null;
    }
  }

  getBungletoken() {
    let self = this;

    return this.platform.ready()
      .then(() => {
        return self.storage.get("bungled-token");
      })
      .then((result) => {
        if (!_.isUndefined(result)) {
          return result;
        } else {
          let token = "";
          return self.getBungletokenFromBungie()
            .then((token) => {
              token = token;
              return this.storage.set("bungled-token", token);
            })
            .then(() => {
              return token;
            })
            .catch((error) => {
              throw error;
            });
        }
      })
      .then((token) => {
        return token;
      })
      .catch((error) => {
        throw error;
      });
  }

  getBungletokenFromBungie() {
    let self = this;

    return this.platform.ready()
      .then(() => {
        return new Promise((resolve, reject) => {
          // Open a hidden browser to Bungie.net to get the user's token from the cookie.
          let ref = InAppBrowser.open("https://www.bungie.net/help", "_blank", "location=no,hidden=yes");

          // When the page has stopped loading...
          ref.addEventListener("loadstop", (event) => {
            // Attempt to get the cookie...
            ref.executeScript({ code: "document.cookie" },
              (result) => {
                // If successful, we should have a cookie in the result.
                try {
                  if (!_.isEmpty(result)) {
                    let bungieCookie = cookie.parse(result[0]);

                    if (_.has(bungieCookie, "bungled")) {
                      resolve(bungieCookie["bungled"]);
                    } else {
                      // Cookie did not contain a bungled token. Unexepected...
                      reject("");
                    }
                  } else {
                    // No result was returned from executeScript. Unexepected...
                    reject("");
                  }
                } catch (e) {
                  // Very unexepected...
                  reject("");
                } finally {
                  if (!_.isUndefined(ref)) {
                    ref.close();
                    ref = undefined;
                  }
                }
              });
          });

          ref.addEventListener("loaderror", (event) => {
            reject("");

            if (!_.isUndefined(ref)) {
              ref.close();
              ref = undefined;
            }
          });
        });
      });
  }
}
