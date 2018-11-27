import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, Slides, Platform, Events } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { trigger, state, style, animate, transition, group, keyframes } from '@angular/animations';
import { ItemDetailsPage } from "../../pages/item-details/item-details";

import { TranslateService } from '@ngx-translate/core';

import { AccountfPage } from "../../pages/accountf/accountf";

import { BuySellMainPage } from "../../pages/buy-sell-main/buy-sell-main";
import { CatalogueMainPage } from '../../pages/catalogue-main/catalogue-main';
import { CoursesCategoriesPage } from "../../pages/courses-categories/courses-categories";
import { BooksCategoriesPage } from "../../pages/books-categories/books-categories";
import { CoursesListPage } from "../../pages/courses-list/courses-list";

import { ConnectivityServiceProvider } from "../../providers/connectivity-service/connectivity-service";

import { CalenderPage } from "../calender/calender";
import { MatchMakingListPage } from "../match-making-list/match-making-list";

import { AuthProvider } from "../../providers/auth/auth";

import { SearchPage } from "../../pages/search/search";

import { UsedPage } from "../used/used";

import { FCM } from '@ionic-native/fcm';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('cartBadge', [
        state('idle', style({
            opacity: '1',
            transform: 'scale(1)'
        })),
        state('adding', style({
            opacity: '0.5',
            transform: 'scale(1.4)'
        })),
        transition('idle <=> adding', animate('300ms linear')),
        transition('void => *', [
            style({transform: 'translateX(200%)'}),
            animate('500ms ease-in-out')
        ])
    ]),
    trigger('addButton', [
        state('idle', style({
            // opacity: '1'
        })),
        state('adding', style({
            // opacity: '0.3',
            //fontWeight: 'bold'
        })),
        transition('idle <=> adding', animate('500ms linear')),
        transition('void => *', [
            // style({transform: 'translateX(200%)'}),
            // animate('300ms ease-in-out')
        ])
    ])
,
    trigger('flyInOut', [
      state('cartBadge', style({transform: 'translateX(0)'})),
      transition('void => *', [
        animate(500, keyframes([
          style({opacity: 1, transform: 'translateX(100%)', offset: 0.1}),
          style({opacity: 1, transform: 'translateX(-15px)', offset: 0.3}),
          style({opacity: 1, transform: 'translateX(0)', offset: 0.5}),
          style({opacity: 1, transform: 'translateX(-100%)', offset: 0.7}),
          style({opacity: 1, transform: 'translateX(15px)',  offset: 0.9}),
          style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
        ]))
      ])
    ])
]
})
export class HomePage {
  slider_Data_Store: any[];
  bestOvers: any[];
  bestSell: any[];
  bestrecommended: any[];
  searchResults: any[];
  number_of_sliders: any;
  subscription;
  isSearchToggle: boolean = false;
  cartBadgeState: string = 'idle';
  direc: any;
  direcR: any;
  storelist: any[];
  homemenu: any[];
  select: string;
  pageClass: any;
  isPassReqister = false;
  secretid = "";
  pagetitle ="";
  isAppPrefLoaded: boolean = false;
  pages: any[];
  secretids: any[];
  thumb: string;

  OnLoadButton: boolean = true;

  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController, 
    private http: Http,
      public mainFunc: MainFunctionsProvider, 
        private changeDetector: ChangeDetectorRef,
          public platform: Platform,
            public translate: TranslateService,
              public events: Events,
                public auth: AuthProvider,
                  public storage: Storage,
                    private fcm: FCM,
                    private alertCtrl: AlertController,
                      public chkconn: ConnectivityServiceProvider) {

                this.storelist = [];
                this.homemenu = [];

                this.pages = [
                  'false',
                  CatalogueMainPage,
                  'false',
                  CoursesListPage,
                  CoursesListPage,
                  CoursesListPage,
                  MatchMakingListPage
                ];

                this.secretids = [
                  'false',
                  'for_catalogue',
                  'false',
                  'course',
                  'library',
                  'event',
                  'career'
                ];
                // this.chkconn.disconnectSubscription;
                // this.chkconn.connectSubscription;
                
                events.subscribe('application:isLogged', (token) => {
                  
                  this.storage.get('thumb').then((val) => {
                   
                    this.thumb = val;
                  });
                });
                
                this.storage.get('pass_reqister').then( data => {
                  if(data){
                   this.isPassReqister = true;
                  }
                });

                this.events.publish('application:language','');

                this.storage.get('token').then( data => {
                  if(data){
                    this.events.publish('application:isLogged',true);
                    this.mainFunc.refreshToken();
                  }else{
                    this.events.publish('application:isLogged',false);
                  } 
                });
      
  }

