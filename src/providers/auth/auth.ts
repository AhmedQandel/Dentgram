import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { MainFunctionsProvider } from "../main-functions/main-functions";

import { Storage } from '@ionic/storage'



@Injectable()
export class AuthProvider {


  constructor(public http: Http, public mainFunc: MainFunctionsProvider,
    public storage: Storage) {
  }


  
  createAuthorizationHeader(headers: Headers){
    headers.append('Authorization', window.localStorage.getItem('token'));
  }

  private(){
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(this.mainFunc.url+'private', {
      headers: headers
    }).map(res => res.json());
  }

  login(data){
    return this.http.post(this.mainFunc.url+"/api/auth/signin", data)
    .map(this.extractData);
  }

  isLogged(){
  // let tok = this.storage.get('token');
    // if(this.storage.('token')){
    //   return true
    // }else{
    //   return false;
    // }

    // return (this.storage.get('token').then(data => {
    //   if(data != null){

    //   }
    // }));
    
    this.storage.get('token').then( data => {
      if(data){
        return true;
      }else{
        return false;
      }
    });
  }


  logout(){
    window.localStorage.removeItem('token');
    this.storage.remove('token');
    return true;
  }

  private extractData(res: Response){
    let body = res.json();
    if(body.succes === true){
      window.localStorage.setItem('token', body.token);
      this.storage.set('token', body.token);
    };
    return body || {};
}

}
