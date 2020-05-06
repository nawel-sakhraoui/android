import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {  UserService } from '../_services/index';
import * as CryptoJS from 'crypto-js'; 

    
    
@Component({
     selector: 'app-signin',
     templateUrl: './signin.component.html',
     styleUrls: ['./signin.component.css'],
 
})

export class  SigninComponent  {
    model: any = {};
    model2 : any = {};
    loading = false; 
    phonemask = ["0",/[5-7]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," "]
    checkUserPhone : boolean =false; 

    // checkUserEmail:boolean = true ; 
  
/*    constructor(
        private router: Router,
        private userService: UserService) {
        
    }
      
  
    register ( ){
        this.userService.existPhone(this.model.phone)
        .subscribe( 
            data => {
                
                console.log(data), 
                this.checkUserPhone = data ;
                
                if ( !data){
                    //no userphone register ! 
                    //send fb blabla 
                    
                   var userm =   CryptoJS.PBKDF2(this.model["useremail"], 'abc', { keySize: 128/32, iterations: 1}).toString();
                   this.userService.createUser(userm, {"fullname":this.model["fullname"],
                                             "useremail":this.model['useremail'], 
                                             "enable": false})
                    
                   .subscribe(
                      data2 => {
                        
                          
                          this.model["userid"]= data2["_id"] ;
                          
                          var salt =  data2["_id"];//CryptoJS.lib.WordArray.random(128/8); 
                          var pwd =   CryptoJS.PBKDF2(this.model["password"], salt, { keySize: 128/32, iterations: 1000 }).toString();
                          this.model["password"]=""; 
                          this.model["confirmedPassword"] =""; 
                          
                          console.log(this.model["password"]);
                          
                          this.userService.createTempUser({"userid":this.model['userid'],
                                                            "password": pwd, 
                                                            'fullname':this.model['fullname'], 
                                                            "email":this.model["useremail"]})
                            .subscribe(
                               data3 => {
                                
                                   this.loading = true;
                                   //this.router.navigate(['/login']);
                                   console.log("create service done ") ;
                                   this.userService.validation(this.model.useremail, this.model.userid, pwd )
                                   .subscribe(
                                       data4 => {
                                          
                                            console.log('email send for validation!  ') ; 
                                             
                                        }, error4 => {
                                            
                                            console.log(error4) ; 
                                        });
                                        
                                             var x = document.getElementById("registerDone");
                                             x.style.display = "block";
                                            var x2 = document.getElementById("register");
                                             x2.style.display = "none";
                                    
                                },   
                                error3 => {
                                    this.loading = false;
                                    console.log(error3) ; 
                                });
                         
                         
                        },   
                          error2 => {
                                this.loading = false;
                                console.log(error2) ; 
                         });
             } else{
                      
                //just loging with  phone number 
                this.loading = false;
                console.log("already exist email ") ; 
            
              }
            
            },
                
           error1 => {
                    
                    console.log(error1) ;
          });
        
        
    
    }*/
    }
    
   