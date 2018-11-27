import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';




@Component({
  selector: 'page-news-details',
  templateUrl: 'news-details.html',
})
export class NewsDetailsPage {


  
  isLogged: boolean = false;
  id;
  newsData={
    main_image:''
  };
  name;

  constructor(public navCtrl: NavController,
       public navParams: NavParams,
        public viewCtrl: ViewController, 
          private http: Http,
            public mainFunc: MainFunctionsProvider,
            public translate: TranslateService,
            public platform: Platform,
            public storage: Storage,
            private youtube: YoutubeVideoPlayer,
            private photoViewer: PhotoViewer) {


          this.mainFunc.showLoading('',true);

          this.id = this.navParams.get('id');

          this.getDataNews(this.id);
          this.mainFunc.dismissLoading();
          this.isLoggedIn();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailsPage');
    this.viewCtrl.setBackButtonText('');

    

  }




getDataNews(idNews){
 
  let url = this.mainFunc.url + '/api/structure/news/view/'+idNews
  let localNewsData = this.http.get(url).map(res => res.json());
  localNewsData.subscribe(data => {
    this.newsData=data[0];
    this.newsData.main_image=this.mainFunc.url + data[0].main_image;


  });

}


  

  isLoggedIn()
  {
    console.log("sssssssss");
    
    this.storage.get('token').then(data => {
      if (data !== null) {
        this.isLogged = true;
      }else{
        this.isLogged = false;
      }
    });
  }




}

