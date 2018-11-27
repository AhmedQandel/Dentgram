import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, ModalController, NavParams, Content, ViewController, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { TranslateService } from '@ngx-translate/core';
// import { CurrencyPipe } from '@angular/common';

import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// import { trigger, state, style, animate, transition, group, keyframes } from '@angular/animations';

import 'rxjs/add/operator/map';
// import { ItemDetailsPage } from "../../pages/item-details/item-details";
import { AccountPage } from "../../pages/account/account";


@Component({
  selector: 'page-acc-cart',
  templateUrl: 'acc-cart.html',
})

export class AccCartPage {
  @ViewChild(Content) content: Content;
  direc: any;
  direcR: any;
  fav: any[];
  itemsList: any[];
  isGrid = false;
  toTal = 0;
  finalTotalShipping = 0;
  cartBadgeState: string = 'idle';

  tab_1_edit_cart: boolean;
  tab_1_edit_cart_check_total: boolean;
  tab_1_select_address: boolean;
  tab_1_thank_you: boolean;
  tab_1_payment_method: boolean;
  isLoadingNow: boolean;
  check_cart_items: boolean;
  token: any;
  cartitemslist: any[];
  address_list: any[];
  subTotal = 0;
  finalTotal = 0;
  shippingWayList = [];
  store_list = [];
  isCartHaveData = false;
  small_tab_cart = true;
  small_tab_shipping = false;
  small_tab_address = false;
  small_tab_payment = false;

  reloadAddresses = false;

  selected_address = null;

  final_sub_price_price = 0;
  total_cod_price = 0;
  total_shipping_price = 0;

