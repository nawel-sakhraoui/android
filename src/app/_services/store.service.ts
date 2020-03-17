
import { NgZone} from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketIO } from "nativescript-socketio"; 


import * as  BackgroundHttp from "nativescript-background-http";
//import "rxjs/Rx";
import * as FileSystem from "file-system";


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
    existStore (storeid: string ) {
         storeid= storeid.replace(/ /g, "%20");
        return this.http.get (this.host+'/api/stores/stores/exist/'+storeid) ; 
        
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
    postArticle ( storetitle :string,  article : any ){
       // storetitle= storetitle.replace(/ /g, "%20"); 
        return this.http.post(this.host+'/api/stores/articles/stores/'+storetitle, article ); 
    }
    
    
    getArticle (id : string ){
        return this.http.get(this.host+'/api/stores/articles/'+id);       
    }
    
    getArticlesByStoreTitle(storetitle : string, froms, size){
        storetitle= storetitle.replace(/ /g, "%20"); 
        return this.http.get (this.host+'/api/stores/'+storetitle+'/articles/'+true+'/'+froms+'/'+size); 
    }
  
    getSoldoutArticlesByStoreTitle(storeid : string, froms,size){
       storeid= storeid.replace(/ /g, "%20");
        return this.http.get (this.host+'/api/stores/'+storeid+'/articles/'+false+'/'+froms+'/'+size); 
    }
    
    getArticlesCount (storeid:string, available:boolean){
         storeid= storeid.replace(/ /g, "%20"); 
      return this.http.get(this.host+'/api/stores/'+storeid+'/articles/'+available+'/count');
   
    }
    
    getArticlesForCart (articlesid:any) {
        console.log(articlesid) ; 
        return this.http.get ( this.host+'/api/articles/articles/'+articlesid.toString()) ;   
    }   

    postBanner (storeid : string , banner:any ) {
         storeid= storeid.replace(/ /g, "%20");
        //console.log(cover.toString());
          //this.covurl = resizeb64(this.covurl, 'auto', '800px');
             return this.http.put(this.host+'/api/stores/'+storeid+'/banner',{'banner':banner}); 
     }
    
    getBanner(storeid: string){
      //  console.log(storetitle ) ; 
         storeid= storeid.replace(/ /g, "%20");
        return  this.http.get (this.host+'/api/stores/'+storeid+'/banner'); 
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
    
        getStore( storeid:string){
             storeid= storeid.replace(/ /g, "%20");
        return this.http.get (this.host+'/api/stores/stores/'+storeid); 
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
          storeid= storeid.replace(/ /g, "%20");
                return this.http.put(this.host+'/api/stores/stores/'+storeid+'/rating',{'value':value}); 

        }
       
   getRatingStore (storeid : string ) {
      storeid= storeid.replace(/ /g, "%20");
        return this.http.get(this.host+'/api/stores/stores/'+storeid+'/rating'); 

    }
    
      getNotifications (storeid: string){
           storeid= storeid.replace(/ /g, "%20");
         return this.http.get(this.host+'/api/stores/stores/'+storeid+'/notification') ; 
        }
    
    
    
    putNotification ( commandid:any,value:string, time:any, storeid:string,userid:string, fullname :  string  ){
         storeid= storeid.replace(/ /g, "%20");
          return this.http.put(this.host+'/api/stores/stores/'+storeid+'/notification', {'commandid':commandid,
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
    
     removeNotificationByCommandid (storeid:string, commandid :string, value:string ){
         storeid= storeid.replace(/ /g, "%20"); 
         return this.http.put(this.host+'/api/stores/stores/'+storeid+'/notification/remove', {'commandid':commandid,
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
         storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/categories', {'selectedCat': value})  ; 
    
     }
    
    
     updateGeo( storeid , value ) {
         storeid= storeid.replace(/ /g, "%20"); 
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/geo', {'geo': value})  ; 
    
     }
     getGeo( storeid  ) {
         storeid= storeid.replace(/ /g, "%20"); 
          return  this.http.get(this.host+'/api/stores/stores/'+storeid+'/geo')  ; 
    
     }
    
     updateDescription( storeid , value ) {
         storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/description', {'description': value})  ; 
    
     }
    updateAdmins( storeid , value :any) {
         storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/admins', {'admins': value})  ; 
    
     }
    
      putStoreStatus( storeid  , value:boolean ) {
         storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/close', {'open': value})  ; 
    
     }
 
     getStoreStatus( storeid :string ) {
         storeid= storeid.replace(/ /g, "%20");
          return  this.http.get(this.host+'/api/stores/stores/'+storeid+'/status')  ; 
    
     }
    
     updateArticleNumbers( storeid : string, articleid:string, value:string ) {
         storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/numbers', {'numbers': value})  ; 
    
     }  
    updateArticlePrice(storeid:string, articleid:string, value:string ) {
         storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/price', {'price': value})  ; 
    
     }
     updateArticleTitle(storeid:string, articleid:string, value:string ) {
            storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/title', {'title': value})  ; 
    
     }
    updateArticleDescription(storeid:string, articleid:string, value:string ) {
           storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/description', {'description': value})  ; 
    
     }
      updateArticleSizing(storeid:string, articleid:string, value:string ) {
            storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/sizing', {'sizing': value})  ; 
    
     }
       updateArticleCategories(storeid:string, articleid:string, value:string ) {
            storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/categories',  {'selectedCat': value})  ; 
    
     }
 
       updateArticleDelivery( storeid:string, articleid:string, value:any) {
             storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/delivery', {'delivery': value})  ; 
    
     }
     
    updateArticleColor(storeid:string, articleid:string, value:any) {
              storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/color', {'color': value})  ; 
    
    }
    
     updateArticlesGeo(storeid:string,  value:any) {
               storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/all/geo', {'geo': value})  ; 
    
    }
    
    
    updateArticleAvailable( storeid:string, articleid:string, value:any) {
             storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/available', {'available': value})  ; 
    
    }
    
    getDeliveries (){
         return this.http.get(this.host+'/api/deliveries'); 
    }
    
    getStoreCategories (storeid) {
         storeid= storeid.replace(/ /g, "%20");
        return this.http.get(this.host+'/api/stores/store/'+storeid+"/selectedcat"); 
    }
    
    
    putIncome( storeid:string , income:any) {
         storeid= storeid.replace(/ /g, "%20"); 
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/income', {'income': income})  ; 
    
     }
    getIncome (storeid:string ) {
          storeid= storeid.replace(/ /g, "%20"); 
            return this.http.get(this.host+'/api/stores/stores/'+storeid+'/income') ;
     }
     
    putSuspend( storeid:string , suspend:boolean) {
          storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/suspend', {'suspend': suspend})  ; 
    
    }
    getSuspend (storeid:string ) {
           storeid= storeid.replace(/ /g, "%20");
           return this.http.get(this.host+'/api/stores/stores/'+storeid+'/suspend') ;
    }
    // suspended store's article 
    putSuspendArticles(storeid : string, suspend:boolean ) {
         storeid= storeid.replace(/ /g, "%20");
         return this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/all/suspend/all', {'suspend'   :suspend}); 
    
        
    }
    putSuspendArticleById (storeid : string, articleid:string, suspend:boolean ) {
         storeid= storeid.replace(/ /g, "%20");
         return this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/suspend', {'suspend':suspend}); 

        
    }
    getArticleSuspend (storeid:string, articleid : string ) {
                 storeid= storeid.replace(/ /g, "%20");
                 return  this.http.get(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/suspend')  ; 

    }
    
   


    
    
    getStoresCount() {
      // console.log(store) ; 
        return this.http.get(this.host+'/api/managerstores/stores/count');
    }
    
    getStoresManager(storeid:string){
         storeid= storeid.replace(/ /g, "%20");
        return this.http.get(this.host+'/api/managerstores/stores/'+storeid) ; 
    }
    ///api/stores/stores/:storeid/income/validate
    putIncomeLoan( storeid:string , income:any) {
         storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/income/loan', {'income': income})  ; 
    
     }
    putIncomeValidate( storeid:string , income:any) {
          storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/income/validate', {'income': income})  ; 
    
     }
    
    postLoanProof (storename : string ,date:string ,  loan:any ) {
        //console.log(cover.toString());
          //this.covurl = resizeb64(this.covurl, 'auto', '800px');
             return this.http.put(this.host+'/api/stores/'+storename+'/loan/'+date, {'loan':loan}); 
     }
    getLoanProof (storeid : string ,date:string ) {
          storeid= storeid.replace(/ /g, "%20");
        //console.log(cover.toString());
          //this.covurl = resizeb64(this.covurl, 'auto', '800px');
             return this.http.get(this.host+'/api/stores/'+storeid+'/loan/'+date); 
     }
    


  
    /* public uploadGallery(destination: string, filevar: string, filepath: string) {
        return new Observable((observer: any) => {
            let session = BackgroundHttp.session("file-upload");
            let request = {
                url: destination,
                method: "POST"
            };
            let params = [{ "name": filevar, "filename": filepath, "mimeType": "image/png" }];
            let task = session.multipartUpload(params, request);
            task.on("complete", (event) => {
                let file = FileSystem.File.fromPath(filepath);
                file.remove().then(result => {
                    observer.next("Uploaded `" + filepath + "`");
                    observer.complete();
                }, error => {
                    observer.error("Could not delete `" + filepath + "`");
                });
            });
            task.on("error", event => {
                console.dump(event);
                observer.error("Could not upload `" + filepath + "`. " + event.eventName);
            });
        });
    }*/
    
    getAdmins(storeid){
         storeid= storeid.replace(/ /g, "%20");
        return this.http.get(this.host+'/api/managerstores/stores/admins/'+storeid) ; 
    }
    
     putBannerName( storeid:string , name:string)  {
          storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/stores/stores/'+storeid+'/bannername', {'name': name})  ; 
    
    }
    getBannerName (storeid:string ) {
           storeid= storeid.replace(/ /g, "%20");
           return this.http.get(this.host+'/api/stores/stores/'+storeid+'/bannername') ;
    }
    
    

     putPicName( storeid : string, articleid:string, picname:string ) {
         storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/picname', {'picname':picname})  ; 
    
     }  
     putGalleryName( storeid : string, articleid:string, names) {
         storeid= storeid.replace(/ /g, "%20");
          return  this.http.put(this.host+'/api/articles/stores/'+storeid+'/articles/'+articleid+'/gallerynames', {'gallerynames':names})  ; 
    
     } 
}
    
