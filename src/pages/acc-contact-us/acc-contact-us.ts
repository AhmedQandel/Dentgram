import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AccContactUsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-acc-contact-us',
  templateUrl: 'acc-contact-us.html',
})
export class AccContactUsPage {
  direc: any;
  direcR: any;

  name: string;
  email: string;
  subject: string;
  message: string;
  country: number;
  validateForm: FormGroup;
  ifformvalid: boolean;
  loading: any;

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

      this.loading = this.loadingCtrl.create({
        content: 'Please Wait ..'
      });

      this.viewCtrl.setBackButtonText('');
      // this.viewCtrl.setBackButtonText(null);
      this.storage.get('country_id').then((val) => {
        this.country = val;
      });
      this.validateForm = formBuilder.group({
        name: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        subject: ['', Validators.required],
        email: ['', Validators.compose([ Validators.pattern(this.mainFunc.EMAIL_REGEX), Validators.maxLength(255), Validators.required])],
        message: ['', Validators.required],
      });

  }

  showAlertMsg(msg){
    let alert = this.alertCtrl.create({
      message: msg,
      buttons: ['Ok']
    });
    alert.present();
  }

  ionViewDidLoad() {
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }


    // Validate Form Live
    

    console.log('ionViewDidLoad AccFavPage');
  }
  dismissview(){
    // this.navCtrl.parent.viewCtrl.dismiss();
  }
  sendMassage(){
    this.loading.present();
    let url = this.mainFunc.url+'/api/contact-us';
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({headers: headers});

    this.message = this.validateForm.value.message;

    // let country_id = 0;

    


    let data = {
      "type":"contact",
      "name": this.name,
      "email": this.email,
      "subject": this.subject,
      "message": this.message,
      "country_id": this.country
    };


    this.http.post(url, data, options)
          .map(res => res.json())
          .subscribe(data => { 
            this.loading.dismiss();
            if(data.success == true){
              this.validateForm.reset();
              this.showAlertMsg('Message sent successfully.!');
            }else{
              this.showAlertMsg('Error sending the message.!');
            }
    });
  }

}
