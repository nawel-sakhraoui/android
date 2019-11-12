import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NgZone} from '@angular/core';

import { SocketIO } from "nativescript-socketio"; 
 


import { Observable } from 'rxjs/Observable';
//import { SocketIO } from 'nativescript-socketio';
import {ConfigService} from './api-config.service'; 
 //import * as SocketIO from "nativescript-socket.io"; 

 
@Injectable()
export class UserdetailsService {

   socket :any ; 
   host :string ; 
    apiKey:string ; 
   constructor(private http: HttpClient, 
                private socketIO :SocketIO, 
                private ngZone :NgZone) { 
    
         this.host = ConfigService.storeServer; 
         this.apiKey = ConfigService.apiKey; 
        // this.socket =new SocketIO(this.host );
        // this.socket.connect();
    // this.socket = SocketIO.connect(this.host) ; 
       
    } 
    
    
   postUserAccount (fullname : string, phone : string){
           return this.http.post(this.host+'/api/useraccount', {'fullname':fullname, 'phone':phone}  ); 
        
        }
    
   getUserAccount (userid:string){
       return this.http.get (this.host+'/api/useraccount/'+userid); 
      }
    
    
   getFullname(userid: string){
               return this.http.get (this.host+'/api/useraccount/'+userid+'/fullname'); 

        }
    
   postAvatar (userid : string , avatar :any){
      return this.http.put(this.host+'/api/users/'+userid+'/avatar',{'avatar':avatar}); 

       
   }
   
   getAvatar (userid : string ) {
         return this.http.get(this.host+'/api/users/'+userid+'/avatar'); 

    }
    putRating(userid, value, feedback, storetitle  ) {
                return this.http.put(this.host+'/api/useraccount/'+userid+'/rating',{'storetitle':storetitle,'value':value, 'feedback':feedback}); 

        }
       
   getRating (userid : string ) {
     
        return this.http.get(this.host+'/api/useraccount/'+userid+'/rating'); 

    }
    
    getRatingList(userid: string ){
         return this.http.get(this.host+'/api/useraccount/'+userid+'/ratinglist'); 

    }
   
    getNotifications (userid: string){
         return this.http.get(this.host+'/api/useraccount/'+userid+'/notifications') ; 
    }
    
    
    
    putNotification (userid : string, commandid:string,value:string, time:number, storetitle:string ){
          return this.http.put(this.host+'/api/useraccount/'+userid+'/notifications', {'commandid':commandid,
                                                                                                    'value':value, 
                                                                                                      'time':time,
                                                                                                      'storetitle': storetitle}) ; 

        }
    
    
     removeNotification (userid : string, notifs:any ){
         console.log(notifs); 
          return this.http.put(this.host+'/api/useraccount/'+userid+'/notifications/removelist', {'notifs':notifs}); 

      }
    getNotif (id) {
            
     console.log(id) 
     let observable = new Observable(observer => { 
          
              //this.socket = io(this.host);
              this.socketIO.connect() ; 
                this.socketIO.on('ongoing_step'+id, (data) => {
                        this.ngZone.run(() => {
                               // Do stuff here
                             console.log(data ) ; 
                             observer.next(data);  
                          });
                    
                });
             return () => {
                   this.socketIO.disconnect(); 
                }; 
        }) 
        return observable;
    
    } 
    
    searchUser( userphone: string){
                   return this.http.get(this.host+'/api/useraccount/search/'+userphone);

        }
        
     
     getMessagesNotifications (userid: string){
         return this.http.get(this.host+'/api/useraccount/'+userid+'/messages/notifications') ; 
        }
    
    
    
    putMessagesNotification (userid : string ){
          return this.http.put(this.host+'/api/useraccount/'+userid+'/messages/notifications',{'messagesnotificationcount':1}) ; 

        }
    
     putMessagesNotificationdown (userid : string, read:number ){
          return this.http.put(this.host+'/api/useraccount/'+userid+'/messages/notificationsdown',{'read':read}) ; 

        }
    
    
    getMessagesNotif(userid) {
            
      console.log(userid); 
          
          let observable = new Observable(observer => { 
          
             // this.socket = io(this.host);
              this.socketIO.connect() ; 
                this.socketIO.on('messages_notif'+userid, (data) => {
                    this.ngZone.run(() => {
                               // Do stuff here
                             console.log(data ) ; 
                             observer.next(data);  
                          });   
                });
              return () => {
                   this.socketIO.disconnect(); 
               }; 
        }) 
        return observable;
    
    }
    
    getMessagesNotifDown(userid) {
            
      console.log(userid); 
          
          let observable = new Observable(observer => { 
          
             // this.socket = io(this.host);
              this.socketIO.connect() ; 
                this.socketIO.on('messages_notif_down'+userid, (data) => {
                        this.ngZone.run(() => {
                               // Do stuff here
                             console.log(data ) ; 
                             observer.next(data);  
                          });
                
                });
               return () => {
                 this.socketIO.disconnect(); 
              
                   }; 
        }) 
        return observable;
    
    } 
    removeNotifByCommandId(userid, commandid , value){
        console.log (value ) ;
        if (value != 'message' &&  value!='rating') {
           value = 'notif' ; 
                
        }
        
        console.log(value) ; 
        return this.http.put(this.host+'/api/useraccount/'+userid+'/notifications/remove/'+value, {'commandid':commandid
                                                                                                              });

        
    }
    
      getRemoveNotif (id) {

       console.log(id) 
          
          let observable = new Observable(observer => { 
          
             // this.socket = io(this.host);
              this.socketIO.connect() 
                this.socketIO.on('ongoing_remove_step'+id, (data) => {
                     this.ngZone.run(() => {
                               // Do stuff here
                             console.log(data ) ; 
                             observer.next(data);  
                          });
                });
                return () => {
                    this.socketIO.disconnect(); 
                }; 
        }) 
        return observable;
    
    } 
    putCategory (userid: string , category : string ) {
        
        
        }
    removeCategory (userid : string, category : string ) {
        
        
        }
    putLocation(userid, location ) {
                return this.http.put(this.host+'/api/useraccount/'+userid+'/location', {'location':location});
 
        }
    
      getLocation(userid: string){
               return this.http.get (this.host+'/api/useraccount/'+userid+'/location'); 

        }
      
    getFirebase(userid : string ){
        return this.http.get(this.host+'/api/useraccount/'+userid+'/firebase'); 
      }
    
    addFirebase(userid:string, firebase:string) {
                return this.http.put(this.host+'/api/useraccount/'+userid+'/firebase',{"firebase":firebase}); 
     }      
      
    
    getGeo(longitude, latitude) {
        
            //   longitude = '10.393';
           //    latitude = "31.373";
        let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&key=" + this.apiKey;
        return this.http.get(url); 

        
        }
    
}
