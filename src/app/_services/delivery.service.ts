import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import {ConfigService} from './api-config.service'; 


@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

 host:string ;

  constructor(private http : HttpClient)  { 
        this.host =   ConfigService.storeServer; 
  }


 addDelivery (delivery:any){
 console.log(delivery) ; 
  	return this.http.post(this.host+"/api/delivery",  delivery) ; //{'title':title,'price':price, 'communes': communes, 'categories': categories, "phone":phone})  ;

 }

 getCountDelivery(){

     return this.http.get(this.host+"/api/delivery/count" )  ;

}

 getAllDelivery( froms, size){

     return this.http.get(this.host+"/api/delivery/from/"+froms+"/size/"+size )  ;

}

 getDeliveryBy( villes,  categories) {
      
         if (villes.length != 0  && categories.length != 0 ) {
            let com = villes.toString() ; 
            let cat = categories.toString() ; 
          
             return this.http.get(this.host+"/api/delivery/all/villes/"+com+"/categories/"+cat )  ;
         } else {
        
         if (villes.length == 0 ) {
              //      console.log(cat) ; 
                   let cat = categories.toString() ; 
                    return this.http.get(this.host+"/api/delivery/categories/"+cat )  ;
  
         }else {
             if ( categories.length == 0 ) {
                let com = villes.toString() ; 
                  
                 return this.http.get(this.host+"/api/delivery/villes/"+com )  ;
             }
             
             }
         
         }
 }
    removeDelivery(id ) {
        
        return this.http.put(this.host+'/api/delivery/remove/'+id , {}) ; 
        }
}
