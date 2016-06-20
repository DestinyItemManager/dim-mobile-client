import { Page, Modal, NavController } from 'ionic-angular';
import { AuthServices } from '../../providers/auth/auth-services';
import { SignInModalPage } from '../sign-in-modal/sign-in-modal';

@Page({
  templateUrl: 'build/pages/app-landing/app-landing.html',
})
export class AppLandingPage {
  static get parameters() {
    return [[NavController], [AuthServices]];
  }

  constructor(nav, auth) {
    this.nav = nav;
    this.auth = auth;
  }

  showLogin(platform) {
    let modal = Modal.create(SignInModalPage);
    this.nav.present(modal);
  }
}
