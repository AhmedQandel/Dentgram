import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, ViewController, NavParams, Slides, Platform, Events } from 'ionic-angular';

import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { trigger, state, style, animate, transition, group, keyframes } from '@angular/animations';
import { AccountfPage } from "../../pages/accountf/accountf";
import { TranslateService } from '@ngx-translate/core';

import { LibraryDetailsPage } from "../../pages/library-details/library-details";
import { UsedMsgPage } from "../../pages/used-msg/used-msg";

import { AuthLoginPage } from '../../pages/auth-login/auth-login';

import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-used-ads-details',
  templateUrl: 'used-ads-details.html',
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
export class UsedAdsDetailsPage {
  // itemTitle: any;
  // itemPrice = 1890;
  // itemRate = 4.6;
  // itemId = '1';
  ifIsLogged: boolean = false;
  id: any;
  name: any;
  description: any;
  image_full: any;
  image_thumb: any;
  model: any;
  length: any;
  width: any;
  height: any;
  weight: any;
  category_id: any;
  product_id: any;
  phone: any;
  category_name: any;
  category_display_name: any;
  category_icon_full: any;
  category_icon_thumb: any;
  man_id: any;
  man_name: any;
  man_icon_full: any;
  man_icon_thumb: any;
  attributes: any;
  slides_list: any;
  spes: any;
  toTraget: any;
  flag = "used_item";
  discount: any;
  price: any;
  currency: any;
  price_discount: any;
  isFavourite=false;

  cartBadgeState: string = 'idle';
  can_order: boolean = false;

  isDataAvilable = false;

  can_call = false;
  can_message = false;

  authRequested:boolean = false;

  bestrecommended: any[];

  constructor(public navCtrl: NavController,
       public navParams: NavParams,
        public viewCtrl: ViewController, 
          private http: Http,
            public mainFunc: MainFunctionsProvider,
            public translate: TranslateService,
            public platform: Platform,
            public storage: Storage,
            private socialSharing: SocialSharing,
            private changeDetector: ChangeDetectorRef,
            private photoViewer: PhotoViewer) {
          // this.itemTitle = "عبارة عن جهاز يتم فيه توليد قوى الطرد المركزي عن طريق الدوران حيث تتجه الجزيئات الأكثر ثقالة إلى الخارج بعيدا عن محور الدوران";

          // this.mainFunc.showLoading('',true);

          this.id = this.navParams.get('id');
          this.bestrecommended = [];

          this.isLogged();
          // let localBestRecommendeddata = this.http.get('assets/bestrecommended.json').map(res => res.json().items);
          // localBestRecommendeddata.subscribe(data => {
          //   this.bestrecommended = data;
          // });

          // this.mainFunc.dismissLoading();
          
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsedAdsDetailsPage');
    this.viewCtrl.setBackButtonText('');

    this.storage.get('token').then( token => {

    let url = this.mainFunc.url + '/api/structure/used-items/view/' + this.id;
      let localHomeMenudata2 = this.http.get(url).map(res => res.json());
      localHomeMenudata2.subscribe(data => {
        this.attributes = [];
        this.slides_list = [];
        this.spes = [];

        if (data.id != null && data.id != ''){

          this.isDataAvilable = true; 
          this.product_id = data.id;
          this.category_id = data.category.id;
          this.category_icon_full = data.category.icon.full;
          this.category_icon_thumb = data.category.icon.thumb;

          this.name = data.name;

          this.slides_list = data.photos;
          this.price = data.price;
          this.currency = data.currency;
          this.description = data.description;
          
          this.can_call = data.can_call;
          this.phone = data.phone;
          this.can_message = data.can_message;

          if (this.platform.dir() === "rtl") {
            this.name = data.name;
            // this.description = data.description_ar;
            this.category_name = data.category.name_ar;
            this.category_display_name = data.category.display_name_ar;
            // this.man_name = data.manufacturer.name_ar;
            // this.bestrecommended_data(this.name);
          } else {
            this.name = data.name;
            // this.description = data.description_en;
            this.category_name = data.category.name_en;
            this.category_display_name = data.category.display_name_en;
            // this.man_name = data.manufacturer.name_en;          
            // this.bestrecommended_data(this.name);
          }

        }else{
          this.isDataAvilable = false;
        }

        
      });

      let urlFav = this.mainFunc.url + '/api/is_favorite?flag=used_item&item_id='+this.id+'&token='+token;
      let localFav = this.http.get(urlFav).map(res => res.json());
      localFav.subscribe(data => {
   console.log("sssss",data);
   
    
          this.isFavourite=data.is_favorite;
      
          console.log("sssss", this.isFavourite);
        
      });

    });

  }

  Share(name: any , image:any) {
    console.log(name);
    console.log(image);
    
    this.socialSharing.share(name, null, image, null)
      .then(
      () => {
        console.log("Success");
      }
      )
      .catch(
      (error) => {
        // const toto = this.toast.create({
        //   message: error.message,
        // });
        // toto.present();
      }
      );
  }
  addToFav(product_id,flag){
    this.mainFunc.addToFav(product_id,flag);
    if (this.isFavourite) {
      this.isFavourite=false;
    }else{
      this.isFavourite=true;
    }
  }

  showData(type){
    switch (type) {

      case "phone":
        document.getElementById('phone').click();
        break;
      
      default:
        if(this.ifIsLogged){
          this.navCtrl.push(UsedMsgPage, {id: type});
        } else {
          this.authRequested = true;
          let id = type;
          this.toTraget = id;
          this.navCtrl.push(AuthLoginPage, {shouldAuth: true});
        }
        break;
    }
  }
  ionViewWillEnter() {
    if(this.authRequested === true){
      this.authIsLogged(this.toTraget);
      this.authRequested = false;
    }
  }

  isLogged()
  {
    this.storage.get('token').then(data => {
      if (data !== null) {
        this.ifIsLogged = true;
        return true;
      }else{
        this.ifIsLogged = false;
        return false;
      }
    });
  }

  authIsLogged(id)
  {
    this.storage.get('token').then(data => {
      if (data !== null) {
        this.ifIsLogged = true;
        this.navCtrl.push(UsedMsgPage, {id: id});
        return true;
      }else{
        this.ifIsLogged = false;
        return false;
      }
    });
  }

  openImage(url){
    url = encodeURI(url);
    this.photoViewer.show(url);
  }

  openCartPage2() {
    this.navCtrl.push(AccountfPage, {
      'select' : '1'
    });   
  }

}

