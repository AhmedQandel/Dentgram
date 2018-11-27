import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { NavController, NavParams, ViewController, Events, AlertController, LoadingController, Loading, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Http, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import 'rxjs/add/operator/map';
import { AuthCreatePage } from "../../pages/auth-create/auth-create";

import { TranslateService } from '@ngx-translate/core';

import { AuthProvider } from "../../providers/auth/auth";

import { HomePage } from "../../pages/home/home";
import { Storage } from '@ionic/storage';


import { Facebook } from '@ionic-native/facebook';

import { SplashScreen } from '@ionic-native/splash-screen';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';


import { DatePipe } from '@angular/common';




@Component({
  selector: 'page-auth-login',
  templateUrl: 'auth-login.html',

  animations: [
    
       //For the logo
       trigger('flyInBottomSlow', [
         state('in', style({
           transform: 'translate3d(0,0,0)'
         })),
         transition('void => *', [
           style({transform: 'translate3d(0,1000px,0'}),
           animate('2000ms ease-in-out')
         ])
       ]),
    
       //For the background detail
       trigger('flyInBottomFast', [
         state('in', style({
           transform: 'translate3d(0,0,0)'
         })),
         transition('void => *', [
           style({transform: 'translate3d(0,2000px,0)'}),
           animate('1000ms ease-in-out')
         ])
       ]),
    
       //For the login form
       trigger('bounceInBottom', [
         state('in', style({
           transform: 'translate3d(0,0,0)'
         })),
         transition('void => *', [
           animate('2000ms 200ms ease-in', keyframes([
             style({transform: 'translate3d(0,2000px,0)', offset: 0}),
             style({transform: 'translate3d(0,-20px,0)', offset: 0.9}),
             style({transform: 'translate3d(0,0,0)', offset: 1}) 
           ]))
         ])
       ]),
    
       //For login button
       trigger('fadeIn', [
         state('in', style({
           opacity: 1
         })),
         transition('void => *', [
           style({opacity: 0}),
           animate('1000ms 2000ms ease-in')
         ])
       ])
     ]
})
export class AuthLoginPage {
  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";
  FB_APP_ID: number = 464365010729056;
  private login : FormGroup;
  dir: any;
  shouldAuth: boolean = false;
  shouldDismiss: boolean = false;
  constructor(private nav: NavController,
       private alertCtrl: AlertController,
         private loadingCtrl: LoadingController,
         public navParams: NavParams,
          public viewCtrl: ViewController, 
            private http: Http,
              public mainFunc: MainFunctionsProvider,
              public translate: TranslateService,
              public platform: Platform,
              private formBuilder: FormBuilder,
              public auth: AuthProvider,
              public storage: Storage,
              public fb: Facebook,
              public events: Events,
              public datepipe: DatePipe) {
    
                this.fb.browserInit(this.FB_APP_ID, "v2.8");
                console.log("facebook AppId  " + this.FB_APP_ID);
                this.dir = this.platform.dir();

                this.login = this.formBuilder.group({
                  email: ['', Validators.required],
                  password: ['', Validators.required],
                  remember: ['']
                });
  }

  ionViewDidLoad(){
    this.viewCtrl.setBackButtonText('');
    if(this.navParams.get('shouldAuth') === true){
      this.shouldAuth = this.navParams.get('shouldAuth');
    }
  }

  ionViewWillEnter() {
    if(this.shouldDismiss === true){
      this.viewCtrl.dismiss();
    }
  }

  openLoginUser(){
    let loading = this.loadingCtrl.create({
        content: 'Signing in...'
    });
    loading.present();

    this.auth.login(this.login.value).subscribe(data => {
      loading.dismiss();
      console.log("userData", data);

      if(data.message === "Successfully signed in user!"){
        this.storage.set('token', data.token);
        // this.storage.set('userId', data.id);
        this.storage.set('pass_reqister', 'true');
        this.storage.set('name', data.name);
        this.storage.set('thumb', data.thumb);
        this.events.publish('application:isLogged');
        if(this.shouldAuth === false){
          this.nav.setRoot(HomePage);
        }else{
          this.viewCtrl.dismiss();
          
        }
      }
    },(error) => {
      loading.dismiss();
      if(error.status === 401){
        let alert = this.alertCtrl.create({
          title: 'Login Failed',
          subTitle: error.message,
          buttons: ['OK']
        })
        alert.present();
      }
    })
  
  }
  openCreateUser(){
    this.nav.push(AuthCreatePage, {shouldAuth: this.shouldAuth});
    if(this.shouldAuth === true){
      this.shouldDismiss = true;
    }
  }



  fbLoginWithToken(){

    console.log("facebook login");
    let create: any;
    let country_id = '';
    let city_id = '';
    let langu = ''
    let permissions = new Array<string>();
    // let nav = this.nav;


    this.storage.get('country_id').then((val) => {
      if (val){
        country_id = val;
      }
    });

    this.storage.get('city_id').then((val) => {
      if (val){
        city_id = val;
      }
    });

    this.storage.get('language').then((val) => {
      if (val){
        langu = val;
      }
    });

 //the permissions your facebook app needs from the user
 permissions = ['public_profile','email','user_birthday','user_location','user_hometown'];

 this.fb.login(permissions)
 .then((response) => {
    let loading = this.loadingCtrl.create({
        content: 'Signing in...'
    });
    loading.present();
  
    let fbToken = response.authResponse.accessToken;
    console.log('fb Token', fbToken);


         let Url_request = this.mainFunc.url + "/api/auth/facebook";
         let header = this.mainFunc.header;

          create = {
            fb_token: fbToken, 
            country_id: country_id,
            city_id: city_id,
            lang : langu
          };
          
         this.http.post(Url_request, JSON.stringify(create), {headers: header})
        .map(res => res.json())
        .subscribe(data => {
          loading.dismiss();
          let containt_message = data.message;
          let containt_token = data.token;

          // this.storage.set('token', containt_token);

          this.storage.set('token', data.token);
          this.storage.set('pass_reqister', 'true');

          if(this.shouldAuth === false){
            this.nav.setRoot(HomePage);
          }else{
            this.viewCtrl.dismiss();
            
          }

          }, (error) => {
            loading.dismiss();
                 let alert = this.alertCtrl.create({
                   title:'Dentgram',
                   message: 'Sorry you cant login with facebook account please sign up',
                   buttons: [{
                     text: 'Ok',
                     handler: () => {
          
                     }
                   }]
                 })
                 alert.present();
            console.log(error);
        });


  }, (error) => {
    console.log(error);
  });

    // let userId = response.authResponse.userID;
    // let params = new Array<string>();
    

   //Getting name and gender properties
  //  this.fb.api("/me?fields=id,name,gender,email,birthday,first_name,last_name,locale,timezone", params)
  //  .then((user) => {
  //    user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
  //    //now we have the users info, let's save it in the NativeStorage
     

    //  if (user.gender === 'male'){
    //    user.gender = 1;
    //  }else if(user.gender === 'female'){
    //    user.gender = 2;
    //  }

     // this.storage.set('first_name', user.first_name); 
     // this.storage.set('last_name', user.last_name);
     // this.storage.set('email', user.email);
     // this.storage.set('password', '123456789');
     // this.storage.set('country_id', country_id);
     // this.storage.set('city_id', city_id);
     // this.storage.set('age', user.birthday);
     // this.storage.set('phone', '01000000000');
     // this.storage.set('gender', user.gender);
     
    //  user.birthday = new Date();
    //  user.birthday =this.datepipe.transform(user.birthday, 'yyyy-MM-dd');

    //  create = {
    //    first_name: user.first_name,
    //    last_name: user.last_name,
    //    country_id: country_id,
    //    city_id: city_id,
    //    email: user.email,
    //    password: '123456789',
    //    gender: user.gender,
    //    phone: '01000000000',
    //    age: user.birthday,
    //  };

    //  let login_data = {
    //    email: user.email,
    //    password: '123456789'
    //  };


     
     //Lock if this user alrady registerd

    //  this.auth.login(login_data).subscribe(data => {
    //    if(data.message === "Successfully signed in user!"){
         
    //      this.storage.set('token', data.token);
    //      this.storage.set('pass_reqister', 'true');
    //      this.storage.set('first_name', user.first_name); 
    //      this.storage.set('last_name', user.last_name);
    //      this.storage.set('email', user.email);
    //      this.storage.set('password', '123456789');
    //      // this.storage.set('country_id', country_id);
    //      // this.storage.set('city_id', city_id);
    //      this.storage.set('age', user.birthday);
    //      this.storage.set('phone', '01000000000');
    //      this.storage.set('gender', user.gender);



    //      this.nav.setRoot(HomePage);
    //    }
    //  },(error) => {
    //    if(error.status === 401){

    //      // let alert = this.alertCtrl.create({
    //      //   title:'user',
    //      //   message: ' first_name : ' + user.first_name 
    //      //   + '    last_name : ' + user.last_name,
    //      //   + '    email : ' + user.email,
    //      //   + '    password : ' + user.,
    //      //   + '     : ' + user.,
    //      //   + '     : ' + user.,
    //      //   + '     : ' + user.,
    //      //   + '     : ' + user.,
    //      //   buttons: [{
    //      //     text: 'done',
    //      //     handler: () => {
   
    //      //     }
    //      //   }]
    //      // })
    //      // alert.present();

    //      let Url_request = this.mainFunc.url + "/api/auth/register";
    //      let header = this.mainFunc.header;
    //      this.http.post(Url_request, JSON.stringify(create), {headers: header})
    //    .map(res => res.json())
    //    .subscribe(data => {
    //      let containt_message = data.message;
    //      let containt_token = data.token;

    //      // this.storage.set('token', containt_token);

    //      this.storage.set('token', data.token);
    //      this.storage.set('pass_reqister', 'true');
    //      this.storage.set('first_name', user.first_name); 
    //      this.storage.set('last_name', user.last_name);
    //      this.storage.set('email', user.email);
    //      this.storage.set('password', '123456789');
    //      // this.storage.set('country_id', country_id);
    //      // this.storage.set('city_id', city_id);
    //      this.storage.set('age', user.birthday);
    //      this.storage.set('phone', '01000000000');
    //      this.storage.set('gender', user.gender);
         
    //      if (this.dir === 'rtl') {
    //        let showAlert = this.alertCtrl.create({
    //          title: 'إنشاء حساب',
    //          subTitle: 'تم إنشاء الحساب بنجاح, شكراً لإستخدامك دنتجرام',
    //          buttons: [{
    //              text: 'تم',
    //              handler: () => {
    //                //this.nav.setRoot(HomePage);
    //                // window.location.reload();
    //              }
    //            }
    //          ]
    //        })
    //        showAlert.present();

    //      }else if (this.dir === 'ltr'){
    //        let showAlert = this.alertCtrl.create({
    //          title: 'Signup',
    //          subTitle: 'Your account has been created successfully, Thank you for using Dentgram',
    //          buttons: [{
    //              text: 'Ok',
    //              handler: () => {
    //                //this.nav.setRoot(HomePage);
    //                // window.location.reload();
    //              }
    //            }
    //          ]
    //        })
    //        showAlert.present();
    //      };


    //      this.auth.login(login_data).subscribe(data => {
    //        if(data.message === "Successfully signed in user!"){
             
    //          this.storage.set('token', data.token);
    //          this.storage.set('pass_reqister', 'true');
    //          // this.storage.set('first_name', user.first_name); 
    //          // this.storage.set('last_name', user.last_name);
    //          // this.storage.set('email', user.email);
    //          // this.storage.set('password', '123456789');
    //          // // this.storage.set('country_id', country_id);
    //          // // this.storage.set('city_id', city_id);
    //          // this.storage.set('age', user.birthday);
    //          // this.storage.set('phone', '01000000000');
    //          // this.storage.set('gender', user.gender);
 
    //          this.nav.setRoot(HomePage);
    //        }
    //      });

    //    },(error) => {
    //      let alert = this.alertCtrl.create({
    //        title:'error',
    //        message: error,
    //        buttons: [{
    //          text: 'Ok',
    //          handler: () => {
   
    //          }
    //        }]
    //      })
    //      alert.present();

    //    });

    //    }
    //  })




    //  let showAlert = this.alertCtrl.create({
    //    title: 'فيسبوك',
    //    // subTitle: 'تم إنشاء الحساب بنجاح, شكراً لإستخدامك دنتجرام',
    //    message: 'User name :' + user.first_name + ' ' + user.last_name +'  Email: ' + user.email + 
    //     '  Pic: ' + user.picture + '  Location: ' + user.locale +
    //      '  Birthday: ' + user.birthday +
    //        '  Gender: ' + user.gender +
    //          '  Time Zone: ' + user.timezone +
    //            '  Token: ' + response.authResponse.accessToken,

    //    buttons: [{
    //        text: 'تم',
    //        handler: () => {
    //          //this.nav.setRoot(HomePage);
    //          // window.location.reload();
    //        }
    //      }
    //    ]
    //  })
     // showAlert.present();




    //  this.storage.set('user',
    //  {
    //    name: user.name,
    //    gender: user.gender,
    //    picture: user.picture

    //  }
    // ).then(() => {
    //    // nav.push(UserPage);
    //  },(error) => {
    //    console.log(error);
    //  })
  //  })
//  }, (error) => {
//    console.log(error);
//  });



  }

  doFbLogin(){
    let create: any;
    let country_id = 0;
    let city_id = "";
    let permissions = new Array<string>();
    let nav = this.nav;


    this.storage.get('country_id').then((val) => {
      if (val){
        country_id = val;
      }
    });

    this.storage.get('city_id').then((val) => {
      if (val){
        city_id = val;
      }
    });

    //the permissions your facebook app needs from the user
    permissions = ['public_profile','email','user_birthday','user_location','user_hometown'];

    this.fb.login(permissions)
    .then((response) => {
      let userId = response.authResponse.userID;
      let params = new Array<string>();

      // let alert = this.alertCtrl.create({
      //   title:'connect to fb',
      //   message: userId,
      //   buttons: [{
      //     text: 'done',
      //     handler: () => {

      //     }
      //   }]
      // })
      // alert.present();

      //Getting name and gender properties
      this.fb.api("/me?fields=id,name,gender,email,birthday,first_name,last_name,locale,timezone", params)
      .then((user) => {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage
        

        
        // let alert = this.alertCtrl.create({
        //   title:'user',
        //   message: user.picture,
        //   buttons: [{
        //     text: 'done',
        //     handler: () => {
  
        //     }
        //   }]
        // })
        // alert.present();



        

        if (user.gender === 'male'){
          user.gender = 1;
        }else if(user.gender === 'female'){
          user.gender = 2;
        }

        // this.storage.set('first_name', user.first_name); 
        // this.storage.set('last_name', user.last_name);
        // this.storage.set('email', user.email);
        // this.storage.set('password', '123456789');
        // this.storage.set('country_id', country_id);
        // this.storage.set('city_id', city_id);
        // this.storage.set('age', user.birthday);
        // this.storage.set('phone', '01000000000');
        // this.storage.set('gender', user.gender);
        
        user.birthday = new Date();
        user.birthday =this.datepipe.transform(user.birthday, 'yyyy-MM-dd');

        create = {
          first_name: user.first_name,
          last_name: user.last_name,
          country_id: country_id,
          city_id: city_id,
          email: user.email,
          password: '123456789',
          gender: user.gender,
          phone: '01000000000',
          age: user.birthday,
        };

        let login_data = {
          email: user.email,
          password: '123456789'
        };


        
        //Lock if this user alrady registerd

        this.auth.login(login_data).subscribe(data => {
          if(data.message === "Successfully signed in user!"){
            
            this.storage.set('token', data.token);
            this.storage.set('pass_reqister', 'true');
            this.storage.set('first_name', user.first_name); 
            this.storage.set('last_name', user.last_name);
            this.storage.set('email', user.email);
            this.storage.set('password', '123456789');
            // this.storage.set('country_id', country_id);
            // this.storage.set('city_id', city_id);
            this.storage.set('age', user.birthday);
            this.storage.set('phone', '01000000000');
            this.storage.set('gender', user.gender);



            if(this.shouldAuth === false){
              this.nav.setRoot(HomePage);
            }else{
              this.viewCtrl.dismiss();
              
            }
          }
        },(error) => {
          if(error.status === 401){

            // let alert = this.alertCtrl.create({
            //   title:'user',
            //   message: ' first_name : ' + user.first_name 
            //   + '    last_name : ' + user.last_name,
            //   + '    email : ' + user.email,
            //   + '    password : ' + user.,
            //   + '     : ' + user.,
            //   + '     : ' + user.,
            //   + '     : ' + user.,
            //   + '     : ' + user.,
            //   buttons: [{
            //     text: 'done',
            //     handler: () => {
      
            //     }
            //   }]
            // })
            // alert.present();

            let Url_request = this.mainFunc.url + "/api/auth/register";
            let header = this.mainFunc.header;
            this.http.post(Url_request, JSON.stringify(create), {headers: header})
          .map(res => res.json())
          .subscribe(data => {
            let containt_message = data.message;
            let containt_token = data.token;

            // this.storage.set('token', containt_token);

            this.storage.set('token', data.token);
            this.storage.set('pass_reqister', 'true');
            this.storage.set('first_name', user.first_name); 
            this.storage.set('last_name', user.last_name);
            this.storage.set('email', user.email);
            this.storage.set('password', '123456789');
            // this.storage.set('country_id', country_id);
            // this.storage.set('city_id', city_id);
            this.storage.set('age', user.birthday);
            this.storage.set('phone', '01000000000');
            this.storage.set('gender', user.gender);
            
            if (this.dir === 'rtl') {
              let showAlert = this.alertCtrl.create({
                title: 'إنشاء حساب',
                subTitle: 'تم إنشاء الحساب بنجاح, شكراً لإستخدامك دنتجرام',
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
                title: 'Signup',
                subTitle: 'Your account has been created successfully, Thank you for using Dentgram',
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
            };


            this.auth.login(login_data).subscribe(data => {
              if(data.message === "Successfully signed in user!"){
                
                this.storage.set('token', data.token);
                this.storage.set('pass_reqister', 'true');
                this.storage.set('name', data.name);
                this.storage.set('thumb', data.thumb);
                this.events.publish('application:isLogged');
                // this.storage.set('first_name', user.first_name); 
                // this.storage.set('last_name', user.last_name);
                // this.storage.set('email', user.email);
                // this.storage.set('password', '123456789');
                // // this.storage.set('country_id', country_id);
                // // this.storage.set('city_id', city_id);
                // this.storage.set('age', user.birthday);
                // this.storage.set('phone', '01000000000');
                // this.storage.set('gender', user.gender);
    
                if(this.shouldAuth === false){
                  this.nav.setRoot(HomePage);
                }else{
                  this.viewCtrl.dismiss();
                  
                }
              }
            });

          },(error) => {
            let alert = this.alertCtrl.create({
              title:'error',
              message: error,
              buttons: [{
                text: 'Ok',
                handler: () => {
      
                }
              }]
            })
            alert.present();

          });

          }
        })




        let showAlert = this.alertCtrl.create({
          title: 'فيسبوك',
          // subTitle: 'تم إنشاء الحساب بنجاح, شكراً لإستخدامك دنتجرام',
          message: 'User name :' + user.first_name + ' ' + user.last_name +'  Email: ' + user.email + 
           '  Pic: ' + user.picture + '  Location: ' + user.locale +
            '  Birthday: ' + user.birthday +
              '  Gender: ' + user.gender +
                '  Time Zone: ' + user.timezone +
                  '  Token: ' + response.authResponse.accessToken,

          buttons: [{
              text: 'تم',
              handler: () => {
                //this.nav.setRoot(HomePage);
                // window.location.reload();
              }
            }
          ]
        })
        // showAlert.present();




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

doLinLogin() {

}

facebookLogin(email,password){

}
facebookRegister(data){

}


skipRegister(){


  this.storage.set('pass_reqister', 'true');

  if (this.dir === 'rtl') {
    let showAlert = this.alertCtrl.create({
      title: 'دنتجرام',
      subTitle: 'الدخول بدون تسجيل',
      message: 'يمكنك التسجيل لاحقاً عن طريق الدخول للقائمة الجانبية واختيار تسجيل الدخول',
      buttons: [{
          text: 'تم',
          handler: () => {
            this.nav.setRoot(HomePage);
            // window.location.reload();
          }
        }
      ]
    })
    showAlert.present();
  }else if (this.dir === 'ltr'){
    let showAlert = this.alertCtrl.create({
      title: 'Dentgram',
      subTitle: 'Using Application Without Login',
      message: 'You can register or login inside the application by select login from the side menu',
      buttons: [{
          text: 'Ok',
          handler: () => {
            this.nav.setRoot(HomePage);
            // window.location.reload();
          }
        }
      ]
    })
    showAlert.present();
  }

  
}


checkNetwork() {
  // return new Promise((resolve,reject) =>{
  
  //   if(Network.type!='none'){
  //     resolve(true)
  //   } else{
  //     reject(false);
  //     this.provider.toastMessage('Please check your connection ...')
  //   }
  //     });
}

}
