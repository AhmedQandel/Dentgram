import { Component , ViewChild,ChangeDetectorRef  } from '@angular/core';
import { NavController, ViewController, AlertController, NavParams, Platform, Events, LoadingController , Select } from 'ionic-angular';




//////////////////////////////////////////
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
// import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { AccountfPage } from "../../pages/accountf/accountf";
//////////////////////////////////////////
import { ItemDetailsPage } from "../../pages/item-details/item-details";
import { ItemDetailsStorePage } from "../../pages/item-details-store/item-details-store";
import { CoursesDetailsPage } from "../../pages/courses-details/courses-details";
import { LibraryDetailsPage } from "../../pages/library-details/library-details";
import { MatchMakingDetailsPage } from '../match-making-details/match-making-details';
import { UsedAdsDetailsPage } from "../used-ads-details/used-ads-details"; 

import { DataProvider } from "../../providers/data/data";
import { SearchResultPage } from "../../pages/search-result/search-result";

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
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
export class SearchPage {

  type = '';
  direc: any;
  direcR: any;
  isSearchToggle: boolean = false;
  cartBadgeState: string = 'idle';
  isPassReqister = false;
  searchQuery: string = '';

  searchTerm: string = '';
  searchControl: FormControl;
  items: any;
  searching: any = false;
  secretid: string;
  query: string;
  url: string;
  isGrid: boolean = true;
  homemenu: any[];
  mobwidth: any;
  mobheight: any;
  isDataAvilable = true;
  filterBy: string;

  current_page: number;
  can_load_more: boolean = false;
  thumb: string;

  EmptyImage=this.mainFunc.url+"/assets/img/course_img_not_avilable.png";








  // type = '';
  // direc: any;
  // direcR: any;
  // isSearchToggle: boolean = false;
  // cartBadgeState: string = 'idle';
  // isPassReqister = false;
  // searchQuery: string = '';
  // searchTerm: string = '';
  // searchControl: FormControl;
  // items: any;
  // searching: any = false;
  histSearchWords: any[];
  // thumb: string;
  filterOptions: string[] = [];
  showFilter: boolean = false;
  // filterBy: string;
  filterByValue: string;
  city_list = [];
  city_list_ar = [];
  city_list_en = [];
  country_list = [];
  country_list_ar = [];
  country_list_en = [];
  category_list = [];
  loader: any;
  allData = [];
  search=false;
  // secretid: string;
  @ViewChild('sectionSelect') sectionSelect: Select;

  constructor(public navCtrl: NavController,
    public mainFunc: MainFunctionsProvider,
    public platform: Platform,
    public viewCtrl: ViewController,
    public storage: Storage,
    public events: Events,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public dataService: DataProvider,
    public loadingController: LoadingController,
    private http: Http,
    private changeDetector: ChangeDetectorRef,

    
    ) {

    events.subscribe('application:isLogged', (token) => {
      this.storage.get('thumb').then((val) => {
        this.thumb = val;
      });
    });

    this.searchControl = new FormControl();
    this.type = this.navParams.get('type');

    if (this.type == 'for_catalogue') {
      this.type = 'product';
    } else if (this.type == 'job') {
      this.type = 'career';
    } else if (this.type == 'for_store') {
      this.type = 'item';
    } else if (this.type == 'for_used') {
      this.type = 'used_item';
    }











    this.EmptyImage=this.mainFunc.url+"/assets/img/course_img_not_avilable.png";
    console.log(this.EmptyImage);
    

    this.callHistorysearches();
  }
  
  doFilter(){
    console.log(this.sectionSelect);
    
    this.sectionSelect.open();
    console.log('hello')
 }
  getCategories() {
    if (this.secretid=="library") {
      this.secretid="for_library";
    }else if(this.secretid == "used_item"){
      this.secretid="for_used";
    }else if(this.secretid == "course"){
      this.secretid="for_course";
    }else if(this.secretid == "event"){
      this.secretid="for_event";
    }

    let url = this.mainFunc.url + '/api/structure/categories/' + this.secretid + '/0';
    let localHomeMenudata2 = this.http.get(url).map(res => res.json());
    localHomeMenudata2.subscribe(data => {
      this. category_list = data;
    });
  }

