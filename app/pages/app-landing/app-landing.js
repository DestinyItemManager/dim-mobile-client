import {Page, NavController} from 'ionic-angular';

/*
  Generated class for the AppLandingPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/app-landing/app-landing.html',
})
export class AppLandingPage {
  static get parameters() {
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
  }
}
