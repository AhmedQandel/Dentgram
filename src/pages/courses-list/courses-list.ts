import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, ViewController, NavParams, Slides, Platform, Events, Content } from 'ionic-angular';



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
import { CoursesCategoriesPage } from "../courses-categories/courses-categories";
import { BooksCategoriesPage } from "../books-categories/books-categories";

import { CoursesDetailsPage } from "../../pages/courses-details/courses-details";

import { Storage } from '@ionic/storage';

import { SearchPage } from "../../pages/search/search";

import { LibraryDetailsPage } from "../../pages/library-details/library-details";

import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';


@Component({
  selector: 'page-courses-list',
  templateUrl: 'courses-list.html',
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


export class CoursesListPage {
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
  select: string;
  pageClass: any;
  storelist: any[];
  homemenu: any[];
  catName: string;
  catId: number;
  secretid = "";
  pagetitle = "";
  isDataAvilable = true;
  libraryType = 'books';
  thumb: string;
   

  current_page: number;
  can_load_more: boolean = false;

  slideInView:boolean = true;
  slideViewed:any[] = [];
  slideClicked:any[] = [];
  @ViewChild(Content)
  content:Content;

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
              private youtube: YoutubeVideoPlayer,
                public navParams: NavParams) {

                this.storelist = [];
                this.homemenu = [];
                this.slider_Data_Store = [];

                events.subscribe('application:isLogged', (token) => {
                  
                  this.storage.get('thumb').then((val) => {
                   
                    this.thumb = val;
                  });
                });

                this.catName = this.navParams.get('name');
                
                if(this.navParams.get('id') == undefined){
                  this.catId = 0;
                }else{
                  this.catId = this.navParams.get('id');  
                }
                console.log('catId', this.catId);

                this.secretid = this.navParams.get('secretid');
                this.pagetitle = this.navParams.get('pagetitle');

                this.events.publish('application:language','');
                this.viewCtrl.setBackButtonText('');
  }

  ionViewDidEnter(currentIndex){
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }
    if(this.slides != undefined){
      this.content.ionScrollEnd.subscribe((data)=>{

        let dimensions = this.content.getContentDimensions();

        let scrollTop = this.content.scrollTop;
        let contentHeight = dimensions.contentHeight;
        let scrollHeight = dimensions.scrollHeight;
        let sliderHeight = document.getElementById('slider').offsetHeight;

        let sliderInView = sliderHeight - scrollTop;

        if(sliderInView < (sliderHeight - sliderHeight)){
          console.log('Slider not in view');
          this.slideInView = false;
        }else{
          console.log('Slider is in View');
          this.slideInView = true;
        }

      });
    }
  }
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.ionViewDidEnter(currentIndex);
    if(this.slideInView == true){
      if(this.slider_Data_Store[Number(currentIndex - 1)] != undefined){
        let slider_id = this.slider_Data_Store[Number(currentIndex - 1)].id;
        if(this.slideViewed.indexOf(slider_id) <= -1){
          
          let url = this.mainFunc.url+'/api/ads/slider-view/'+slider_id;
          
          this.http.get(url).map(res => res.json()).subscribe(dataAll => {
            this.slideViewed.push(slider_id);
          });
        }
      }
    }
  }
  

  openSlider(arr,slide_id)
  {
    if(arr != null){
      if(this.slider_Data_Store[Number(slide_id)] != undefined){
        let slider_id = this.slider_Data_Store[Number(slide_id)].id;
        if(this.slideClicked.indexOf(slider_id) <= -1){
          
          let url = this.mainFunc.url+'/api/ads/slider/'+slider_id;
          
          this.http.get(url).map(res => res.json()).subscribe(dataAll => {
            this.slideClicked.push(slider_id);
          });
        }
      }
      this.mainFunc.openSlider(arr);
    }
  }
    ionViewDidLoad(){
      this.subscription = Observable.interval(3000).subscribe(x=> {
        try {
          this.slides.slideNext(1000);
        } catch (error) {
          
        }
      });
      // this.viewCtrl.setBackButtonText('');
                              // this.direc = !this.platform.dir();
                                // this.platform.dir.toString
      // let localdata_slider = this.http.get('assets/slider.json').map(res => res.json().items);
      // localdata_slider.subscribe(data => {
      //   this.slider_Data_Store = data;
      //   this.number_of_sliders = data.length;
      // });
  
                              // let localBestOverdata = this.http.get('assets/bestover.json').map(res => res.json().items);
                              // localBestOverdata.subscribe(data => {
                              //   this.bestOvers = data;
                              // });
                          
                              // let localBestSelldata = this.http.get('assets/bestsell.json').map(res => res.json().items);
                              // localBestSelldata.subscribe(data => {
                              //   this.bestSell = data;
                              // });
                          
                              // let localBestRecommendeddata = this.http.get('assets/bestrecommended.json').map(res => res.json().items);
                              // localBestRecommendeddata.subscribe(data => {
                              //   this.bestrecommended = data;
                              // });
                              
                              // Load Main Home Page Menu Data
                              // let localHomeMenudata = this.http.get('assets/courseslist.json').map(res => res.json());
                              // localHomeMenudata.subscribe(data => {
                              //   this.homemenu = data.categories;
                              //   // let slider_data = data.slider;
                              //   // this.slider_Data_Store = slider_data;
                              //   // this.number_of_sliders = slider_data.length;

                              // });

      




      // // Load Stores Data
      // let localItemsdata = this.http.get('assets/beststores.json').map(res => res.json().items);
      // localItemsdata.subscribe(data => {
      //   this.storelist = data;
  
      // });
  
      if (this.secretid === 'library'){
        this.loadLibData();
      }else{
        this.loadData();  
      }
      
      

      
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

      if (this.secretid === 'course'){
        numn = 1;
      }else if (this.secretid === 'event'){
        this.storage.get('city_id').then((val) => {
          if (val){
            numn = val;
          }
        });
      }
      
      let url = this.mainFunc.url + '/api/structure/'+ this.secretid +'s/category/' + this.catId + '/' + numn
      console.log("url", url);
      let localHomeMenudata2;
      
      if (this.secretid === 'course'){
        // localHomeMenudata2 = this.http.get(url).map(res => res.json().courses);  
        localHomeMenudata2 = this.http.get(url).map(res => res.json());  
      }else if (this.secretid === 'event'){
        // localHomeMenudata2 = this.http.get(url).map(res => res.json().events);
        localHomeMenudata2 = this.http.get(url).map(res => res.json());
      }     

      localHomeMenudata2.subscribe(dataall => {
        let data;
        
        console.log("remote data", dataall);

        if(dataall.slides){
          this.slider_Data_Store = dataall.slides;
          this.number_of_sliders = dataall.length;
        }
        
        if (this.secretid === 'course'){
          data = dataall.courses;
        }else if (this.secretid === 'event'){
          data = dataall.events;
        }

        let data2: any[];
        data2 = [];
        if(data.length > 0){
          this.isDataAvilable = true;
          this.current_page = dataall.pages.current_page;
          this.can_load_more = dataall.pages.can_load_more;
        }else{
          this.isDataAvilable = false;
        }
        for (let index = 0; index < data.length; index++) {
          const e = data[index];
          let eicon = data[index].image.full;
          if (eicon === null){
            // eicon = 'assets/img/catalogue/img-1.png';
            eicon = 'assets/img/course_img_not_avilable.png';
          }
          if (e.useable === "0"){
            e.useable = false;
          }else if(e.useable === "1"){
            e.useable = true;
          }
          
          let item = {
            "id": e.id,
            "name_en": e.name_en,
            "name_ar": e.name_ar,
            "img": eicon,
            "start_date": e.start_date,
            "end_date": e.end_date,
            "level": e.level,
            "location": e.location

            // "back_back": "",
            // "parent_id": e.parent_id,
            // "useable": e.useable
          }
          data2.push(item);
        }
        this.homemenu = data2;
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
    
    click_Open_Page(id){

      console.log('Id Clicked', id);
      this.select = '';

      switch (id) {
        case 'course':
          console.log('Tap Clicked is : Courses');
          this.pageClass = CoursesCategoriesPage;
          this.secretid = "course";
          this.pagetitle ="MENU_COURSES";
        break;
        
        case 'library':
          console.log('Tap Clicked is : Liberary');
          this.pageClass = CoursesCategoriesPage;
          this.secretid = "library";
          this.pagetitle ="MENU_LIBRARY";
        break;
        
        case 'event':
          console.log('Tap Clicked is : Calender');
          this.pageClass = CoursesCategoriesPage;
          this.secretid = "event";
          this.pagetitle ="MENU_CALENDAR";

        break;
        
        case 'career':
          console.log('Tap Clicked is : Career');
          this.pageClass = CoursesCategoriesPage;
          this.secretid = "career";
          this.pagetitle ="MENU_CALENDAR";

        break;
        
      }
      
      this.navCtrl.push(this.pageClass, {
        'select' : this.select,
        'title': this.pagetitle,
        'secretid': this.secretid
      });

  }
    /////////////////////////////////////////
    /////////////////////////////////////////
    /////////////////////////////////////////

    loadLibData(){
      this.isDataAvilable = true;
      
      this.viewCtrl.setBackButtonText('');
      // this.direc = !this.platform.dir();
        // this.platform.dir.toString
      // let localdata_slider = this.http.get('assets/slider.json').map(res => res.json().items);
      // localdata_slider.subscribe(data => {
      //   this.slider_Data_Store = data;
      //   this.number_of_sliders = data.length;
      // });
  

      let numn = 1;

      if (this.secretid === 'course'){
        numn = 1;
      }else if (this.secretid === 'event'){
        this.storage.get('city_id').then((val) => {
          if (val){
            numn = val;
          }
        });
      }


      this.storage.get('city_id').then((val) => {
        if (val){
          numn = val;
        }
      });


      // http://dentgram.com/api/structure/libraries/books/category/3/2
      
      let url = this.mainFunc.url + '/api/structure/libraries/' + this.libraryType +'/category/' + this.catId + '/' + numn
      let localHomeMenudata2;
      
      // if (this.secretid === 'course'){
      //   localHomeMenudata2 = this.http.get(url).map(res => res.json().courses);  
      // }else if (this.secretid === 'event'){
        // localHomeMenudata2 = this.http.get(url).map(res => res.json().libraries);
        localHomeMenudata2 = this.http.get(url).map(res => res.json());
      // }     

      localHomeMenudata2.subscribe(dataall => {

        let data = dataall.libraries;

        let data2: any[];
        data2 = [];
        
        
        // if(data.length > 0){
          
        // }else{
        //   this.isDataAvilable = false;
        // }

        if(dataall.slides){
          this.slider_Data_Store = dataall.slides;
          this.number_of_sliders = dataall.length;
        }

        if(data.length > 0){
          this.isDataAvilable = true;
          this.current_page = dataall.pages.current_page;
          this.can_load_more = dataall.pages.can_load_more;
        }else{
          this.isDataAvilable = false;
        }


        for (let index = 0; index < data.length; index++) {
          const e = data[index];
          let eicon = data[index].image.full;
          if (eicon === null){
            // eicon = 'assets/img/catalogue/img-1.png';
            eicon = 'assets/img/course_img_not_avilable.png';
          }
          if (e.useable === "0"){
            e.useable = false;
          }else if(e.useable === "1"){
            e.useable = true;
          }


          
          let item = {
            "id": e.id,
            "name_en": e.name_en,
            "name_ar": e.name_ar,
            "img": eicon,
            "start_date": e.start_date,
            "end_date": e.end_date,
            "level": e.level,
            "location": e.location

            // "back_back": "",
            // "parent_id": e.parent_id,
            // "useable": e.useable
          }
          data2.push(item);
        }
        this.homemenu = data2;
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

      if (this.secretid === 'course'){
        numn = 1;
      }else if (this.secretid === 'event'){
        this.storage.get('city_id').then((val) => {
          if (val){
            numn = val;
          }
        });
      }
      
      let url = this.mainFunc.url + '/api/structure/'+ this.secretid +'s/category/' + this.catId + '/' + numn + '?page=' + (this.current_page + 1);
      let localHomeMenudata2;
      
      if (this.secretid === 'course'){
        localHomeMenudata2 = this.http.get(url).map(res => res.json());  
      }else if (this.secretid === 'event'){
        localHomeMenudata2 = this.http.get(url).map(res => res.json());
      }     

      localHomeMenudata2.subscribe(dataall => {
        let data;
        if (this.secretid === 'course'){
          data = dataall.courses;
        }else if (this.secretid === 'event'){
          data = dataall.events;
        }

        let data2: any[];
        data2 = [];
        if(data.length > 0){
          this.isDataAvilable = true;
          this.current_page = dataall.pages.current_page;
          this.can_load_more = dataall.pages.can_load_more;
        }else{
          this.isDataAvilable = false;
        }
        for (let index = 0; index < data.length; index++) {
          const e = data[index];
          let eicon = data[index].image.full;
          if (eicon === null){
            eicon = 'assets/img/course_img_not_avilable.png';
          }
          if (e.useable === "0"){
            e.useable = false;
          }else if(e.useable === "1"){
            e.useable = true;
          }
          
          let item = {
            "id": e.id,
            "name_en": e.name_en,
            "name_ar": e.name_ar,
            "img": eicon,
            "start_date": e.start_date,
            "end_date": e.end_date,
            "level": e.level,
            "location": e.location

          }
          this.homemenu.push(item);
        }
        // this.homemenu = data2;

      },
      err => {

      },
      () => {

      }
      
    );

    }

    loadNextPageLib() {

      let numn = 1;

      if (this.secretid === 'course'){
        numn = 1;
      }else if (this.secretid === 'event'){
        this.storage.get('city_id').then((val) => {
          if (val){
            numn = val;
          }
        });
      }


      this.storage.get('city_id').then((val) => {
        if (val){
          numn = val;
        }
      });


      let url = this.mainFunc.url + '/api/structure/libraries/' + this.libraryType +'/category/' + this.catId + '/' + numn + '?page=' + (this.current_page + 1);
      let localHomeMenudata2;
      
        localHomeMenudata2 = this.http.get(url).map(res => res.json());
      
      localHomeMenudata2.subscribe(dataall => {
      
        let data = dataall.libraries;

        let data2: any[];
        data2 = [];


        if(data.length > 0){
          this.isDataAvilable = true;
          this.current_page = dataall.pages.current_page;
          this.can_load_more = dataall.pages.can_load_more;
        }else{
          this.isDataAvilable = false;
        }


        for (let index = 0; index < data.length; index++) {
          const e = data[index];
          let eicon = data[index].image.full;
          if (eicon === null){
            // eicon = 'assets/img/catalogue/img-1.png';
            eicon = 'assets/img/course_img_not_avilable.png';
          }
          if (e.useable === "0"){
            e.useable = false;
          }else if(e.useable === "1"){
            e.useable = true;
          }


          
          let item = {
            "id": e.id,
            "name_en": e.name_en,
            "name_ar": e.name_ar,
            "img": eicon,
            "start_date": e.start_date,
            "end_date": e.end_date,
            "level": e.level,
            "location": e.location

          }
          this.homemenu.push(item);
        }
        // this.homemenu = data2;

      },
      err => {

      },
      () => {

      
      }
      
    );

    }

    doInfinite(infiniteScroll) {
      if(this.can_load_more){
        setTimeout(() => {
          if (this.secretid === 'library'){
            this.loadNextPageLib();
          }else{
            this.loadNextPage();
          }
          infiniteScroll.complete();
        }, 1000)
      }else{
        infiniteScroll.complete();
      }
    }

    click_Open_catalogue_sub_id(id,name_ar,name_en){
      let name = '';
      if (this.platform.dir() === "rtl") {
        name = name_ar;
      } else {
        name = name_en;
      }
      this.navCtrl.push(CoursesDetailsPage, {
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
      
      this.navCtrl.push(CoursesDetailsPage, {

        'id' : id,
        'secretId' : 'courses'
      });   
    }

    openDetailsEventPage(id){
      
      this.navCtrl.push(CoursesDetailsPage, {
        'id' : id,
        'secretId' : 'events'
      });   
    }
    openLibraryItem(id) {
      // this.youtube.openVideo(url);

      this.navCtrl.push(LibraryDetailsPage, {
        'id' : id,
        'secretId' : 'libraries'
      });
    }
  }

