
import { NgZone} from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketIO } from "nativescript-socketio"; 


import {ConfigService} from './api-config.service'; 

//import * as EmailValidator from 'email-validator';


 import { Observable } from 'rxjs/Observable';
 import * as io from 'socket.io-client';

@Injectable()
export class StoreService {
        
    socket :any ; 
    host : string ; 
    constructor(private http: HttpClient, 
                private socketIO: SocketIO, 
                private ngZone: NgZone) { 
    
         this.host = ConfigService.storeServer; 
           //  this.socket = SocketIO.connect(this.host) ; 

        
    } 
    
    //check storage name 
    existStore (title : string ) {
        return this.http.get (this.host+'/api/stores/stores/exist/'+title) ; 
        
    }
    
    
    
    // create a new storage 
    create(store: any) {
      // console.log(store) ; 
        return this.http.post(this.host+'/api/stores', store);
    }
    
    
  
    /* getCategories (){
         
        return this.http.get (this.host+'/api/stores/categories') ; 
     }
    
    */
      // getKeywords (categorie:string ){
         
      //  return this.http.get (this.host+'/api/stores/categories/'+categorie+'/keywords') ; 
     //}    

    //store cover  
    /*postCover(storename : string , cover: any){
        return new Promise ((resolve, reject)=>{
        
       const req = new XMLHttpRequest() ;
        var formData: any = new FormData();
        formData.append('file', cover, cover.name) ; 
        //req.setRequestHeader('enctype', 'multipart/form-data');
       req.open('POST', this.host+'/api/stores/'+storename+'/cover') ; 
       req.send (formData);
       // return this.http .post (this.host+'/api/stores/'+storename+'/cover',cover); 
        //console.log(formData) ; 
        });
        }
    
    */
    postArticle ( storeid :string,  article : any ){
        return this.http.post(this.host+'/api/stores/articles/stores/'+storeid, article ); 
    }
    
    getArticle (id : string ){
        return this.http.get(this.host+'/api/stores/articles/'+id);   
        
    }
    
    getArticlesByStoreTitle(storeTitle : string, froms, size){
      
        return this.http.get (this.host+'/api/stores/'+storeTitle+'/articles/'+true+'/'+froms+'/'+size); 
    }
  
    getSoldoutArticlesByStoreTitle(storeTitle : string, froms,size){
      
        return this.http.get (this.host+'/api/stores/'+storeTitle+'/articles/'+false+'/'+froms+'/'+size); 
    }
    
    getArticlesCount (storetitle:string, available:boolean){
        
      return this.http.get(this.host+'/api/stores/'+storetitle+'/articles/'+available+'/count');
   
    }
    
    getArticlesForCart (articlesid:any) {
        console.log(articlesid) ; 
        return this.http.get ( this.host+'/api/articles/articles/'+articlesid.toString()) ;   
    }   

    postBanner (storename : string , banner:any ) {
        //console.log(cover.toString());
          //this.covurl = resizeb64(this.covurl, 'auto', '800px');
             return this.http.put(this.host+'/api/stores/'+storename+'/banner',{'banner':banner}); 
     }
    
    getBanner(storetitle: string){
      //  console.log(storetitle ) ; 
        
        return  this.http.get (this.host+'/api/stores/'+storetitle+'/banner'); 
    }
    
   
      postPic (article : string , pic:any ) {
        
             return this.http.put(this.host+'/api/articles/'+article+'/pic',{'pic':pic}); 
     }
    
    getPic(article: string){
     //   console.log(article ) ; 
        
        return  this.http.get(this.host+'/api/articles/'+article+'/pic'); 
    }
    
     
      postGallery (article : string , gallery:any ) {
        //console.log(cover.toString());
          //this.covurl = resizeb64(this.covurl, 'auto', '800px');
             return this.http.put(this.host+'/api/articles/'+article+'/gallery',{'gallery':gallery}); 
     }
    
