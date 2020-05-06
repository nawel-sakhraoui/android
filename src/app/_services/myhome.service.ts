import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {ConfigService} from './api-config.service'; 

//import { map } from 'rxjs/operators';
//import { Observable } from "rxjs/internal/Observable";

  

@Injectable()
export class MyhomeService {

  private host :string ; 

  constructor(private http: HttpClient) { 
    
         this.host = ConfigService.storeServer; 
    }
  // private customHeaders: HttpHeaders = new HttpHeaders('Authorization', 'Basic ' +  localStorage.getItem('currentUser').token);

    
      getMyHome (userid: string ) {
      
         return   this.http.get (this.host+'/api/users/'+userid+"/myhome");
      }
    

      getStores (size, city){
        
          return this.http.get (this.host+'/api/myhome/stores/size/'+size+'/city/'+city); 
       }
    
              
       getArticles (size ) {
                     return this.http.get (this.host+'/api/myhome/articles/size/'+size); 

           
           }
    
          
       getArticlesByCat (size, categorie, city ) {
                     return this.http.get (this.host+'/api/myhome/articles/categorie/'+categorie+'/size/'+size+'/city/'+city); 

           
           } 
      getArticlesByNewest (size,city) {
                     return this.http.get (this.host+'/api/myhome/articles/newest/size/'+size+'/city/'+city); 

           
           } 
    
//contact us 
    
}
