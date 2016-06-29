import { Page, Modal, NavController } from "ionic-angular";
import { AuthenticationService } from "../../auth/shared/authentication.service";
import { SignInModalPage } from "../sign-in-modal/sign-in-modal.page";

@Page({
  templateUrl: "build/auth/sign-in/sign-in.html",
})
export class SignInPage {
  constructor(
    private nav: NavController,
    private auth: AuthenticationService
  ) {

  }

  showLogin(platform) {
    let modal = Modal.create(SignInModalPage);
    this.nav.present(modal);
  }
}
