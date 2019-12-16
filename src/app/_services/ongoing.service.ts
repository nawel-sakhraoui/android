import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {ConfigService} from './api-config.service'; 



@Injectable()
export class OngoingService {
        
    private host :string ; 
    
    constructor(private http: HttpClient) { 
    
         this.host = ConfigService.storeServer; 
    } 
   
    postArticle(article:any ) {
        
                return this.http.post(this.host+'/api/ongoing', article);

        };
    
    getArticlesByStoreId(storeid: string,froms :number, size:number ){
        storeid= storeid.replace(/ /g, "%20");
                  let v = "notclose" ; 
                return this.http.get(this.host+'/api/ongoing/stores/'+storeid+'/close/'+v+"/"+froms+"/"+size);

         };
    
      
    getArticlesByStoreIdClose(storeid: string,froms :number, size:number ){
        storeid= storeid.replace(/ /g, "%20");
             let v = "close" ;
                return this.http.get(this.host+'/api/ongoing/stores/'+storeid+'/close/'+v+"/"+froms+"/"+size);

         };
    
        getCountArticlesByStoreId(storeid: string ){
            storeid= storeid.replace(/ /g, "%20");
            console.log(storeid) ; 
             let v = "notclose" ;
             return this.http.get(this.host+'/api/ongoing/stores/'+storeid+'/close/'+v+"/count/");

         };
    
        
        getCountArticlesByStoreIdClose(storeid: string ){
                         console.log(storeid )  ;
                storeid= storeid.replace(/ /g, "%20");
             let v = "close" ;
             return this.http.get(this.host+'/api/ongoing/stores/'+storeid+'/close/'+v+"/count/");

         };
    
         getCountArticlesByUserId(userid: string ){
             let v = "notclose" ;
             return this.http.get(this.host+'/api/ongoing/users/'+userid+'/close/'+v+"/count/");

         };
    
        
         getCountArticlesByUserIdClose(userid: string ){
             let v = "close" ;
             return this.http.get(this.host+'/api/ongoing/users/'+userid+'/close/'+v+"/count/");

         };
       
         getArticlesByUserId(userid: string, froms : number , size: number ){
                let v = "notclose" ; 
                return this.http.get(this.host+'/api/ongoing/users/'+userid+'/close/'+v+"/"+froms+"/"+size);

         };
    
    
        getArticlesByUserIdClose(userid: string , froms:number, size:number){
    
                let v = "close" ;
                return this.http.get(this.host+'/api/ongoing/users/'+userid+'/close/'+v+"/"+froms+"/"+size);

         };
    
       postMessage(froms: string , to: string , message:string) {
              return this.http.put(this.host+'/api/ongoing/messages',{'message':message, 
                                                                                   'from': froms,
                                                                                    'to': to }); 
       
       }
    
      putPrepare (commandid:string, prepare ) {
        
                return this.http.put(this.host+'/api/ongoing/'+commandid+'/prepare', {"prepare":prepare });

        };
    
       putSend (commandid:string, send ) {
        
                return this.http.put(this.host+'/api/ongoing/'+commandid+'/send', {"send":send });

        };

       putReceive(commandid:string, receive ) {
        
                return this.http.put(this.host+'/api/ongoing/'+commandid+'/receive', {"receive":receive });

        };
    
        putLitige(commandid:string, litige) {
        
                return this.http.put(this.host+'/api/ongoing/'+commandid+'/litige', {"litige":litige });

        };
     
         putSolvedLitige(commandid:string, litige) {
        
                return this.http.put(this.host+'/api/ongoing/'+commandid+'/solvedlitige', {"solvedlitige":litige });

        };
    
    
        putClose(commandid:string, close ) {
            console.log("closeservice ") ; 
                console.log(close) ; 
                return this.http.put(this.host+'/api/ongoing/'+commandid+'/close', {"close":close });

        };
       
        putStop(commandid:string, stop ) {
        
                return this.http.put(this.host+'/api/ongoing/'+commandid+'/stop', {"stop":stop });

        };
    
       putRating(commandid:string) {
        
                return this.http.put(this.host+'/api/ongoing/'+commandid+'/rating', {"rating":false });

        };
    
    
       putRatingArticle(commandid: string, articleid : string ,rating:any, feedback:any ){
               
                return this.http.put(this.host+'/api/ongoing/'+commandid+'/rating/article', {'articleid':articleid, 'rating':rating, 'feedback':feedback});

         };
        putAllRatingArticle(commandid: string ,rating:any, feedback:any ){
               console.log(rating); 
                return this.http.put(this.host+'/api/ongoing/'+commandid+'/rating/allarticle', {'rating':rating, 'feedback':feedback});

         };
    
        putRatingUser(commandid: string ,rating:any, feedback:any ){
               console.log(rating); 
                return this.http.put(this.host+'/api/ongoing/'+commandid+'/rating/user', {'rating':rating, 'feedback':feedback});

         };
         putRatingUserStore(commandid: string ,rating:any, feedback:any ){
               console.log(rating); 
                return this.http.put(this.host+'/api/ongoing/'+commandid+'/rating/storeusers', {'rating':rating, 'feedback':feedback});

         };
        
         getOngoingById(commandid: string ) {
              return this.http.get(this.host+'/api/ongoing/ongoing/'+commandid) ; 
             }
    
        getOngoingStoreUser(userid : string, storeid : string ) {
            storeid= storeid.replace(/ /g, "%20");
            
             return this.http.get (this.host+'/api/ongoing/ongoing/store/'+storeid+"/user/"+ userid ) ; 
            }
     /*  getOngoingSteps(id) { 
          
          let observable = new Observable(observer => { 
                this.socket = io(this.url);
                this.socket.on('ongoing_step'+id, (data) => {
                    console.log(data ) ; 
                     observer.next(data);   
                });
                return () => {
                     this.socket.disconnect(); 
                }; 
        }) 
        return observable;
    
    } */

 }
