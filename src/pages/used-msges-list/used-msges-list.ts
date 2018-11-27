import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, ViewController, ToastController, NavParams, Slides, Platform, Events } from 'ionic-angular';


import { TranslateService } from '@ngx-translate/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Storage } from '@ionic/storage';

import { UsedMsgesListDetailsPage } from "../../pages/used-msges-list-details/used-msges-list-details";
@Component({
  selector: 'page-used-msges-list',
  templateUrl: 'used-msges-list.html',
})
export class UsedMsgesListPage {

  direc: any;
  direcR: any;
  messageslist: any[];
  resData: any[] = [];
  isDataAvilable = true;
  current_page: number = 0;
  can_load_more: boolean = true;

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

  loadPage(){
    if(this.can_load_more == true){
        this.storage.get('token').then( token => {
            let url = this.mainFunc.url+'/api/ads/get-messages?token='+token+'&page='+Number(this.current_page+1);
            let headers = new Headers();
            headers.append('Content-Type','application/json');
            let options = new RequestOptions({headers: headers});
            
            let localHomeMenudata2 = this.http.post(url,'',options).map(res => res.json());
              localHomeMenudata2.subscribe(dataall => {
                let data = [];
                data = dataall.data;
                if(data.length == 0 && this.current_page == 0){
                  this.isDataAvilable = false;
                  this.can_load_more = true;
                } else if(data.length == 0 && this.current_page != 0) {
                  this.can_load_more = false;
                }else{
                  for(let i = 0;i < data.length; i++){
                    this.resData.push(data[i]);
                    this.messageslist = this.resData;
                  }
                  this.current_page++;
                  this.can_load_more = true;
                }
            });
        });
     }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsedMsgesListPage');

    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }

    this.loadPage();
  }

  openMsgDetails(body,msg_id,index) {
    this.messageslist[index].read_at = 'is_read';
    this.navCtrl.push(UsedMsgesListDetailsPage, {
      'body' : body,
      'msg_id': msg_id
    });
  }

  dismissview(){
    this.navCtrl.parent.viewCtrl.dismiss();
  }

  doInfinite(infiniteScroll: any) {
    if(this.can_load_more){
      setTimeout(() => {
        this.loadPage();
        infiniteScroll.complete();
      }, 1000)
    }else{
      infiniteScroll.complete();
    }
  }

  doToast(msg)
  {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  deleteMessage(msg_id, index)
  {
    this.storage.get('token').then( token => {
      let url = this.mainFunc.url + '/api/ads/delete-message/'+msg_id+'?token='+token;
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      let options = new RequestOptions({headers: headers});

      this.http.post(url,'',options).map(
        res => res.json())
        .subscribe(data => { 
          if(data.success == true){
            this.messageslist.splice(index, 1);
            if(this.can_load_more && this.messageslist.length == 0){
              this.loadPage();
            }
            this.doToast('Message deleted successfully');
          } else{
            this.doToast('Failed to delete message!');
          }
        });
    });
  }

}
