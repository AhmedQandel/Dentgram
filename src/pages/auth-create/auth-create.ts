import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events, Platform, AlertController, LoadingController } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Http, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage'
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from "../../pages/home/home";


@Component({
  selector: 'page-auth-create',
  templateUrl: 'auth-create.html',
})
export class AuthCreatePage {
  direc: any;
  direcR: any;
  title: any;
  sex: any;
  dir: any;
  country_list = [];
  city_list = [];
  allData: any;
  first_name_error:boolean = false;
  last_name_error:boolean = false;
  email_error:boolean = false;
  password_error:boolean = false;
  country_id_error:boolean = false;
  city_id_error:boolean = false;
  age_error:boolean = false;
  phone_error:boolean = false;
  gender_error:boolean = false;
  thumb: string;

  shouldAuth: boolean = false;

  private create : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController,
      public translate: TranslateService,
      public platform: Platform,
      private http: Http,
      public storage: Storage,
      public events: Events,
      public alertCtrl: AlertController,
      public loadingCtrl: LoadingController,
      private formBuilder: FormBuilder) {

 
        events.subscribe('application:isLogged', (token) => {
          
          this.storage.get('thumb').then((val) => {
            this.thumb = val;
          });
        });

        this.viewCtrl.setBackButtonText('');
        this.dir = this.platform.dir();
        this.create = this.formBuilder.group({
          first_name: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
          last_name: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
          country_id: ['', Validators.required],
          city_id: ['', Validators.required],
          email: ['',  Validators.compose([ Validators.pattern(this.mainFunc.EMAIL_REGEX), Validators.maxLength(255), Validators.required])],
          password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)])],
          gender: ['', Validators.required],
          phone: ['',  Validators.compose([Validators.pattern('[\+][0-9]|[0-9]'), Validators.required])],
          age: ['', Validators.required],
        });

        if (navigator.onLine){
          let url = this.mainFunc.url + '/api/auth/register';
          let localdata_content = this.http.get(url).map(res => res.json().countries);
          localdata_content.subscribe(data => {
            this.country_list = data;
            this.allData = data;
          });
          
        }else{
          // No Internet Connection
        }
      
  }
  createForm(){
    let Url_request = this.mainFunc.url + "/api/auth/register";
    let header = this.mainFunc.header;
    let city = this.create.value['city_id'];
    let loading = this.loadingCtrl.create({
        content: 'Creating Account...'
    });
    loading.present();
    if (city === 0){
      // this.create.dirty;
    }else {
      this.http.post(Url_request, JSON.stringify(this.create.value), {headers: header})
          .map(res => res.json())
          .subscribe(data => {
            let containt_message = data.message;
            let containt_token = data.token;

            
            // if (data.errors.first_name){
            //   this.first_name_error = "errorshow";
            // }else if (data.errors.last_name){
            //   this.last_name_error = "errorshow";
            // }else if (data.errors.email){
            //   this.email_error = "errorshow";
            // }else if (data.errors.password){
            //   this.password_error = "errorshow";
            // }else if (data.errors.country_id){
            //   this.country_id_error = "errorshow";
            // }else if (data.errors.city_id){
            //   this.city_id_error = "errorshow";
            // }else if (data.errors.age){
            //   this.age_error = "errorshow";
            // }else if (data.errors.phone){
            //   this.phone_error = "errorshow";
            // }else if (data.errors.gender){
            //   this.gender_error = "errorshow";
            // }

            
              
              
              
              


            this.storage.set('first_name', this.create.value['first_name']); 
            this.storage.set('last_name', this.create.value['last_name']);
            this.storage.set('email', this.create.value['email']);
            this.storage.set('password', this.create.value['password']);
            this.storage.set('country_id', this.create.value['country_id']);
            this.storage.set('city_id', this.create.value['city_id']);
            this.storage.set('age', this.create.value['age']);
            this.storage.set('phone', this.create.value['phone']);
            this.storage.set('gender', this.create.value['gender']);



            this.storage.set('token', containt_token);
          this.storage.set('pass_reqister', 'true');
          this.storage.set('name', data.name);
          this.storage.set('thumb', data.thumb);
          this.events.publish('application:isLogged');
            
            if (this.dir === 'rtl') {
              let showAlert = this.alertCtrl.create({
                title: 'إنشاء حساب',
                subTitle: 'تم إنشاء الحساب بنجاح, شكراً لإستخدامك دنتجرام',
                buttons: [{
                    text: 'تم',
                    handler: () => {
                      if(this.shouldAuth === false){
                        this.navCtrl.setRoot(HomePage);
                      }else{
                        this.viewCtrl.dismiss();
                      }
                      // window.location.reload();
                    }
                  }
                ]
              })
              showAlert.present();
            }else if (this.dir === 'ltr'){
              let showAlert = this.alertCtrl.create({
                title: 'Signup',
                subTitle: 'Your account has been created successfully, Thank you for using Dentgram',
                buttons: [{
                    text: 'Ok',
                    handler: () => {
                      if(this.shouldAuth === false){
                        this.navCtrl.setRoot(HomePage);
                      }else{
                        this.viewCtrl.dismiss();
                      }
                      // window.location.reload();
                    }
                  }
                ]
              })
              showAlert.present();
            }
            loading.dismiss();

          },(error) => {
            loading.dismiss();
            if (error.status === 422){
              console.log('422 error handle', error );
              let errText = JSON.parse(error._body);
              let inputErrors = errText.errors;
              
              let errorsHTML = '';

              console.log('inputErrors', inputErrors);
              for(let key in inputErrors){
                errorsHTML = errorsHTML + '<li><b>' + key + ':</b> ' + inputErrors[key] + '</li>';
              }

              errorsHTML = '<ul>' + errorsHTML + '</ul>';

              

              if (this.dir === 'rtl') {
                let showAlert = this.alertCtrl.create({
                  title: 'إنشاء حساب',
                  subTitle: 'حدث خطأ أثناء تسجيل الحساب الجديد من فضلك تأكد من البيانات الصحيحة',
                  message: '',
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
              }else if (this.dir === 'ltr'){
                let showAlert = this.alertCtrl.create({
                  title: 'Signup Errors',
                  subTitle: errorsHTML,
                  message: '',
                  buttons: [{
                      text: 'Ok',
                      handler: () => {
                        //this.nav.setRoot(HomePage);
                        // window.location.reload();
                      }
                    }
                  ]
                })
                showAlert.present();
              }




            }
          });
    }
  }


  ionViewDidLoad() {
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }
    if(this.navParams.get('shouldAuth') === true){
      this.shouldAuth = this.navParams.get('shouldAuth');
    }

    console.log('ionViewDidLoad AccFavPage');
  }
  dismissview(){
    this.navCtrl.parent.viewCtrl.dismiss();
  }


  change_city(lang) {
    
    this.create.value['city_id'] = 0;
    let id = null;
    id = this.create.value['country_id'];
    
    for (let index = 0; index < this.country_list.length; index++) {
      const element = this.country_list[index];
      if (id === element.id) {
        id = index;
        break;
      }
    }
    this.city_list = this.allData[id].cities;
  }

  
}
