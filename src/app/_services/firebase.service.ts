import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
 
    

/* httpOptions = {
  'headers':this.headers// new HttpHeaders({
    //'Content-Type':  'application/json',
  //  'Authorization': 'key=AAAAqbHsZxk:APA91bHJCcsIXCGsaOknEfhMa6DRFO-x27elF49hXZamf764YvzHGDpQVq8hyoKGudvNPG97_cNTY1QL_e7DmM80H4xDOOTMJQJ6BX8BSEPfIiCMb6LTo2L9jnmV-4p18ckHiLA4YVXm'
 // })
};*/
  
  constructor(private http : HttpClient) {

     //      this.headers=this.headers.append( 'Authorization', 'key=AAAAqbHsZxk:APA91bHJCcsIXCGsaOknEfhMa6DRFO-x27elF49hXZamf764YvzHGDpQVq8hyoKGudvNPG97_cNTY1QL_e7DmM80H4xDOOTMJQJ6BX8BSEPfIiCMb6LTo2L9jnmV-4p18ckHiLA4YVXm') ; 
 
    }

    //sendMsgNotification()
    messageNotif( token:string, fullname:string, userid:string, pic  ) {
       
      return  this.http.post("https://fcm.googleapis.com/fcm/send" , 
                 {
                    "notification": {
                         "title": fullname,
                         "text":  "Vous à envoyé un nouveau message.",
                         "icon": pic ,//'assets/siin.png',
                         "sound": "default",
                     },
                     "data": {
                         "notif":"message",
                         "userid" : userid,
                         "userfullname":fullname   
                     
                     },
                     
                       "priority": "High",
                        "to": token
                 });
  
        
        }
     
     //storemessage notif 
    storemessageNotif( token:string, storename:string, commandid:string ) {
       
      return  this.http.post("https://fcm.googleapis.com/fcm/send" , 
                 {
                    "notification": {
                         "title": storename,
                         "text":  "Vous avez un nouveau message.",
                         "sound": "default"
                     },
                     'data': {
                         'notif':"ongoing",
                         "commandid":commandid,
                         'fragment': 'message',
                      },
                       "priority": "High",
                        "to": token
                 });
  
        
        }
    
        //storemessage notif 
    prepareNotif( token:string, storename:string, commandid:string ) {
       
      return  this.http.post("https://fcm.googleapis.com/fcm/send" , 
                 {
                    "notification": {
                         "title": storename,
                         "text":  "Votre commande est prête, en attente de livraison.",
                         "sound": "default"
                     },
                     'data': {
                         'notif':"ongoing",
                         "commandid":commandid,
                         'fragment': 'no'
                      },
                       "priority": "High",
                        "to": token
                 });
  
        
        }
    
    
    sendNotif( token:string, storename:string , commandid:string ) {
       
      return  this.http.post("https://fcm.googleapis.com/fcm/send" , 
                 {
                    "notification": {
                         "title": storename,
                         "text":  "Votre commande a été envoyée.",
                         "sound": "default"
                     },
                     'data': {
                         'notif':"ongoing", 
                         "commandid":commandid,
                         'fragment': 'no'
                      },
                       "priority": "High",
                        "to": token
                 });
  
        
        }
     ratingNotif( token:string, storename:string, commandid:string ) {
       
      return  this.http.post("https://fcm.googleapis.com/fcm/send" , 
                 {
                    "notification": {
                         "title": storename,
                         "text":  "Noter les articles achetés",
                         "sound": "default"
                     },
                     
                     'data': {
                         'notif':"ongoing", 
                         "commandid":commandid,
                         'fragment': 'rating'
                      },
                     
                       "priority": "High",
                        "to": token
                 });
  
        
        }
    
    
     commandNotif( token:string, fullname:string , storename:string, commandid:string) {
       
      return  this.http.post("https://fcm.googleapis.com/fcm/send" , 
                 {
                    "notification": {
                         "title": storename,
                         "text":  "Vous avez une nouvelle commande de "+ fullname,
                         "sound": "default"
                     },
                     'data': {
                         'notif':"store",
                         'storeid':storename,
                         "commandid":commandid,
                         'fragment': 'no'
                      },
                       "priority": "High",
                        "to": token
                 });
  
        
        }
     receiveNotif( token:string, fullname:string , storename:string,commandid:string) {
       
      return  this.http.post("https://fcm.googleapis.com/fcm/send" , 
                 {
                    "notification": {
                         "title": storename,
                         "text":   fullname+" à reçu votre commande",
                         "sound": "default"
                     },
                     'data': {
                         'notif':"store",
                         'storeid':storename,
                         "commandid":commandid,
                         'fragment': 'no'
                      },
                       "priority": "High",
                        "to": token
                 });
  
        
        }
    
     litigeNotif( token:string, fullname:string , storename:string, commandid:string) {
       
      return  this.http.post("https://fcm.googleapis.com/fcm/send" , 
                 {
                    "notification": {
                         "title": storename,
                         "text":   fullname+" retour de la commande",
                         "sound": "default"
                     },
                     'data': {
                         'notif':"store",
                         'storeid':storename,
                         "commandid":commandid,
                         'fragment': 'no'
                      },
                       "priority": "High",
                        "to": token
                 });
  
        
        }
    
    
      closelitigeNotif( token:string, fullname:string , storename:string,commandid:string) {
       
      return  this.http.post("https://fcm.googleapis.com/fcm/send" , 
                 {
                    "notification": {
                         "title": storename,
                         "text":   fullname+" à fermée le litige",
                         "sound": "default"
                     },
                       'data': {
                         'notif':"store",
                         'storeid':storename,
                         "commandid":commandid,
                         'fragment': 'no'
                      },
                       "priority": "High",
                        "to": token
                 });
  
        
        }
      usermessageNotif( token:string, fullname:string , storename:string,commandid:string) {
       
      return  this.http.post("https://fcm.googleapis.com/fcm/send" , 
                 {
                    "notification": {
                         "title": storename,
                         "text":   fullname+" à envoyé un message",
                         "sound": "default"
                     },
                     'data': {
                         'notif':"store",
                         'storeid':storename,
                         "commandid":commandid,
                         'fragment': 'message'
                      },
                       "priority": "High",
                        "to": token
                 });
  
        
        }
    
       closeNotif( token:string, fullname:string , storename:string, commandid:string) {
       
      return  this.http.post("https://fcm.googleapis.com/fcm/send" , 
                 {
                    "notification": {
                         "title": storename,
                         "text":   fullname+" commande complétées",
                         "sound": "default"
                     },
                     'data': {
                         'notif':"store",
                         'storeid':storename,
                         "commandid":commandid,
                         'fragment': 'rating'
                      },
                      "priority": "High",
                      "to": token
                 });
  
        
        }
       
    
    stopNotif( token:string, fullname:string , storename:string, commandid:string) {
       
      return  this.http.post("https://fcm.googleapis.com/fcm/send" , 
                 {
                    "notification": {
                         "title": storename,
                         "text":   fullname+" à annulé  sa commande",
                         "sound": "default"
                     },
                     
                     'data': {
                         'notif':"store",
                         'storeid':storename,
                         "commandid":commandid,
                         'fragment': 'no'
                      },
                       "priority": "High",
                        "to": token
                 });
  
        
        }
     /*   
        1. POST: https://fcm.googleapis.com/fcm/send2. Headers
   - Authorization: key={{SERVER_KEY}}
   - Content-Type: application/json3. Body: raw
   {
     "notification": {
       "title": "My title",
       "text": "My text",
       "sound": "default"
     },
     "priority": "High",
     "to": "{{DEVICE_TOKEN}}"
   }
       }*/
    
}
