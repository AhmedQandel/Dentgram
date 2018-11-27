import { Component, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { NavController, ViewController,ToastController, NavParams, Slides, Platform, Events, AlertController, LoadingController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { UploadProvider } from "../../providers/upload/upload";
import { trigger, state, style, animate, transition, group, keyframes } from '@angular/animations';
import { ItemDetailsPage } from "../../pages/item-details/item-details";
import { Storage } from '@ionic/storage';

import { TranslateService } from '@ngx-translate/core';

import { SearchPage } from "../search/search";

// import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';

import { MatchMakingDetailsPage } from "../../pages/match-making-details/match-making-details";

@Component({
  selector: 'page-used-add',
  templateUrl: 'used-add.html',
})

export class UsedAddPage {
  direc: any;
  direcR: any;
  ad_category: string;
  ad_category_id: string;
  ad_name: string;

  div_select_category: boolean = true;
  div_ad_data: boolean = false;

  MainMenuDiv: boolean = false;
  SubMenuDiv: boolean = false;

  ad_can_call: boolean = true;
  ad_can_message: boolean = true;
  category_list: any[];
  homemenu: any[];
  category_Id: string;

  isDataAvilable = true;
  step: number = 0;
  imageNumber=0;
  images_list: any[];
  thumb_list: any[];
  photos_list: any[];
  promisesArray: any[] = [];
  loading: any;
  private create : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mainFunc: MainFunctionsProvider,
    public uploadFunc: UploadProvider,
      public viewCtrl: ViewController,
      public translate: TranslateService,
      private http: Http,
      public storage: Storage,
      public element:ElementRef,
      private camera: Camera,
      private filePath: FilePath,
      private formBuilder: FormBuilder,
      private alertCtrl: AlertController,
      public loadingCtrl: LoadingController,
      private transfer: FileTransfer,
      public toastCtrl: ToastController,
      // private imageResizer: ImageResizer,
      public platform: Platform) {

      this.viewCtrl.setBackButtonText('');
      this.category_list = [];
      this.homemenu = [];
      this.images_list = [];
      this.thumb_list = [];
      this.photos_list = [];
      this.promisesArray = [];

      this.loading = this.loadingCtrl.create({
        content: 'Please Wait ..'
      });
      
      
      // this.images_list.push('assets/img/select_photo.png');

      this.create = this.formBuilder.group({
        // first_name: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        // last_name: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        // country_id: ['', Validators.required],
        // city_id: ['', Validators.required],
        // email: ['',  Validators.compose([ Validators.pattern(this.mainFunc.EMAIL_REGEX), Validators.maxLength(255), Validators.required])],
        // password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)])],
        // gender: ['', Validators.required],
        // phone: ['',  Validators.compose([Validators.pattern('[0-9]*'), Validators.required])],
        // age: ['', Validators.required],

        // ad_category: ['', Validators.required],
        ad_name: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(200), Validators.required])],
        ad_details: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(15000), Validators.required])],
        ad_phone: ['',  Validators.compose([Validators.pattern('[0-9]*'), Validators.required])],
        ad_can_call: ['', Validators.required],
        ad_can_message: ['', Validators.required],
        ad_price: ['',  Validators.compose([Validators.pattern('[0-9]*'), Validators.required])]
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

    
    
    console.log('ionViewDidLoad AccFavPage');
  }
  dismissview(){
    this.navCtrl.parent.viewCtrl.dismiss();
  }

  loadCategoryData(){

    this.isDataAvilable = true;
    this.MainMenuDiv = true;
    this.homemenu = [];
    let url = this.mainFunc.url + '/api/structure/categories/for_used/0'
    let localHomeMenudata2 = this.http.get(url).map(res => res.json());
    localHomeMenudata2.subscribe(data => {


      let data2: any[];
      data2 = [];
      if(data.length > 0){
        this.isDataAvilable = true;
      }else{
        this.isDataAvilable = false;
      }
      for (let index = 0; index < data.length; index++) {
        const e = data[index];
        let eicon = data[index].icon.thumb;
        if (eicon === null){
          eicon = 'assets/img/catalogue/img-1.png';
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
          "back_back": "",
          "parent_id": e.parent_id,
          "useable": e.useable
        }
        data2.push(item);
      }
      this.homemenu = data2;
      // data2 = data;

    });
  

  }

  click_Open_catalogue_sub_id(id,name_ar,name_en) {
    
    this.homemenu = [];
    let url = this.mainFunc.url + '/api/structure/categories/for_used/' + id;
    let localHomeMenudata2 = this.http.get(url).map(res => res.json());
    localHomeMenudata2.subscribe((data) => {
      let data2: any[];
      data2 = [];
      if (data.length > 0){
        this.isDataAvilable = true;
      }else{
        this.isDataAvilable = false;

        this.category_Id = id;

        if (this.platform.dir() === "rtl") {
          this.ad_category = name_ar;          
        } else {
          this.ad_category = name_en;
        }
        // alert('no data happen');

        this.div_select_category = true;
        this.div_ad_data = false;
      }
      for (let index = 0; index < data.length; index++) {
        const e = data[index];
        let eicon = data[index].icon.thumb;
        if (eicon === null){
          eicon = 'assets/img/catalogue/img-1.png';
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
          "back_back": "",
          "parent_id": e.parent_id,
          "useable": e.useable
        }
        data2.push(item);
      }
      this.homemenu = data2;
      // data2 = data;

    },(error) => {
      this.isDataAvilable = false;

      this.category_Id = id;

      if (this.platform.dir() === "rtl") {
        this.ad_category = name_ar;          
      } else {
        this.ad_category = name_en;
      }

      // alert('no data happen');

      this.div_select_category = true;
      this.div_ad_data = false;
    }
  );

  }
  openSelectCategory() {
    this.div_ad_data = true;
    this.div_select_category = false;

    this.loadCategoryData();
  }

  selectImage() {
    if (this.imageNumber == 0) { 
    this.thumb_list = [];
    this.images_list = [];
    this.photos_list = [];
    }
    
   if (this.imageNumber == 6) {
    this.presentToast('Max Number of image is 6');

   }else{
    var options = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') ) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            console.log(filePath);
            this.images_list.push(filePath);
            if(this.imageNumber != 0){
              this.photos_list.push(filePath);
            }
            this.imageNumber=this.imageNumber+1;   
          });
      } else {
  

      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  } 
    
    
    
    
    
    
    
    
    // var options = {
    //   maximumImagesCount: 6,
    //   // width: 1920,
    //   // height: 1080,
    //   quality: 30
    // };

    
    // this.imagePicker.getPictures(options).then((results) => {
    //   for (var i = 0; i < results.length; i++) {
    //       // alert('Image URI: ' + results[i])
    //       this.images_list.push(results[i]);
    //       if(i != 0){
    //         this.photos_list.push(results[i]);
    //       }         
    //   }

    //   // this.images_list = results;
    //   console.log('images_list', this.images_list);
    //   console.log('photos_list', this.photos_list);

    //   if(results.length < 1){
    //     this.images_list.push('assets/img/select_photo.png');
    //   }
    // }, (err) => { });
  }
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  ngAfterViewInit(){
    this.element.nativeElement.querySelector("textarea").style.height = "100%";
  }

  addAd(){

    this.storage.get('token').then( token => {
      if(token && this.category_Id != null && this.images_list[0] != 'assets/img/select_photo.png'){
        
        
        
        this.myUploadClick(token).then((data)=>{

          // token is avilable
        let ad_form = {
          "category_id" : this.category_Id,
          "name" : this.create.value['ad_name'],
          "description" : this.create.value['ad_details'],
          "image" : this.promisesArray[0],
          "photos" : this.promisesArray,
          "phone" : this.create.value['ad_phone'],
          "can_call" : this.create.value['ad_can_call'],
          "can_message" : this.create.value['ad_can_message'],
          "price" : this.create.value['ad_price']
        }

          console.log('The Form', ad_form);
        });    

      }else{
        // no token avilable
        this.showAlertMsg('Please Check The Data');
      }});
  }

  public async myUploadClick(token) {

    let loading_status: number = 0;

    this.promisesArray = [];
    // const filesToUpload: any[] = [1, 2, 3, 4, 5, 6];


    
   

    // loading.present();

    

    this.loading.present();

    for (const file of this.images_list) {
      
      console.log("Starting upload: %s ", file);
      
      // ----------------- Start Uploading Images


      let filename = file.substring(file.lastIndexOf("/"));//'image';
      let apiurl = this.mainFunc.url + "/api/upload_file?token=" + token;

      const fileTransfer: FileTransferObject = this.transfer.create();

      let options1: FileUploadOptions = {
        
        fileKey: 'file',
        fileName: filename,
        httpMethod: 'POST',
        chunkedMode : false,
        headers: {},
        params: {
          "_method" : "PUT"
        }
        
      }

      fileTransfer.upload(file, apiurl, options1)
        .then((data) => {
          // success
          // alert("success");
          // this.step++;

          // let msg_jsonSt = JSON.stringify(data);
          let msg_json = JSON.parse(data.response);
          let msg = msg_json.message;
          
          loading_status++;
          
          

          this.promisesArray.push(msg);
          console.log('msg', msg);

          // alert("data : " + JSON.stringify(data));
        }, (err) => {
          // error
          // alert("error : " + JSON.stringify(err));
          console.log('Error happen code : ' + err.code + ' ---- source : ' + err.source + ' ------ Target : ' + err.target + ' ------ Http Status : ' + err.http_status);
        });

      // --------------- End Uploading

      
    }

    await Promise.all(this.promisesArray)
      .then((res) => {

        if(this.promisesArray.length === this.images_list.length){
         
          this.loading.dismiss();
          console.log('Promises Array', this.promisesArray);
          console.log("All uploads done, we can now create the Ad");

        }
        
      }, (firstErr) => {
        this.loading.dismiss();
        console.error("Error uploading file.", firstErr);
      });

      // loading.dismiss();

      return Promise.all(this.promisesArray);
  }
  
  photolist(){
    
  }

  addAd2(){
    this.photos_list = [];
    let target = this.images_list.length + 1;
    let loading_status = 0;

    console.log('this.images_list', this.images_list);
    
    if(this.images_list.length > 1){
      for(var i = 1; i = this.images_list.length; i++){
        this.photos_list.push(this.images_list[i]);
      }
    }

    this.storage.get('token').then( token => {
      if(token){
        if(this.images_list[0] == 'assets/img/select_photo.png'){
          this.showAlertMsg('Please Select Image');
        }else{

          if(this.category_Id != null){
            let ad_form = {
              "category_id" : this.category_Id,
              "name" : this.create.value['ad_name'],
              "description" : this.create.value['ad_details'],
              "image" : this.images_list[0],
              "photos" : {

              },
              "phone" : this.create.value['ad_phone'],
              "can_call" : this.create.value['ad_can_call'],
              "can_message" : this.create.value['ad_can_message'],
              "price" : this.create.value['ad_price'],
            }
              
            
            // let loading = this.loadingCtrl.create({
            //   content: 'Upload Data ' + loading_status + ' Of ' + this.images_list.length
            // });

            // loading.present();

            // if( this.step == loading_status){
            //   loading_status++;
            //   this.upload_file(this.images_list[this.step],token);
            // }

            


            // for(var x = 0; x == this.images_list.length; x++){
              
              // loading_status++;
              // this.saveFile(this.images_list[0],token,0,this.images_list.length);
            // }

            

            
            // loading.dismiss();

            // if(loading_status == this.images_list.length){
            //   // Create the Ads
            // }


          }else{
            this.showAlertMsg('Please Check The Data');
          }
        }
      }else{
        this.showAlertMsg('Please Login Before Add item');
      } 
    });
  }

  async saveFile(uri,token,x,max){

    this.uploadFunc.upload_file(this.images_list[x],token,x).then((data: string) => {
      if (data <= max){
        this.saveFile(this.images_list[data],token,data,max);
      }
    });

    // const upload_file_status = await this.uploadFunc.upload_file(uri,token,num);

  }
  callback() {
    console.log('Upload Done');
  }
  valid_ad() {

    this.ad_name = "";

  }

  showAlertMsg(msg){
    let alert = this.alertCtrl.create({
      message: msg,
      buttons: ['Ok']
    });
    alert.present();
  }

  upload_file(file_uri,token){

    // var filename = file_uri.replace(/^.*[\\\/]/, '');
    let filename = 'image';
    let apiurl = this.mainFunc.url + "/api/upload_file?token=" + token;

    const fileTransfer: FileTransferObject = this.transfer.create();
    let options1: FileUploadOptions = {
      fileKey: 'file',
      fileName: filename,
      httpMethod: 'POST',
      chunkedMode : false,
      headers: {},
      params: {
        "_method" : "PUT"
      }
      
    }

    fileTransfer.upload(file_uri, apiurl, options1)
      .then((data) => {
        // success
        // alert("success");
        this.step++;
        alert("data : " + JSON.stringify(data));
      }, (err) => {
        // error
        // alert("error : " + JSON.stringify(err));
      });

      
  }

  openmatch(){
    // 

    this.navCtrl.push(MatchMakingDetailsPage);
  }

  listenToAdd(){
    if(this.promisesArray.length === this.images_list.length && this.images_list.length != 0){
      let newArr = this.promisesArray.reverse();
      this.promisesArray = [];
      
      let body_application = {
        "category_id" : this.category_Id,
        "name" : this.create.value['ad_name'],
        "description" : this.create.value['ad_details'],
        "image" : newArr[0],
        "photos" : newArr,
        "phone" : this.create.value['ad_phone'],
        "can_call" : this.create.value['ad_can_call'],
        "can_message" : this.create.value['ad_can_message'],
        "price" : this.create.value['ad_price']
      }


      console.log('Form Data body_application', body_application);
     
      this.storage.get('token').then(token => {
        let Url_request = this.mainFunc.url + "/api/ads/new?token=" + token;
        let header = this.mainFunc.header;
        this.http.put(Url_request, JSON.stringify(body_application), {headers: header})
            .map(res => res.json())
            .subscribe(data => {
              let containt_message = data.success;
              console.log('Response Message', containt_message);
              if (containt_message){
                // clear All Data And Show Message For Submit The Add
                this.loading.dismiss();
                
                this.create.reset();

                this.category_list = [];
                this.homemenu = [];
                this.images_list = [];
                this.thumb_list = [];
                this.photos_list = [];
                this.promisesArray = [];

                // this.images_list.push('assets/img/select_photo.png');
                
              }

              // alert("Response From PUT Method : " + data);

            },(error) => {
  
              this.loading.dismiss();

              console.log('Error In Add Address', error.status);
              
              if (error.status === 422){
  
              }
  
  
            });
      });
      
      
    }
  }

  showSearchBar() {
    this.navCtrl.push(SearchPage, {
      'type' : 'for_used'
    });
  }

}