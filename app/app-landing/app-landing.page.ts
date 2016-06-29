import { Page, NavController } from "ionic-angular";

@Page({
  templateUrl: "build/app-landing/app-landing.html",
})
export class AppLandingPage {
  constructor(
    private nav: NavController
  ) { }

  logout() { }

  login() { }
}
