import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ViewController, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage'
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from "../home/home";

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';

import { Facebook } from '@ionic-native/facebook';


@Component({
  selector: 'page-language-select',
  templateUrl: 'language-select.html',
})
export class LanguageSelectPage {

  lang_ar = false;
  lang_en = true;
  dir = 'ltr';
  
  lab_country = 'Country';
  lab_city = 'City';
  lab_save = 'Save';
  requierd_field = '* Choose Country';
  requierd_field_not_valid = false;

  country_list = [];
  country_list_ar = [];
  country_list_en = [];

  city_list = [];
  city_list_ar = [];
  city_list_en = [];

  allData: any;

  loader: any;

  FB_APP_ID: number = 464365010729056;

  private create : FormGroup;

  constructor(public navCtrl: NavController,
     public translate: TranslateService,
      public navParams: NavParams,
        public viewCtrl: ViewController,
          public platform: Platform,
            private http: Http,
              public mainFunc: MainFunctionsProvider,
                private formBuilder: FormBuilder,
                  public storage: Storage,
                    public splashScreen: SplashScreen,
                      public fb: Facebook,
                        public alertCtrl: AlertController,
                          public loadingController: LoadingController) {

                    this.fb.browserInit(this.FB_APP_ID, "v2.8");

                  this.create = this.formBuilder.group({
                    country_selected_ar: ['', Validators.required],
                    country_selected_en: ['', Validators.required],
                    city_selected_ar: ['', Validators.required],
                    city_selected_en: ['', Validators.required]
                  });

            if (navigator.onLine){
              // this.authClass.showLoading('Loading Data',true);
              let url = this.mainFunc.url + '/api/auth/register';
              this.showLoading('', true);
              let localdata_content = this.http.get(url).map(res => res.json().countries);
              // let localdata_content = this.http.get('assets/countries.json').map(res => res.json().countries);
              localdata_content.subscribe(data => {

                if (data.length > 0){
                  this.dismissLoading();
                }

                this.country_list = data;
                this.allData = data;
              });
              
            }else{
              // No Internet Connection
            }

  }

  ionViewDidLoad() {
     console.log('ionViewDidLoad LanguageSelectPage');
  }

  change_city(lang) {
    
    let id = null;
    switch (lang) {
      case 'ar':
        id = this.create.value['country_selected_ar'];    
        break;
      case 'en':
        id = this.create.value['country_selected_en'];
        break;
    
      default:
        break;
    }
    
    for (let index = 0; index < this.country_list.length; index++) {
      const element = this.country_list[index];
      if (id === element.id) {
        id = index;
        break;
      }
    }
    this.create.value['city_selected_ar'] = "";
    this.create.value['city_selected_en'] = "";

    this.city_list = this.allData[id].cities;
    
  }

  
  changelanguage(lang) {
    if(lang == 'arabic' && this.dir !='rtl'){
      this.platform.setDir('ltr',false);
      this.platform.setDir('rtl',true);
      this.lang_ar = true;
      this.lang_en = false;
      this.dir = 'rtl';
      this.lab_country = 'الدولة';
      this.lab_city = 'المدينة';
      this.lab_save = 'حفظ';
      this.requierd_field = '* جميع البيانات مطلوبة';

    }
    else if(lang == 'english' && this.dir !='ltr'){
      this.platform.setDir('rtl',false);
      this.platform.setDir('ltr',true);
      this.lang_ar = false;
      this.lang_en = true;
      this.dir = 'ltr';
      this.lab_country = 'Country';
      this.lab_city = 'City';
      this.lab_save = 'Save';
      this.requierd_field = '* All Data Required';
    }
  }


  saveData(){

    let language = "";
    if (this.lang_ar){
      language = "ar";
    }else if(this.lang_en){
      language = "en";
    }else {
      language = "";
    }



    if (language != "" && language === "ar" && this.create.value['country_selected_ar'] != null && this.create.value['country_selected_ar'] != "" && this.create.value['city_selected_ar'] != null && this.create.value['city_selected_ar'] != "") {
      this.storage.set('language', language);
      this.storage.set('country_id', this.create.value['country_selected_ar']);
      this.storage.set('city_id', this.create.value['city_selected_ar']);

      // this.splashScreen.show();
      // window.location.reload();
      this.navCtrl.setRoot(HomePage);

    }else if (language != "" && language === "en" && this.create.value['country_selected_en'] != null && this.create.value['country_selected_en'] != "" && this.create.value['city_selected_en'] != null && this.create.value['city_selected_en'] != "") {
      this.storage.set('language', language);
      this.storage.set('country_id', this.create.value['country_selected_en']);
      this.storage.set('city_id', this.create.value['city_selected_en']);


      this.navCtrl.setRoot(HomePage);
      // this.splashScreen.show();
      // window.location.reload();
    }else{
      this.requierd_field_not_valid = true;
    }
    // let data_saved = {'country': this.create.value['country_selected'], 'lang' : language};
    
  }




  doFbLogin(){
    let permissions = new Array<string>();
    let nav = this.navCtrl;

    //the permissions your facebook app needs from the user
    permissions = ['public_profile','email','user_birthday','user_location','user_hometown'];

    this.fb.login(permissions)
    .then((response) => {
      let userId = response.authResponse.userID;
      let params = new Array<string>();

      //Getting name and gender properties
      this.fb.api("/me?fields=id,name,gender,email,birthday,first_name,last_name,locale,timezone,", params)
      .then((user) => {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage
        
        let showAlert = this.alertCtrl.create({
          title: 'فيسبوك',
          // subTitle: 'تم إنشاء الحساب بنجاح, شكراً لإستخدامك دنتجرام',
          message: 'User name :' + user.first_name + ' ' + user.last_name + ' ' + user.name +'  Email: ' + user.email + '  Status: ' + user.status +
           '  Pic: ' + user.picture + '  Location: ' + user.locale +
            '  Birthday: ' + user.birthday +
              '  Gender: ' + user.gender +
                '  Time Zone: ' + user.timezone +
                  '  Token: ' + response.authResponse.accessToken +
                  '  All Data: ' + user,
          buttons: [{
              text: 'تم',
              handler: () => {
                //this.nav.setRoot(HomePage);
                // window.location.reload();
              }
            }
          ]
        })
        showAlert.present();

        this.storage.set('user',
        {
          name: user.name,
          gender: user.gender,
          picture: user.picture

        })
        .then(() => {
          // nav.push(UserPage);
        },(error) => {
          console.log(error);
        })
      })
    }, (error) => {
      console.log(error);
    });
}

  showLoading(message: string, state: boolean){
      
    this.loader = this.loadingController.create({
      content: message
    });  
  
    if(!state){
      this.dismissLoading(); 
    }else{
      this.loader.present();
    }
    
  }

  dismissLoading(){
    setTimeout(() => {
      this.loader.dismiss();
    }, 50);
  }
}
