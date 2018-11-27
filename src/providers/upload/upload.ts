import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { MainFunctionsProvider } from '../main-functions/main-functions';




@Injectable()
export class UploadProvider {

  constructor(public http: Http,
    public mainFunc: MainFunctionsProvider,
    private transfer: FileTransfer) {
  }

  upload_file(file_uri,token,num){

    num++;
    return new Promise((resolve, reject) => {

      setTimeout(() => {
      
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
            // alert("data : " + JSON.stringify(data));
            console.log("upload", JSON.stringify(data));
          }, (err) => {
            // error
            // alert("error : " + JSON.stringify(err));
            console.log("err", JSON.stringify(err));
            
          });

          resolve(num);
      }, 3000);

    });

    // var filename = file_uri.replace(/^.*[\\\/]/, '');
    

  }


  public async myUploadClick() {
    const promisesArray: any[] = [];
    const filesToUpload: any[] = [1, 2, 3];
    for (const file of filesToUpload) {
      console.log("Starting upload: %s", file);
      promisesArray.push(this.upload(file));
    }

    await Promise.all(promisesArray)
      .then((res) => {
        console.log("All uploads done");
      }, (firstErr) => {
        console.error("Error uploading file.", firstErr);
      }).catch(err => {
        console.log(err);
      });
  }

  private upload(file) {
    return new Promise((resolve, reject) => {
      // your upload code
      setTimeout(() => {
        if (2 === file) {
          console.error("Upload %s failed", file);
          reject(file);
        } else {
          console.log("Upload %s done", file);
          resolve(file);
        }
      }, 1000 * file);
    });
  }
  
}
