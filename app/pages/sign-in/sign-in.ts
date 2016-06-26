import { Page, Modal, NavController } from "ionic-angular";
import { AuthServices } from "../../providers/auth/auth-services";
import { SignInModalPage } from "../sign-in-modal/sign-in-modal";

@Page({
  templateUrl: "build/pages/sign-in/sign-in.html",
})
export class SignInPage {
  constructor(
    private nav: NavController,
    private auth: AuthServices
  ) {

  }

  showLogin(platform) {
    let modal = Modal.create(SignInModalPage);
    this.nav.present(modal);
  }
}
