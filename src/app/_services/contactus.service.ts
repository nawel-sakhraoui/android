import { Injectable } from '@angular/core';
import {ConfigService} from './api-config.service'; 
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactusService {

    host :string ; 
    
    constructor(private http: HttpClient) { 
    
                 this.host = ConfigService.storeServer; 
    }
    
    
    postContactUs (model ){
          return this.http.post (this.host+'/api/contactus/',model); 
    }
    
    getCloseCount() { 
        return this.http.get(this.host+"/api/contactus/close/count");                    
     }

    
    getNotCloseCount() {   
        return this.http.get(this.host+"/api/contactus/notclose/count");                    
     }
    
    
    getClose(froms, size){
          return this.http.get(this.host+"/api/contactus/close/from/"+froms+"/size/"+size);      
     }
    
    getNotClose(froms, size){
          return this.http.get(this.host+"/api/contactus/notclose/from/"+froms+"/size/"+size);      
     }
    
    putClose (id, date) {
           return this.http.put (this.host+'/api/contactus/id/'+id+"/close", {"close":date});    
    }  
             
}




