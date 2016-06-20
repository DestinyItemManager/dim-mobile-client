import { ViewChild, EventEmitter } from '@angular/core';
import { App, Platform, MenuController, Modal, NavController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { AppLandingPage } from './pages/app-landing/app-landing';
import { WelcomePage } from './pages/welcome/welcome';
import { ItemsPage } from './pages/items/items';
import { SettingsPage } from './pages/settings/settings';
import { SignInPage } from './pages/sign-in/sign-in';
import { SignOutPage } from './pages/sign-out/sign-out';
import { AuthServices } from './providers/auth/auth-services';
import { DimPrincipal } from './providers/auth/dim-principal';
import { DestinyServices } from './providers/destiny-services/destiny-services';
import { SignInModalPage } from './pages/sign-in-modal/sign-in-modal';

@App({
  templateUrl: 'build/app.html',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/,
  providers: [AuthServices, DimPrincipal, DestinyServices],
  queries: {
    nav: new ViewChild('content')
  }
})
class MyApp {
  static get parameters() {
    return [[Platform], [MenuController], [AuthServices]];
  }

  constructor(platform, menu, auth) {
    this.platform = platform;
    this.menu = menu;
    this.auth = auth;
    this.initializeApp();

    // Wireup Login Modal w/ event from AuthService
    this.loginEventSubscription = this.auth.loginEvent.subscribe((data) => {
      this.showLogin();
    });

    // Check to see if the user has previously logged into Bungie.net
    this.auth.principal.identity()
      .then((response) => {
        if (this.auth.principal.isAuthenticated) {
          this.rootPage = ItemsPage;
        } else {
          this.auth.showLoginDialog();
        }
      }, (error) => {
        console.log(error);
      });

    // set our app's pages
    this.pages = [
      { title: 'Welcome', component: WelcomePage },
      { title: 'Items', component: ItemsPage },
      { title: 'Settings', component: SettingsPage }
    ];
  }

  initializeApp() {
    this.platform.ready()
      .then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        StatusBar.styleDefault();
      });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // this.menu.open();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  ngOnDestroy() {
    this.loginEventSubscription.dispose();
  }

  showLogin() {
    this.rootPage = AppLandingPage;
  }
}
