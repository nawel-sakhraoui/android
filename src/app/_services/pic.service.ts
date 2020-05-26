import { Injectable } from '@angular/core';

import { NgZone} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketIO } from "nativescript-socketio"; 
import * as  BackgroundHttp from "nativescript-background-http";
import {ConfigService} from './api-config.service'; 

import { Observable } from 'rxjs/Observable';

//import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class PicService {

  host=""; 
  constructor(private http: HttpClient, 
              private ngZone: NgZone) {
              
      this.host = ConfigService.storeServer;     
  
  }


    
   putBanner(bannername: string, banner: string, extension:string) {
        //bannername = bannername.replace(/ /g, "%20");
       console.log(bannername) ; 
        return new Observable((observer: any) => {
            let session = BackgroundHttp.session("upload");
            let request = {
                url: this.host+'/upload/banner/'+bannername,
                method: "POST", 
                description:"",
                androidAutoClearNotification:true, 
                androidAutoDeleteAfterUpload : true ,
     
            };
           let params = [{"name":'uploadbanner', "filename": banner, "mimeType":"image/"+extension }];
           let task = session.multipartUpload(params, request);
           task.on("complete", (event) => {
                    console.log(event);
                     observer.next("Uploaded");
                     observer.complete(); 
                  
                  
                  });
            task.on("error", event => {
                console.log(event);
              //  observer.error("Could not upload `" + banner + "`. " + event.eventName);
                            observer.error("Could not upload ");
            });
        });
   }
    
    deleteBanner (bannername) {
             //   bannername = bannername.replace(/ /g, "%20");
                console.log(bannername) ; 
       return  this.http.put(this.host+'/delete/banner/'+bannername, {});
            
    }

    
    /*
   getBanner(storetitle: string) {
   
         storetitle= storetitle.replace(/ /g, "%20");
         return  this.http.get(this.host+'/download/banner/'+storetitle);//.map(result => result.json());
    }*/
    
    getBannerLink(storetitle ) {
        //   storetitle= storetitle.replace(/ /g, "%20");
           return this.host+'/download/banner/'+storetitle ; 
        }
    
    
  putPic(picname: string, pic: string, extension:string) {
        //picname = picname.replace(/ /g, "%20");
        return new Observable((observer: any) => {
            let session = BackgroundHttp.session("upload");
            let request = {
                url: this.host+'/upload/pic/'+picname,
                method: "POST", 
                description:"",
                androidAutoClearNotification:true,
                androidAutoDeleteAfterUpload: true
     
            };
           let params = [{"name":'uploadpic', "filename": pic, "mimeType":"image/"+extension }];
           let task = session.multipartUpload(params, request);
           task.on("complete", (event) => {
                    console.log(event);
                     observer.next("Uploaded");
                     observer.complete(); 
                  
                  
                  });
            task.on("error", event => {
                console.log(event);
                //  observer.error("Could not upload `" + banner + "`. " + event.eventName);
                observer.error("Could not upload ");
            });
        });
   }
    
    
   getPicLink(articleid ) {
          
           return this.host+'/download/pic/'+articleid ; 
   }
    
   deletePic (articlename ) {
       console.log("wwwwwwwwwwwwwww") ; 
        console.log(articlename) ; 
          return  this.http.put(this.host+'/delete/pic/'+articlename, {});
            
    }

    
   putGallery( names:any, gallery: any, extension:any) {
        //picname = picname.replace(/ /g, "%20");
        return new Observable((observer: any) => {
            let session = BackgroundHttp.session("upload");
            let request = {
                url: this.host+'/upload/gallery/'+names,
                method: "POST", 
                description:"",
                androidAutoClearNotification:true, 
                androidAutoDeleteAfterUpload: true,
                
            };
            let params = [] ; 
            for (let i= 0; i< gallery.length; i++) //  g of gallery ) 
              params.push({"name":'uploadgallery', "filename":gallery[i] , "mimeType":"image/"+extension[i] });
           let task = session.multipartUpload(params, request);
           task.on("complete", (event) => {
                    console.log(event);
                     observer.next("Uploaded");
                     observer.complete(); 
                  
                  
                  });
            task.on("error", event => {
                console.log(event);
                //  observer.error("Could not upload `" + banner + "`. " + event.eventName);
                observer.error("Could not upload ");
            });
        });
   }
    
        getGalleryLink(articleid ) {
          
           return this.host+'/download/gallery/'+articleid ; 
        }
    

       deleteGallery (articlenames :any) {
       
          return  this.http.put(this.host+'/delete/gallery', {'names':articlenames});
      
       }

    
    
      putProfile(name: string, profile: string, extension:string) {
        //picname = picname.replace(/ /g, "%20");
        return new Observable((observer: any) => {
            let session = BackgroundHttp.session("upload");
            let request = {
                url: this.host+'/upload/profile/'+name,
                method: "POST", 
                description:"",
                androidAutoClearNotification :true, 
                androidAutoDeleteAfterUpload: true,
     
            };
           let params = [{"name":'uploadprofile', "filename": profile, "mimeType":"image/"+extension }];
           let task = session.multipartUpload(params, request);
           task.on("complete", (event) => {
                    console.log(event);
                     observer.next("Uploaded");
                     observer.complete(); 
                  
                  
                  });
            task.on("error", event => {
                console.log(event);
                //  observer.error("Could not upload `" + banner + "`. " + event.eventName);
                observer.error("Could not upload ");
            });
        });
   }
    
    
   getProfileLink(id ) {
          
           return this.host+'/download/profile/'+id ; 
   }
    
   deleteProfile (name ) {
       
          return  this.http.put(this.host+'/delete/profile/'+name, {});
            
    }

}
