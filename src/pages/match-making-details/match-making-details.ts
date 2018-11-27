import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
// import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import { Base64 } from '@ionic-native/base64';
import { FilePath } from '@ionic-native/file-path';
import { Storage } from '@ionic/storage';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { TranslateService } from '@ngx-translate/core';

import { MatchMakingApplyPage } from "../match-making-apply/match-making-apply";

@Component({
  selector: 'page-match-making-details',
  templateUrl: 'match-making-details.html',
})
export class MatchMakingDetailsPage {


  id: any;
  isDataAvilable = false;
  allData: any;
  store_name: string;
  store_icon_thumb: string;
  category_id: string;
  category_icon_full: string;
  category_icon_thumb: string;
  category_name: string;
  category_display_name: string;
  country_id: string;
  country_icon_full: string;
  country_icon_thumb: string;
  country_name: string;
  imageMain = 'assets/img/career_img_not_avilable.png';
  title: string;
  short_description: string;
  description: string;
  contact_no: string;
  contact_email: string;
  can_call: boolean;
  can_email: boolean;



  constructor(public navCtrl: NavController,
     public navParams: NavParams,
      private fileChooser: FileChooser,
        private transfer: FileTransfer,
          // private base64: Base64,
            public storage: Storage,
              private filePath: FilePath,
                public viewCtrl: ViewController, 
                  private http: Http,
                    public mainFunc: MainFunctionsProvider,
                      public translate: TranslateService,
                        public platform: Platform) {
            this.allData = [];

          this.id = this.navParams.get('id');


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchMakingDetailsPage');
    this.storage.get('token').then(token => {
      this.loadData(token);
    });
  }

  loadData(token){
    let url = this.mainFunc.url + '/api/structure/careers/view/' + this.id + '?token=' + token;
      let localHomeMenudata2 = this.http.get(url).map(res => res.json());
      localHomeMenudata2.subscribe(data => {
                
        if (data.id != null && data.id != ''){
          this.isDataAvilable = true;
          this.allData = data;

          // Article Data
          this.title = data.title;
          this.short_description = data.short_description;
          this.description = data.description;
          this.contact_no = data.contact_no;
          this.contact_email = data.contact_email;
          this.can_call = data.can_call;
          this.can_email = data.can_email;

          // Category Data
          this.category_id = data.category.id;
          this.category_icon_full = data.category.icon.full;
          this.category_icon_thumb = data.category.icon.thumb;

          // Country Data
          this.country_id = data.category.id;
          this.country_icon_full = data.country.icon.full;
          this.country_icon_thumb = data.country.icon.thumb;
          
          // Store Data
          this.store_name = data.stores.name;
          this.store_icon_thumb = data.stores.icon.thumb;

          if (this.platform.dir() === "rtl") {

            this.category_name = data.category.name_ar;
            this.country_name = data.country.name_ar;
            this.category_display_name = data.category.display_name_ar;
          } else {
            this.category_name = data.category.name_en;
            this.country_name = data.country.name_en;
            this.category_display_name = data.category.display_name_en;
          }

        }else{
          this.isDataAvilable = false;
        }

        
      });
  }
  openFile() {

    this.storage.get('token').then( token => {
      if(token){
        let apiurl = "http://dentgram.com/api/upload_file?token=" + token;
    
        this.fileChooser.open().then((uri)=>{
          alert(uri);
        this.filePath.resolveNativePath(uri).then(filePath => {
    
          alert(filePath);
    
          const fileTransfer: FileTransferObject = this.transfer.create();
    
        let options1: FileUploadOptions = {
           fileKey: 'file',
           fileName: 'test1.pdf',
           httpMethod: 'POST',
           chunkedMode : false,
           headers: {},
           params: {
             "_method" : "PUT"
           }
           
        }
    
        fileTransfer.upload(filePath, apiurl, options1)
        .then((data) => {
          // success
          // alert("success");
          alert("data : " + JSON.stringify(data));
        }, (err) => {
          // error
          alert("error : " + JSON.stringify(err));
        });
    
    
    
        }).catch(err => 
            console.log(err)
        );
    
    
    
        
    
        }).catch(e => console.log(e));

      }else{
    
      } 
    });



    // 'http://dentgram.com/api/upload_file?token='



    
    // FileChooser.prototype ptype = FileChooser.prototype("PDF files (*.pdf)", "*.pdf");


  }

  showData(type){
    switch (type) {
      case "email":
        document.getElementById('email').click();
        break;

      case "phone":
        document.getElementById('phone').click();
        break;
      
      default:
        // code...
        break;
    }
  }

  openFile2() {
    
    // FileChooser.prototype ptype = FileChooser.prototype("PDF files (*.pdf)", "*.pdf");

    let apiurl = "http://dentgram.com/upload.php";
    
    this.fileChooser.open().then((uri)=>{
      
      // this.file.resolveLocalFilesystemUrl(uri).then((newUri)=>{
      //   alert(JSON.stringify(newUri));
        
      //   let dirPath = newUri.nativeURL;
      //   let dirPathSegments = dirPath.split('/');
      //   dirPathSegments.pop();
      //   dirPath = dirPathSegments.join('/');

      //   this.file.readAsArrayBuffer(dirPath, newUri.name).then((buffer)=> {
      //     this.upload(buffer, newUri.name);
      //   })

      // })
      
      // const fileTransfer: FileTransferObject = this.transfer.create();
      // let options1: FileUploadOptions = {
      //   fileKey: 'image_upload_file',
      //   fileName: 'test1.pdf',
      //   headers: {},
      //   params: {"app_key":"Testappkey"},
      //   chunkedMode : false
      //   }

      // fileTransfer.upload(uri, apiurl, options1)
      //     .then((data) => {
      //     // success
      //     alert("success"+JSON.stringify(data));
      //     }, (err) => {
      //     // error
      //     alert("error"+JSON.stringify(err));
      // });

      


    this.filePath.resolveNativePath(uri).then(filePath => {

      alert(filePath);

      const fileTransfer: FileTransferObject = this.transfer.create();

    let options1: FileUploadOptions = {
       fileKey: 'file',
       fileName: 'test1.pdf',
       chunkedMode : false,
       headers: {}
    
    }

    fileTransfer.upload(filePath, apiurl, options1)
    .then((data) => {
      // success
      // alert("success");
      alert("data : " + JSON.stringify(data));
    }, (err) => {
      // error
      alert("error : " + JSON.stringify(err));
    });



    }).catch(err => 
        console.log(err)
    );



    

    }).catch(e => console.log(e));
  }

  
  upload(buffer, name){
    let blob = new Blob ([buffer], {type: "application/pdf"});
    alert(blob);
  }


  // //////////////////////
  applyForAJob(id) {
    this.navCtrl.push(MatchMakingApplyPage, {
      'id' : id
    });
  }

}
