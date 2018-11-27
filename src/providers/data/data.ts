import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { MainFunctionsProvider } from '../../providers/main-functions/main-functions';
import { Storage } from '@ionic/storage';


/*
  Generated class for the DataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataProvider {

  items: any;

  constructor(public http: Http, public mainFunc: MainFunctionsProvider,
    public storage: Storage) {
  }

  filterItems(searchTerm, Type, city_id) {
    this.items = [];
    let Url_request = this.mainFunc.url + "/api/search?query=" + searchTerm + '&type=' + Type + '&limit=10&city_id=' + city_id;
    return this.http.get(Url_request).map(res => res.json());
  }

  filterItemsBy(searchTerm, Type, city_id, filterby, filterByValue) {
    this.items = [];
    let Url_request = this.mainFunc.url + "/api/search?query=" + searchTerm + '&type=' + Type + '&limit=10&city_id=' + city_id;
    if (filterByValue) {
      switch (filterby) {
        case 'CATEGORY_FILTER':
          Url_request += "&filterBy=category";
          break;
        case 'LOCATION_FILTER':
          Url_request += "&filterBy=location";
          break;
        case 'DATE_FILTER':
          Url_request += "&filterBy=date";
          break;
        case 'COURSE_PROVIDER_FILTER':
          Url_request += "&filterBy=courseProvider";
          break;
      }
      Url_request += "&filterByValue=" + filterByValue;
    }
    
    console.log("filter by url", Url_request);
    return this.http.get(Url_request).map(res => res.json());
  }
}
