import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

// import { ItemDetailsPage } from "../../pages/item-details/item-details";


@Component({
  selector: 'page-acc-fav',
  templateUrl: 'acc-fav.html',
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
export class AccFavPage {

  direc: any;
  direcR: any;
  fav: any[];
  itemsList: any[];
  isGrid = false;
  cartBadgeState: string = 'idle';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController,
      public translate: TranslateService,
      public platform: Platform,
      public storage: Storage, 
      private http: Http,
      private changeDetector: ChangeDetectorRef) {

      this.viewCtrl.setBackButtonText('');

      this.storage.get('fav').then((val) =>{
        let arr = val;
        console.log('Storage Fav', arr);
      });
      this.loadData();      
  }

  ionViewDidLoad() {
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }

    
  }

  dismissview(){
    this.navCtrl.parent.viewCtrl.dismiss();
  }

  loadData(){
    let localItemsdata = this.http.get('assets/items.json').map(res => res.json().items);
    localItemsdata.subscribe(data => {
      this.itemsList = data;

    });

  }

  filterItems(searchTerm){
    return this.itemsList.filter((item) => {
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });     
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
  
  deleteFromFav(id){
    this.mainFunc.deleteFromFav(id);
    this.loadData();
  }

  openItemDetails(id){

  }

}