import { Component } from "@angular/core";
import { Modal, NavController, ViewController } from "ionic-angular";
import { AuthenticationService } from "../shared/authentication.service";
import { AppLandingPage } from "../../app-landing/app-landing.page";
import { BungieIdentity } from "../shared/bungie-identity";

@Component({
  templateUrl: "build/auth/sign-in-modal/sign-in-modal.html",
})
export class SignInModalPage {
  private platforms: Array<any>;

  constructor(
    private viewCtrl: ViewController,
    private nav: NavController,
    private auth: AuthenticationService
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
