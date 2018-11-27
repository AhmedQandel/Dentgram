import { Injectable, Inject, ViewChild } from '@angular/core';
import { Http, Headers,RequestOptions } from '@angular/http';
import { Nav, App, ToastController, LoadingController, Platform, Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { NavController } from "ionic-angular/index";


// import { CategorysPage } from "../../pages/categorys/categorys";
// import { BuyBrowseProductsPage } from "../../pages/buy-browse-products/buy-browse-products";
// import { UsedAdsDetailsPage } from "../../pages/used-ads-details/used-ads-details";
// import { CoursesDetailsPage } from "../../pages/courses-details/courses-details";
// import { LibraryDetailsPage } from "../../pages/library-details/library-details";
// import { MatchMakingDetailsPage } from "../../pages/match-making-details/match-making-details";


@Injectable()
export class MainFunctionsProvider {

  @ViewChild(Nav) nav: Nav;

  header=  new Headers();
  cartItems: any[];
  cartItemsNumber: number[];
  favItems: any[];
  token_id: string;
  loader: any;
  token: any;
  manuno1: boolean = false;
  manuno2: boolean = false;
  manuno3: boolean = false;
  manuno4: boolean = false;
  manuno5: boolean = false;
  manuno6: boolean = false;
  manuno7: boolean = false;
  manuno8: boolean = false;
  manuno9: boolean = false;

  // private navCtrl;
  // private navCtrl:NavController;

  url = "https://dentgram.com";

  EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  constructor(public http: Http,
    public toastCtrl: ToastController,
    private app: App,
    public storage: Storage,
    // private navCtrl: NavController, 
    public loadingController: LoadingController,
    public events: Events,
    public platform: Platform) {

    // this.navCtrl = this.app.getActiveNav();
    
    this.cartItems = [];
    this.cartItemsNumber = [];
    this.favItems = [];
    this.reSetFav();
    this.reSetCart();


    this.header.append('cache-control', 'cache'); 
    this.header.append('content-Type','application/json');
    this.header.append('X-requested-With','XMLHttpRequest');
    
  }

  getCartItemsNumber(){
    let itemsNumber = 0;

    for (var index = 0; index < this.cartItems.length; index++) {
           itemsNumber ++;
    }
    return itemsNumber;
  }

  getFavItemsNumber(){
    let itemsNumber = 0;

    for (var index = 0; index < this.favItems.length; index++) {
           itemsNumber ++;
    }
    return itemsNumber;
  }

  showToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  addToFav(item, flag){
  
    // add fav item on server
    let favoriteBody = {

      "flag" : flag,
      "item_id" : item
    }
    this.storage.get('token').then( token => {
      

      let url = this.url + '/api/favorite';
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      headers.append('Authorization', 'Bearer ' + token );        
      let options = new RequestOptions({headers: headers});
      
      this.http.post(url, JSON.stringify(favoriteBody) ,options).map(
        res => res.json())
        .subscribe(data => { 
          if(data.message === 'Successfully added to the favorites!'){
            this.showToast('تم إضافة المنتج لقائمة التفضيلات');
            this.favItems.push(item);
            this.storage.set('fav',this.favItems);
          }else{
            this.showToast('تم ازالة المنتج لقائمة التفضيلات');
            this.deleteFromFav(item);
            this.storage.set('fav',this.favItems);
          }
            
        },(error) => {
          this.showToast('حدث خطأ ما , من فضلك حاول في وقت لاحق');
        });
    });
  }

  addToCart(item){
    if (this.checkItemInCart(item)) {
      this.showToast('المنتج موجود في العربة بالفعل');
    } else {
      this.cartItems.push(item);
      this.cartItemsNumber.push(1);
      this.storage.set('cart',this.cartItems);
      this.storage.set('cartNumber',this.cartItemsNumber);
      this.showToast('تم إضافة المنتج لعربة التسوق');  
    }
  }



  updateCartCounter(op,id){

    let index = this.cartItemsNumber.indexOf(id);
    let old =+ this.cartItemsNumber[id];

    if (op == 'add'){
      this.cartItemsNumber[id] = old + 1;
    }else if (op == 'remove'){
      if (old > 1){
        this.cartItemsNumber[id] = old - 1;
      }
    }  
    this.storage.set('cartNumber', this.cartItemsNumber);
  }

  getCartItemCounter(id){
    let index = this.cartItems.indexOf(id);
    let valu = this.cartItemsNumber[index]
    return this.cartItemsNumber[index];
  }

  getCartItemid(id){
    let index = this.cartItems.indexOf(id);
    
    return index;
  }
  reSetFav(){
    this.favItems = [];
    this.storage.get('fav').then((val) => {
      if(val.length > 0){
        this.favItems = val;
      }else{
        this.favItems = [];  
      }
    }).catch((error) => {
      this.favItems = [];
    });
  }

  reSetCart(){
    this.cartItems = [];
    this.cartItemsNumber = [];
    this.storage.get('cart').then((val) => {
      if(val.length > 0){
        this.cartItems = val;
      }else{
        this.cartItems = [];  
      }
    }).catch((error) => {
      this.cartItems = [];
    });

    this.storage.get('cartNumber').then((val) => {
      if(val.length > 0){
        this.cartItemsNumber = val;
      }else{
        this.cartItemsNumber = [];  
      }
    }).catch((error) => {
      this.cartItemsNumber = [];
    });
  }

  
  checkItemInFav(id){
    let re: boolean = false;
    
    for (var index = 0; index < this.favItems.length; index++) {
      var element = this.favItems[index];
      if (id === element) {
        return true;
      }
    }
    return false;
  }

  checkItemInCart(id){
    let re: boolean = false;
    
    for (var index = 0; index < this.cartItems.length; index++) {
      var element = this.cartItems[index];
      if (id === element) {
        return true;
      }
    }
    return false;
  }
  
  deleteFromCart(id){
    let index = this.cartItems.indexOf(id);
    this.cartItems.splice(index, 1);
    this.cartItemsNumber.splice(index, 1);
    this.storage.set('cart',this.cartItems);
    this.storage.set('cartNumber',this.cartItemsNumber);
  }
  deleteAllCart(){
    this.cartItems = [];
    this.cartItemsNumber = [];
    this.storage.remove('cart');
    this.storage.remove('cartNumber');
    // this.storage.set('cart',this.cartItems);
    // this.storage.set('cartNumber',this.cartItemsNumber);
  }

  deleteFromFav(id){
    
    let index = this.favItems.indexOf(id);
    this.favItems.splice(index, 1);
    this.storage.set('fav',this.favItems);
  }

  isLoggedin(){
    let sittuation = false;
    this.storage.get('token').then(data => {
      if (data) {
        sittuation = true;
      }
    });
    return sittuation;
  }



  refreshToken(){
    let old_token : string;
    this.storage.get('token').then(token_id => {
      old_token = token_id;
      console.log('Old Token', old_token);
      
      // Refresh Token From The Server
     let full_url = this.url + '/api/auth/refresh?token=' + old_token;
     let recivedData = this.http.get(full_url).map(res => res.json());
     recivedData.subscribe(data => {
        this.storage.set('token', data.token);
        // this.token = data.token;

        console.log('New Token', data.token);
     },(error) => {
      this.storage.remove('token');
      this.storage.remove('pass_reqister');
      this.storage.remove('first_name'); 
      this.storage.remove('last_name');
      this.storage.remove('email');
      this.storage.remove('password');
      this.storage.remove('age');
      this.storage.remove('phone');
      this.storage.remove('gender');
     });
    });
    
     
  }

  // get(): Promise<any> {
  //   return this.storage.get('token').then(token_id => {
  //     this.token_id = token_id;
  //   });
  // }

  // set(token_id) {
  //   this.storage.set('token', token_id);
  // }

  // refresh(): Observable <any> {

  //   let obs = Observable.fromPromise(this.get())
  //     .filter(() => this.jwtHelper.istoken_idExpired(this.token_id))
  //     .flatMap(() =>  this.authHttp.get(''));
  //   obs.subscribe((response: Response) => {
  //     this.token_id = response.json().token_id;
  //     this.settoken_id(this.token_id);
  //   }, (error: Response) => {
  //     console.log(error);
  //   });
  //   return obs;
  // }

  showLoadingSign(){

  }

  showLoading(message: string, state: boolean){
    
    this.loader = this.loadingController.create({
      content: message
    });  
   
    if(!state){
      this.dismissLoading(); 
    }else{
       this.loader.present();
    }
    
  }
  dismissLoading(){
    setTimeout(() => {
      this.loader.dismiss();
    }, 500);
  }
  addItemToHistory(type, name){

    // Check If Item Founded 
  type = 'hist_' + type;
  let newarr: any[];
  let oldarr: any[];
  newarr = [];
  oldarr = [];

    this.storage.get(type).then((val) =>{
      oldarr = val;
      if (oldarr != null){

        // History Type Existed

        if (oldarr.length > 0){
        
          // History Type have data so we can check if item added before
          
          let count = oldarr.length;
          console.log('Oldarr Counter', count);
          if (count > 10){
            count = 10;
          }


          console.log('old array', oldarr);
          newarr.push(name);
          for (let i = 0; i < (count); i ++){
            let olditem = oldarr[i];
            
            console.log('Current i', i);
            console.log('old item', olditem);

            if(olditem === name){

            }else{
              newarr.push(olditem);
            }
          }

          
          this.storage.set(type, newarr);

          // newarr.push(name);
          // newarr.splice(0,0,name);

        }else{
          
          // History Type Empty so add data direct to storage
          newarr.push(name);
          this.storage.set(type, newarr);
        }
      }else{

        // History Type Not Added Before !!
        newarr.push(name);
        this.storage.set(type, newarr);
      }
      
    });
    
  }

  getItemsFromHist(type){

    type = 'hist_' + type;
    let newarr: any[];
    let oldarr: any[];
    newarr = [];
    oldarr = [];
  
    this.storage.get(type).then((val) =>{
      oldarr = val;
      if (oldarr != null){
        newarr = oldarr;    
      }else{
      }
    });

    return newarr;
  }
  financial(x) {
    // console.log(x);
    // return Number.parseFloat(x); //.toPrecision(4);
    // return Number.toInteger(x);
    return x;
  }

  encoder(url){
    return encodeURI(url);
  }

  showButton(ix){
    let i = +ix;

    let re: boolean = false;

    switch (i) {
      case 1:
        re = this.manuno1;
      break;
      case 2:
        re = this.manuno2;
      break;
      case 3:
        re = this.manuno3;
      break;
      case 4:
        re = this.manuno4;
      break;
      case 5:
        re = this.manuno5;
      break;
      case 6:
        re = this.manuno6;
      break;
      case 7:
        re = this.manuno7;
      break;
      case 8:
        re = this.manuno8;
      break;
      case 9:
        re = this.manuno9;
      break;
    }

    return re;
  }

  openSlider(action){
    if(action != null){
      this.events.publish('application:openSlide',action);
    }
  }
}