  getCities() {
    let url = this.mainFunc.url + '/api/auth/register';
    this.showLoading('', true);
    let localdata_content = this.http.get(url).map(res => res.json().countries);

    localdata_content.subscribe(data => {
      if (data.length > 0) {
        this.dismissLoading();
      }

      
      this.allData = data;
      let id;
      let country_id;
      this.storage.get('country_id').then((val) => { 
        if (val){ 
          country_id = val; 

          for (let index = 0; index < this.allData.length; index++) {
            const element = this.allData[index];
            if (element.id === country_id) {
              id = index;
              break;
            }
          }
        
          this.city_list = this.allData[id].cities;
        } 
      });
      
    });

  }
  getCountries() {
    let url = this.mainFunc.url + '/api/auth/register';
    this.showLoading('', true);
    let localdata_content = this.http.get(url).map(res => res.json().countries);

    localdata_content.subscribe(data => {
      if (data.length > 0) {
        this.dismissLoading();
      }

      
      this.allData = data;
      this.country_list=data;
 
      
    });

  }

  showLoading(message: string, state: boolean) {

    this.loader = this.loadingController.create({
      content: message
    });

    if (!state) {
      this.dismissLoading();
    } else {
      this.loader.present();
    }

  }

  dismissLoading() {
    setTimeout(() => {
      this.loader.dismiss();
    }, 50);
  }

  callHistorysearches() {
    this.histSearchWords = [];
    this.storage.get('hist_' + this.type).then((val) => {
      if (val != null) {
        this.histSearchWords = val;
      }
    });
  }

  ionViewWillEnter() {
    this.callHistorysearches();
    this.prepareFilter();
  }

  ionViewDidLoad() {
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";
    }

