import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, ActionSheetController, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ItemDetailsPage } from "../../pages/item-details/item-details";

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-categorys',
  templateUrl: 'categorys.html',
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
export class CategorysPage {
  catName: any;
  catId: any;
  isGrid: boolean = true;
  bestrecommended: any[];
  cartBadgeState: string = 'idle';
  mobwidth: any;
  mobheight: any;
  direc: any;
  direcR: any;
  isDataAvilable = true;
  current_page: number;
  can_load_more: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
     public viewCtrl: ViewController, 
       private http: Http,
         public mainFunc: MainFunctionsProvider,
          public actionSheetCtrl: ActionSheetController,
            private changeDetector: ChangeDetectorRef,
              private platform: Platform,
              public translate: TranslateService) {


                  let cname = this.navParams.get('name');
                  let cid = this.navParams.get('id');

                  this.catName = cname;
                  this.catId = cid;


                  let localBestRecommendeddata = this.http.get('assets/bestrecommended.json').map(res => res.json().items);
                  localBestRecommendeddata.subscribe(data => {
                    // this.bestrecommended = data;
                  });



                  //////////////////////////////////////////////

                  // this.mainFunc.showLoading('',true);

                  let url = this.mainFunc.url + '/api/structure/products/category/' + this.catId;
                  let localHomeMenudata2 = this.http.get(url).map(res => res.json());
                  localHomeMenudata2.subscribe(dataall => {
                    let data = dataall.products;
                    let name = "";
                    let data2: any[];
                    data2 = [];
                    if (data.length > 0){
                      this.isDataAvilable = true;
                      this.current_page = dataall.pages.current_page;
                      this.can_load_more = dataall.pages.can_load_more;

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
                      // if (e.useable === "0"){
                      //   e.useable = false;
                      // }else if(e.useable === "1"){
                      //   e.useable = true;
                      // }
                      
                      let item = {
                        "id": e.id,
                        // "name_en": e.name_en,
                        // "name_ar": e.name_ar,
                        "name": name,
                        "image": eicon
                        // ,
                        // "back_back": "",
                        // "parent_id": e.parent_id,
                        // "useable": e.useable
                      }
                      data2.push(item);
                    }
                    this.bestrecommended = data2;
                    // data2 = data;

                  });


                  // this.mainFunc.dismissLoading();

  } 

  loadNextPage() {

    let url = this.mainFunc.url + '/api/structure/products/category/' + this.catId + '?page=' + (this.current_page + 1);
    let localHomeMenudata2 = this.http.get(url).map(res => res.json());
    localHomeMenudata2.subscribe(dataall => {
      let data = dataall.products;
      let name = "";
      let data2: any[];
      data2 = [];
      if (data.length > 0){
        this.isDataAvilable = true;
        this.current_page = dataall.pages.current_page;
        this.can_load_more = dataall.pages.can_load_more;
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
          "image": eicon
        }
        this.bestrecommended.push(item);
      }
      
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CategorysPage');
    this.viewCtrl.setBackButtonText('');
    this.platform.ready().then((readySource) => {
      this.mobwidth = this.platform.width();
      this.mobheight = this.platform.height();
    });
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }
  }

  showSortingActionSheet(){
    let ac_Title = "Sort By";
    let act_sub1 = "Most Matching";
    let act_sub2 = "Best Seller";
    let act_sub3 = "Top Rated";
    let act_sub4 = "Price Up";
    let act_sub5 = "Price Down";
    let act_sub6 = "Cancle";

    if (this.platform.dir() === "rtl") {
      ac_Title = "ترتيب الأصناف حسب";
      act_sub1 = "الأكثر تطابقا";
      act_sub2 = "الأكثر مبيعاً";
      act_sub3 = "الأعلى تقييما";
      act_sub4 = "الأقل سعرا";
      act_sub5 = "الأعلى سعرا";
      act_sub6 = "إلغاء";
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: ac_Title,
      buttons: [
        {

          text: act_sub1,
          // icon: 'md-albums',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: act_sub2,
          // icon: 'md-cart',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: act_sub3,
          // icon: 'md-star',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: act_sub4,
          // icon: 'md-arrow-dropup',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: act_sub5,
          // icon: 'md-arrow-dropdown',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: act_sub6,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ],
      enableBackdropDismiss: true
    });
    
    actionSheet.present();
  }

  changeViewMode() {
    this.isGrid = !this.isGrid;
  }


  addToCart(id,item){
    this.mainFunc.cartItems.push(id);
    this.mainFunc.showToast('تم إضافة المنتج لعربة التسوق');
    item.addButtonState = 'adding';
    this.cartBadgeState = 'adding';
    this.changeDetector.detectChanges();
    this.mainFunc.checkItemInCart(id);
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
    // this.navCtrl.push(ItemDetailsPage);

    this.navCtrl.push(ItemDetailsPage, {
      'id' : id
    });
  }
  
  doInfinite(infiniteScroll) {
    if(this.can_load_more){
      setTimeout(() => {
        this.loadNextPage();
        infiniteScroll.complete();
      }, 1000)
    }else{
      infiniteScroll.complete();
    }
  }

}
