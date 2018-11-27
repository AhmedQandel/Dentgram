import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform, AlertController, ModalController } from 'ionic-angular';
import { NoConnectivityPage } from "../../pages/no-connectivity/no-connectivity";
declare var Connection;

@Injectable()
export class ConnectivityServiceProvider {

  onDevice: boolean;
  disconnectSubscription: any;
  connectSubscription: any;
  confirm: any;
  internetStatus: Boolean;
  modalOpen = false;
  modal: any;

  constructor(public platform: Platform,
       private network: Network,
        public alertCtrl: AlertController,
          public myModal: ModalController){

          
    // this.onDevice = this.platform.is('cordova');

      // watch network for a disconnect
      
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.internetStatus = false;
      

      if (!this.modalOpen){
        this.modal = this.myModal.create(NoConnectivityPage);
        this.modalOpen = true;
        this.modal.present();
      }

      console.log('network was disconnected :-(');
    });



    // watch network for a connection
  this.connectSubscription = this.network.onConnect().subscribe(() => {
    console.log('network connected!');
    // console.log('Connection Type : ' + this.network.type);
    this.internetStatus = true;
    // We just got a connection but we need to wait briefly
    // before we determine the connection type. Might need to wait.
    // prior to doing any api requests as well.
    if (this.modalOpen){
      this.modal.dismiss();  
      this.modalOpen = false;
    }
    
    setTimeout(() => {
      if (this.network.type === 'wifi') {
        console.log('we got a wifi connection, woohoo!');
      }
    }, 3000);
  });
  }

  checkConnStartup(){
    if (navigator.onLine){
      
    }else{
      // this.modal = this.myModal.create(NoConnectivityPage);
      // this.modalOpen = true;
      // this.modal.present();  
    }
    
    // console.log('Connection Type : ' + this.network.type);
    
  }

}
