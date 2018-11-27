import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, LoadingController, ToastController, ActionSheetController, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { trigger, state, style, animate, transition, group, keyframes } from '@angular/animations';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
// import { ItemDetailsStorePage } from "../../pages/item-details-store/item-details-store";

import { UsedAdsDetailsPage } from "../../pages/used-ads-details/used-ads-details";
import { TranslateService } from '@ngx-translate/core';
import { AccountfPage } from "../../pages/accountf/accountf";

import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-used-myads',
  templateUrl: 'used-myads.html',
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

export class UsedMyadsPage {

  catName: any;
  catId: any;
  isGrid: boolean = true;
  bestrecommended: any[];
  cartBadgeState: string = 'idle';
  mobwidth: any;
  mobheight: any;
  direc: any;
  direcR: any;
  city_id: any;

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
              public storage: Storage,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              public translate: TranslateService,
              public loading: LoadingController) {

         

          //////////////////////////////////////////////
                this.bestrecommended = [];
                this.loadData();

          

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsedAdsListPage');
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


  doToast(msg)
  {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  loadData(){

  this.storage.get('token').then( token => {
    if(token){
      let url = this.mainFunc.url + '/api/ads?token=' + token;
        let localHomeMenudata2 = this.http.get(url).map(res => res.json());
        localHomeMenudata2.subscribe(dataall => {
          let data = [];
          data = dataall.data;
          let name = "";
          let data2: any[];
          data2 = [];
          if (data.length > 0){
            this.isDataAvilable = true;
            this.current_page = dataall.current_page;
            this.can_load_more = dataall.next_page_url != null;
          }else{
            this.isDataAvilable = false;
          }
          for (let index = 0; index < data.length; index++) {
            const e = data[index];
            let eicon = data[index].image.thumb;
            if (eicon === null){
              eicon = 'assets/img/catalogue/img-1.png';
            }
            // if (this.platform.dir() === "rtl") {
            //   name = e.name_ar;
            // } else {
            //   name = e.name_en;
            // }
            

            let item = {
              "id": e.id,
              "name": e.name,
              "image": eicon,
              "price": e.price,
              // "by" : e.by,
              "approved": e.approved,
              "message": e.message,
              "currency" : e.currency
              // "city_ar" : e.city.name_ar,
              // "city_en" : e.city.name_en
            }
            data2.push(item);
          }
          this.bestrecommended = data2;
          
        });
      }else{

      }
    });
  }

  loadNextPage() {

    this.storage.get('token').then( token => {
      if(token){
        let url = this.mainFunc.url + '/api/ads?token=' + token + '?page=' + (this.current_page + 1);;
          let localHomeMenudata2 = this.http.get(url).map(res => res.json());
          localHomeMenudata2.subscribe(dataall => {
            let data = [];
            data = dataall.data;
            let name = "";
            let data2: any[];
            data2 = [];
            if (data.length > 0){
              this.isDataAvilable = true;
              this.current_page = dataall.current_page;
              this.can_load_more = dataall.next_page_url != null;
            }else{
              this.isDataAvilable = false;
            }
            for (let index = 0; index < data.length; index++) {
              const e = data[index];
              let eicon = data[index].image.thumb;
              if (eicon === null){
                eicon = 'assets/img/catalogue/img-1.png';
              }
              // if (this.platform.dir() === "rtl") {
              //   name = e.name_ar;
              // } else {
              //   name = e.name_en;
              // }
              
  
              let item = {
                "id": e.id,
                "name": e.name,
                "image": eicon,
                "price": e.price,
                // "by" : e.by,
                "currency" : e.currency
                // "city_ar" : e.city.name_ar,
                // "city_en" : e.city.name_en
              }
              data2.push(item);
            }
            this.bestrecommended = data2;
            
          });
        }else{
  
        }
      });
  }

  deleteAdConfirm(ad_id, index){
    let alert = this.alertCtrl.create({
      title: 'Deleting Ad',
      subTitle: 'Are you want to delete ad?',
      buttons: [{
              text: 'Confirm',
              handler: () => {
                this.deleteAd(ad_id,index);
              }
            },{
              text: 'Cacnel'
            }
          ]
    })
    alert.present();
  }

  deleteAd(ad_id, index)
  {
    
    this.storage.get('token').then( token => {
      let url = this.mainFunc.url + '/api/ads/delete/'+ad_id+'?token='+token;
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      let options = new RequestOptions({headers: headers});
      let load = this.loading.create({
        content: 'Deleting Ad...'
      });
      load.present();
      this.http.post(url,'',options).map(
        res => res.json())
        .subscribe(data => { 
          load.dismiss();
          if(data.success == true){
            this.bestrecommended.splice(index, 1);
            this.doToast('Add deleted successfully');
          } else{
            this.doToast('Failed to delete Ad!');
          }
        });
    });
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
    // this.mainFunc.cartItems.push(id);
    this.mainFunc.addToCart(id);
    // this.mainFunc.showToast('تم إضافة المنتج لعربة التسوق');
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
    this.mainFunc.deleteFromFav(item);
  }
  
  deleteFromCart(id){
    this.mainFunc.deleteFromCart(id);
    // this.loadData();
  }

  openItemDetails(id) {
    this.navCtrl.push(UsedAdsDetailsPage, {
      'id' : id
    });
  }
  
  openCartPage2() {
    this.navCtrl.push(AccountfPage, {
      'select' : '1'
    });   
  }

  dismissview(){
    this.navCtrl.parent.viewCtrl.dismiss();
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

