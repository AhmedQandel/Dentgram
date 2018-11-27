import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, LoadingController, Platform } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
// import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Storage } from '@ionic/storage';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'page-match-making-apply',
  templateUrl: 'match-making-apply.html',
})
export class MatchMakingApplyPage {

  id: any;
  validateForm: FormGroup;
  filename: any;
  file_url: any;
  uploaded_file: any = null;
  loading: any;
  isLoadingNow: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
     private fileChooser: FileChooser,
       private transfer: FileTransfer,
           public storage: Storage,
             private filePath: FilePath,
               public viewCtrl: ViewController,
               public formBuilder: FormBuilder, 
                 private http: Http,
                 public loadingCtrl: LoadingController,
                 private alertCtrl: AlertController,
                   public mainFunc: MainFunctionsProvider,
                     public translate: TranslateService,
                       public platform: Platform) {
           
          let ids = this.navParams.get('id');
          this.id = ids;
          
          this.validateForm = formBuilder.group({
            fullname: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(90), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            phone: ['',  Validators.compose([Validators.pattern('[0-9]*'), Validators.required])],
            email: ['', Validators.compose([ Validators.pattern(this.mainFunc.EMAIL_REGEX), Validators.maxLength(255), Validators.required])],
            address: ['', Validators.required],
          });

          this.loading = this.loadingCtrl.create({
            content: 'Please Wait ..'
          });

          this.isLoadingNow = false;
 }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchMakingApplyPage');
  }


  selectFile(){
    
        this.fileChooser.open().then((uri)=>{
          // alert(uri);
        this.filePath.resolveNativePath(uri).then(filePath => {
    
          // alert(filePath);
          // this.filePath = filePath;

          let filename = filePath.substring(filePath.lastIndexOf("/") + 1);
          let fileext = filename.substr(filename.lastIndexOf('.') + 1);
          fileext = fileext.toLowerCase();
    

          if(fileext === 'pdf'){

            this.file_url = filePath.toLowerCase();
            this.filename = filename;
            console.log('File URI', filePath);
            console.log('File Name', filename);
            
          }else{
            let alert = this.alertCtrl.create({
              message: 'Please select only "pdf" file',
              buttons: ['Ok']
            });
            alert.present();
          }

          console.log('filePath', filePath);
        }).catch(err => 
            console.log(err)
        );

        }).catch(e => console.log(e));
 
  }

  uploadApplication(){

    // this.loading.present();
    this.isLoadingNow = true;
    let options1: FileUploadOptions = {
      fileKey: 'file',
      fileName: this.filename,
      httpMethod: 'POST',
      chunkedMode : false,
      headers: {},
      params: {
        "_method" : "PUT"
      }
     
    }

    const fileTransfer: FileTransferObject = this.transfer.create();
    this.storage.get('token').then( token => {
        if(token){

          

          let apiurl = "http://dentgram.com/api/upload_file?token=" + token;

          fileTransfer.upload(this.file_url, apiurl, options1)
          .then((data) => {
            
            let msg_json = JSON.parse(data.response);
            let msg = msg_json.message;
            this.uploaded_file = msg;

            
          }, (err) => {
            // this.loading.dismiss();
            this.isLoadingNow = false;

            let alert = this.alertCtrl.create({
              message: 'Uploading Error Happen',
              buttons: ['Ok']
            });
            alert.present();

          });



        }else{

          this.isLoadingNow = false;
          // this.loading.dismiss();
          let alert = this.alertCtrl.create({
            message: 'Please login first',
            buttons: ['Ok']
          });
          alert.present();
          
        }
      });
      
  }

  // selectAndUploadCV(){

    
  //   let options1: FileUploadOptions = {
  //     fileKey: 'file',
  //     fileName: this.filename,
  //     httpMethod: 'POST',
  //     chunkedMode : false,
  //     headers: {},
  //     params: {
  //       "_method" : "PUT"
  //     }
     
  //   }

  //   const fileTransfer: FileTransferObject = this.transfer.create();

  //   // if(this.file_url != null){

  //     this.storage.get('token').then( token => {
  //       if(token){

  //         let apiurl = "http://dentgram.com/api/upload_file?token=" + token;

  //         fileTransfer.upload(this.file_url, apiurl, options1)
  //         .then((data) => {
            
  //           let msg_json = JSON.parse(data.response);
  //           let msg = msg_json.message;
            
  //           // alert("data : " + JSON.stringify(data));
  //         }, (err) => {
  //           // error
  //           // alert("error : " + JSON.stringify(err));
  //         });



  //       }else{

  //         let alert = this.alertCtrl.create({
  //           message: 'Please login first',
  //           buttons: ['Ok']
  //         });
  //         alert.present();
          
  //       }
  //     });

  //   // }else{
  //   //   let alert = this.alertCtrl.create({
  //   //     message: 'Please select C.V "pdf" file',
  //   //     buttons: ['Ok']
  //   //   });
  //   //   alert.present();
  //   // }
  // }

  // sendApplication(){

  //   this.storage.get('token').then( token => {
  //     if(token){
  //       let apiurl = "http://dentgram.com/api/upload_file?token=" + token;
    
  //       this.fileChooser.open().then((uri)=>{
  //         alert(uri);
  //       this.filePath.resolveNativePath(uri).then(filePath => {
    
  //         // alert(filePath);
  //         let filename = filePath.substring(filePath.lastIndexOf("/"));//'image';
  //         let fileext = filename.substr(filename.lastIndexOf('.') + 1);
  //         fileext = fileext.toLowerCase();

  //         const fileTransfer: FileTransferObject = this.transfer.create();
    
          
  //         let options1: FileUploadOptions = {
  //           fileKey: 'file',
  //           fileName: filename,
  //           httpMethod: 'POST',
  //           chunkedMode : false,
  //           headers: {},
  //           params: {
  //             "_method" : "PUT"
  //           }
           
  //         }
    
  //         if(fileext === 'pdf'){

  //           this.file_url = filePath;
  //           this.filename = filename;

  //         }else{
  //           let alert = this.alertCtrl.create({
  //             message: 'Please select only "pdf" file',
  //             buttons: ['Ok']
  //           });
  //           alert.present();
  //         }
          

  //       }).catch(err => 
  //           console.log(err)
  //       );
    
    
    
        
    
  //       }).catch(e => console.log(e));

  //     }else{
    
  //     } 
  //   });

  // }


  listenToAdd(){

    if(this.uploaded_file != null){
           
      let uploaded_file_st = this.uploaded_file;
      this.uploaded_file = null;

      let body_application = {

        "full_name" : this.validateForm.value['fullname'],
        "phone" : this.validateForm.value['phone'],
        "email" : this.validateForm.value['email'],
        "address" : this.validateForm.value['address'],
        "cv" : uploaded_file_st
      }

     
      this.storage.get('token').then(token => {
        let Url_request = this.mainFunc.url + '/api/structure/careers/apply/' + this.id + '?token=' + token;
        let header = this.mainFunc.header;
        this.http.put(Url_request, JSON.stringify(body_application), {headers: header})
            .map(res => res.json())
            .subscribe(data => {
              let containt_message = data.success;
              this.isLoadingNow = false;
              if (containt_message){
                // clear All Data And Show Message For Submit The Add
                
                this.validateForm.reset();
                this.filename = null;
                this.file_url = null;
                this.uploaded_file = null;
                
                
                
                let alert = this.alertCtrl.create({
                  message: 'Your Application Submited Successfully, thank you',
                  buttons: ['Ok']
                });
                alert.present();

              }else{

                // this.loading.dismiss();

                let alert = this.alertCtrl.create({
                  message: 'Sorry You Submited alrady For This Job, Please Wait For Employer Replay',
                  buttons: ['Ok']
                });
                alert.present();


                // clear All Data And Show Message For Submit The Add
                
                this.validateForm.reset();
                this.filename = null;
                this.file_url = null;
                this.uploaded_file = null;
              }

              // alert("Response From PUT Method : " + data);

            },(error) => {
  
              // this.loading.dismiss();

              console.log('Error In Add Address', error.status);
              
              if (error.status === 422){
  
              }
  
  
            });
      });
      
      // this.loading.dismiss();
    }else{
      // this.loading.dismiss();
    }
  }
}
