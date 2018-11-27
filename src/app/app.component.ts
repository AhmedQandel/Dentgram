import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { enableProdMode } from '@angular/core';
import { HomePage } from '../pages/home/home';
import { BuySellMainPage } from '../pages/buy-sell-main/buy-sell-main';
import { MainFunctionsProvider } from '../providers/main-functions/main-functions';
import { CategorysPage } from "../pages/categorys/categorys";
import { AccountPage } from "../pages/account/account";
import { AuthCreatePage } from "../pages/auth-create/auth-create";
import { AuthLoginPage } from "../pages/auth-login/auth-login";
import { BrandsPage } from "../pages/brands/brands";
import { FaqPage } from "../pages/faq/faq";
import { StoresPage } from "../pages/stores/stores";
import { UsedPage } from "../pages/used/used";
import { AccAddressPage } from "../pages/acc-address/acc-address";
import { AccContactUsPage } from "../pages/acc-contact-us/acc-contact-us";
import { FavHome } from "../pages/fav-home/fav-home";
import { NewsPage } from "../pages/news-page/news-page";
import { AccFavPage } from "../pages/acc-fav/acc-fav";
import { AccInfoPage } from "../pages/acc-info/acc-info";
import { AccOrdersPage } from "../pages/acc-orders/acc-orders";
import { TranslateService } from '@ngx-translate/core';
import { AccountfPage } from "../pages/accountf/accountf";

import { AuthProvider } from "../providers/auth/auth";

import { CoursesPage } from "../pages/courses/courses";
import { TechniciansPage } from "../pages/technicians/technicians";
import { ElearningPage } from "../pages/elearning/elearning";
import { BlogPage } from "../pages/blog/blog";
import { Storage } from '@ionic/storage';

import { ConnectivityServiceProvider } from "../providers/connectivity-service/connectivity-service";



import { CatalogueMainPage } from '../pages/catalogue-main/catalogue-main';
import { CoursesCategoriesPage } from "../pages/courses-categories/courses-categories";
import { CoursesListPage } from "../pages/courses-list/courses-list";
import { BooksCategoriesPage } from "../pages/books-categories/books-categories";
import { MatchMakingPage } from "../pages/match-making/match-making";



import { ItemDetailsPage } from "../pages/item-details/item-details";
import { BuyBrowseProductsPage } from "../pages/buy-browse-products/buy-browse-products";
import { UsedAdsDetailsPage } from "../pages/used-ads-details/used-ads-details";
import { CoursesDetailsPage } from "../pages/courses-details/courses-details";
import { LibraryDetailsPage } from "../pages/library-details/library-details";
import { MatchMakingDetailsPage } from "../pages/match-making-details/match-making-details";


