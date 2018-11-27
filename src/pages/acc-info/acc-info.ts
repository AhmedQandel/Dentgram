import { Component } from '@angular/core';
import { NavController, NavParams, ToastController,ViewController, Events, AlertController, Platform, LoadingController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { TranslateService } from '@ngx-translate/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
// import { Observable } from 'rxjs/Observable';
// import { HomePage } from "../home/home";
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';

import { SplashScreen } from '@ionic-native/splash-screen';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { File } from "@ionic-native/file";

declare var cordova: any;

@Component({
  selector: 'page-acc-info',
  templateUrl: 'acc-info.html',
})

export class AccInfoPage {

  direc: any;
  direcR: any;
  email: string = 'mohamed_sy7@live.com';
  homemenu: any[];
  mainMenu: boolean = true;
  mainProfile: boolean = false;
  mainLang: boolean = false;
  mainPass: boolean = false;
  mainContact: boolean = false;
  loading: any;
  private create : FormGroup;
  lastImage: string = null;
  // loading: Loading;

  lang_ar = true;
  lang_en = false;
  dir = 'rtl';
  
  lab_country = 'الدولة';
  lab_city = 'المدينة';
  lab_save = 'حفظ';
  requierd_field = '* اختر الدولة';
  requierd_field_not_valid = false;

  country_list = [];
  country_list_ar = [];
  country_list_en = [];

  city_list = [];
  city_list_ar = [];
  city_list_en = [];

  allData: any;
  private createLang : FormGroup;
  private createPass : FormGroup;


  dataLoaded: boolean = false;
  pro_first_name: string;
  pro_last_name: string;
  pro_email: string;
  pro_phone: string;
  pro_gender: boolean = true;
  pro_age: any;
  lang_country: string;
  lang_city: string;
  thumb: string;
  pro_thumb: string;
  pro_image: string;
  pro_photo: string;
  uploaded_image: string;


  cont_name: string;
  cont_email: string;
  cont_subject: string;
  cont_message: string;
  cont_country: number;
  contForm: FormGroup;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController,
      private http: Http,
      public storage: Storage,
      private formBuilder: FormBuilder,
      public translate: TranslateService,
      private alertCtrl: AlertController,
      private androidPermissions: AndroidPermissions,
      private camera: Camera,
      public loadingCtrl: LoadingController,
      private transfer: FileTransfer,
      public events: Events,
      private file: File, 
      private filePath: FilePath,
      public splashScreen: SplashScreen,
      public toastCtrl: ToastController,
      public platform: Platform) {

      this.viewCtrl.setBackButtonText('');

      this.homemenu = [];

      this.loading = this.loadingCtrl.create({
        content: 'Please Wait ..'
      });

      this.storage.get('country_id').then((val) => {
        this.cont_country = val;
      });

      this.contForm = formBuilder.group({
        cont_name: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        cont_subject: ['', Validators.required],
        cont_email: ['', Validators.compose([ Validators.pattern(this.mainFunc.EMAIL_REGEX), Validators.maxLength(255), Validators.required])],
        cont_message: ['', Validators.required],
      });

      // Load Main Home Page Menu Data
    let localHomeMenudata = this.http.get('assets/mainmenuaccount.json').map(res => res.json().items);
      localHomeMenudata.subscribe(data => {
      this.homemenu = data;

    });

    if (navigator.onLine){
      // this.authClass.showLoading('Loading Data',true);
      let url = this.mainFunc.url + '/api/auth/register';
      let localdata_content = this.http.get(url).map(res => res.json().countries);
      // let localdata_content = this.http.get('assets/countries.json').map(res => res.json().countries);
      localdata_content.subscribe(data => {
        this.country_list = data;
        this.allData = data;

        this.storage.get('city_id').then( city_id => {
          this.storage.get('country_id').then( country_id => {

            if(city_id != null && city_id != ''){

              let idx = +country_id;
              for (let index = 0; index < this.country_list.length; index++) {
                const element = this.country_list[index];
                if (idx === element.id) {
                  idx = index;
                  break;
                }
              }

              this.city_list = this.allData[idx].cities;
            }else{

            }
          });
        });

      });
      
    }else{
      // No Internet Connection
    }


    this.storage.get('language').then( language => {
      if(language){
        if(language === 'en'){
          this.lang_ar = false;
          this.lang_en = true;
          // this.dir = 'ltr';
          this.changelanguage('english');
        }else if(language === 'ar'){
          this.lang_ar = true;
          this.lang_en = false;
          // this.dir = 'rtl';
          this.changelanguage('arabic');
        }
      }
    });
    
    

    this.create = this.formBuilder.group({
      pro_first_name: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      pro_last_name: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      pro_email: ['',  Validators.compose([ Validators.pattern(this.mainFunc.EMAIL_REGEX), Validators.maxLength(255), Validators.required])],
      pro_gender: ['', Validators.required],
      pro_phone: ['',  Validators.compose([Validators.pattern('[\+][0-9]|[0-9]'), Validators.required])],
      // pro_phone: ['',  Validators.compose([Validators.pattern('[\+][0-9]*'), Validators.required])],
      pro_age: ['', Validators.required]
    });

    this.createLang = this.formBuilder.group({
      country_selected_ar: ['', Validators.required],
      country_selected_en: ['', Validators.required],
      city_selected_ar: ['', Validators.required],
      city_selected_en: ['', Validators.required]
    });

    this.createPass = this.formBuilder.group({
      pass_old_password: ['', Validators.required],
      pass_new_password: ['', Validators.required],
      pass_repeat_password: ['', Validators.required]
    });

  }

  ionViewDidLoad() {
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }

    this.storage.get('token').then( token => {
      
      if (navigator.onLine){
        let url = this.mainFunc.url + '/api/user/profile?token=' + token;
        let localdata_content = this.http.get(url).map(res => res.json());
        localdata_content.subscribe(data => {
          this.dataLoaded = true;
          this.pro_first_name = data.first_name;
          this.pro_last_name = data.last_name;
          this.pro_email = data.email;
          this.pro_phone = data.phone;
          this.pro_gender = data.gender;
          this.pro_age = data.age;
          this.lang_country = data.country_id;
          this.thumb = data.thumb;
          this.pro_thumb = data.thumb;
          this.pro_image = null;

          // if(data.country_id != null && data.country_id != ''){
            
          // }

          this.lang_city = data.city_id;
        });
        
      }else{
        // No Internet Connection
      }

    });

    console.log('ionViewDidLoad AccFavPage');
  }
  dismissview(){
    if(this.mainMenu == true){
      this.navCtrl.parent.viewCtrl.dismiss();
    }else{
      this.mainMenu = true;
      this.mainProfile = false;
      this.mainLang = false;
      this.mainPass = false;
      this.mainContact = false;
    }
  }

  showAlertMsg(msg){
    let alert = this.alertCtrl.create({
      message: msg,
      buttons: ['Ok']
    });
    alert.present();
  }

  click_Open_Page(id){

    this.mainProfile = false;
    this.mainMenu = false;
    this.mainLang = false;
    this.mainPass = false;
    this.mainContact = false;

    switch (id) {
      
      case '0':
        // Edit Profile
        this.mainMenu = true;
        
      break;

      case '1':
        // Edit Profile
        this.mainProfile = true;
      break;

      case '2':
        // Country & Language
        this.mainProfile = true;
        this.mainLang = true;
        setTimeout(() => {
          this.mainProfile = false;
        }, 100);
        
      break;
      
      case '3':
        // Change Password
        this.mainPass = true;
      break;
      
      case '4':
        // Contact Us
        this.mainContact = true;
      break;

    }
}

