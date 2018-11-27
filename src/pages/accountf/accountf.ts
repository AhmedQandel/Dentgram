import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AccFavPage } from "../../pages/acc-fav/acc-fav";
import { AccCartPage } from "../../pages/acc-cart/acc-cart";
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'page-accountf',
  templateUrl: 'accountf.html'
})
export class AccountfPage {
  selected_tab: any;

  accFavRoot = AccFavPage;
  accCartRoot = AccCartPage;

  constructor(public navCtrl: NavController, public params: NavParams,
    public translate: TranslateService,
    public platform: Platform) {
    
      this.selected_tab = params.get('select');
  }

}
