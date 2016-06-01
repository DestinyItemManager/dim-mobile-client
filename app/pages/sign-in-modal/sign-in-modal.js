import { Modal, NavController, Page, ViewController } from 'ionic-angular';

/*
  Generated class for the SignInModalPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/sign-in-modal/sign-in-modal.html',
})
export class SignInModalPage {
  static get parameters() {
    return [[ViewController]];
  }

  constructor(viewCtrl) {
    this.viewCtrl = viewCtrl;
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
