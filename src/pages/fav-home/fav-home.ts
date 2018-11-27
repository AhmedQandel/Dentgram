import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, ViewController, Slides, Platform, Events } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Storage } from '@ionic/storage';

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

import { BuySellMainPage } from "../../pages/buy-sell-main/buy-sell-main";
import { CatalogueMainPage } from '../../pages/catalogue-main/catalogue-main';
import { CoursesCategoriesPage } from "../../pages/courses-categories/courses-categories";
import { BooksCategoriesPage } from "../../pages/books-categories/books-categories";
import { CoursesListPage } from "../../pages/courses-list/courses-list";

import { ConnectivityServiceProvider } from "../../providers/connectivity-service/connectivity-service";

import { CalenderPage } from "../calender/calender";
import { MatchMakingListPage } from "../match-making-list/match-making-list";

import { AuthProvider } from "../../providers/auth/auth";

import { FavCoursesListPage } from "../../pages/fav-list-courses/dr-fav-list-courses";

import { UsedPage } from "../used/used";

import { FCM } from '@ionic-native/fcm';
import { AlertController } from 'ionic-angular';
import { FavoritePageEvent } from '../../pages/fav-list-events/dr-fav-list-events';


@Component({
  selector: 'page-fav-home',
  templateUrl: 'fav-home.html',
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
export class FavHome {


  direc: any;
  direcR: any;

  constructor(public navCtrl: NavController, 
    private http: Http,
      public mainFunc: MainFunctionsProvider, 
        private changeDetector: ChangeDetectorRef,
          public viewCtrl: ViewController,
          public platform: Platform,
            public translate: TranslateService,
              public events: Events,
                public auth: AuthProvider,
                  public storage: Storage,
                    private fcm: FCM,
                    private alertCtrl: AlertController,
                      public chkconn: ConnectivityServiceProvider) {

               
      
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
  
  dismissview(){
    this.viewCtrl.dismiss();
  }

  openFavScreen(type){
    // if(type === 'courses'){
      this.navCtrl.push(FavCoursesListPage,{'secretid':type});
    // }else if(type === 'events'){
    //   this.navCtrl.push(FavoritePageEvent);
    // }
  
    }  


}
