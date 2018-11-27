import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AccAddressPage } from "../../pages/acc-address/acc-address";
import { AccContactUsPage } from "../../pages/acc-contact-us/acc-contact-us";
import { AccFavPage } from "../../pages/acc-fav/acc-fav";
import { AccInfoPage } from "../../pages/acc-info/acc-info";
import { AccOrdersPage } from "../../pages/acc-orders/acc-orders";
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';

import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  selected_tab: any;

  accFavRoot = AccFavPage;
  accOrdersRoot = AccOrdersPage;
  accInfoRoot = AccInfoPage;
  accAddressRoot = AccAddressPage;
  accContactUsRoot = AccContactUsPage;


  constructor(public navCtrl: NavController, public params: NavParams,
    public translate: TranslateService,
    public mainFunc: MainFunctionsProvider,
    public platform: Platform) {
    
      this.selected_tab = params.get('select');
  }

}
