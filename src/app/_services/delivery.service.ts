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
    
 getDelivery(deliveryId ){ 
 
      return this.http.get(this.host+'/api/delivery/id/'+deliveryId) ;   
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
    

  updatePhone(id, phone ) {
        
        return this.http.put(this.host+'/api/delivery/'+id+'/phone' , {'phone':phone} ); 
     }
    
   updateAvailable(id, available ) {
        
        return this.http.put(this.host+'/api/delivery/'+id+'/available' , {'available':available} ); 
     } 
    
      
    //Ongoing delivery 
    // ongoingid; deliveryid 
     putOngoingDelivery (ongoingid, deliveryid , storeid, userid,start,price, deliveryAddress) {
        
             return this.http.put(this.host+'/api/delivery/ongoing/'+deliveryid, {'ongoingid':ongoingid, 'storeid':storeid, 'userid':userid,
                                                                                  'got':0,'delivered':0,  'close':0, 'refund':0, 'start':start,
                                                                                  'price':price, 'address':deliveryAddress});
      }
    
       
      getOngoingDeliveryCount(deliveryid) {
         return this.http.get(this.host+'/api/delivery/'+deliveryid+'/ongoing/count' );
      }
    
      getOngoingDelivery(deliveryid, froms, size ){
         return this.http.get(this.host+'/api/delivery/'+deliveryid+'/ongoing/notclose/from/'+froms+'/size/'+size );
        
        }
    
      getDoneDeliveryCount(deliveryid) {
         return this.http.get(this.host+'/api/delivery/'+deliveryid+'/ongoing/countclose' );
 
        }
    
     getDoneDelivery(deliveryid, froms,size) {
          return this.http.get(this.host+'/api/delivery/'+deliveryid+'/ongoing/close/from/'+froms+'/size/'+size );
       
       }
    
       getWeeklyIncome(deliveryid,first,last){
        
           return this.http.get(this.host+'/api/delivery/'+deliveryid+'/ongoing/close/first/'+first+'/last/'+last );

        
       }
    
    
       getWeeklyrefund(){
       
       }
    
    
    
    putDeliveryGot(id, ongoingid, got){
         return this.http.put(this.host+'/api/delivery/'+id+'/ongoing/'+ongoingid+'/got/'+got, {}); 
    }
    
    putDeliveryDelivered(id, ongoingid, delivered){
         return this.http.put(this.host+'/api/delivery/'+id+'/ongoing/'+ongoingid+'/delivered/'+delivered, {}); 
    }
 
    putDeliveryRefund(id, ongoingid, refund){
         return this.http.put(this.host+'/api/delivery/'+id+'/ongoing/'+ongoingid+'/refund/'+refund, {}); 
    }

    putDeliveryClose(id, ongoingid, close){
         return this.http.put(this.host+'/api/delivery/'+id+'/ongoing/'+ongoingid+'/close/'+close, {}); 
    }
    getMonthIncome(id) {
        
        return this.http.get(this.host+'/api/delivery/'+id+'/monthincome') ; 
        
        }
    
}
