import { Injectable } from "@angular/core";
import { Headers, Http, RequestMethod, RequestOptions } from "@angular/http";
import * as _ from "lodash";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";

@Injectable()
export class DestinyService {
  private apiKey: string;
  public data: any;

  constructor(
    private http: Http,
    public token: string = ""
  ) {
    this.apiKey = "57c5ff5864634503a0340ffdfbeb20c0";
    this.data = null;
  }

  private getToken(): Promise<string> {
    if (_.size(this.token) > 0) {
      return new Promise((resolve) => {
        resolve(this.token);
      });
    } else {
      return new Promise((resolve, reject) => {
        reject("There is no token available.");
      });
    }
  }

  getBungieNetUser() {
    let self = this;

    return this.getToken()
      .then((token) => {
        let headers = new Headers({
          "X-API-Key": this.apiKey,
          "x-csrf": token
        });
        let options = new RequestOptions({ headers: headers });

        return this.http.get("https://www.bungie.net/Platform/User/GetBungieNetUser/", options)
          .map((response) => {
            return response.json();
          })
          .toPromise();
      });
  }
}
