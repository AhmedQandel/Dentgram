

import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Storage } from '@ionic/storage';

import { TranslateService } from '@ngx-translate/core';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the ItemDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-courses-details',
  templateUrl: 'courses-details.html',
})
export class CoursesDetailsPage {
  // itemTitle: any;
  // itemPrice = 1890;
  // itemRate = 4.6;
  // itemId = '1';

  isLogged: boolean = false;
  id: any;
  name: any;
  description: any;
  image_full: any;
  image_thumb: any;
  model: any;
  length: any;
  width: any;
  height: any;
  weight: any;
  category_id: any;
  category_name: any;
  category_display_name: any;
  category_icon_full: any;
  category_icon_thumb: any;
  man_id: any;
  man_name: any;
  man_icon_full: any;
  man_icon_thumb: any;
  attributes: any;
  slides_list: any;
  spes: any;

  allData: any;
  imageMain: any;
 
  isDataAvilable = false;
  galleryType = 'regular';
  secretId = "";
  bestrecommended: any[];
  isFavourite=false;
   flag='';
  constructor(public navCtrl: NavController,
       public navParams: NavParams,
        public viewCtrl: ViewController, 
          private http: Http,
            public mainFunc: MainFunctionsProvider,
            public translate: TranslateService,
            private socialSharing: SocialSharing,
            public platform: Platform,
            public storage: Storage,
            private photoViewer: PhotoViewer) {
          // this.itemTitle = "عبارة عن جهاز يتم فيه توليد قوى الطرد المركزي عن طريق الدوران حيث تتجه الجزيئات الأكثر ثقالة إلى الخارج بعيدا عن محور الدوران";

          this.mainFunc.showLoading('',true);

          this.id = this.navParams.get('id');
          this.secretId = this.navParams.get('secretId');

          // let localBestRecommendeddata = this.http.get('assets/bestrecommended.json').map(res => res.json().items);
          // localBestRecommendeddata.subscribe(data => {
          //   this.bestrecommended = data;
          // });
          this.allData = [];
          this.mainFunc.dismissLoading();
          this.isLoggedIn()
          
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailsPage');
    this.viewCtrl.setBackButtonText('');

    this.storage.get('token').then( token => {


    let url = this.mainFunc.url + '/api/structure/' + this.secretId + '/view/' + this.id;
      let localHomeMenudata2 = this.http.get(url).map(res => res.json());
      localHomeMenudata2.subscribe(data => {
        this.attributes = [];
        this.slides_list = [];
        this.spes = [];
        this.imageMain = [];
        
        
        if (data.id != null && data.id != ''){
          this.isDataAvilable = true;
        
          this.allData = data;
          this.slides_list = data.gallery;
          this.imageMain = data.image.full;

          // this.image_full = data.image.full;
          // this.image_thumb = data.image.thumb;
          // this.model = data.model;
          // this.length = data.length;
          // this.width = data.width;
          // this.height = data.height;
          // this.weight = data.weight;
          // this.category_id = data.category.id;
          // this.category_icon_full = data.category.icon.full;
          // this.category_icon_thumb = data.category.icon.thumb;
          // this.man_id = data.manufacturer.id;
          // this.man_icon_full = data.manufacturer.icon.full;
          // this.man_icon_thumb = data.manufacturer.icon.thumb;
          // this.attributes = data.attribute_groups;
          // this.slides_list = data.gallery;


          // let item = {
          //   "name": ,
          //   "value": 
          // }
          // this.spes.push(item);


          if (this.platform.dir() === "rtl") {
            // this.name = data.name_ar;
            // this.description = data.description_ar;
            // this.category_name = data.category.name_ar;
            // this.category_display_name = data.category.display_name_ar;
            // this.man_name = data.manufacturer.name_ar;
          } else {
            // this.name = data.name_en;
            // this.description = data.description_en;
            // this.category_name = data.category.name_en;
            // this.category_display_name = data.category.display_name_en;
            // this.man_name = data.manufacturer.name_en;          
          }

        }else{
          this.isDataAvilable = false;
        }

      });

      if (this.secretId == 'events') {
        this.flag='event';
      }else{
        this.flag='course';

      }


      let urlFav = this.mainFunc.url + '/api/is_favorite?flag='+this.flag+'&item_id='+this.id+'&token='+token;
      let localFav = this.http.get(urlFav).map(res => res.json());
      localFav.subscribe(data => {
   console.log("sssss",data);
   
    
          this.isFavourite=data.is_favorite;
      
          console.log("sssss", this.isFavourite);
        
      });




      });
  }
  Share(name: any , image:any) {
    console.log(name);
    console.log(image);
    
    this.socialSharing.share(name, null, image, null)
      .then(
      () => {
        console.log("Success");
      }
      )
      .catch(
      (error) => {
        // const toto = this.toast.create({
        //   message: error.message,
        // });
        // toto.present();
      }
      );
  }

  addToCart(id,item){
    
    this.mainFunc.cartItems.push(id);
    this.mainFunc.showToast('تم إضافة المنتج لعربة التسوق');
    this.mainFunc.checkItemInCart(id);
  }
  addToCartFinished(item){
    // this.cartBadgeState = 'idle';
    // item.addButtonState = 'idle';
  }
  addToFav(item){
    this.mainFunc.addToFav(item, this.flag);
    if (this.isFavourite) {
      this.isFavourite=false;
    }else{
      this.isFavourite=true;
    }
  }
  
  openItemDetails(id) {
    // this.navCtrl.push(ItemDetailsPage);
  }
  openImage(url){
    this.photoViewer.show(url);
  }

  isLoggedIn()
  {
    this.storage.get('token').then(data => {
      if (data !== null) {
        this.isLogged = true;
      }else{
        this.isLogged = false;
      }
    });
  }

}