    getGallery(article: string){
        console.log(article ) ; 
        
        return  this.http.get(this.host+'/api/articles/'+article+'/gallery'); 
    }
    

    
    getStoresByUserId(userid : string){
         console.log(userid); 
        return this.http.get (this.host+'/api/stores/'+userid); 
    }
    
        getStore( store:string){
         console.log(store); 
        return this.http.get (this.host+'/api/stores/stores/'+store); 
    }
    
    getCategories (){
        
        return this.http.get(this.host+'/api/categories'); 
    }
      getCategoriesAr (){
        
        return this.http.get(this.host+'/api/categories/ar'); 
    }
    
    //post articles rating 
     putRating(articleid, value, fromuser, feedback ) {
                return this.http.put(this.host+'/api/articles/articles/'+articleid+'/rating',{'userid':fromuser,'value':value, 'feedback':feedback}); 

        }
       
   getRating (articleid : string ) {
     
        return this.http.get(this.host+'/api/articles/articles/'+articleid+'/rating'); 

    }
    getRatingByUser(articleid: string, userid : string  ){
        return this.http.get('http://'+this.host+'/api/articles/articles/'+articleid+'/rating/user/'+userid);
    }
    
    getRatingList(articleid: string ){
         return this.http.get(this.host+'/api/articles/articles/'+articleid+'/ratinglist'); 

    }
    
     putRatingStore(storeid, value) {
                return this.http.put(this.host+'/api/stores/stores/'+storeid+'/rating',{'value':value}); 

        }
       
   getRatingStore (storeid : string ) {
     
        return this.http.get(this.host+'/api/stores/stores/'+storeid+'/rating'); 

    }
    
      getNotifications (storeid: string){
         return this.http.get(this.host+'/api/stores/stores/'+storeid+'/notification') ; 
        }
    
    
    
