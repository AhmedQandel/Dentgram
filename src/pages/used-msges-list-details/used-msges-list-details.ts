import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, ViewController, ToastController, NavParams, Slides, Platform, Events } from 'ionic-angular';


import { TranslateService } from '@ngx-translate/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';
import { Storage } from '@ionic/storage';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';


@Component({
  selector: 'page-used-msges-list-details',
  templateUrl: 'used-msges-list-details.html',
})
export class UsedMsgesListDetailsPage {

  direc: any;
  direcR: any;
  message: string;
  title: string;
  description: string;
  msg_id: any;
  message2;
  constructor(public navCtrl: NavController, 
    private http: Http,
      public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController, 
        private changeDetector: ChangeDetectorRef,
          public platform: Platform,
            public translate: TranslateService,
              public events: Events,
              public storage: Storage,
              private toastCtrl: ToastController,
                public navParams: NavParams) {

                  this.viewCtrl.setBackButtonText('');
  }


  doToast(msg)
  {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsedMsgesListDetailsPage');
  
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }

    this.message = this.navParams.get('body');

    this.msg_id = this.navParams.get('msg_id');
    this.readMessage(this.msg_id);
  }

  readMessage(msg_id)
  {
    this.storage.get('token').then( token => {
      let url = this.mainFunc.url + '/api/ads/read-message/'+msg_id+'?token='+token;
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      let options = new RequestOptions({headers: headers});

      this.http.post(url,'',options).map(
        res => res.json())
        .subscribe(data => { 
          if(data.success == true){
            // this.doToast('Message marked as read');
          }
        });
    });
  }


  sendMessage()
  {
    this.storage.get('token').then( token => {
      let url = this.mainFunc.url + '/api/ads/reply?message_id='+this.msg_id+'&body='+this.message2;
      let headers = new Headers();
      headers.append('Authorization', 'Bearer ' + token);
      headers.append('Content-Type','application/json');
      let options = new RequestOptions({headers: headers});
 
      this.http.post(url,'',options).map(
        res => res.json())
        .subscribe(data => { 
          if(data.success == true){
            this.doToast('Message sent successfully');
            this.message2='';
          }
        });
    });
  }

  dismissview(){
    this.viewCtrl.dismiss();
  }

}
