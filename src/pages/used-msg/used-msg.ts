import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';

import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-used-msg',
  templateUrl: 'used-msg.html',
})
export class UsedMsgPage {
  direc: any;
  direcR: any;
  adMessage: FormGroup;
  message: string;
  used_item_id: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController,
      public translate: TranslateService,
      public platform: Platform,
      private http: Http,
      private alertCtrl: AlertController,
      public loadingCtrl: LoadingController,
      public storage: Storage,
      public formBuilder: FormBuilder) {

      this.viewCtrl.setBackButtonText('');
      this.adMessage = formBuilder.group({
        message: ['', Validators.required]
      });

      this.used_item_id = this.navParams.get('id');
  }

  ionViewDidLoad() {
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }
    this.viewCtrl.setBackButtonText('');

    console.log('ionViewDidLoad UsedMsgPage');
  }
  dismissview(){
    this.viewCtrl.dismiss();
  }


  showAlertMsg(msg){
    let alert = this.alertCtrl.create({
      message: msg,
      buttons: ['Ok']
    });
    alert.present();
  }

  sendMessage(){
    let loading = this.loadingCtrl.create({
        content: 'Sending Message...'
      });
    loading.present();

    let url = this.mainFunc.url+'/api/ads/send-message?token=';
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({headers: headers});

    this.message = this.adMessage.value.message;

    let data = {
      "message": this.message,
      "used_item_id": this.used_item_id
    };

    this.storage.get('token').then( token => {
      this.http.post(url+token, data, options)
        .map(res => res.json())
        .subscribe(data => { 
          if(data.success == true){
            let alert = this.alertCtrl.create({
              message: 'Message sent successfully.!',
              buttons: ['Ok']
            });
            alert.present();
            this.adMessage.reset();
            loading.dismiss();
          }else{
            loading.dismiss();
            this.showAlertMsg('Error sending the message.!');
          }
      }),((error) => {
        loading.dismiss();
        this.showAlertMsg('Error sending the message.!');
      });
    });

  }

}
