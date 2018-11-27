import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';

import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html',
})
export class CoursesPage {
  direc: any;
  direcR: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController,
      public translate: TranslateService,
      public platform: Platform) {
      this.viewCtrl.setBackButtonText('');
  }

  ionViewDidLoad() {
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }

    console.log('ionViewDidLoad AccFavPage');
  }
  dismissview(){
    this.navCtrl.parent.viewCtrl.dismiss();
  }

}
