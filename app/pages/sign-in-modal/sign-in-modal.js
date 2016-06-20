import { Modal, NavController, Page, ViewController } from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/sign-in-modal/sign-in-modal.html',
})
export class SignInModalPage {
  static get parameters() {
    return [[ViewController], [NavController]];
  }

  constructor(viewCtrl, nav) {
    this.viewCtrl = viewCtrl;
    this.nav = nav;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showLoginModalDialog() {

  }
}
