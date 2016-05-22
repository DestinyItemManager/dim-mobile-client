import { Page, NavController } from 'ionic-angular';

@Page({
    templateUrl: 'build/pages/sign-in/sign-in.html',
})
export class SignInPage {
    static get parameters() {
        return [[NavController]];
    }

    constructor(nav) {
        this.nav = nav;
    }
}
