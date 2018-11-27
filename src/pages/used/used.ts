import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { UsedAddPage } from "../../pages/used-add/used-add";
import { UsedAdsPage } from "../../pages/used-ads/used-ads";
import { UsedAdsListPage } from "../../pages/used-ads-list/used-ads-list";
import { UsedFavPage } from "../../pages/used-fav/used-fav";
import { UsedMyadsPage } from "../../pages/used-myads/used-myads";
import { UsedMsgPage } from "../../pages/used-msg/used-msg";
import { UsedMsgesListPage } from "../../pages/used-msges-list/used-msges-list";
import { TranslateService } from '@ngx-translate/core';

import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the UsedPage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */

@Component({
  selector: 'page-used',
  templateUrl: 'used.html'
})
export class UsedPage {
  selected_tab: any;
  ifIsLogged: boolean = false;

  usedAdsRoot = UsedAdsListPage
  usedAddRoot = UsedAddPage
  usedMyadsRoot = UsedMyadsPage
  usedFavRoot = UsedFavPage
  usedMsgRoot = UsedMsgPage
  usedMsgesListRoot = UsedMsgesListPage

  constructor(public navCtrl: NavController,
    public params: NavParams,
    public translate: TranslateService,
    public mainFunc: MainFunctionsProvider,
    public storage: Storage,
    public platform: Platform) {
    
      this.selected_tab = '0';

      this.isLogged();
  }

  isLogged()
  {
    this.storage.get('token').then(data => {
      if (data !== null) {
        this.ifIsLogged = true;
        return true;
      }else{
        this.ifIsLogged = false;
        return false;
      }
    });
  }

}