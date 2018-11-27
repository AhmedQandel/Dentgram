import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, ModalController, NavParams, Content, ViewController, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { TranslateService } from '@ngx-translate/core';
// import { CurrencyPipe } from '@angular/common';

import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';



@Component({
  selector: 'page-acc-orders',
  templateUrl: 'acc-orders.html',
})
export class AccOrdersPage {
  @ViewChild(Content) content: Content;
  direc: any;
  direcR: any;
  token: any;
  allDataTable: any[];
  orderData: any[];
  isGrid = false;

  orderListTab = true;
  orderDetailsTab = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController,
      public translate: TranslateService,
      public platform: Platform,
      public myModal: ModalController,
      public alertCtrl: AlertController,
      public storage: Storage, 
      private http: Http) {

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

    this.loadData();


    console.log('ionViewDidLoad AccFavPage');
  }
  dismissview(){
    this.navCtrl.parent.viewCtrl.dismiss();
  }

  loadData(){
    if (navigator.onLine){
      this.mainFunc.showLoading('',true);
      this.allDataTable = [];
      let header = this.mainFunc.header;
      let body_application = {};
      this.storage.get('token').then(token_id => {
        this.token = token_id;
        let Url_request = this.mainFunc.url + "/api/orders/all?token=" + this.token;
        this.http.post(Url_request, JSON.stringify(body_application), {headers: header})
          .map(res => res.json())
          .subscribe(data => {
            this.allDataTable = data.data;
          });
      });
      this.mainFunc.dismissLoading();
    }
  }

  showOrderDetails(i){

    this.orderListTab = false;
    this.orderDetailsTab = true;
    this.orderData = [];
    this.orderData = this.allDataTable[i];
    this.content.scrollTo(0, 0);

  }

  goBackToOrdersList(){
    this.orderListTab = true;
    this.orderDetailsTab = false;
    this.orderData = [];
  }
}