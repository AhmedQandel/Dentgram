import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the AuthSignoutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-auth-signout',
  templateUrl: 'auth-signout.html',
  
})
export class AuthSignoutPage {
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public translate: TranslateService,
    public platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthSignoutPage');
  }

}