    putNotification ( commandid:any,value:string, time:any, storetitle:string,userid:string, fullname :  string  ){
          return this.http.put(this.host+'/api/stores/stores/'+storetitle+'/notification', {'commandid':commandid,
                                                                                                    'value':value, 
                                                                                                      'time':time,
                                                                                                      'userid': userid, 
                                                                                                      "fullname": fullname}) ; 

        }
    getNotif (id) {
        
        
            
       console.log(id) ;
          
       let observable = new Observable(observer => { 
        
                //this.socket = io(this.host);
                this.socketIO.connect() ; 
                this.socketIO.on('store_step'+id, (data) => {
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
    
     removeNotificationByCommandid (storetitle:string, commandid :string, value:string ){

         return this.http.put(this.host+'/api/stores/stores/'+storetitle+'/notification/remove', {'commandid':commandid,
                                                                                                              'value':value}); 

      }
      getRemoveNotif (id) {
            
       console.log(id) ;
          
         let observable = new Observable(observer => { 
          
                     this.socketIO.connect() ; 
                this.socketIO.on('store_step_remove'+id, (data) => {
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
    
    
    
    updateSelectedCat( storeid , value ) {
        
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/categories', {'selectedCat': value})  ; 
    
     }
    
    
     updateGeo( storeid , value ) {
        
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/geo', {'geo': value})  ; 
    
     }
     getGeo( storeid  ) {
        
          return  this.http.get(this.host+'/api/stores/stores/'+storeid+'/geo')  ; 
    
     }
    
     updateDescription( storeid , value ) {
        
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/description', {'description': value})  ; 
    
     }
    updateAdmins( storeid , value :any) {
        
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/admins', {'admins': value})  ; 
    
     }
    
      putStoreStatus( storeid  , value:boolean ) {
        
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/close', {'open': value})  ; 
    
     }
 
     getStoreStatus( storeid  ) {
        
          return  this.http.get(this.host+'/api/stores/stores/'+storeid+'/status')  ; 
    
     }
    
     updateArticleNumbers( storeid : string, articleid:string, value:string ) {
        
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/numbers', {'numbers': value})  ; 
    
     }  
    updateArticlePrice(storeid:string, articleid:string, value:string ) {
        
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/price', {'price': value})  ; 
    
     }
     updateArticleTitle(storeid:string, articleid:string, value:string ) {
        
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/title', {'title': value})  ; 
    
     }
    updateArticleDescription(storeid:string, articleid:string, value:string ) {
        
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/description', {'description': value})  ; 
    
     }
      updateArticleSizing(storeid:string, articleid:string, value:string ) {
        
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/sizing', {'sizing': value})  ; 
    
     }
       updateArticleCategories(storeid:string, articleid:string, value:string ) {
        
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/categories',  {'selectedCat': value})  ; 
    
     }
 
       updateArticleDelivery( storeid:string, articleid:string, value:any) {
        
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/delivery', {'delivery': value})  ; 
    
     }
     
    updateArticleColor(storeid:string, articleid:string, value:any) {
        
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/color', {'color': value})  ; 
    
    }
    
     updateArticlesGeo(storeid:string,  value:any) {
        
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/all/geo', {'geo': value})  ; 
    
    }
    
    
    updateArticleAvailable( storeid:string, articleid:string, value:any) {
       
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/available', {'available': value})  ; 
    
    }
    
    getDeliveries (){
         return this.http.get(this.host+'/api/deliveries'); 
    }
    
    getStoreCategories (storetitle) {
        return this.http.get(this.host+'/api/stores/store/'+storetitle+"/selectedcat"); 
    }
    
    
    putIncome( storeid:string , income:any) {
        
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/income', {'income': income})  ; 
    
     }
    getIncome (storeid:string ) {
        
            return this.http.get(this.host+'/api/stores/stores/'+storeid+'/income') ;
     }
     
    putSuspend( storeid:string , suspend:boolean) {
        
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/suspend', {'suspend': suspend})  ; 
    
    }
    getSuspend (storeid:string ) {
        
           return this.http.get(this.host+'/api/stores/stores/'+storeid+'/suspend') ;
    }
    // suspended store's article 
    putSuspendArticles(storeid : string, suspend:boolean ) {
         return this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/all/suspend/all', {'suspend'   :suspend}); 
    
        
    }
    putSuspendArticleById (storeid : string, articleid:string, suspend:boolean ) {
         return this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/suspend', {'suspend':suspend}); 

        
    }
    getArticleSuspend (storeid:string, articleid : string ) {
    
                 return  this.http.get(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/suspend')  ; 

    }
    
    getStoresCount() {
      // console.log(store) ; 
        return this.http.get(this.host+'/api/managerstores/stores/count');
    }
    
    getStoresManager(storeid:string){
        
        return this.http.get(this.host+'/api/managerstores/stores/'+storeid) ; 
    }
    ///api/stores/stores/:storeid/income/validate
    putIncomeLoan( storeid:string , income:any) {
        
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/income/loan', {'income': income})  ; 
    
     }
    putIncomeValidate( storeid:string , income:any) {
        
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/income/validate', {'income': income})  ; 
    
     }
    
        postLoanProof (storename : string ,date:string ,  loan:any ) {
        //console.log(cover.toString());
          //this.covurl = resizeb64(this.covurl, 'auto', '800px');
             return this.http.put(this.host+'/api/stores/'+storename+'/loan/'+date, {'loan':loan}); 
     }
     getLoanProof (storename : string ,date:string ) {
        //console.log(cover.toString());
          //this.covurl = resizeb64(this.covurl, 'auto', '800px');
             return this.http.get(this.host+'/api/stores/'+storename+'/loan/'+date); 
     }
    
    getAdmins(storetitle){
        
        return this.http.get(this.host+'/api/managerstores/stores/admins/'+storetitle) ; 
        }
    
    
}
    

/*

*/
