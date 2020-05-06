import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';
import { map } from  'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ConfigService} from './api-config.service'; 


//import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class PicService {

  host=""; 
  constructor(private http: HttpClient ) {
              
      this.host = ConfigService.storeServer;     
  
  }


    
   putBanner(bannername, banner,  extension:string) {
       console.log('put banner service');
         console.log(banner) ; 
      
        let formData = new FormData();
        formData.append("uploadbanner", banner);
        console.log(formData) ; 
        return this.http.post(this.host+'/upload/banner/'+bannername, formData);
  
   }
    
    deleteBanner (bannername) {
        
       return  this.http.put(this.host+'/delete/banner/'+bannername, {});
            
    }

    
    getBannerLink(storetitle ) {
        //  storetitle= storetitle.replace(/ /g, "%20");
           return this.host+'/download/banner/'+storetitle ; 
    }
    
    
   putPic(picname: string, pic: any , extension:string) {
   
         let formData = new FormData();
        formData.append("uploadpic", pic);
    
        return this.http.post(this.host+'/upload/pic/'+picname , formData)
  
    
   }
    
    
   getPicLink(articleid ) {
          
           return this.host+'/download/pic/'+articleid ; 
   }
    
     getPic(articleid ) {
          
           return this.http.get(this.host+'/download/pic/'+articleid , {responseType: "arraybuffer"}); 
   }
    
   deletePic (articlename ) {
       
          return  this.http.put(this.host+'/delete/pic/'+articlename, {});
            
    }

    
   putGallery( names:any, gallery: any, extension:any) {
        let formData = new FormData();
        for (let i=0 ; i< gallery.length;i++)    
        formData.append("uploadgallery", gallery[i]);
       console.log(formData) ;  
       
        return this.http.post(this.host+'/upload/gallery/'+names, formData)
  
  
   }
    
        getGalleryLink(articleid ) {
          
           return this.host+'/download/gallery/'+articleid ; 
        }
    
    
         getGallery(articleid) {
             
                return this.http.get(this.host+'/download/gallery/'+articleid, {responseType: "arraybuffer"}) ; 
          }

       deleteGallery (articlenames :any) {
       
          return  this.http.put(this.host+'/delete/gallery', {'names':articlenames});
      
       }

    
    
    putProfile(name: string, profile: any , extension:string) {
          
        let formData = new FormData();
        formData.append("uploadprofile", profile);
    
        return this.http.post( this.host+'/upload/profile/'+name , formData)
  
        //picname = picname.replace(/ /g, "%20");
      
   }
    
    
   getProfileLink(id ) {
          
           return this.host+'/download/profile/'+id ; 
   }
    
   deleteProfile (name ) {
       
          return  this.http.put(this.host+'/delete/profile/'+name, {});
            
    }
    }