enableProdMode();

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { from } from 'rxjs/observable/from';
import { LanguageSelectPage } from '../pages/language-select/language-select';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = HomePage;
  rootPage: any;
  languageChange = false;
  pages: Array<{title: string, component: any}>;

  menuData: any[];
  lang_list: any[];
  categorys: any[];
  bestOvers: any[];
  activePage: any;
  direc: any;
  direcR: any;
  openCat: boolean;
  welcomeText = "Hi";
  lang_set: any = "en";
  menuSide: any;
  isLogged = false;
  username = "";
  Dfirst_name: string;
  Dlast_name: string;
  Demail: string;
  Dphone: string;
  Dgender: boolean = true;
  Dage: any;
  lang_country: string;
  lang_city: string;
  isAppPrefLoaded: boolean = false;
  thumb: string;
  Dthumb: string;
  Dimage: string;
  Dphoto: string;

  constructor(public platform: Platform,
       public statusBar: StatusBar,
         public splashScreen: SplashScreen,
          private http: Http,
            public mainFunc: MainFunctionsProvider,
              public menuCtrl: MenuController,
                public translate: TranslateService,
                  public storage: Storage,
                      public events: Events,
                        public alertCtrl: AlertController,
                          public auth: AuthProvider,
                            public conn: ConnectivityServiceProvider) {


                            this.conn.checkConnStartup();
                              
                            events.subscribe('application:isLogged', (token) => {
                              if(token !== false){
                                this.isLogged = true;
                              }else{
                                this.isLogged = false;
                              }
                              this.storage.get('thumb').then((val) => {
                                console.log("imageeee", val);
                                this.thumb = val;
                              });
                              this.storage.get('name').then((val) => {
                                console.log("nameeeee", val);
                                this.Dfirst_name = val;
                              });
                              this.storage.get('username').then((val) => {
                                if (val){
                                  this.username = val;
                                  this.storage.get('token').then( token => {
                                });
                                }
                              });
                            });

                            events.subscribe('application:openSlide', (arr) => {

                                if(arr != null){
                                  this.storage.get('city_id').then((city_id) => {
                                    
                                    let target = arr.target;
                                    let id = arr.id;
                                    let secretid = '';
                                    let pageClass: any;
                            
                                    switch (target) {
                                      case 'product':
                                        pageClass = ItemDetailsPage;
                                        secretid = "product";
                                      break;
                            
                                      case 'item':
                                        pageClass = BuyBrowseProductsPage;
                                        secretid = "item";
                                      break;
                            
                                      case 'used_item':
                                        pageClass = UsedAdsDetailsPage;
                                        secretid = "used_item";
                                      break;
                            
                                      case 'course':
                                        pageClass = CoursesDetailsPage;
                                        secretid = "course";
                                      break;
                            
                                      case 'event':
                                        pageClass = CoursesDetailsPage;
                                        secretid = "event";
                                      break;
                            
                                      case 'library_books':
                                        pageClass = LibraryDetailsPage;
                                        secretid = "library_books";
                                      break;
                            
                                      case 'library_videos':
                                        pageClass = LibraryDetailsPage;
                                        secretid = "library_videos";
                                      break;
                            
                                      case 'career':
                                        pageClass = MatchMakingDetailsPage;
                                        secretid = "career";
                                      break;
                            
                                    }
                            
                                    this.nav.push(pageClass, {
                                      'id': id,
                                      'secretid': secretid,
                                      'city_id' : city_id
                                    });
                            
                                  });
                            
                                  
                                }
                            });
                        events.subscribe('application:language', (language) => {
                          
                          this.storage.get('language').then((val) => {
                            console.log('Language', val);
                            

                            if(val === null || val === "") {

                              // this.storage.set('language', 'ar');
                              // this.lang_set = "ar";
                              // if (this.lang_set === "ar") {
                              //   this.menuCtrl.getMenus()[0].side = "right";
                              //   // this.menuCtrl.toggle('right');
                              //   // this.menuCtrl.getMenus()[0]("side","rigth");
                              //   this.menuSide = "rtl";
                              //   this.platform.setDir('ltr',false);
                              //   this.platform.setDir('rtl',true);
                              //   this.translate.setDefaultLang('ar');
                              // } else if (this.lang_set === "en") {
                              //   this.menuCtrl.getMenus()[0].side = "left";
                              //   // this.menuCtrl.toggle('left');
                              //   this.menuSide = "ltr";
                              //   this.platform.setDir('rtl',false);
                              //   this.platform.setDir('ltr',true);
                              //   this.translate.setDefaultLang('en');  
                              // }

                              this.rootPage = LanguageSelectPage;


                              // this.mainFunc.showToast('Language is : Null, and Set : ' + this.lang_set);
                            }else {
                              
                              this.storage.get('pass_reqister').then((val) => {
                                if (val){
                                  
                                }else{
                                  // this.rootPage = AuthLoginPage;
                                  this.nav.setRoot(AuthLoginPage);
                                }
                              });

                              this.lang_set = val;
                              // this.mainFunc.showToast('Language is : ' + val);
                              if (this.lang_set === "ar") {
                                this.menuCtrl.getMenus()[0].side = "right";
                                // this.menuCtrl.toggle('right');
                                this.menuSide = "rtl";
                                this.platform.setDir('ltr',false);
                                this.platform.setDir('rtl',true);
                                this.translate.setDefaultLang('ar');
                              } else if (this.lang_set === "en") {
                                this.menuCtrl.getMenus()[0].side = "left";
                                // this.menuCtrl.toggle('left');
                                this.menuSide = "ltr";
                                this.platform.setDir('rtl',false);
                                this.platform.setDir('ltr',true);
                                this.translate.setDefaultLang('en');  
                              }
                            }      
                          });
                      

                          
                          
                      
                          if (this.platform.dir() === "rtl") {
                            this.direc = "ltr";
                            this.direcR = "rtl"
                          } else {
                            this.direc = "rtl";
                            this.direcR = "ltr";  
                          }
                        });
                     
                        // this.platform.ready().then(() => {
                      //   this.nativeStorage.setItem('language','ar')
                      //   .then(
                      //     () => 
                
                      //     error => console.error('Error storing item', error)
                      //   );
                
                      //   this.nativeStorage.getItem('language')
                      //   .then(
                      //     data => console.log('Native Storage' + data),
                      //     error => console.error(error)
                      //   );
                      // });
                  /////////////////////////////////////
                      // this.platform.ready().then(() => {
                      //   this.nativeStorage.setItem('myitem', {property: 'value', anotherProperty: 'anotherValue'})
                      //     .then(
                      //       () => console.log('Stored item!'),
                      //       error => console.error('Error storing item', error)
                      //     );
                  
                      //   this.nativeStorage.getItem('myitem')
                      //     .then(
                      //       data => console.log(data),
                      //       error => console.error(error)
                      //     );
                      // });

                    // this.platform.ready().then(() => {
                      // this.initializeApp();                
                    // });
    
                
    // used for an example of ngFor and navigation

    this.rootPage = HomePage;

    this.pages = [
      { title: 'Home', component: HomePage }
    ];

    this.activePage = 'HomePage';

    // let localLangdata = this.http.get('assets/lang/app.json').map(res => res.json().items);
    // localLangdata.subscribe(data => {
    //   this.lang_list = data;
      
    //   if (this.platform.dir() === "rtl") {
    //     // this.welcomeText = data.welcome.ar;
        
    //   }else {
    //     // this.welcomeText = data['welcome'].en;
    //   }
    // });

    let localMenudata = this.http.get('assets/menulist.json').map(res => res.json().items);
    localMenudata.subscribe(data => {
      
      this.menuData = data;
      
    });

    let localCatdata = this.http.get('assets/cat.json').map(res => res.json().items);
    localCatdata.subscribe(data => {
      this.categorys = data;
    });

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      // this.showdd();  
      this.splashScreen.hide();
      this.statusBar.hide();
    });

    this.getAppPref();
  }

  showdd() {


    

    // this.direc = 'ltr';
   

    
  }

  ngOnInit() {
    // this.storage.get('token').then( token => {
    //       let url = this.mainFunc.url + '/api/user/profile?token=' + token;
    //       let localdata_content = this.http.get(url).map(res => res.json());
    //       localdata_content.subscribe(data => {
    //         this.isLogged = true;
    //         this.Dfirst_name = data.first_name;
    //         this.Dlast_name = data.last_name;
    //         this.Demail = data.email;
    //         this.Dphone = data.phone;
    //         this.Dgender = data.gender;
    //         this.Dage = data.age;
    //         this.lang_country = data.country_id;
    //         this.thumb = data.thumb;
    //         this.Dimage = null;

    //         this.lang_city = data.city_id;
    //       });
    // });
    this.events.subscribe('application:isLogged', (token) => {
      if(token !== false){
        this.isLogged = true;
      }else{
        this.isLogged = false;
      }
      this.storage.get('thumb').then((val) => {
        this.thumb = val;
      });
      this.storage.get('name').then((val) => {
        this.Dfirst_name = val;
      });
      this.storage.get('username').then((val) => {
        if (val){
          this.username = val;
          this.storage.get('token').then( token => {
        });
        }
      });
    });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
   // this.nav.setRoot(page.component);
  }

  menuClick(sub,pagename){
    this.openCat = sub;
    this.activePage = pagename;
    console.log('Selected page', pagename);
    let pageClass: any;
    let openType: any;
    let select: any;
    let secretid: any;
    let pagetitle: any;


    if (pagename != 'CategoryPage') {
      switch (pagename) {
        case 'HomePage':
          pageClass = HomePage;
          openType = 'in';
          break;
          case 'MENU_CATALOGUE':
          pageClass = CatalogueMainPage;
          openType = 'out';
          secretid = 'for_catalogue';
          pagetitle = 'MENU_CATALOGUE';
          break;
        case 'MENU_BUY_SELL':
          if(this.mainFunc.manuno8){
            pageClass = UsedPage;
            openType = 'out';
            secretid = '';
            pagetitle = '';
          }else{
            pageClass = BuySellMainPage;
            openType = 'out';
            secretid = '';
            pagetitle = '';
          }
          break;
        case 'MENU_COURSES':
          pageClass = CoursesListPage;
          openType = 'out';
          secretid = 'course';
          pagetitle = 'MENU_COURSES';
          break;
        case 'MENU_LIBRARY':
          pageClass = CoursesListPage;
          openType = 'out';
          secretid = 'library';
          pagetitle = 'MENU_LIBRARY';
          break;
        case 'MENU_CALENDAR':
          pageClass = CoursesListPage;
          openType = 'out';
          secretid = 'event';
          pagetitle = 'MENU_CALENDAR';
          break;
        case 'MENU_MATCH_MAKING':
          pageClass = MatchMakingPage;
          openType = 'out';
          secretid = '';
          pagetitle = '';
          break; 

        case 'BrandsPage':
          pageClass = BrandsPage;
          openType = 'in';
          break;

          case 'NewsPage':
          pageClass = NewsPage;
          openType = 'out';
          break;

        case 'FaqPage':
          pageClass = FaqPage;
          openType = 'in';       
          break;
        case 'StoresPage':
          pageClass = StoresPage;
          openType = 'in';
          break;
        case 'UsedPage':
          pageClass = UsedPage;
          openType = 'out';
          break;
        case 'AccAddressPage':
          pageClass = AccountPage;
          select = '2';
          openType = 'out';
          break;
        case 'FavHome':
          pageClass = FavHome;
          select = '4';
          openType = 'out';
          break;
       
        case 'AccContactUsPage':
          pageClass = AccContactUsPage;
          select = '4';
          openType = 'out';
          break;
        case 'AccountPage':
          pageClass = AccountPage;
          openType = 'out';
          break;
        case 'AuthCreatePage':
          pageClass = AuthCreatePage;
          openType = 'in';
          break;
        case 'AuthLoginPage':
          pageClass = AuthLoginPage;
          openType = 'in';
          break;
        case 'AccInfoPage':
          pageClass = AccountPage;
          select = '1';
          openType = 'out';
          break;
        case 'FavPage':
          pageClass = AccountfPage;
          select = '0';
          openType = 'out';
          break;
        case 'CartPage':
          pageClass = AccountfPage;
          select = '1';
          openType = 'out';
          break;
        case 'AccOrdersPage':
          pageClass = AccountPage;
          select = '0';
          openType = 'out';
          break;
        case 'CoursesPage':
          pageClass = CoursesPage;
          select = '0';
          openType = 'out';
          break;
        case 'TechniciansPage':
          pageClass = TechniciansPage;
          select = '0';
          openType = 'out';
          break;
        case 'ElearningPage':
          pageClass = ElearningPage;
          select = '0';
          openType = 'out';
          break;
        case 'BlogPage':
          pageClass = BlogPage;
          select = '0';
          openType = 'out';
          break;                                                                                                   
        case 'AuthSignoutPage':
          // pageClass = ;
          openType = 'signout';



          break;
        case 'ChangeLanguage':
          openType = 'ChangeLanguage';
          break;
      }

      this.showPopup(openType, pageClass, select,pagetitle,secretid)
      
      if (openType === 'ChangeLanguage'){
        this.changeLang();
      }
      if (openType === 'signout'){
        this.signOut();
      }
    }
    
  }


  showPopup(openType, pageClass, select,pagetitle,secretid) {
console.log(pageClass);

    if(pageClass == CatalogueMainPage){
      let alert = this.alertCtrl.create({
        title: 'Catalogue',
        message: 'Welcome to our digital dental directory. We work hard to put more than 2000 manufactures, 5000 distributors and 100,000 different products all together. In case you do not find what you are looking for, or you have any suggestions, please share it with us.' ,
        buttons: [
          {
            text: 'Okay',
            role: 'cancel',
            handler: () => {
              if (openType === 'in'){
                this.nav.setRoot(pageClass);
                this.menuCtrl.close();
              }else if (openType === 'out'){
        
                this.nav.push(pageClass, {
                  'select' : select,
                  'title': pagetitle,
                  'secretid': secretid
                });
        
                this.menuCtrl.close();
              }
            }
          },
        ]
      });
      alert.present();
    }
    // else if(pageClass == BuySellMainPage || pageClass ==UsedPage){
    //   let alert = this.alertCtrl.create({
    //     title: 'Buy & Sell',
    //     message: 'Welcome to our digital dental directory. We work hard to put more than 2000 manufactures, 5000 distributors and 100,000 different products all together. In case you do not find what you are looking for, or you have any suggestions, please share it with us.' ,
    //     buttons: [
    //       {
    //         text: 'Okay',
    //         role: 'cancel',
    //         handler: () => {
    //           if (openType === 'in'){
    //             this.nav.setRoot(pageClass);
    //             this.menuCtrl.close();
    //           }else if (openType === 'out'){
        
    //             this.nav.push(pageClass, {
    //               'select' : select,
    //               'title': pagetitle,
    //               'secretid': secretid
    //             });
        
    //             this.menuCtrl.close();
    //           }
    //         }
    //       },
    //     ]
    //   });
    //   alert.present();
    // }
    
    
    else{
      if (openType === 'in'){
        this.nav.setRoot(pageClass);
        this.menuCtrl.close();
      }else if (openType === 'out'){

        this.nav.push(pageClass, {
          'select' : select,
          'title': pagetitle,
          'secretid': secretid
        });

        this.menuCtrl.close();
      }
    }
      
  }

    getAppPref(){

    this.storage.get('appPrefLoaded').then( data => {
      if(data){
       this.isAppPrefLoaded = true;
      }else{
        let urlx = this.mainFunc.url + '/api/app-preferences';
        let localHomeMenudata2;
        localHomeMenudata2 = this.http.get(urlx).map(res => res.json());  
        localHomeMenudata2.subscribe(data => {
          let dataarr: any = data;

          // for (let index = 0; index < dataarr.length; index++) {
          //   const element = dataarr[index];
          //   console.log(element);
          // }
          
          let ss1 = +data[0].s1;
          let ss2 = +data[0].s2;
          let ss3 = +data[0].s3;
          let ss4 = +data[0].s4;
          let ss5 = +data[0].s5;
          let ss6 = +data[0].s6;
          let ss7 = +data[0].buy_sell_behavior;
          
          if( ss1 == 1){
            this.mainFunc.manuno1 = true;  
          }
          if( ss2 == 1){
            this.mainFunc.manuno2 = true;  
          }
          if( ss3 == 1){
            this.mainFunc.manuno3 = true;  
          }
          if( ss4 == 1){
            this.mainFunc.manuno4 = true;  
          }
          if( ss5 == 1){
            this.mainFunc.manuno5 = true;  
          }
          if( ss6 == 1){
            this.mainFunc.manuno6 = true;  
          }
          if( ss7 == 1){
            // Default Store View
            this.mainFunc.manuno7 = true;  
          }
          if( ss7 == 2){
            // Used Items Only
            this.mainFunc.manuno8 = true;  
          }
          if( ss7 == 3){
            // New Stores Only
            this.mainFunc.manuno9 = true;  
          }

          // this.mainFunc.manuno1 = ss1;
          // this.mainFunc.manuno2 = data[0].s2;
          // this.mainFunc.manuno3 = data[0].s3;
          // this.mainFunc.manuno4 = data[0].s4;
          // this.mainFunc.manuno5 = data[0].s5;
          // this.mainFunc.manuno6 = data[0].s6;
          // this.mainFunc.manuno7 = data[0].buy_sell_behavior;

        });

      }

    });

  }

  subMenuClick(id, cat){
    let parm: Object ={
      id: id,
      name: cat
    }
    this.nav.push(CategorysPage, parm);
  }
  checkActive(page){
    // let pages: any;
    //pages = this.getPageClassName(page);
   return page == this.activePage;
  }

  openLoginScreen(){
    this.nav.push(AuthLoginPage);
  }

  signOut(){
    let lang = this.lang_set;
    // if (this.languageChange === false) {
      this.storage.get('language').then((val) => {
        lang = val;
      });
      lang = this.lang_set;
      if(lang === "ar"){
        let alert = this.alertCtrl.create({
          title: 'دنتجرام',
          subTitle: 'تسجيل الخروج من التطبيق',
          buttons: [
            {
              text: 'موافق',
              handler: data => {
                this.splashScreen.show();
                // this.languageChange = true;
                this.isLogged = false;
                this.storage.remove('token');
                this.storage.remove('name');
                this.storage.remove('thumb');
                this.storage.remove('pass_reqister');
                this.events.publish('application:isLogged');
                setTimeout(() => {
                  window.location.reload();
                }, 1500)
              }
            }
          ]
        });
        alert.present();
      } else if(lang === "en"){
        let alert = this.alertCtrl.create({
          title: 'Dentgram',
          subTitle: 'Signout from the application',
          buttons: [
            {
              text: 'Ok',
              handler: data => {
                this.splashScreen.show();
                this.isLogged = false;
                this.storage.remove('token');
                this.storage.remove('name');
                this.storage.remove('thumb');
                this.storage.remove('pass_reqister');
                this.events.publish('application:isLogged');
                setTimeout(() => {
                  window.location.reload();
                }, 1500)
              }
            }
          ]
        });
        alert.present();
      }
    // } 
  }

  changeLang(){
    let lang = this.lang_set;
    if (this.languageChange === false) {
      this.storage.get('language').then((val) => {
        lang = val;
      });
      lang = this.lang_set;
      if(lang === "ar"){
        let alert = this.alertCtrl.create({
          title: 'دنتجرام',
          subTitle: 'سيتم اعادة تشغيل التطبيق لتفعيل تغيير اللغة',
          buttons: [
            {
              text: 'موافق',
              handler: data => {
                this.splashScreen.show();
                this.languageChange = true;
                this.storage.set('language','en');
                setTimeout(() => {
                  window.location.reload();
                }, 1500)
              }
            }
          ]
        });
        alert.present();
      } else if(lang === "en"){
        let alert = this.alertCtrl.create({
          title: 'Dentgram',
          subTitle: 'The application will restart in order to change the language',
          buttons: [
            {
              text: 'Ok',
              handler: data => {
                this.splashScreen.show();
                this.storage.set('language','ar');
                this.languageChange = true;
                setTimeout(() => {
                  window.location.reload();
                }, 1500)
              }
            }
          ]
        });
        alert.present();
      }
    } 
  }

  goAccount() {
    this.nav.push(AccountPage, {select: 1});
  }

  showIt(x,ctrl){
    if(ctrl != 0 && ctrl != 99){
      return this.mainFunc.showButton(ctrl);
    }else if(ctrl == 99){
      if(this.mainFunc.manuno9 == false && this.mainFunc.manuno7 == false){
        return false;
      }else{
        return true;
      }
    }else{
      if (x === false){
        return true;
      }else if(x === true && this.isLogged){
        return true;
      }else{
        return false;
      }
    }
  }
}
