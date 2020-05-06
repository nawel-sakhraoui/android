import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import {ConfigService} from './api-config.service'; 

//import * as EmailValidator from 'email-validator';


@Injectable()
export class UserService {
        
    private host:string ; 
    
    constructor(private http: HttpClient) { 
    
      this.host =   ConfigService.userServer; 
    
    } 
    
     checkUserPhone (phone){
            console.log(this.host) ; 
             return this.http.get(this.host+'/api/users/'+phone+'/exist');
}
    
    /*
    createTempUser(user: any) {
      
        return this.http.post(this.host+'/api/tempusers', user);
    }*/
    
    createUser ( fullname : string, phone : string, token:string, userid:string  ){

        return this.http.post(this.host+'/api/users/'+userid, {"fullname": fullname,
                                                                    "phone":    phone, 
                                                                    "enable":   true , 
                                                                    "token":    token       }) ;
    
    }
    
    loginUser(userid:string, token:string) {
       
         return this.http.put(this.host+'/api/users/'+userid+'/login',{"token": token }) ; 
    }
  
    addStore (userid : string, storeid : string ) {
        
        return this.http.put(this.host+'/api/users/'+userid+'/store/add',{'storetitle': storeid} ) ; 
    }
    
    
    removeStore (userid : string, storeid : string ) {
        
        return this.http.put(this.host+'/api/users/'+userid+'/store/remove',{'storetitle': storeid} ) ; 
    }
    
    getStores (userid: string ){
       
        return this.http.get(this.host+'/api/users/'+userid+'/stores' ) ; 

     }
    getToken (){
        console.log("aaaaaaaaaaaaaa") ; 
        let temp = localStorage.getItem('currentUser');

        console.log(temp ) ; 
       if( temp )
                return temp ; 
        else 
                return ""; 
    }
    
    getUserscount () {
         return this.http.get(this.host+'/api/users/count') ; 
       }
    
    getUsers (froms, size ) {
         return this.http.get (this.host+ '/api/users/all/'+froms+"/"+size); 
        
        
        
       }
    
    getUserByPhone(userphone) {
        
        return this.http.get (this.host+ '/api/users/search/'+userphone);
        
       }
    logoutall(userid:string) {
        return this.http.put (this.host+'/api/users/'+userid+'/logout/all', {});
        
       }
    /*  
    existMail (useremail :String ) {
        return  this.http.get (this.host+'/api/users/'+useremail+"/exist") ; 
        }
    
    
    getUserId (useremail : String ) {
        return   this.http.get (this.host+'/api/users/'+useremail+"/id") ; 
        }
    
    
    enableUser (userid :string, password:string, enable : boolean){
        return this.http.put (this.host+'/api/users/'+userid+'/enable'); 
        }
    

    validation ( useremail: string, userid : string , pwd:string){
        return this.http.post (this.host+'/api/users/validation/email', {"useremail": useremail, "userid": userid, 'pwd':pwd} );
        }
    
    
    getUser(userid :string ) {
        return this.http.get(this.host+'/api/users/'+userid ) ;    
    
    }
    
    checkEnable (userid: string ) {
            return this.http.get(this.host+'/api/users/'+userid+'/enable') ;  
        }
    */
    updateEnable (userid : string , enable:boolean ) {
        return  this.http.put(this.host+'/api/users/'+userid+'/enable', {'enable': enable});

    }
  
    

       updateOwnerstore (userid : string , owner:boolean ) {
        return  this.http.put(this.host+'/api/users/'+userid+'/ownerstore', {'ownerstore': owner});

    }
       getOwnerstore (userid: string ){
       
        return this.http.get(this.host+'/api/users/'+userid+'/ownerstore' ) ; 

     }
    
        updateOwnerdelivery (userid : string , owner:boolean ) {
        return  this.http.put(this.host+'/api/users/'+userid+'/ownerdelivery', {'ownerdelivery': owner});

    }
       getOwnerdelivery (userid: string ){
       
        return this.http.get(this.host+'/api/users/'+userid+'/ownerdelivery' ) ; 

     }
        updateDelivery (userid : string , delivery ) {
        return  this.http.put(this.host+'/api/users/'+userid+'/delivery', {'delivery': delivery});

    }
        getDelivery(userid){
        
              return this.http.get(this.host+'/api/users/'+userid+'/delivery' ) ; 
    }
}

/*

*/