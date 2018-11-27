import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, Events } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the BrandsStoresPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-brands-stores',
  templateUrl: 'brands-stores.html',
})
export class BrandsStoresPage {

  id: number;
  name: string;
  icon: string;
  origin: string;
  storelist: any[];
  thumb: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController,
      public translate: TranslateService,
      public platform: Platform,
      public events: Events,
      public storage: Storage, 
      private http: Http) {

    this.id = navParams.get('id');
    this.name = navParams.get('name');
    this.storelist = [];

    events.subscribe('application:isLogged', (token) => {
      
      this.storage.get('thumb').then((val) => {
        this.thumb = val;
      });
      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrandsStoresPage');

     // Load Brands From The Server
     let url = this.mainFunc.url + '/api/structure/brands/agents/' + this.id
     let recivedData = this.http.get(url).map(res => res.json());
     recivedData.subscribe(data => {
      this.icon = data.icon;
      this.origin = data.origin;
      this.storelist = data.stores;
     });
  }

}
