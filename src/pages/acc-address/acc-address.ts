import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, AlertController } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Http } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage'
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the AccAddressPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-acc-address',
  templateUrl: 'acc-address.html',
})
export class AccAddressPage {
  direc: any;
  direcR: any;
  dir: any;
  city_list : any[];
  address_list: any[];
  token: any;
  dont_call_boolean = false;
  create_Add_tab = false;
  show_all_adds_tab = true;
  edit_Add_tab = false;

  private create : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mainFunc: MainFunctionsProvider,
      public viewCtrl: ViewController,
      public translate: TranslateService,
      public platform: Platform,
      private http: Http,
      public storage: Storage,
      public alertCtrl: AlertController,
      private formBuilder: FormBuilder) {
      this.viewCtrl.setBackButtonText('');


      this.dir = this.platform.dir();
      this.create = this.formBuilder.group({
        city_id: ['', Validators.required],
        phone: ['',  Validators.compose([Validators.pattern('[0-9]*'), Validators.required])],
        name: ['', Validators.required],
        address1: ['', Validators.required],
        address2: ['', Validators.required],
        landmark: ['', Validators.required],
        preferred: ['', Validators.required],
        recipient_name: ['', Validators.required],
        landline: [''],
        dont_call: [''],
        comments: [''],
      });

      if (navigator.onLine){
        this.storage.get('token').then(token_id => {
          let token = token_id;
          this.city_list = [];
          let url = this.mainFunc.url + '/api/user/address?token=' + token;
          let localdata_content = this.http.get(url).map(res => res.json());
          localdata_content.subscribe(data => {
            this.city_list = data.cities;
            // this.allData = data;
          });
        });
      }else{
        // No Internet Connection
      }

      this.loadData();

  }
//test
  ionViewDidLoad() {
    if (this.platform.dir() === "rtl") {
      this.direc = "ltr";
      this.direcR = "rtl"
    } else {
      this.direc = "rtl";
      this.direcR = "ltr";  
    }

    console.log('ionViewDidLoad AccFavPage');
  }
  dismissview(){
    this.navCtrl.parent.viewCtrl.dismiss();
  }

  loadData(){

    this.dont_call_boolean = false;
    this.create_Add_tab = false;
    this.show_all_adds_tab = true;
    this.edit_Add_tab = false;
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
  onClickAddAddress(){
    this.create_Add_tab = true;
    this.show_all_adds_tab = false;
    this.edit_Add_tab = false;

    this.create.reset();
    
    
  }
  cancelAdd() {

    this.create_Add_tab = false;
    this.show_all_adds_tab = true;
    this.edit_Add_tab = false;
    this.loadData();
  }
  addcity(){
    let Url_request = this.mainFunc.url + "/api/user/address/create?token=";
    let header = this.mainFunc.header;
    let city = this.create.value['city_id'];

    if (city === 0){
      // this.create.dirty;
    }else {
      if (navigator.onLine){
        this.storage.get('token').then(token_id => {
          Url_request = Url_request + token_id;
          this.http.post(Url_request, JSON.stringify(this.create.value), {headers: header})
              .map(res => res.json())
              .subscribe(data => {
                
              },(error) => {

              });
          });
        }else{
          // No Internet Connection
        }
    }
  }

  createAddress(){

    console.log('Data', this.create.value);
    console.log('Wrong Data', this.create.errors);
    if(!this.create.invalid){
      let body_application = {
        "city_id": this.create.value['city_id'],
        "recipient_name": this.create.value['recipient_name'],
        "name": this.create.value['name'],
        "address1": this.create.value['address1'],
        "address2": this.create.value['address2'],
        "phone":  this.create.value['phone'],
        "landline": this.create.value['landline'],
        "landmark": this.create.value['landmark'],
        "preferred":  this.create.value['preferred'],
        "dont_call":  this.dont_call_boolean,//this.create.value['dont_call'],
        "comments": this.create.value['comments']
      }

      console.log('Data create', this.create);
      console.log('Data body_application', body_application);
      
      this.storage.get('token').then(token_id => {
        this.token = token_id;
        let Url_request = this.mainFunc.url + "/api/user/address/create?token=" + this.token;
        let header = this.mainFunc.header;
        this.http.put(Url_request, JSON.stringify(body_application), {headers: header})
            .map(res => res.json())
            .subscribe(data => {
              let containt_message = data.message;
              if (containt_message === 'Successfully created address!'){

              }

              this.loadData();


            },(error) => {
  
              console.log('Error In Add Address = '  + error.status);
              
              if (error.status === 422){
  
              }
  
  
            });
      });
    }
    

  }

}
