import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the FaqPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {
  direc: any;
  direcR: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public translate: TranslateService,
    public platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrandsPage');

    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }
  }

}