ionViewDidEnter(){
  if (this.platform.dir() === "rtl") {
    this.direc = "ltr";
    this.direcR = "rtl"
  } else {
    this.direc = "rtl";
    this.direcR = "ltr";  
  }
  
}  
  ionViewDidLoad(){
    this.getAppPref();

    // this.direc = !this.platform.dir();
      // this.platform.dir.toString
    let localdata_slider = this.http.get('assets/slider.json').map(res => res.json().items);
    localdata_slider.subscribe(data => {
      this.slider_Data_Store = data;
      this.number_of_sliders = data.length;
    });

    let localBestOverdata = this.http.get('assets/bestover.json').map(res => res.json().items);
    localBestOverdata.subscribe(data => {
      this.bestOvers = data;
    });

    let localBestSelldata = this.http.get('assets/bestsell.json').map(res => res.json().items);
    localBestSelldata.subscribe(data => {
      this.bestSell = data;
    });

    let localBestRecommendeddata = this.http.get('assets/bestrecommended.json').map(res => res.json().items);
    localBestRecommendeddata.subscribe(data => {
      this.bestrecommended = data;
    });
    

    // Load Stores Data
    let localItemsdata = this.http.get('assets/beststores.json').map(res => res.json().items);
    localItemsdata.subscribe(data => {
      this.storelist = data;

    });

    // Load Main Home Page Menu Data
    let localHomeMenudata = this.http.get('assets/mainmenuhome.json').map(res => res.json().items);
    localHomeMenudata.subscribe(data => {
      this.homemenu = data;

    });

    // Home Page Slider Timer Controller
    this.subscription = Observable.interval(3000).subscribe(x=> {
      
      try {
        this.slides.slideNext(1000);
      } catch (error) {
        
      }
    });


    this.platform.ready().then(() => {
      if (this.platform.is('cordova')){

          console.log('platform', this.platform);
                    
          this.fcm.subscribeToTopic('dentist_general');

          this.storage.get('country_id').then( data => {
            if(data){
              let chann = 'dentist_' + data;
              this.fcm.subscribeToTopic(chann);
            }
          });

          this.fcm.getToken().then(token => {

            if(this.platform.is('ios')){
              this.updateFCM(token,'ios');
            }else if(this.platform.is('android')){
              this.updateFCM(token,'android');
            }
            
          });

          this.fcm.onNotification().subscribe(data => {

            if(data.wasTapped){
              console.log("Received in background");
            } else {
              console.log("Received in foreground");
            };
          });

          this.fcm.onTokenRefresh().subscribe(token => {
            if(this.platform.is('ios')){
              this.updateFCM(token,'ios');
            }else if(this.platform.is('android')){
              this.updateFCM(token,'android');
            }
          });
     
      };
    });


  }

  updateFCM(fcmToken, platF){
    this.storage.get('token').then( data => {
      if(data){
       
        let token = data;
        
        let body_application = {
          "fcm_token" : fcmToken,
          "device" : platF
        }

        let header = this.mainFunc.header;
        let Url_request = this.mainFunc.url + "/api/auth/fcm?token=" + token;

        this.http.post(Url_request, JSON.stringify(body_application), {headers: header})
        .map(res => res.json())
        .subscribe(data => {
          console.log('FCM Registerd Successfuly');
        },(error) => {
        console.log('The Error', error);
      });

    }
  });
}
  showSearchBar() {
    this.navCtrl.push(SearchPage, {
      'type' : 'item'
    });
  }

  addToCart(id,item){
    this.mainFunc.addToCart(id);
    // this.mainFunc.cartItems.push(id);
    // this.mainFunc.showToast('تم إضافة المنتج لعربة التسوق');
    item.addButtonState = 'adding';
    this.cartBadgeState = 'adding';
    this.changeDetector.detectChanges();
    // this.mainFunc.checkItemInCart(id);
  }
  addToCartFinished(item){
    this.cartBadgeState = 'idle';
    item.addButtonState = 'idle';
  }
  addToFav(item){
    // this.mainFunc.addToFav(item);
  }
  removeFromFav(item){

  }
  
  openItemDetails(id) {
    this.navCtrl.push(ItemDetailsPage);
  }
  searchBar(word) {
    
  }

  openCartPage() {
    this.navCtrl.push(AccountfPage, {
      'select' : '1'
    });   
  }

  openCartPage2() {
    this.navCtrl.push(AccountfPage, {
      'select' : '1'
    });   
  }

  showPopup(id,name_ar,name_en) {
    if(id == 1){
      let alert = this.alertCtrl.create({
        title: 'Catalogue',
        message: 'Welcome to our digital dental directory. We work hard to put more than 2000 manufactures, 5000 distributors and 100,000 different products all together. In case you do not find what you are looking for, or you have any suggestions, please share it with us.' ,
        buttons: [
          {
            text: 'Okay',
            role: 'cancel',
            handler: () => {
              this.click_Open_catalogue_id(id,name_ar,name_en);
            }
          },
        ]
      });
      alert.present();
    }
    // else if (id == 2) {
    //   let alert = this.alertCtrl.create({
    //     title: 'Buy & Sell',
    //     message: 'Welcome to our digital dental directory. We work hard to put more than 2000 manufactures, 5000 distributors and 100,000 different products all together. In case you do not find what you are looking for, or you have any suggestions, please share it with us.' ,
    //     buttons: [
    //       {
    //         text: 'Okay',
    //         role: 'cancel',
    //         handler: () => {
    //           this.click_Open_catalogue_id(id,name_ar,name_en);
    //         }
    //       },
    //     ]
    //   });
    //   alert.present(); 
    // }
    else{
      this.click_Open_catalogue_id(id,name_ar,name_en);
    }
    
  }

  click_Open_catalogue_id(id,name_ar,name_en){
   
    if(this.pages[id] != 'false'){
      let name = '';
      if (this.platform.dir() === "rtl") {
        name = name_ar;
      } else {
        name = name_en;
      }
      this.navCtrl.push(this.pages[id], {
        'id' : 0,
        'name' : name,
        'secretid' : this.secretids[id]
      });
    } else{
      this.click_Open_Page(id);
    }

  }

  click_Open_Page(id){ 
      console.log('Id Clicked',  id);
      this.select = '';

      switch (id) {
        case 1:
          console.log('Tap Clicked is : Catalogue');
          this.pageClass = CatalogueMainPage;
          this.secretid = "for_catalogue";
          this.pagetitle ="MENU_CATALOGUE";
        break;

        case 2:
          console.log('Tap Clicked is : Buy & Sell');
          if(this.mainFunc.manuno8){
            this.pageClass = UsedPage;
            this.secretid = "";
          }else{
            this.pageClass = BuySellMainPage;
            this.secretid = "item";
          }
        break;
        
        case 3:
          console.log('Tap Clicked is : Courses');
          this.pageClass = CoursesCategoriesPage;
          this.secretid = "course";
          this.pagetitle ="MENU_COURSES";
        break;
        
        case 4:
          console.log('Tap Clicked is : Liberary');
          this.pageClass = CoursesCategoriesPage;
          this.secretid = "library";
          this.pagetitle ="MENU_LIBRARY";
        break;
        
        case 5:
          console.log('Tap Clicked is : Calender');
          this.pageClass = CoursesCategoriesPage;
          this.secretid = "event";
          this.pagetitle ="MENU_CALENDAR";

        break;
        
        case 6:
          console.log('Tap Clicked is : Match');
          this.pageClass = MatchMakingListPage;
          this.secretid = "career";
        break;
        
      }
      
      this.navCtrl.push(this.pageClass, {
        'select' : this.select,
        'title': this.pagetitle,
        'secretid': this.secretid
      });

  }

  CheckOnLoadButton() {
    if(
      this.mainFunc.manuno1 == false &&
      this.mainFunc.manuno2 == false &&
      this.mainFunc.manuno3 == false &&
      this.mainFunc.manuno4 == false &&
      this.mainFunc.manuno5 == false &&
      this.mainFunc.manuno6 == false
      ){
      this.OnLoadButton = true;
    }else{
      this.OnLoadButton = false;
    }
  }

  getAppPref(){

    this.storage.get('appPrefLoaded').then( data => {
      if(data){
       this.isAppPrefLoaded = true;
      }else{
        let urlx = this.mainFunc.url + '/api/app-preferences';
        let localHomeMenudata2;
        localHomeMenudata2 = this.http.get(urlx).map(res => res.json());  
        localHomeMenudata2.subscribe(data => {
          let dataarr: any = data;

          // for (let index = 0; index < dataarr.length; index++) {
          //   const element = dataarr[index];
          //   console.log(element);
          // }
          
          let ss1 = +data[0].s1;
          let ss2 = +data[0].s2;
          let ss3 = +data[0].s3;
          let ss4 = +data[0].s4;
          let ss5 = +data[0].s5;
          let ss6 = +data[0].s6;
          let ss7 = +data[0].buy_sell_behavior;
          
          if( ss1 == 1){
            this.mainFunc.manuno1 = true;  
          }
          if( ss2 == 1){
            this.mainFunc.manuno2 = true;  
          }
          if( ss3 == 1){
            this.mainFunc.manuno3 = true;  
          }
          if( ss4 == 1){
            this.mainFunc.manuno4 = true;  
          }
          if( ss5 == 1){
            this.mainFunc.manuno5 = true;  
          }
          if( ss6 == 1){
            this.mainFunc.manuno6 = true;  
          }
          if( ss7 == 1){
            // Default Store View
            this.mainFunc.manuno7 = true;  
          }
          if( ss7 == 2){
            // Used Items Only
            this.mainFunc.manuno8 = true;  
          }
          if( ss7 == 3){
            // New Stores Only
            this.mainFunc.manuno9 = true;  
          }

          this.CheckOnLoadButton();

          // this.mainFunc.manuno1 = ss1;
          // this.mainFunc.manuno2 = data[0].s2;
          // this.mainFunc.manuno3 = data[0].s3;
          // this.mainFunc.manuno4 = data[0].s4;
          // this.mainFunc.manuno5 = data[0].s5;
          // this.mainFunc.manuno6 = data[0].s6;
          // this.mainFunc.manuno7 = data[0].buy_sell_behavior;

        });

      }

    });

  }

  
}
