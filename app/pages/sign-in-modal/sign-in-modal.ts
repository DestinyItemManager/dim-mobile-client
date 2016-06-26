import {Component} from "@angular/core";
import { Modal, NavController, Page, ViewController } from "ionic-angular";
import { AuthServices } from "../../providers/auth/auth-services";
import { AppLandingPage } from "../app-landing/app-landing";
import { BungieIdentity } from "../../providers/auth/bungie-identity";

@Component({
  templateUrl: "build/pages/sign-in-modal/sign-in-modal.html",
})
export class SignInModalPage {
  private platforms: Array<any>;

  constructor(
    private viewCtrl: ViewController,
    private nav: NavController,
    private auth: AuthServices
  ) {
    this.platforms = [
      {
        name: "Playstation Network",
        icon: "logo-playstation",
        value: "psn"
      },
      {
        name: "Xbox Live",
        icon: "logo-xbox",
        value: "xbl"
      }
    ];
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showLoginModalDialog(platform) {
    console.log("clicked");

    let p = this.auth.login(platform)
      .then((token) => {
        if (token) {
          this.auth.principal.authenticate(token);

          this.dismiss();
          this.nav.setRoot(AppLandingPage);
        } else {
          // Show error.
        }
      });
  }
}