    this.searchControl.valueChanges.debounceTime(500).subscribe(search => {
      if (this.searchTerm.length > 1) {
        this.setFilteredItems();
      }
    });
  }

  prepareFilter() {
    let prevPageName = this.navCtrl.getPrevious().name;
    let prevSecretId = this.navCtrl.getPrevious().data.secretid;
    if (prevPageName.indexOf("Courses") > -1) {
      if (prevSecretId.indexOf("course") > -1) {
        this.filterOptions = ["CATEGORY_FILTER", "LOCATION_FILTER", "DATE_FILTER", "COURSE_PROVIDER_FILTER"];
        this.showFilter = true;
        this.secretid = "for_course";
      } else if (prevSecretId.indexOf("event") > -1) {
        this.filterOptions = ["CATEGORY_FILTER", "LOCATION_FILTER", "DATE_FILTER"];
        this.showFilter = true;
        this.secretid = "for_event";
      } else if (prevSecretId.indexOf("librar") > -1) {
        this.filterOptions = ["CATEGORY_FILTER"];
        this.showFilter = true;
        this.secretid = "for_library";
      }
    } else if (prevPageName.indexOf("UsedAds") > -1) {
      this.filterOptions = ["CATEGORY_FILTER","COUNTRY_FILTER"];
      this.showFilter = true;
      this.secretid = "for_used";
    }
  }

  onFilterByChange(selectedValue: any) {
    this.filterByValue = undefined;
    this.city_list = [];
    this.category_list = [];
    
    if (selectedValue === 'COUNTRY_FILTER')
      this.getCountries();

    if (selectedValue === 'CATEGORY_FILTER')
      this.getCategories();

    this.setFilteredItems();
  }

  onFilterByValueChange(selectedValue: any) {
    this.openSearchResultPage();
    // this.setFilteredItems();
  }

  dismissview() {
    this.viewCtrl.dismiss();
  }

  setFilteredItems() {
    this.items = [];
    console.log(this.filterByValue);
    
    // this.storage.set('city_id',this.filterByValue);
    this.storage.get('city_id').then(city_id => {
      let datarecived;

      if (this.filterBy) {
        datarecived = this.dataService.filterItemsBy(this.searchTerm, this.type, city_id, this.filterBy, this.filterByValue);
      } else {
        datarecived = this.dataService.filterItems(this.searchTerm, this.type, city_id);
      }

      datarecived.subscribe(data => {
        this.items = data;
        this.searching = false;
      });
    });
  }

  onSearchInput() {
    this.items = [];
    if (this.searchTerm.length > 1) {
      this.searching = true;
    }
    this.search=false;

  }

  openSearchResultPage() {
    // this.navCtrl.push(SearchResultPage, {
    //   'type': this.type,
    //   'query': this.searchTerm,
      // 'filterBy': this.filterBy
    // });
    this.search=true;
    this.secretid = this.type;
    this.query = this.searchTerm;
    this.filterBy = this.filterBy;
console.log(this.filterBy);

    this.homemenu = [];

    this.mainFunc.addItemToHistory(this.secretid,this.query);

    this.events.subscribe('application:isLogged', (token) => {
            
      this.storage.get('thumb').then((val) => {
        this.thumb = val;
      });
    });
    this.storage.get('city_id').then(city_id => {
      this.url = this.mainFunc.url + '/api/search-v2?query=' + this.query + '&type=' + this.secretid + '&limit=10&result=1&city_id=' + city_id;
      if(this.filterBy){
        console.log(this.filterBy);
        
        switch (this.filterBy) {
          case 'COUNTRY_FILTER':
          this.url += "&country_id="+this.filterByValue+"&location=&date=&provider=&category=";
            break;
          case 'CATEGORY_FILTER':
          this.url += "&category="+this.filterByValue+"&location=&date=&provider=&country_id=";
            break;
          case 'LOCATION_FILTER':
          this.url += "&location="+this.filterByValue+"&category=&date=&provider=&country_id=";
            break;
          case 'DATE_FILTER':
          this.url += "&date="+this.filterByValue+"&category=&location=&provider=&country_id=";
            break;
          case 'COURSE_PROVIDER_FILTER':
          this.url = this.mainFunc.url + '/api/search-v2?query=' + this.query + '&type=' + this.secretid + '&limit=10&filters=&result=1?page=' + (this.current_page + 1);
          this.url += "&category=&location=&date=&country_id=&provider="+this.filterByValue;
          // this.url += "&provider‎="+this.filterByValue+"&location=&category=&date=";
            break;
        }
      }else{
        this.url += "&category=&location=&date=&country_id=&provider=";
      }






      // if (this.filterByValue) {
      //   this.url += "&filterByValue="+this.filterByValue;
      // }
      console.log('ionViewDidLoad URL' ,  this.url);


       // Run The Correct Code Depend on type
      switch (this.secretid) {
        
        // product
        case 'product':
          this.loadData_Product();
        break;

        // item
        case 'item':
          this.loadData_Item();
        break;

        // course
        case 'course':
          this.loadData_Event();
        break;

        // event
        case 'event':
          this.loadData_Event();
        break;

        // career
        case 'career':
          this.loadData_Career();
        break;

        // library-videos
        case 'library':
          this.loadData_Library();
        break;

        // library-books
        case 'library-books':
          this.loadData_Library_Books();
        break;

        case 'used_item':
          this.loadData_Used_Item();
        break;

      }
    });

  }

  openSearchResultPageSpacefic(name) {
    // this.navCtrl.push(SearchResultPage, {
    //   'type': this.type,
    //   'query': name
    // });
    this.search=true;

    this.secretid = this.type;
    this.query = name;
    this.filterBy = '';

    this.homemenu = [];

    this.mainFunc.addItemToHistory(this.secretid,this.query);

    this.events.subscribe('application:isLogged', (token) => {
            
      this.storage.get('thumb').then((val) => {
        this.thumb = val;
      });
    });
    this.storage.get('city_id').then(city_id => {
      this.url = this.mainFunc.url + '/api/search-v2?query=' + this.query + '&type=' + this.secretid + '&limit=10&filters=&result=1';
      if(this.filterBy){
        switch (this.filterBy) {
          case 'COUNTRY_FILTER':
          this.url += "&country_id="+this.filterByValue+"&location=&date=&provider=&category=";
            break;
          case 'CATEGORY_FILTER':
          this.url += "&category="+this.filterByValue+"&location=&date=&country_id=&provider‎=";
            break;
          case 'LOCATION_FILTER':
          this.url += "&location="+this.filterByValue+"&category=&date=&country_id=&provider‎=";
            break;
          case 'DATE_FILTER':
          this.url += "&date="+this.filterByValue+"&category=&location=&country_id=&provider‎=";
            break;
          case 'COURSE_PROVIDER_FILTER':
          this.url += "&provider‎="+this.filterByValue+"&location=&category=&date=&country_id=";
            break;
        }
      }else{
        this.url += "&category=&location=&date=&country_id=&provider‎=";
      }
      console.log('ionViewDidLoad URL' ,  this.url);


       // Run The Correct Code Depend on type
      switch (this.secretid) {
        
        // product
        case 'product':
          this.loadData_Product();
        break;

        // item
        case 'item':
          this.loadData_Item();
        break;

        // course
        case 'course':
          this.loadData_Event();
        break;

        // event
        case 'event':
          this.loadData_Event();
        break;

        // career
        case 'career':
          this.loadData_Career();
        break;

        // library-videos
        case 'library':
          this.loadData_Library();
        break;

        // library-books
        case 'library-books':
          this.loadData_Library_Books();
        break;

        case 'used_item':
          this.loadData_Used_Item();
        break;

      }
    });
  }

  // openCartPage2() {
  //   this.navCtrl.push(AccountfPage, {
  //     'select': '1'
  //   });
  // }

  showDeleteHistoryConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Delete History',
      message: 'Do you want to delete search history?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            // console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // console.log('Agree clicked');
            this.storage.remove('hist_' + this.type);
            this.callHistorysearches();
          }
        }
      ]
    });
    confirm.present();
  }
