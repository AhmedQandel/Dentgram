import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { AccountfPage } from "../../pages/accountf/accountf";
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the ItemDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html',
})
export class ItemDetailsPage {
  // itemTitle: any;
  // itemPrice = 1890;
  // itemRate = 4.6;
  // itemId = '1';

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
  isLogged: boolean = false;
  distributor:any;
  isDataAvilable = false;
  isFavourite=false;

  bestrecommended: any[];

  constructor(public navCtrl: NavController,
       public navParams: NavParams,
        public viewCtrl: ViewController, 
          private http: Http,
            public mainFunc: MainFunctionsProvider,
            public translate: TranslateService,
            public platform: Platform,
            private socialSharing: SocialSharing,
            public storage: Storage,
            private photoViewer: PhotoViewer) {
          // this.itemTitle = "عبارة عن جهاز يتم فيه توليد قوى الطرد المركزي عن طريق الدوران حيث تتجه الجزيئات الأكثر ثقالة إلى الخارج بعيدا عن محور الدوران";

          // this.mainFunc.showLoading('',true);

          this.id = this.navParams.get('id');
          
          this.bestrecommended = [];
          // let localBestRecommendeddata = this.http.get('assets/bestrecommended.json').map(res => res.json().items);
          // localBestRecommendeddata.subscribe(data => {
          //   this.bestrecommended = data;
          // });

          // this.mainFunc.dismissLoading();
          this.isLoggedIn()
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailsPage');
    this.viewCtrl.setBackButtonText('');
     
    this.storage.get('city_id').then(city_id => {
      let tokenkey='';
      this.storage.get('token').then( token => {
        tokenkey=token;
        console.log(tokenkey);
        
   

    let url = this.mainFunc.url + '/api/structure/products/view/' + this.id + '?city_id='+city_id;
      let localHomeMenudata2 = this.http.get(url).map(res => res.json());
      localHomeMenudata2.subscribe(data => {
        this.attributes = [];
        this.slides_list = [];
        this.spes = [];

        if (data.id != null && data.id != ''){
          this.isDataAvilable = true;
          
          this.image_full = data.image.full;
          this.image_thumb = data.image.thumb;
          this.model = data.model;
          this.length = data.length;
          this.width = data.width;
          this.height = data.height;
          this.weight = data.weight;
          this.category_id = data.category.id;
          this.category_icon_full = data.category.icon.full;
          this.category_icon_thumb = data.category.icon.thumb;
          this.man_id = data.manufacturer.id;
          this.man_icon_full = data.manufacturer.icon.full;
          this.man_icon_thumb = data.manufacturer.icon.thumb;
          this.attributes = data.attribute_groups;
          this.slides_list = data.gallery;
          this.distributor=data.distributor;
          // let item = {
          //   "name": ,
          //   "value": 
          // }
          // this.spes.push(item);


          if (this.platform.dir() === "rtl") {
            this.name = data.name_ar;
            this.description = data.description_ar;
            this.category_name = data.category.name_ar;
            this.category_display_name = data.category.display_name_ar;
            this.man_name = data.manufacturer.name_ar;
            this.bestrecommended_data(this.name);
          } else {
            this.name = data.name_en;
            this.description = data.description_en;
            this.category_name = data.category.name_en;
            this.category_display_name = data.category.display_name_en;
            this.man_name = data.manufacturer.name_en;   
            this.bestrecommended_data(this.name);       
          }

        }else{
          this.isDataAvilable = false;
        }

        
      });


      let urlFav = this.mainFunc.url + '/api/is_favorite?flag=product&item_id='+this.id+'&token='+token;
      let localFav = this.http.get(urlFav).map(res => res.json());
      localFav.subscribe(data => {
   console.log("sssss",data);
   
    
          this.isFavourite=data.is_favorite;
      
          console.log("sssss", this.isFavourite);
        
      });




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
  showData(){
console.log("dd");

        document.getElementById('phone').click();

  }
  bestrecommended_data(name){
    let url = this.mainFunc.url + '/api/search?query=' + name + '&type=product&limit=5&filters=&result=1';
    let localHomeMenudata2 = this.http.get(url).map(res => res.json());
    localHomeMenudata2.subscribe(dataall => {

      let data = dataall.data;
      let name = "";
      let data2: any[];
      data2 = [];
      if (data.length > 0){
        this.isDataAvilable = true;
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
        data2.push(item);
      }
      this.bestrecommended = data2;
    });
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
    this.mainFunc.addToFav(item,'product');
    if (this.isFavourite) {
      this.isFavourite=false;
    }else{
      this.isFavourite=true;
    }
  }
  removeFromFav(item){

  }
  openImage(url){
    url = encodeURI(url);
    this.photoViewer.show(url);
  }
  openItemDetails(id) {
    this.navCtrl.push(ItemDetailsPage, {
      'id' : id
    });
  }

  openCartPage2() {
    this.navCtrl.push(AccountfPage, {
      'select' : '1'
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
