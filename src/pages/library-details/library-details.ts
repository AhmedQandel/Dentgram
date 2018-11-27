import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { SocialSharing } from '@ionic-native/social-sharing';
import { FileOpener } from '@ionic-native/file-opener';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { File } from '@ionic-native/file';

@Component({
  selector: 'page-library-details',
  templateUrl: 'library-details.html',
})
export class LibraryDetailsPage {


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

  allData: any;
  imageMain: any;

  isDataAvilable = false;
  galleryType = 'regular';
  secretId = "";
  bestrecommended: any[];

  lib_books: any[];
  lib_videos: any[];
  category_data: any[];
  isFavourite=false;

  share={
    name:'',
    image:''
  }

  constructor(public navCtrl: NavController,
       public navParams: NavParams,
        public viewCtrl: ViewController, 
          private http: Http,
            public mainFunc: MainFunctionsProvider,
            public translate: TranslateService,
            public platform: Platform,
            public storage: Storage,
            private fileOpener: FileOpener,
            private file: File,
            private socialSharing: SocialSharing,
            private youtube: YoutubeVideoPlayer,
            private transfer: FileTransfer,
            private photoViewer: PhotoViewer) {


          this.mainFunc.showLoading('',true);

          this.id = this.navParams.get('id');
          this.secretId = this.navParams.get('secretId');

          this.allData = [];
          this.mainFunc.dismissLoading();
          this.isLoggedIn();

  }
  Share(name: any , image:any) {

    if (this.lib_books.length>0) {
      name=name+' \n  '+this.lib_books[0].url;
    }else if(this.lib_videos.length>0){
      name=name+' \n  https://www.youtube.com/embed/'+this.lib_videos[0].url;
    }
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
        this.lib_books = [];
        this.lib_videos = [];
        this.category_data = [];

        if (data.id != null && data.id != ''){
          this.isDataAvilable = true;
        
          this.allData = data;
          this.slides_list = data.gallery;
          this.imageMain = data.image.full;
          if (data.videos) {
            this.lib_videos = data.videos;
          }
          if (data.books) {
            this.lib_books = data.books;
          }
          

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
            this.category_display_name = data.category.display_name_ar;
            // this.man_name = data.manufacturer.name_ar;
          } else {
            // this.name = data.name_en;
            // this.description = data.description_en;
            // this.category_name = data.category.name_en;
            this.category_display_name = data.category.display_name_en;
            // this.man_name = data.manufacturer.name_en;          
          }

        }else{
          this.isDataAvilable = false;
        }

        
      });


      let urlFav = this.mainFunc.url + '/api/is_favorite?flag=library&item_id='+this.id+'&token='+token;
      let localFav = this.http.get(urlFav).map(res => res.json());
      localFav.subscribe(data => {
   console.log("sssss",data);
   
    
          this.isFavourite=data.is_favorite;
      
          console.log("sssss", this.isFavourite);
        
      });
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
    this.mainFunc.addToFav(item,'library');
    if (this.isFavourite) {
      this.isFavourite=false;
    }else{
      this.isFavourite=true;
    }
  }
  removeFromFav(item){

  }
  openItemDetails(id) {
    // this.navCtrl.push(ItemDetailsPage);
  }
  openImage(url){
    this.photoViewer.show(url);
  }

  openBook(url,title){
    url = encodeURI(url);
    // let browser = this.iab.create(url);
    // browser.show();
    // window.open(url, '_system');
    // let options: DocumentViewerOptions = {
    //   title: title
    // }

    // this.document.viewDocument(url, 'application/pdf', options)

    var extension = url.split('.').pop(); 

    // this.fileOpener.open(url, 'application/pdf')
    // .then(() => console.log('File is opened'))
    // .catch(e => console.log('Error opening file', e));

    let path = '';
    const fileTransfer: FileTransferObject = this.transfer.create();

    if (this.platform.is('android')) {
      let dir_name = 'Download'; // directory to download - you can also create new directory
      let result = this.file.createDir(this.file.externalRootDirectory, dir_name, true);
      result.then((uri) => {
        path = uri.toURL();
        fileTransfer.download(url, path + 'test' + '.' + extension).then((entry) => {
          console.log('download complete: ' + entry.toURL());
          this.fileOpener.open(entry.toURL(), this.getMIMEtype(extension))
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));

        }, (error) => {
          // handle error
        });

      })
        .catch(e => console.log(e));

    } else {


        let dir_name2 = 'Download'; // directory to download - you can also create new directory
        let result2 = this.file.createDir(this.file.dataDirectory, dir_name2, true);
        result2.then((uri) => {
          path = uri.toURL();
          fileTransfer.download(url, path + 'test' + '.' + extension).then((entry) => {
            console.log('download complete: ' + entry.toURL());
            console.log('download complete: ' + this.getMIMEtype(extension));
            // this.document.viewDocument(entry.toURL(), this.getMIMEtype(Extention), {});

            this.fileOpener.open(entry.toURL(), this.getMIMEtype(extension))
            .then(() => console.log('File is opened'))
            .catch(e => console.log('Error opening file', e));
  


          }, (error) => {
            // handle error
          });
  
        })
          .catch(e => console.log(e));
    }



    
  }
  getMIMEtype(extn){
    let ext=extn.toLowerCase();
    let MIMETypes={
      'txt' :'text/plain',
      'docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc' : 'application/msword',
      'pdf' : 'application/pdf',
      'jpg' : 'image/jpeg',
      'jpeg' : 'image/jpeg',
      'bmp' : 'image/bmp',
      'png' : 'image/png',
      'xls' : 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf' : 'application/rtf',
      'ppt' : 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'csv' : 'text/csv'
    }
    return MIMETypes[ext];
  }
  openVideo(url,title) {
    url = encodeURI(url);
    this.youtube.openVideo(url);
  }

  getYoutubeurl (url) {

    let newUrl = 'https://www.youtube.com/embed/' + url ;
    return newUrl;
  }
  getYoutubeImage (url) {

    let newUrl = 'https://img.youtube.com/vi/' + url + '/hqdefault.jpg';
    return newUrl;
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