/////////////////////////////////////////////////////////////////////////////////////////



  //////////////////////////////////// 
  //         Section                // 
  //                Product         // 
  //    //////////////////////      // 
  
  loadData_Product() {
    
    let localHomeMenudata2 = this.http.get(this.url).map(res => res.json());
    localHomeMenudata2.subscribe(dataall => {
      let data = dataall.data;
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
        if (this.platform.dir() === "rtl") {
          name = e.name_ar;
        } else {
          name = e.name_en;
        }
        
        let item = {
          "id": e.id,
          "name": name,
          "image":eicon
        }
        data2.push(item);
      }
      this.homemenu = data2;
    });
  }


  loadData_Product_More() {

    let localHomeMenudata2 = this.http.get(this.url).map(res => res.json());
    localHomeMenudata2.subscribe(dataall => {
      let data = dataall.data;
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
        this.homemenu.push(item);
      }
      // this.homemenu = data2;
    });

  }

  //////////////////////////////////// 
  //         Section                // 
  //                Item            // 
  //    //////////////////////      // 


  loadData_Item() {
    let localHomeMenudata2 = this.http.get(this.url).map(res => res.json());
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
          "discount" : e.discount,
          "currency" : e.currency
        }
        data2.push(item);
      }
      this.homemenu = data2;

    });
  }


  loadData_Item_More() {

    let localHomeMenudata2 = this.http.get(this.url).map(res => res.json());
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
          "discount" : e.discount,
          "currency" : e.currency
        }
        this.homemenu.push(item);
      }
      // this.homemenu = data2;

    });
  }

  //////////////////////////////////// 
  //         Section                // 
  //                Event           // 
  //    //////////////////////      // 


  loadData_Event() {
      
      let localHomeMenudata2;
      localHomeMenudata2 = this.http.get(this.url).map(res => res.json());
      localHomeMenudata2.subscribe(dataall => {
        let data2: any[];
        let data = dataall.data;
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
          data2.push(item);
        }
        this.homemenu = data2;

      },
      err => {

      },
      () => {

      }
    );
  }


  loadData_Event_More() {

    let localHomeMenudata2;
      localHomeMenudata2 = this.http.get(this.url).map(res => res.json().data);
      localHomeMenudata2.subscribe(dataall => {
        let data2: any[];
        let data = dataall.data;
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


  //////////////////////////////////// 
  //         Section                // 
  //                Course          // 
  //    //////////////////////      // 


  loadData_Course() {

  }

  loadData_Course_More() {

  }

  //////////////////////////////////// 
  //         Section                // 
  //                Career          // 
  //    //////////////////////      // 


  loadData_Career() {

    let localHomeMenudata2;
      
      
    localHomeMenudata2 = this.http.get(this.url).map(res => res.json().data);
    localHomeMenudata2.subscribe(dataall => {
      let data2: any[];
      data2 = [];
      let data = dataall.data;

      if(data.length > 0){
        this.isDataAvilable = true;
        this.current_page = dataall.current_page;
        this.can_load_more = dataall.next_page_url != null;
        
        for (let index = 0; index < data.length; index++) {
          const e = data[index];
          // let eicon = data[index].countries.icon.full;
          // if (eicon === null){
          //   eicon = 'assets/img/catalogue/img-1.png';
          // }
          // if (e.useable === "0"){
          //   e.useable = false;
          // }else if(e.useable === "1"){
          //   e.useable = true;
          // }
          
          let item = {
            "id": e.id,
            "name": e.title,
            // "name": e.name_ar,
            "short_description": e.short_description
            // "img": eicon,
            // "location_en": e.countries.name_en,
            // "location_ar": e.countries.name_ar,
            // "store_id": e.stores.id,
            // "store_name": e.stores.name,
            // "store_name_ar": e.stores.name_ar,
            // "store_icon": e.stores.icon.thumb
          }
          data2.push(item);
        }
        this.homemenu = data2;
      }else{
        this.isDataAvilable = false;
        // this.isDataAvilableAct = false;
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


  loadData_Career_More() {

    let localHomeMenudata2;
      
      
    localHomeMenudata2 = this.http.get(this.url).map(res => res.json().data);
    localHomeMenudata2.subscribe(dataall => {
      let data2: any[];
      data2 = [];
      let data = dataall.data;

      if(data.length > 0){
        this.isDataAvilable = true;
        this.current_page = dataall.current_page;
        this.can_load_more = dataall.next_page_url != null;
        
        for (let index = 0; index < data.length; index++) {
          const e = data[index];
          // let eicon = data[index].countries.icon.full;
          // if (eicon === null){
          //   eicon = 'assets/img/catalogue/img-1.png';
          // }
          // if (e.useable === "0"){
          //   e.useable = false;
          // }else if(e.useable === "1"){
          //   e.useable = true;
          // }
          
          let item = {
            "id": e.id,
            "name": e.title,
            // "name": e.name_ar,
            "short_description": e.short_description
            // "img": eicon,
            // "location_en": e.countries.name_en,
            // "location_ar": e.countries.name_ar,
            // "store_id": e.stores.id,
            // "store_name": e.stores.name,
            // "store_name_ar": e.stores.name_ar,
            // "store_icon": e.stores.icon.thumb
          }
          this.homemenu.push(item);
        }
        // this.homemenu = data2;
      }else{
        this.isDataAvilable = false;
        // this.isDataAvilableAct = false;
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

  //////////////////////////////////// 
  //         Section                // 
  //                Video           // 
  //    //////////////////////      // 

  loadData_Library() {
    let localHomeMenudata2;
    localHomeMenudata2 = this.http.get(this.url).map(res => res.json());
    localHomeMenudata2.subscribe(dataall => {
      let data2: any[];
      data2 = [];
      let data = dataall.data;
      if(data.length > 0){
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
          // "start_date": e.start_date,
          // "end_date": e.end_date,
          // "level": e.level,
          // "location": e.location

        }
        data2.push(item);
      }
      this.homemenu = data2;

    },
    err => {

    },
    () => {

    }
  );
  }


  loadData_Library_More() {

    let localHomeMenudata2;
    localHomeMenudata2 = this.http.get(this.url).map(res => res.json().data);
    localHomeMenudata2.subscribe(dataall => {
      let data2: any[];
      data2 = [];
      let data = dataall.data;
      if(data.length > 0){
        this.isDataAvilable = true;
        this.current_page = dataall.current_page;
        this.can_load_more = dataall.next_page_url != null;
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
          // "start_date": e.start_date,
          // "end_date": e.end_date,
          // "level": e.level,
          // "location": e.location

        }
        this.homemenu.push(item);
      }
      this.homemenu = data2;

    },
    err => {

    },
    () => {

    }
  );
  }

  //////////////////////////////////// 
  //         Section                // 
  //                Books           // 
  //    //////////////////////      // 


  loadData_Library_Books() {

  }

  loadData_Library_Books_More() {

  }


  //////////////////////////////////// 
  //         Section                // 
  //                Used_Item       // 
  //    //////////////////////      // 

  loadData_Used_Item() {

    let localHomeMenudata2 = this.http.get(this.url).map(res => res.json());
    localHomeMenudata2.subscribe(dataall => {
      let data = dataall.data;
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
        if (this.platform.dir() === "rtl") {
          name = e.name_ar;
        } else {
          name = e.name_en;
        }

        let item = {
          "id": e.id,
          "name": e.name,
          "image": eicon,
          "price": e.price,
          "by" : e.by,
          "currency" : e.currency,
          // "city_ar" : e.city.name,
          // "city_en" : e.city.name
        }

        data2.push(item);
      }
      this.homemenu = data2;
    });

  }

  loadData_Used_Item_More() {

    let localHomeMenudata2 = this.http.get(this.url).map(res => res.json());
    localHomeMenudata2.subscribe(dataall => {
      let data = dataall.data;
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
        if (this.platform.dir() === "rtl") {
          name = e.name_ar;
        } else {
          name = e.name_en;
        }
        
        let item = {
          "id": e.id,
          "name": e.name,
          "image": eicon,
          "price": e.price,
          "by" : e.by,
          "currency" : e.currency,
          "city_ar" : e.city.name_ar,
          "city_en" : e.city.name_en
        }
        
        this.homemenu.push(item);
      }
      // this.homemenu = data2;
    });
  }


  ///////////////////////////////////
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
    this.navCtrl.push(ItemDetailsPage, {
      'id' : id
    });
  }

  openUsedItemDetails(id) {
    this.navCtrl.push(UsedAdsDetailsPage, {
      'id' : id
    });
  }

  openItemStoreDetails (id){
    this.navCtrl.push(ItemDetailsStorePage, {
      'id' : id
    });
  }
  openCartPage2() {
    this.navCtrl.push(AccountfPage, {
      'select' : '1'
    });   
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

  openCareerItem(id) {
    // this.youtube.openVideo(url);

    this.navCtrl.push(MatchMakingDetailsPage, {
      'id' : id
    });
  }

  doInfinite(infiniteScroll) {
    if(this.can_load_more){
      setTimeout(() => {
        // this.loadNextPage();


        this.storage.get('city_id').then(city_id => {

          this.url = this.mainFunc.url + '/api/search-v2?query=' + this.query + '&type=' + this.secretid + '&limit=10&filters=&result=1&city_id=' + city_id + '?page=' + (this.current_page + 1);
          if(this.filterBy){
            switch (this.filterBy) {
              case 'COUNTRY_FILTER':
              this.url += "&filterBy=country";
                break;
              case 'CATEGORY_FILTER':
              this.url += "&filterBy=category";
                break;
              case 'LOCATION_FILTER':
              this.url += "&filterBy=location";
                break;
              case 'DATE_FILTER':
              this.url += "&filterBy=date";
                break;
              case 'COURSE_PROVIDER_FILTER':
              this.url = this.mainFunc.url + '/api/search-v2?query=' + this.query + '&type=' + this.secretid + '&limit=10&filters=&result=1?page=' + (this.current_page + 1);
              this.url += "&filterBy=courseProvider";
              break;
            }
          }
          console.log('doInfinite URL' ,  this.url);

           // Run The Correct Code Depend on type
          switch (this.secretid) {
            
            // product
            case 'product':
              this.loadData_Product_More();
            break;
    
            // item
            case 'item':
              this.loadData_Item_More();
            break;
    
            // course
            case 'course':
              this.loadData_Event_More();
            break;
    
            // event
            case 'event':
              this.loadData_Event_More();
            break;
    
            // career
            case 'career':
              this.loadData_Career_More();
            break;
    
            // library-videos
            case 'library':
              this.loadData_Library_More();
            break;
    
            // library-books
            case 'library-books':
              this.loadData_Library_Books_More();
            break;

            case 'used_item':
              this.loadData_Used_Item_More();
            break;
    
          }
        });


        infiniteScroll.complete();
      }, 1000)
    }else{
      infiniteScroll.complete();
    }
  }
















}
