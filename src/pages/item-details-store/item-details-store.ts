import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, ViewController, NavParams, Platform } from 'ionic-angular';

import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { AccountfPage } from "../../pages/accountf/accountf";
import { TranslateService } from '@ngx-translate/core';

// import { LibraryDetailsPage } from "../../pages/library-details/library-details";


@Component({
  selector: 'page-item-details-store',
  templateUrl: 'item-details-store.html',
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
export class ItemDetailsStorePage {
  // itemTitle: any;
  // itemPrice = 1890;
  // itemRate = 4.6;
  // itemId = '1';

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

  discount: any;
  price: any;
  currency: any;
  price_discount: any;

  cartBadgeState: string = 'idle';
  can_order: boolean = false;

  isDataAvilable = false;


  bestrecommended: any[];

  constructor(public navCtrl: NavController,
       public navParams: NavParams,
        public viewCtrl: ViewController, 
          private http: Http,
            public mainFunc: MainFunctionsProvider,
            public translate: TranslateService,
            public platform: Platform,
            private changeDetector: ChangeDetectorRef,
            private photoViewer: PhotoViewer) {
          // this.itemTitle = "عبارة عن جهاز يتم فيه توليد قوى الطرد المركزي عن طريق الدوران حيث تتجه الجزيئات الأكثر ثقالة إلى الخارج بعيدا عن محور الدوران";

          // this.mainFunc.showLoading('',true);

          this.id = this.navParams.get('id');
          this.bestrecommended = [];
          // let localBestRecommendeddata = this.http.get('assets/bestrecommended.json').map(res => res.json().items);
          // localBestRecommendeddata.subscribe(data => {
          //   this.bestrecommended = data;
          // });

          // this.mainFunc.dismissLoading();
          
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailsPage');
    this.viewCtrl.setBackButtonText('');


    let url = this.mainFunc.url + '/api/structure/items/view/' + this.id;
      let localHomeMenudata2 = this.http.get(url).map(res => res.json());
      localHomeMenudata2.subscribe(data => {
        this.attributes = [];
        this.slides_list = [];
        this.spes = [];

        if (data.id != null && data.id != ''){

          this.isDataAvilable = true;
          
          this.image_full = data.image.full;
          this.image_thumb = data.image.thumb;
          this.model = data.model;
          this.length = data.length;
          this.width = data.width;
          this.height = data.height;
          this.weight = data.weight;
          this.can_order = data.can_order;
          this.category_id = data.category.id;
          this.category_icon_full = data.category.icon.full;
          this.category_icon_thumb = data.category.icon.thumb;
          this.man_id = data.manufacturer.id;
          this.man_icon_full = data.manufacturer.icon.full;
          this.man_icon_thumb = data.manufacturer.icon.thumb;
          this.attributes = data.attribute_groups;
          this.slides_list = data.gallery;
          this.discount = data.discount;
          this.price = data.unit_price;
          this.currency = data.currency;

          console.log('Price', this.price + ' ' + this.currency);
          
          // this.price_discount = data.;

          // let item = {
          //   "name": ,
          //   "value": 
          // }
          // this.spes.push(item);


          if (this.platform.dir() === "rtl") {
            this.name = data.name_ar;
            this.description = data.description_ar;
            this.category_name = data.category.name_ar;
            this.category_display_name = data.category.display_name_ar;
            this.man_name = data.manufacturer.name_ar;
            this.bestrecommended_data(this.name);
          } else {
            this.name = data.name_en;
            this.description = data.description_en;
            this.category_name = data.category.name_en;
            this.category_display_name = data.category.display_name_en;
            this.man_name = data.manufacturer.name_en;          
            this.bestrecommended_data(this.name);
          }

        }else{
          this.isDataAvilable = false;
        }

        
      });
  }

  bestrecommended_data(name){
    let url = this.mainFunc.url + '/api/search?query=' + name + '&type=item&limit=5&filters=&result=1';
    let localHomeMenudata2 = this.http.get(url).map(res => res.json());
    localHomeMenudata2.subscribe(dataall => {
      let data = [];
      data = dataall.data;
      let name = "";
      let data2: any[];
      data2 = [];
      if (data.length > 0){
        this.isDataAvilable = true;
      }else{
        this.isDataAvilable = false;
      }
      for (let index = 0; index < data.length; index++) {
        const e = data[index];
        let eicon = data[index].image.thumb;
        if (eicon === null){
          eicon = 'assets/img/catalogue/img-1.png';
        }
        if (this.platform.dir() === "rtl") {
          name = e.name_ar;
        } else {
          name = e.name_en;
        }

        
        let item = {
          "id": e.id,
          "name": name,
          "image": eicon,
          "price": e.original_price,
          "price_discount": e.unit_price,
          "can_order" : e.can_order,
          "currency" : e.currency
        }
        data2.push(item);
      }
      this.bestrecommended = data2;

    });
  }
  addToCart(id,item){
    // this.mainFunc.cartItems.push(id);
    this.mainFunc.addToCart(id);
    // this.mainFunc.showToast('تم إضافة المنتج لعربة التسوق');
    // item.addButtonState = 'adding';
    this.cartBadgeState = 'adding';
    this.changeDetector.detectChanges();
    this.mainFunc.checkItemInCart(id);
  }
  addToCartFinished(item){
    this.cartBadgeState = 'idle';
    // item.addButtonState = 'idle';
  }
  addToFav(item){
    // this.mainFunc.addToFav(item);
  }
  removeFromFav(item){
    this.mainFunc.deleteFromFav(item);
  }
  
  deleteFromCart(id){
    this.mainFunc.deleteFromCart(id);
    // this.loadData();
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

  openItemStoreDetails (id){
    this.navCtrl.push(ItemDetailsStorePage, {
      'id' : id
    });
  }

}

