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

import { NewsDetailsPage } from "../../pages/news-details/news-details";

import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

/**
 * Generated class for the AccContactUsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-news',
  templateUrl: 'news-page.html',


})
export class NewsPage {

  isSearchToggle: boolean = false;
  direc: any;
  direcR: any;
  homemenu: any[];
  thumb: string;
  storelist: any[];
  storelistalldata: any[];
  records: number;
  hasMoreitems = false;
  isDataAvilable = false;
  current_page: number;
  can_load_more: boolean = false;
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


    console.log("dddddddddddddddddddddddd");
    this.storelist = [];
      this.storelistalldata = [];

    this.homemenu = ["ahmed", "a", "a", "a", "a", "a"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrandsPage');

    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }


    let url = this.mainFunc.url + '/api/structure/news'
    let localHomeMenudata2 = this.http.get(url).map(res => res.json());
    localHomeMenudata2.subscribe(dataall => {
      let data = dataall.data;
      this.storelistalldata = data;
      this.records = data.length;
      let end_point = 20;
      if (data.length > 0){
        this.isDataAvilable = true;
        this.current_page = dataall.current_page;
        if (dataall.current_page != dataall.last_page) {
          this.can_load_more = true;
        }else{
          this.can_load_more = false;
        }
      }else{
        this.isDataAvilable = false;
      }


        for (let index = 0; index < data.length; index++) {
        data[index].main_image= this.mainFunc.url + data[index].main_image;
        }


      this.storelist = data;
      console.log(this.storelist);
      
    });

  }


  loadNextPage() {
    let url = this.mainFunc.url + '/api/structure/news' + '?page=' + (this.current_page + 1);
    let localHomeMenudata2 = this.http.get(url).map(res => res.json());
    localHomeMenudata2.subscribe(dataall => {
      let data = dataall.data;

      // this.storelistalldata = data;
      this.records = data.length;
      let end_point = 20;
      if (data.length > 0){
        this.isDataAvilable = true;
        this.current_page = dataall.current_page;
        // this.can_load_more = dataall.can_load_more;
        if (dataall.current_page != dataall.last_page) {
          this.can_load_more = true;
        }else{
          this.can_load_more = false;
        }
      }else{
        this.isDataAvilable = false;
      }

      for (let index = 0; index < data.length; index++) {
        let e = data[index];
        this.storelist.push(e);
      }
    });
  }

  doInfinite(infiniteScroll) {
    console.log(this.can_load_more);
    
    if(this.can_load_more){
      setTimeout(() => {
        this.loadNextPage();
        infiniteScroll.complete();
      }, 1000)
    }else{
      infiniteScroll.complete();
    }
  }


  dismissview() {
    this.viewCtrl.dismiss();
  }


  showSearchBar() {

  }

  openNewsDetails(id) {
    // this.youtube.openVideo(url);

    this.navCtrl.push(NewsDetailsPage, {
      'id': id
    });
  }

  addToFav(item) {
    // this.mainFunc.addToFav(item);
  }
  removeFromFav(item) {

  }









}
