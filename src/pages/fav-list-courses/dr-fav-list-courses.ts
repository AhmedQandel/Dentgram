import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, ViewController, NavParams, Slides, Platform, Events, Content, Option } from 'ionic-angular';



import { Http, Headers, RequestOptions } from '@angular/http';
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
import { UsedAdsDetailsPage } from '../used-ads-details/used-ads-details';


@Component({
  selector: 'page-fav-courses-list',
  templateUrl: 'dr-fav-list-courses.html',
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
        style({ transform: 'translateX(200%)' }),
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
      state('cartBadge', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        animate(500, keyframes([
          style({ opacity: 1, transform: 'translateX(100%)', offset: 0.1 }),
          style({ opacity: 1, transform: 'translateX(-15px)', offset: 0.3 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 0.5 }),
          style({ opacity: 1, transform: 'translateX(-100%)', offset: 0.7 }),
          style({ opacity: 1, transform: 'translateX(15px)', offset: 0.9 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})


export class FavCoursesListPage {
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
  token: string;


  current_page: number;
  can_load_more: boolean = false;

  slideInView: boolean = true;
  slideViewed: any[] = [];
  slideClicked: any[] = [];
  @ViewChild(Content)
  content: Content;

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

    this.secretid = this.navParams.get('secretid');;
    this.pagetitle = this.navParams.get('secretid');;
console.log(this.secretid);

    this.events.publish('application:language', '');
    this.viewCtrl.setBackButtonText('');
  }

  ionViewDidEnter(currentIndex) {
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";
    }
  }

  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


  ionViewDidLoad() {


    if (this.secretid === 'library') {
      this.loadLibData();
    } else {
      this.loadData();
    }

  }


  loadData() {
    this.viewCtrl.setBackButtonText('');
    let numn = 1;
    let type="";
    if (this.secretid === 'courses') {
      numn = 1;
      type="course";
    } else if (this.secretid === 'events') {
      this.storage.get('city_id').then((val) => {
        if (val) {
          numn = val;
        }
      });
      type="event";
    } else if (this.secretid === 'products') {
      type="product";
    }else if (this.secretid === 'librarys') {
      type="library";
    }else if (this.secretid === 'used_item') {
      type="used_item";
    }

    this.storage.get('token').then(token => {

      let headers = new Headers();
      headers.append('Authorization', 'Bearer ' + token);
      let options = new RequestOptions({ headers: headers });

      let url = this.mainFunc.url + '/api/show-favorites/'+type;
      let localHomeMenudata2;
console.log(this.secretid);

      // if (this.secretid == 'courses') {
        localHomeMenudata2 = this.http.get(url, options).map(res => res.json());
      // } 
      // else if (this.secretid === 'events') {
      //   localHomeMenudata2 = this.http.get(url).map(res => res.json());
      // }

      localHomeMenudata2.subscribe(dataall => {
        let data;
        let data2=[];
        console.log("remote data", dataall);

     

        // if (this.secretid === 'course'){
        data = dataall;
        // }else if (this.secretid === 'event'){
        //   data = dataall.events;
        // }
      
          for (let index = 0; index < data.length; index++) {
            let e;
            let eicon;
            if (this.secretid == 'courses'){
              e = data[index].course;
              eicon = data[index].course.image;
              eicon=this.mainFunc.url +eicon;
              }else if (this.secretid == 'events'){
                e = data[index].event;
                eicon = data[index].event.image;
                eicon=this.mainFunc.url +eicon;
              }else if (this.secretid == 'products'){
                e = data[index].product;
                if (e != null) {
                eicon = data[index].product.image;
                eicon=this.mainFunc.url +eicon;
                }
              }else if (this.secretid == 'librarys'){
                e = data[index].library;
                eicon = data[index].library.image;
                eicon=this.mainFunc.url +eicon;
              }else if (this.secretid == 'used_item'){
                e = data[index].used_item;
                eicon = data[index].used_item.image;
                eicon="https://storage.googleapis.com/dentgram-app.appspot.com/"+eicon;
              }

            
            if (eicon === null ||eicon === "https://dentgram.comnull"  ) {
              eicon = 'assets/img/course_img_not_avilable.png';
            }
            if (e != null) {
            if (e.useable === "0") {
              e.useable = false;
            } else if (e.useable === "1") {
              e.useable = true;
            }
          }
            let item = {
              "id": e.id,
              "name_en": e.name_en ? e.name_en :e.name,
              "name_ar": e.name_ar ? e.name_ar :e.name,
              "img": eicon,
              "start_date": e.start_date,
              "end_date": e.end_date,
              "level": e.level,
              "location": e.location,
              "price": e.price ? e.price :0,

            }
            data2.push(item);
          }  
      




        this.homemenu = data2;
        // data2 = data;
        console.log(this.homemenu);
        
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

    });


  }

  click_Open_Page(id) {

    console.log('Id Clicked', id);
    this.select = '';

    switch (id) {
      case 'course':
        console.log('Tap Clicked is : Courses');
        this.pageClass = CoursesCategoriesPage;
        this.secretid = "course";
        this.pagetitle = "MENU_COURSES";
        break;

      case 'library':
        console.log('Tap Clicked is : Liberary');
        this.pageClass = CoursesCategoriesPage;
        this.secretid = "library";
        this.pagetitle = "MENU_LIBRARY";
        break;

      case 'event':
        console.log('Tap Clicked is : Calender');
        this.pageClass = CoursesCategoriesPage;
        this.secretid = "event";
        this.pagetitle = "MENU_CALENDAR";

        break;

      case 'career':
        console.log('Tap Clicked is : Career');
        this.pageClass = CoursesCategoriesPage;
        this.secretid = "career";
        this.pagetitle = "MENU_CALENDAR";

        break;

    }

    this.navCtrl.push(this.pageClass, {
      'select': this.select,
      'title': this.pagetitle,
      'secretid': this.secretid
    });

  }
  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////

  loadLibData() {
    this.isDataAvilable = true;

    this.viewCtrl.setBackButtonText('');
    let numn = 1;

    if (this.secretid === 'course') {
      numn = 1;
    } else if (this.secretid === 'event') {
      this.storage.get('city_id').then((val) => {
        if (val) {
          numn = val;
        }
      });
    }


    this.storage.get('city_id').then((val) => {
      if (val) {
        numn = val;
      }
    });
    // http://dentgram.com/api/structure/libraries/books/category/3/2
    let url = this.mainFunc.url + '/api/structure/libraries/' + this.libraryType + '/category/' + this.catId + '/' + numn
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

      if (dataall.slides) {
        this.slider_Data_Store = dataall.slides;
        this.number_of_sliders = dataall.length;
      }

      if (data.length > 0) {
        this.isDataAvilable = true;
        this.current_page = dataall.pages.current_page;
        this.can_load_more = dataall.pages.can_load_more;
      } else {
        this.isDataAvilable = false;
      }


      for (let index = 0; index < data.length; index++) {
        const e = data[index];
        let eicon = data[index].image.full;
        if (eicon === null) {
          // eicon = 'assets/img/catalogue/img-1.png';
          eicon = 'assets/img/course_img_not_avilable.png';
        }
        if (e.useable === "0") {
          e.useable = false;
        } else if (e.useable === "1") {
          e.useable = true;
        }



        let item = {
          "id": e.id,
          "name_en": e.name_en,
          "name_ar": e.name_ar,
          "img": this.mainFunc.url +eicon,
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

    if (this.secretid === 'course') {
      numn = 1;
    } else if (this.secretid === 'event') {
      this.storage.get('city_id').then((val) => {
        if (val) {
          numn = val;
        }
      });
    }

    let url = this.mainFunc.url + '/api/structure/' + this.secretid + 's/category/' + this.catId + '/' + numn + '?page=' + (this.current_page + 1);
    let localHomeMenudata2;

    if (this.secretid === 'course') {
      localHomeMenudata2 = this.http.get(url).map(res => res.json());
    } else if (this.secretid === 'event') {
      localHomeMenudata2 = this.http.get(url).map(res => res.json());
    }

    localHomeMenudata2.subscribe(dataall => {
      let data;
      if (this.secretid === 'course') {
        data = dataall.courses;
      } else if (this.secretid === 'event') {
        data = dataall.events;
      }

      let data2: any[];
      data2 = [];
      if (data.length > 0) {
        this.isDataAvilable = true;
        this.current_page = dataall.pages.current_page;
        this.can_load_more = dataall.pages.can_load_more;
      } else {
        this.isDataAvilable = false;
      }
      for (let index = 0; index < data.length; index++) {
        const e = data[index];
        let eicon = data[index].image.full;
        if (eicon === null) {
          eicon = 'assets/img/course_img_not_avilable.png';
        }
        if (e.useable === "0") {
          e.useable = false;
        } else if (e.useable === "1") {
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

    if (this.secretid === 'course') {
      numn = 1;
    } else if (this.secretid === 'event') {
      this.storage.get('city_id').then((val) => {
        if (val) {
          numn = val;
        }
      });
    }


    this.storage.get('city_id').then((val) => {
      if (val) {
        numn = val;
      }
    });
  

    let url = this.mainFunc.url + '/api/structure/libraries/' + this.libraryType + '/category/' + this.catId + '/' + numn + '?page=' + (this.current_page + 1);
    let localHomeMenudata2;

    localHomeMenudata2 = this.http.get(url).map(res => res.json());

    localHomeMenudata2.subscribe(dataall => {

      let data = dataall.libraries;

      let data2: any[];
      data2 = [];


      if (data.length > 0) {
        this.isDataAvilable = true;
        this.current_page = dataall.pages.current_page;
        this.can_load_more = dataall.pages.can_load_more;
      } else {
        this.isDataAvilable = false;
      }


      for (let index = 0; index < data.length; index++) {
        const e = data[index];
        let eicon = data[index].image.full;
        if (eicon === null) {
          // eicon = 'assets/img/catalogue/img-1.png';
          eicon = 'assets/img/course_img_not_avilable.png';
        }
        if (e.useable === "0") {
          e.useable = false;
        } else if (e.useable === "1") {
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
    if (this.can_load_more) {
      setTimeout(() => {
        if (this.secretid === 'library') {
          this.loadNextPageLib();
        } else {
          this.loadNextPage();
        }
        infiniteScroll.complete();
      }, 1000)
    } else {
      infiniteScroll.complete();
    }
  }

  click_Open_catalogue_sub_id(id, name_ar, name_en) {
    let name = '';
    if (this.platform.dir() === "rtl") {
      name = name_ar;
    } else {
      name = name_en;
    }
    this.navCtrl.push(CoursesDetailsPage, {
      'id': id,
      'name': name
    });
  }

  showSearchBar() {
    this.navCtrl.push(SearchPage, {
      'type': this.secretid
    });
  }



  dismissview() {
    this.viewCtrl.dismiss();
  }

  openDetailsPage(id) {

    this.navCtrl.push(CoursesDetailsPage, {

      'id': id,
      'secretId': 'courses'
    });
  }

  openDetailsEventPage(id) {

    this.navCtrl.push(CoursesDetailsPage, {
      'id': id,
      'secretId': 'events'
    });
  }
  openLibraryItem(id) {
    // this.youtube.openVideo(url);

    this.navCtrl.push(LibraryDetailsPage, {
      'id': id,
      'secretId': 'libraries'
    });
  }

  openProduct(id){
    this.navCtrl.push(ItemDetailsPage, {
      'id' : id
    });
  }
  openItem(id){
    this.navCtrl.push(UsedAdsDetailsPage, {
      'id' : id
    });
  }

}