  // CartitemsObject: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController,
      public translate: TranslateService,
      public platform: Platform,
      public myModal: ModalController,
      public alertCtrl: AlertController,
      public storage: Storage, 
      private http: Http) {

        this.tab_1_edit_cart = true;
        this.tab_1_edit_cart_check_total = false;
        this.tab_1_payment_method = false;
        this.tab_1_select_address = false;
        this.tab_1_thank_you = false;
        // this.CartitemsObject = [];
        // for (var index = 0; index < this.mainFunc.cartItems.length; index++) {
        //   let valObj = this.mainFunc.cartItems[index]; //.indexOf(id);
        //   // let valObjindex = this.mainFunc.cartItems.indexOf(valObj);
        //   let valu = this.mainFunc.cartItemsNumber[index];
        //   this.CartitemsObject[valObj] = valu;
        // }
        

        this.viewCtrl.setBackButtonText('');
        this.storage.get('cart').then((val) =>{
          let arr: any[] = val;
          if (arr != null){
            if (arr.length > 0){
              this.isCartHaveData = true;
            }else{
              this.isCartHaveData = false;
            }
          }
          console.log('Storage Cart', val);
        });

  }

  ionViewWillEnter(){
    // if(this.reloadAddresses){
      this.loadAddressData();
      // this.reloadAddresses = false;
    // }
    console.log( 'ionViewWillEnter accCartPage' );
  }
  addNewAddress() {
    // let myData = {
    //   'select' : 2
    // }
    // let modaloptions: ModalOptions = {
    //   enterAnimation: 'modal-scale-up-enter'
    // }
    // this.reloadAddresses = true;

    // let modal = this.myModal.create(AccountPage, myData);
    // modal.present();

    this.navCtrl.push(AccountPage, {
      'select' : 2
    });   
  }
  ionViewDidLoad() {
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }

    // this.mainFunc.showLoading('',true);
    // this.isLoadingNow = true;

    
    this.loadData();
    // this.mainFunc.dismissLoading();
    // this.toTal = this.accountcartTotal()  
  }

  dismissview(){
    this.navCtrl.parent.viewCtrl.dismiss();
  }

  filterItems(searchTerm){
    return this.itemsList.filter((item) => {
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });     
  }

  addToCartFinished(item){
    this.cartBadgeState = 'idle';
    item.addButtonState = 'idle';
  }
  addToFav(item){
    // this.mainFunc.addToFav(item);
  }
  
  openItemDetails(id){

  }
  accountcartTotal(){
    
  }

  loadAddressData(){

    if (navigator.onLine){
      
      this.address_list = [];
      this.storage.get('token').then(token_id => {
        this.token = token_id;
        let Url_request = this.mainFunc.url + "/api/user/address/all?token=" + this.token;
        let localdata_content = this.http.get(Url_request).map(res => res.json());
          localdata_content.subscribe(data => {
            this.address_list = data;
          });
      });
    
    }

  }

  loadData(){
    this.isLoadingNow = true;

    this.finalTotal = 0;
    this.store_list = [];
    this.cartitemslist = [];
    let cartItemsStored = this.mainFunc.cartItems.length;
    for (var index = 0; index < cartItemsStored; index++) {
      this.cartitemslist.push({
        "item_id" : this.mainFunc.cartItems[index],
        "quantity" : this.mainFunc.cartItemsNumber[index]
      })
    }
    
    
    let body_application = {

      "items" : this.cartitemslist
    }
    console.log('Card Sent Data', body_application);

    this.storage.get('token').then(token_id => {
      this.token = token_id;
      let header = this.mainFunc.header;
      let Url_request = this.mainFunc.url + "/api/orders/cart?token=" + this.token;

      this.http.post(Url_request, JSON.stringify(body_application), {headers: header})
      .map(res => res.json())
      .subscribe(data => {

        if(data.details.length > 0){
          this.isLoadingNow = false;
        }else{
          this.isLoadingNow = true;
        }

        // this.itemsList
        this.itemsList = data.details;
        // this.subTotal = data.total_price ;
        this.finalTotal = data.total_price ;
        console.log('Cart Data', data);

        for (var index = 0; index < data.details.length; index++) {
          this.store_list.push(data.details[index].store_id);
          // this.shippingWayList.push(null);
        }
        console.log('Stores Ids', this.store_list);
      },(error) => {

      });

    });

    // let localItemsdata = this.http.get('assets/items.json').map(res => res.json().items);
    // localItemsdata.subscribe(data => {
    //   // this.itemsList = data;
    //   this.toTal = 0;
    //   for (var index = 0; index < data.length; index++) {
    //     var element = data[index].id;
    //     if (this.mainFunc.checkItemInCart(element)) {
    //       let x =+ data[index].price;
    //       this.toTal = this.toTal + x;
    //     }
    //   }
    // });

    
    // this.isLoadingNow = false;
  }

  loadDataForShipping(){
    // this.finalTotal = 0;
    // this.store_list = [];

    this.cartitemslist = [];
    let cartItemsStored = this.mainFunc.cartItems.length;
    for (var index = 0; index < cartItemsStored; index++) {
      this.cartitemslist.push({
        "item_id" : this.mainFunc.cartItems[index],
        "quantity" : this.mainFunc.cartItemsNumber[index]
      })
    }
    
    
    let body_application = {

      "items" : this.cartitemslist,
      "shipping_profile_ids" : this.shippingWayList,
      "payment_method" : "COD",
      "confirm" : 0
    }

    this.storage.get('token').then(token_id => {
      this.token = token_id;
      let header = this.mainFunc.header;
      let Url_request = this.mainFunc.url + "/api/orders/cart?token=" + this.token;

      this.http.post(Url_request, JSON.stringify(body_application), {headers: header})
      .map(res => res.json())
      .subscribe(data => {


        let final_price_data = +data.final_price;
        let total_shipping_data = +data.total_shipping;
        let total_cod_data = +data.total_cod;
        
        this.finalTotalShipping = final_price_data + total_shipping_data + total_cod_data;

      },(error) => {

      });

    });   
    
    
  }
  

  deleteFromCart(id){
    this.mainFunc.deleteFromCart(id);
    this.loadData();
  }
  clickContenuShopping(){
    
    this.content.scrollTo(0, 0);
    this.small_tab_cart = false;
    this.small_tab_shipping = true;
    this.small_tab_address = false;
    this.small_tab_payment = false;
    this.tab_1_payment_method = false;

    // this.mainFunc.showLoading('',true);
    this.loadData();
    // this.mainFunc.dismissLoading();
    this.content.scrollTo(0, 0);
    // this.tab_1_edit_cart = false;
    this.tab_1_edit_cart_check_total = true;
    // this.tab_1_select_address = true;

  }
  clickContenuShoppingAddress(){
    // Contenu To Select Address
    
    // this.isLoadingNow = true;

    this.content.scrollTo(0, 0);
    this.small_tab_cart = false;
    this.small_tab_shipping = false;
    this.small_tab_address = true;
    this.small_tab_payment = false;
    console.log('Shipping Methods', this.shippingWayList);
    let validShipp = false;
    for (var index = 0; index < this.shippingWayList.length; index++) {
      if(this.shippingWayList[index] === null || this.shippingWayList[index] < 1){
        validShipp = false;
      }else{
        validShipp = true;
      }
    }
    if(this.shippingWayList.length != this.store_list.length){
      validShipp = false;
    }

    if(validShipp === true){
      // this.mainFunc.showLoading('',true);
      this.loadData();
      // this.mainFunc.dismissLoading();
      this.tab_1_edit_cart = false;
      this.tab_1_edit_cart_check_total = true;
      this.tab_1_select_address = true;
      this.tab_1_payment_method = false;
      this.loadAddressData();
      this.loadDataForShipping();
    }else{

      if (this.platform.dir() === "rtl") {
        let alert = this.alertCtrl.create({
          title: 'طريقة الشحن',
          // subTitle: 'أختر طريقة الشحن',
          message: 'قم باختيار طريقة الشحن المناسبة عن طريق الضغط عيها, يوجد طرق مختلفة للشحن',
          buttons: ['حسنا']
        });
        alert.present();
      } else {
        let alert = this.alertCtrl.create({
          title: 'Shipping Method',
          // subTitle: 'Choose shipping method',
          message: 'Please Select shipping method by click on it, there is different shipping methods provided',
          buttons: ['Ok']
        });
        alert.present();
      }

      
    }
    // this.isLoadingNow = false;
  }

  clickPaymentMethod() {

  if(this.selected_address != null){

    this.isLoadingNow = true;

    this.content.scrollTo(0, 0);
    this.small_tab_cart = false;
    this.small_tab_shipping = false;
    this.small_tab_address = false;
    this.small_tab_payment = true;

    this.tab_1_edit_cart = false;
    this.tab_1_edit_cart_check_total = false;
    this.tab_1_select_address = false;
    this.tab_1_payment_method = true;
    
    /////////////////////////// Load Payment Total \\\\\\\\\\\\\\\\\\\\\\
    

    this.cartitemslist = [];
    let cartItemsStored = this.mainFunc.cartItems.length;
    for (var index = 0; index < cartItemsStored; index++) {
      this.cartitemslist.push({
        "item_id" : this.mainFunc.cartItems[index],
        "quantity" : this.mainFunc.cartItemsNumber[index]
      })
    }
    
    
    let body_application = {

      "items" : this.cartitemslist,
      "shipping_profile_ids" : this.shippingWayList,
      "payment_method" : "COD",
      "confirm" : 0
    }

    this.storage.get('token').then(token_id => {
      this.token = token_id;
      let header = this.mainFunc.header;
      let Url_request = this.mainFunc.url + "/api/orders/cart?token=" + this.token;

      this.http.post(Url_request, JSON.stringify(body_application), {headers: header})
      .map(res => res.json())
      .subscribe(data => {


        if(data.details.length > 0){
          this.isLoadingNow = false;
        }else{
          this.isLoadingNow = true;
        }
        // this.itemsList
        // this.itemsList = data.details;
        // this.subTotal = data.total_price ;


        this.final_sub_price_price = +data.final_price;
        this.total_cod_price = +data.total_cod;
        this.total_shipping_price = +data.total_shipping;

        let final_price_data = +data.final_price;
        let total_shipping_data = +data.total_shipping;
        let total_cod_data = +data.total_cod;
        
        this.finalTotalShipping = final_price_data + total_shipping_data + total_cod_data;

      },(error) => {

      });

    });
    // this.isLoadingNow = false;
  }else{
    //////////////// if user don't select address \\\\\\\\\\\\\\\\\\\

    if (this.platform.dir() === "rtl") {
      let alert = this.alertCtrl.create({
        title: 'عنوان الشحن',
        // subTitle: 'أختر عنوان الشحن',
        message: 'من فضلك اختر عنوان للشحن إليه او اضف عنوان جديد',
        buttons: ['حسنا']
      });
      alert.present();
    } else {
      let alert = this.alertCtrl.create({
        title: 'Shipping Address',
        // subTitle: 'Choose shipping address',
        message: 'Please select shipping address or add new one',
        buttons: ['Ok']
      });
      alert.present();
    }
  }

    

  }
  clickFinishShopping(){  

    /////////////////////////////////
    //////////////////////////////
    ///////////////////////////////////
    /////////////////////////////////
    this.isLoadingNow = true;

    this.cartitemslist = [];
    let cartItemsStored = this.mainFunc.cartItems.length;
    for (var index = 0; index < cartItemsStored; index++) {
      this.cartitemslist.push({
        "item_id" : this.mainFunc.cartItems[index],
        "quantity" : this.mainFunc.cartItemsNumber[index]
      })
    }
    
    
    let body_application = {

      "items" : this.cartitemslist,
      "shipping_profile_ids" : this.shippingWayList,
      "user_address_id" : this.selected_address,
      "payment_method" : "COD",
      "confirm" : 1
    }

    this.storage.get('token').then(token_id => {
      this.token = token_id;
      let header = this.mainFunc.header;
      let Url_request = this.mainFunc.url + "/api/orders/cart?token=" + this.token;

      this.http.post(Url_request, JSON.stringify(body_application), {headers: header})
      .map(res => res.json())
      .subscribe(data => {

        if(data){
          this.isLoadingNow = false;
        }else{
          this.isLoadingNow = true;
        }

        // let final_price_data = +data.final_price;
        // let total_shipping_data = +data.total_shipping;
        // let total_cod_data = +data.total_cod;
        
        // this.finalTotalShipping = final_price_data + total_shipping_data + total_cod_data;

        this.content.scrollTo(0, 0);
        this.tab_1_edit_cart = false;
        this.tab_1_select_address = false;
        this.tab_1_thank_you = true;
        this.tab_1_edit_cart_check_total = false;
        this.tab_1_payment_method = false;


        this.small_tab_cart = false;
        this.small_tab_shipping = false;
        this.small_tab_address = false;
        this.small_tab_payment = false;



        this.mainFunc.deleteAllCart();
        // this.loadData();
        
      },(error) => {
        console.log('The Error is', error);
      });

    });
    
    // this.isLoadingNow = false;
  }
  goBackToCart() {

    this.content.scrollTo(0, 0);
    this.tab_1_edit_cart = true;
    this.tab_1_select_address = false;
    this.tab_1_edit_cart_check_total = false;
    this.tab_1_payment_method = false;

    this.small_tab_cart = true;
    this.small_tab_shipping = false;
    this.small_tab_address = false;
    this.small_tab_payment = false;

  }
  goBackToShopping(){
    this.content.scrollTo(0, 0);
    this.tab_1_edit_cart = true;
    this.tab_1_select_address = false;
    this.tab_1_payment_method = false;
    this.tab_1_edit_cart_check_total = true;

    this.small_tab_cart = false;
    this.small_tab_shipping = true;
    this.small_tab_address = false;
    this.small_tab_payment = false;
  }

  goBackToAddress() {
    this.content.scrollTo(0, 0);
    this.tab_1_edit_cart = false;
    this.tab_1_select_address = true;
    this.tab_1_payment_method = false;

    this.small_tab_cart = false;
    this.small_tab_shipping = false;
    this.small_tab_address = true;
    this.small_tab_payment = false;
  }
  clickGoToHome(){
    // this.navCtrl.pop();
  }

  checkEmptyCart(){
    let emp = false
    if (this.mainFunc.getCartItemsNumber() < 1) {
      emp = true;
    }else{
      emp = false;
    }
    return emp;
  }


  clearCartDB() {
    this.mainFunc.deleteAllCart();
  }

  getStoreShippingId(id){
    let index = this.store_list.indexOf(id);
    return index;
  }

  onBlur(id,min,max){
    this.OrderLogicControl(id,min,max)
    this.storage.set('cartNumber', this.mainFunc.cartItemsNumber);
    console.log('Blur Event Triggered');
    
  }

  changeStoreShippingId(id){

  }


  OrderLogicControl(id,min,max){
    
    let val = this.mainFunc.getCartItemCounter(id);
    
    min = Number(min);
    max = Number(max);
    val = Number(val);
    // val = Number.parseInt(val);


    
    if (min == 'null' || min == null || min == 0 || min == '0'){
      min = 1;
    }

    if (max == null || max == 'null'){
      max = 100;
    }

    if (val < min){
      val = min;
    }

    if (val > max){
      val = max;
    }
    val =  Math.floor(val);

    this.mainFunc.cartItemsNumber[this.mainFunc.getCartItemid(id)] = val;
    // this.storage.set('cartNumber', this.mainFunc.cartItemsNumber);
  }

minOrderControl(val){
  let min = Number(val);
  if (min == null || min == 0){
    min = 1;
  }
  return min;
}
 
maxOrderControl(val){
  val = Number(val);
  if (val === null || val === 'null'){
    val = 100;
  }
  return val;
}



}