import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import {ConfigService} from './api-config.service'


@Injectable({
  providedIn: 'root'
})
export class AddressService {

     host :string ; 
  constructor(private http : HttpClient) {
      
         this.host = ConfigService.storeServer;  
  
  }
    
    addAddress( address){
       console.log(address) ; 
            return this.http.post(this.host+'/api/address', address); 

     }
    updateAddress (id , address) {
            return this.http.put(this.host+'/api/address/id/'+id, address); 
 
       }
     removeAddress (id , address) {
            return this.http.put(this.host+'/api/address/id/'+id+"/remove", {'remove':true}); 
 
       }
     
    
    getAddresses (userid :string ) {
     
        return this.http.get(this.host+'/api/address/'+userid ) ;    
	}


    getCities( ) {

    	return this.http.get(this.host+'/api/cities')  ; 
    }

    getCommunes (city:string ) {

	    return this.http.get(this.host+'/api/communes/'+city); 
    }


    getAllCommunes ( ) {

        return this.http.get(this.host+'/api/communes'); 
    }
}
