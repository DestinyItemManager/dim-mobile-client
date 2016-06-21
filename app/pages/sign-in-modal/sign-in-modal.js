import { Modal, NavController, Page, ViewController } from 'ionic-angular';
import { AuthServices } from '../../providers/auth/auth-services';

@Page({
  templateUrl: 'build/pages/sign-in-modal/sign-in-modal.html',
})
export class SignInModalPage {
  static get parameters() {
    return [[ViewController], [NavController], [AuthServices]];
  }

  constructor(viewCtrl, nav, auth) {
    this.viewCtrl = viewCtrl;
    this.nav = nav;
    this.auth = auth;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showLoginModalDialog(platform) {
    console.log('clicked');
    
    let p = this.auth.showLogin(platform)
      .then((token) => {
        console.log(token);
        this.dismiss();
      });
  }
}
