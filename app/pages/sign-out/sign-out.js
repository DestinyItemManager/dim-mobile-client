import { Page, NavController } from 'ionic-angular';

@Page({
    templateUrl: 'build/pages/sign-out/sign-out.html',
})
export class SignOutPage {
    static get parameters() {
        return [[NavController]];
    }

    constructor(nav) {
        this.nav = nav;
    }
}