change_city(lang) {
    
  let id = null;
  switch (lang) {
    case 'ar':
      id = this.createLang.value['country_selected_ar'];    
      break;
    case 'en':
      id = this.createLang.value['country_selected_en'];
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

  this.createLang.value['city_selected_ar'] = "";
  this.createLang.value['city_selected_en'] = "";

  this.city_list = this.allData[id].cities;
  
}

changelanguage(lang) {
  if(lang == 'arabic' && this.dir !='rtl'){
    // this.platform.setDir('ltr',false);
    // this.platform.setDir('rtl',true);
    this.lang_ar = true;
    this.lang_en = false;
    this.dir = 'rtl';
    this.lab_country = 'الدولة';
    this.lab_city = 'المدينة';
    this.lab_save = 'حفظ';
    this.requierd_field = '* جميع البيانات مطلوبة';
    console.log('lang is arabic');
  }

  else if(lang == 'english' && this.dir !='ltr'){
    // this.platform.setDir('rtl',false);
    // this.platform.setDir('ltr',true);
    this.lang_ar = false;
    this.lang_en = true;
    this.dir = 'ltr';
    this.lab_country = 'Country';
    this.lab_city = 'City';
    this.lab_save = 'Save';
    this.requierd_field = '* All Data Required';
    console.log('lang is english');
  }

}

saveLanguageData(){

    let language = "";
    if (this.lang_ar){
      language = "ar";
    }else if(this.lang_en){
      language = "en";
    }else {
      language = "";
    }



    

    
    if (language != "" && language === "ar" && this.createLang.value['country_selected_ar'] != null && this.createLang.value['country_selected_ar'] != "" && this.createLang.value['city_selected_ar'] != null && this.createLang.value['city_selected_ar'] != "") {

      this.storage.set('country_id', this.createLang.value['country_selected_ar']);
      this.storage.set('city_id', this.createLang.value['city_selected_ar']);


      this.storage.get('language').then(langdata => {
        if (langdata != null && langdata != ''){
          // this.storage.set('language', language);
          if( langdata != language){
            this.changeLang(language)
          }
        }
      });

      // this.splashScreen.show();
      // window.location.reload();


      // this.navCtrl.setRoot(HomePage);

      this.profileEdit();

    }else if (language != "" && language === "en" && this.createLang.value['country_selected_en'] != null && this.createLang.value['country_selected_en'] != "" && this.createLang.value['city_selected_en'] != null && this.createLang.value['city_selected_en'] != "") {
      this.storage.set('country_id', this.createLang.value['country_selected_en']);
      this.storage.set('city_id', this.createLang.value['city_selected_en']);
      console.log('changed en');

      this.storage.get('language').then(langdata => {
        if (langdata != null && langdata != ''){
          // this.storage.set('language', language);
          if( langdata != language){
            this.changeLang(language)
          }
        }
      });

      // this.navCtrl.setRoot(HomePage);

      // this.splashScreen.show();
      // window.location.reload();

      this.profileEdit();
    }else{
      this.requierd_field_not_valid = true;
    }
    // let data_saved = {'country': this.create.value['country_selected'], 'lang' : language};  
}


public async myUploadClick() {
  this.loading = this.loadingCtrl.create({
    content: 'Updating Profile...' 
  });
  this.loading.present();
  if(this.pro_photo != null || this.pro_photo != undefined){
    this.storage.get('token').then(token => {
      // let loading_status: number = 0;
        console.log('uploading image');
        this.loading.setContent('Uploading Image...');

        let file = this.pro_photo;

        console.log("file", file);
        
        if(file != undefined){

          let filename = file.substring(file.lastIndexOf("/"));//'image';
          let apiurl = this.mainFunc.url + "/api/upload_file?token=" + token;

          const fileTransfer: FileTransferObject = this.transfer.create();

          let options1: FileUploadOptions = {
            
            fileKey: 'file',
            fileName: filename,
            httpMethod: 'POST',
            chunkedMode : false,
            headers: {},
            params: {
              "_method" : "PUT"
            }
            
          }

          fileTransfer.upload(encodeURI(file), apiurl, options1)
          .then((data) => {
            let msg_json = JSON.parse(data.response);
            this.uploaded_image = msg_json.message;
            this.pro_image = msg_json.message;
            console.log(this.pro_image, msg_json.message);
            this.profileEdit();
          }, (err) => {
            this.showAlertMsg('Error happen code : ' + err.code + ' ---- source : ' + err.source + ' ------ Target : ' + err.target + ' ------ Http Status : ' + err.http_status);
          }).catch(err => {
            console.log(err);
          });

        }
    });
  }else{
    this.profileEdit();
  }
}

profileEdit(){
  console.log('editing profile');
  this.loading.setContent('Saving data...');
  this.storage.get('token').then(token => {

      let request_body = {

        "first_name" : this.create.value['pro_first_name'],
        "last_name" : this.create.value['pro_last_name'],
        "email" : this.create.value['pro_email'],
        "phone" : this.create.value['pro_phone'],
        "gender" : this.create.value['pro_gender'],
        "age" : this.create.value['pro_age'],
        "country_id" : this.lang_country,
        "city_id" : this.lang_city,
        "image" : this.uploaded_image
      };

      this.storage.get('token').then(token => {
        let Url_request = this.mainFunc.url + '/api/user/profile/update' + '?token=' + token;
        let header = this.mainFunc.header;
        this.http.put(Url_request, JSON.stringify(request_body), {headers: header})
            .map(res => res.json())
            .subscribe(data => {
              let containt_message = data.success;
              this.loading.dismiss();
              if (containt_message){
                // clear All Data And Show Message For Submit The Add
                this.storage.set('token', token);
                this.storage.set('pass_reqister', 'true');
                this.storage.set('name', data.name);
                this.storage.set('thumb', data.thumb);
                this.events.publish('application:isLogged');
                let alert = this.alertCtrl.create({
                  message: 'Profile Updated Successfully.',
                  buttons: ['Ok']
                });
                this.pro_photo = null;
                this.uploaded_image = null;
                alert.present();
              }else{

                this.pro_thumb = this.thumb;
                this.loading.dismiss();

                let alert = this.alertCtrl.create({
                  message: "Please check your data and try again",
                  buttons: ['Ok']
                });
                alert.present();
              }

              // alert("Response From PUT Method : " + data);

            },(error) => {
              
              this.loading.dismiss();

              let alert = this.alertCtrl.create({
                message: "Please check your data and try again",
                buttons: ['Ok']
              });
              alert.present();

              console.log('Error Password Change', error.status);
              
              if (error.status === 422){
                this.loading.dismiss();
              }


            });
        });

  });
}

changePassword(){
  console.log('changing password');

  let request_body = {

    "old_password" : this.createPass.value['pass_old_password'],
    "new_password" : this.createPass.value['pass_new_password'],
    "new_password_confirmation" : this.createPass.value['pass_repeat_password']
  }

 
  this.storage.get('token').then(token => {
    let Url_request = this.mainFunc.url + '/api/user/profile/password' + '?token=' + token;
    let header = this.mainFunc.header;
    this.http.post(Url_request, JSON.stringify(request_body), {headers: header})
        .map(res => res.json())
        .subscribe(data => {
          let containt_message = data.success;
          if (containt_message){
            // clear All Data And Show Message For Submit The Add
            
            this.createPass.reset();
            
            
            
            let alert = this.alertCtrl.create({
              message: 'Your Password Changed Successfully.',
              buttons: ['Ok']
            });
            alert.present();

          }else{

            // this.loading.dismiss();

            let alert = this.alertCtrl.create({
              message: "Your credintals dosen't match our records, please try again",
              buttons: ['Ok']
            });
            alert.present();


            // clear All Data And Show Message For Submit The Add
            
            this.createPass.reset();
          }

          // alert("Response From PUT Method : " + data);

        },(error) => {

          // this.loading.dismiss();

          let alert = this.alertCtrl.create({
            message: "Your credintals dosen't match our records, please try again",
            buttons: ['Ok']
          });
          alert.present();

          console.log('Error Password Change', error.status);
          
          if (error.status === 422){

          }


        });
  });
}

  selectImage() {
    var options = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') ) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            console.log(filePath);
            this.pro_thumb =filePath;
            this.pro_photo = filePath;   
          });
      } else {
        this.pro_thumb =imagePath;
        this.pro_photo = imagePath; 

      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });



    // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);


    // let options: CaptureImageOptions = { 
    //   limit: 1
    // };
    // this.mediaCapture.captureImage(options)
    //   .then(
    //     (data: MediaFile[]) =>{
    //       console.log(data);
    //       this.pro_thumb = data[0]+"";
    //       this.pro_photo = data[0]+"";
    //     } ,
    //     (err: CaptureError) => console.error(err)
    //   );

      // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      //   result => 
      //   {
      //     console.log('Has permission?',result.hasPermission)
      //     let options: CaptureImageOptions = { 
      //       limit: 1
      //     };
      //     this.mediaCapture.captureImage(options)
      //       .then(
      //         (data: MediaFile[]) =>{
      //           console.log(data);
      //           this.pro_thumb = data[0]+"";
      //           this.pro_photo = data[0]+"";
      //         } ,
      //         (err: CaptureError) => console.error(err)
      //       );
      //   },
      //    err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      // );

    // var options = {
    //   maximumImagesCount: 1,
    //   quality: 30
    // };

    // this.imagePicker.getPictures(options).then((results) => {
    //   this.pro_thumb = results[0];
    //   this.pro_photo = results[0];
    //   // if(results[0] != null && results[0] != undefined){
    //   //   this.pro_photo = results[0];
    //   // }
    // }, (err) => { 
    //   console.log(err);
    // });
  }

  // private createFileName() {
  //   var d = new Date(),
  //   n = d.getTime(),
  //   newFileName =  n + ".jpg";
  //   return newFileName;
  // }
   
  // // Copy the image to a local folder
  // private copyFileToLocalDir(namePath, currentName, newFileName) {
  //   this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
  //     this.lastImage = newFileName;
         
  //   }, error => {
  //     this.presentToast('Error while storing file.');
  //   });
  // }
   
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
   
  // // Always get the accurate path to your apps folder
  // public pathForImage(img) {
  //   if (img === null) {
  //     return '';
  //   } else {
  //     return cordova.file.dataDirectory + img;
  //   }
  // }

  sendMassage(){
    this.loading.present();
    let url = this.mainFunc.url+'/api/contact-us';
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({headers: headers});

    this.cont_message = this.contForm.value.cont_message;

    // let country_id = 0;

    


    let data = {
      "type":"contact",
      "name": this.cont_name,
      "email": this.cont_email,
      "subject": this.cont_subject,
      "message": this.cont_message,
      "country_id": this.cont_country
    };


    this.http.post(url, data, options)
          .map(res => res.json())
          .subscribe(data => { 
            this.loading.dismiss();
            if(data.success == true){
              this.contForm.reset();
              this.showAlertMsg('Message sent successfully.!');
            }else{
              this.showAlertMsg('Error sending the message.!');
            }
    });
  }


  changeLang(language){
    
  

        let alert = this.alertCtrl.create({
          title: 'دنتجرام',
          subTitle: 'سيتم اعادة تشغيل التطبيق لتفعيل تغيير اللغة',
          buttons: [
            {
              text: 'موافق',
              handler: data => {
                this.storage.set('language', language);
                this.splashScreen.show();
                window.location.reload();
              }
            }
          ]
        });
        alert.present(); 
  }

}