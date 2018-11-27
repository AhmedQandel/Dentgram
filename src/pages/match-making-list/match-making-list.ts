import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, ViewController, NavParams, Slides, Platform, Events } from 'ionic-angular';



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
import { CategorysPage } from "../../pages/categorys/categorys";

// import { CoursesDetailsPage } from "../../pages/courses-details/courses-details";
import { MatchMakingPage } from "../../pages/match-making/match-making";
import { MatchMakingDetailsPage } from "../../pages/match-making-details/match-making-details";

import { Storage } from '@ionic/storage';

import { SearchPage } from "../../pages/search/search";
// import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';


@Component({
  selector: 'page-match-making-list',
  templateUrl: 'match-making-list.html',
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


export class MatchMakingListPage {
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
  catName: string;
  catId: string;
  secretid = "";
  pagetitle = "";
  isDataAvilable = true;
  isDataAvilableAct = false;
  libraryType = 'books';

  current_page: number;
  can_load_more: boolean = false;
  thumb: string;

  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController, 
    private http: Http,
      public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController, 
        private changeDetector: ChangeDetectorRef,
          public platform: Platform,
            public translate: TranslateService,
            public storage: Storage,
              public events: Events,
              // private youtube: YoutubeVideoPlayer,
                public navParams: NavParams) {

                this.storelist = [];
                this.homemenu = [];
                this.slider_Data_Store = [];

                this.catName = this.navParams.get('name');
                this.catId = this.navParams.get('id');
                  
                this.secretid = 'career';//this.navParams.get('secretid');
                this.pagetitle = this.navParams.get('pagetitle');

                this.events.publish('application:language','');
                this.viewCtrl.setBackButtonText('');

                events.subscribe('application:isLogged', (token) => {
                  
                  this.storage.get('thumb').then((val) => {
                    this.thumb = val;
                  });
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
 
      this.loadData();  
      

      
      // Home Page Slider Timer Controller
    this.subscription = Observable.interval(3000).subscribe(x=> {
        
        try {
          this.slides.slideNext(1000);
        } catch (error) {
          
        }
      });
    }
  

    loadData(){
      this.viewCtrl.setBackButtonText('');
      // this.direc = !this.platform.dir();
        // this.platform.dir.toString
      // let localdata_slider = this.http.get('assets/slider.json').map(res => res.json().items);
      // localdata_slider.subscribe(data => {
      //   this.slider_Data_Store = data;
      //   this.number_of_sliders = data.length;
      // });

      let numn = 1;
      this.storage.get('city_id').then((val) => {
        if (val){
          numn = val;
        }
      });
      
      let url = this.mainFunc.url + '/api/structure/'+ this.secretid +'s/category/' + this.catId + '/' + numn
      let localHomeMenudata2;
      
      
      localHomeMenudata2 = this.http.get(url).map(res => res.json());
      localHomeMenudata2.subscribe(dataall => {
        let data = dataall.careers;

        let data2: any[];
        data2 = [];
        if(dataall.slides){
          this.slider_Data_Store = dataall.slides;
          this.number_of_sliders = dataall.length;
        }

        if(data.length > 0){
          this.isDataAvilable = true;
          this.isDataAvilableAct = true;
          this.current_page = dataall.pages.current_page;
          this.can_load_more = dataall.pages.can_load_more;

          for (let index = 0; index < data.length; index++) {
            const e = data[index];
            let eicon = data[index].countries.icon.thumb;
            if (eicon === null){
              eicon = 'assets/img/catalogue/img-1.png';
            }
            // if (e.useable === "0"){
            //   e.useable = false;
            // }else if(e.useable === "1"){
            //   e.useable = true;
            // }
            
            let item = {
              "id": e.id,
              "name": e.title,
              // "name": e.name_ar,
              "short_description": e.short_description,
              "img": eicon,
              "location_en": e.countries.name_en,
              "location_ar": e.countries.name_ar,
              "store_id": e.stores.id,
              "store_name": e.stores.name,
              "store_name_ar": e.stores.name_ar,
              "store_icon": e.stores.icon.thumb
            }
            data2.push(item);
          }
          this.homemenu = data2;
        }else{
          this.isDataAvilable = false;
          this.isDataAvilableAct = false;
        }
        
        // data2 = data;

      },
      err => {

      },
      () => {

        // this.loading.dismiss();
        // this.mainFunc.dismissLoading();
      }
      // ,
      // finally() => {

      // }
    );
    }
    

    loadNextPage() {

      let numn = 1;
      this.storage.get('city_id').then((val) => {
        if (val){
          numn = val;
        }
      });
      
      let url = this.mainFunc.url + '/api/structure/'+ this.secretid +'s/category/' + this.catId + '/' + numn+ '?page=' + (this.current_page + 1);
      let localHomeMenudata2;
      
      
      localHomeMenudata2 = this.http.get(url).map(res => res.json());
      localHomeMenudata2.subscribe(dataall => {
        let data = dataall.careers;

        let data2: any[];
        data2 = [];
        if(data.length > 0){
          this.isDataAvilable = true;
          this.isDataAvilableAct = true;
          this.current_page = dataall.pages.current_page;
          this.can_load_more = dataall.pages.can_load_more;

          for (let index = 0; index < data.length; index++) {
            const e = data[index];
            let eicon = data[index].countries.icon.thumb;
            if (eicon === null){
              eicon = 'assets/img/catalogue/img-1.png';
            }

            let item = {
              "id": e.id,
              "name": e.title,
              "short_description": e.short_description,
              "img": eicon,
              "location_en": e.countries.name_en,
              "location_ar": e.countries.name_ar,
              "country_icon":e.countries.icon.thumb,
              "store_id": e.stores.id,
              "store_name": e.stores.name,
              "store_name_ar": e.stores.name_ar,
              "store_icon": e.stores.icon.thumb
            }
            this.homemenu.push(item);
          }
        }else{
          this.isDataAvilable = false;
          this.isDataAvilableAct = false;
        }
        
      },
      err => {

      },
      () => {

      }
      
    );

    }

    click_Open_Category() {
      this.navCtrl.push(MatchMakingPage, {
        'select' : '0',
        'title': '',
        'secretid': 'career'
      });
    }


    click_Open_catalogue_sub_id(id,name_ar,name_en){
      let name = '';
      if (this.platform.dir() === "rtl") {
        name = name_ar;
      } else {
        name = name_en;
      }
      this.navCtrl.push(MatchMakingDetailsPage, {
        'id' : id,
        'name' : name
      });  
    }

    showSearchBar() {
      this.navCtrl.push(SearchPage, {
        'type' : this.secretid
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
  
    dismissview(){
      this.viewCtrl.dismiss();
    }

    openDetailsPage(id){
      
      this.navCtrl.push(MatchMakingDetailsPage, {

        'id' : id,
        'secretId' : 'courses'
      });   
    }

    openDetailsEventPage(id){
      
      this.navCtrl.push(MatchMakingDetailsPage, {
        'id' : id,
        'secretId' : 'events'
      });   
    }
    openYoutubeVideo(url) {
      // this.youtube.openVideo(url);
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

