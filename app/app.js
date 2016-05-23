import { ViewChild } from '@angular/core';
import { App, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { WelcomePage } from './pages/welcome/welcome';
import { ItemsPage } from './pages/items/items';
import { SettingsPage } from './pages/settings/settings';
import { SignInPage } from './pages/sign-in/sign-in';
import { SignOutPage } from './pages/sign-out/sign-out';
import { AuthProvider } from './providers/auth/auth';


@App({
  templateUrl: 'build/app.html',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/,
  providers: [AuthProvider],
  queries: {
    nav: new ViewChild('content')
  }
})
class MyApp {
  static get parameters() {
    return [[Platform], [MenuController], [AuthProvider]];
  }

  constructor(platform, menu, auth) {
    this.platform = platform;
    this.menu = menu;
    this.auth = auth;
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Welcome', component: WelcomePage },
      { title: 'Items', component: ItemsPage },
      { title: 'Settings', component: SettingsPage }
    ];


    // auth.loggedInSrc.subscribe(
    //   result => {
    //     if (result) {
    //       this.pages.push({ title: 'Sign In', component: SignInPage });
    //     } else {
    //       this.pages.push({ title: 'Sign Out', component: SignOutPage });
    //     }
    //   });

    // this.auth.load();

    this.auth.getBungleToken()
      .then((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      });


    // this.auth.getRemoteLoginStatus().then((response) => {
    //   console.log(response);
    // }, (error) => {
    //   console.log(error);
    // });

    // this.auth.loggedIn()
    //     .then(result => {
    //         if (result) {
    //             this.pages.push({ title: 'Sign In', component: SignInPage });
    //         } else {
    //             this.pages.push({ title: 'Sign Out', component: SignOutPage });
    //         }
    //     });

    // make HelloIonicPage the root (or first) page
    this.rootPage = WelcomePage;
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
    // this.menu.close();
    this.menu.open();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
