import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, Events } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';



@Component({
  selector: 'page-stores',
  templateUrl: 'stores.html',
})
export class StoresPage {
  direc: any;
  direcR: any;
  storelist: any[];
  thumb: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController,
      public translate: TranslateService,
      public platform: Platform,
      public storage: Storage,
      public events: Events, 
      private http: Http) {
      this.storelist = [];

      events.subscribe('application:isLogged', (token) => {
                  
        this.storage.get('thumb').then((val) => {
          this.thumb = val;
        });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoresPage');

    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }


    // Load Stores Data
    let localItemsdata = this.http.get('assets/storelist.json').map(res => res.json().items);
    localItemsdata.subscribe(data => {
      this.storelist = data;

    });

  }

}