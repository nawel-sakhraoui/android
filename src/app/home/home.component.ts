import { Component, OnInit } from '@angular/core';
 
import { UserService, UserdetailsService } from '../_services/index';
import { FacebookAccountKit, AccountKitResponseType,AccountKitOptions  } from 'nativescript-facebook-account-kit';
import * as CryptoJS from 'crypto-js'; 
import { Color } from "tns-core-modules/color";
import * as localStorage from  "nativescript-localstorage" ; 
 import { ActivatedRoute } from "@angular/router";

import { RouterExtensions } from "nativescript-angular/router"; 
import { Page } from "tns-core-modules/ui/page"; 

@Component({
    //moduleId: module.id.toString(),
    selector: 'app-home',
    templateUrl: 'home.component.html', 
    styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {
  
    options : AccountKitOptions; // = {
     /* prefillPhoneNumber : "9XXXX12345", 
      prefillCountryCode : "91",
      defaultCountryCode : "IN",
      whitelistedCountryCodes : ["IN"],
      blacklistedCountryCodes : [],
      enableGetACall : true,
      presentAnimated : false,
      enableSendToFacebook : true,
      primaryColor : new Color("orange")*/
  //  };
   facebookAccountKit = new FacebookAccountKit(AccountKitResponseType.AuthorizationCode);

    user:any ; 
    
    /* currentUser:any;
    phonemask = ["0",/[5-7]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," "]
    */
    processing = false ; 
    login = true ; 
    loading = false ; 
    loading2 = false ; 
    UserPhone =false ; 
    pleaseRegister = false ;
    justLog = false ; 
    model : any= {} ; 
    suspended = false ; 
    returnUrl =""; 
    langue:string ;
    langue2:string ;
    alertLength = false ;

    constructor(
               private router: RouterExtensions,
                private route :ActivatedRoute, 
                //private router :Router,
                private userService: UserService,
               private userdetailsService : UserdetailsService, 
               private page :Page 
        ) {

                this.page.actionBarHidden = true; 
   }
 
    ngOnInit() {
        //041  62 80 49

      //  this.loadAllUsers();
     // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/'+this.model.userid ;
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/'+this.model.userid ||'/home';

        //language 
     /*     if (localStorage.getItem('Language')=="fr") {
              this.langue2 = 'ar' ; 
              this.langue='fr';
         }else {
              this.langue2='fr' ; 
                this.langue='ar'; 
          }*/
        }

 /*   deleteUser(id: number) {
      //  this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    }*/

    logins(){
        this.loading = true ; 
        this.loading2 = false ; 
        //check if userphone is already register 
        let f = this.model.phone.replace(/\s/g, "_");
        console.log(f) ; 
        console.log(f.length) ; 
        if (this.model.phone.includes('_') ) {
            this.alertLength = true ; 
            this.loading = false ; 
        }else{
        
        this.alertLength = false ; 
        this.model.phone = this.model.phone.replace(/\s/g, "") ; 
        this.userService.checkUserPhone (this.model.phone)
        .subscribe (
            data =>{
                console.log(data );  
                if (data['total']!=0 && data['hits'][0]['_source']['enable'] ==true ) {   
                // continuous with login 
                 
                    this.options= {
                                prefillPhoneNumber :f.substr(1), 
                                prefillCountryCode : "+213",
                                  defaultCountryCode : "DZ",
                                whitelistedCountryCodes : ["DZ"],
                                 blacklistedCountryCodes : [],
                                 enableGetACall : true,
                                  presentAnimated : false,
                                enableSendToFacebook : true,
                                       primaryColor : new Color("orange")
                                    };
                             this.facebookAccountKit.loginWithPhoneNumber(this.options).then(response => {

                             //   console.log(response);
                            
                                this.model.userid =data['hits'][0]['_id'];  //CryptoJS.PBKDF2(this.model.phone, 'abc', { keySize: 128/32, iterations: 1}).toString();; 
                                
                            
                                let salt = this.model.userid ; 
                                console.log(salt) ; 
                                let token =  CryptoJS.PBKDF2(response,  salt, { keySize: 128/32, iterations: 100 }).toString();; 
                                                  
                                this.userService.loginUser( this.model.userid, token )
                             // .pipe(first())
                                    .subscribe (
                                     data=> {
                                             if (data['auth'] ) {
                                             let userid: string = this.model.userid;
                                                 
                                             localStorage.setItem('currentUser', JSON.stringify({userid:this.model.userid,  token: data['token'] }));
                                             this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/'+this.model.userid;
                                             this.loading= false ; 
                                             this.router.navigateByUrl(this.returnUrl);     
                                                        
    
           
                                    }},error0=>{
                                       if (error0.status == 401) {
                                          let noauth = true;
                                  
                                    }});  
                                // create user session and useraccount ! 
                                
                                
                        },
                        (error: any) => {
                            
                                console.error(error)
                        
                        } );
                   
                
                }else {
                   if (data['total']!=0 && data['hits'][0]['_source']['enable'] ==false  ) {
                        this.suspended = true ; 
                        this.loading = false ;
                   }else {
                    this.login  = !this.login; 
                    //the phone is not registered please register first 
                    this.pleaseRegister = true ; 
                    this.loading = false ; 
                }
            }}
            ,error => {
                    console.log(error ) ; 
                    this.loading = false ; 
                    //some technical issue to solve 
                
            }); 
            
   }
        
   }
    
    register(){
        
         this.loading2 = true ;
         this.loading =false ; 
        //check if userphone is already register 
      let f = this.model.phone.replace(/\s/g, "");
        
      if (f!=10 ) {
      this.alertLength = true ; 
      }else{
          this.alertLength = false ; 
        this.model.phone = this.model.phone.replace(/\s/g, "") ; 
        this.userService.checkUserPhone (this.model.phone)
        .subscribe (
            data =>{
                console.log(data ) ;  
                if (data['total']==0 ) {   
                 
                        
                         this.options= {
                                prefillPhoneNumber :f.substr(1), 
                                prefillCountryCode : "+213",
                                  defaultCountryCode : "DZ",
                                whitelistedCountryCodes : ["DZ"],
                                 blacklistedCountryCodes : [],
                                 enableGetACall : true,
                                  presentAnimated : false,
                                enableSendToFacebook : true,
                                       primaryColor : new Color("orange")
                                    };
                                this.facebookAccountKit.loginWithPhoneNumber(this.options).then(response => {

                                console.log(response);
                               
                                this.model.userid = CryptoJS.PBKDF2(this.model.phone, 'abc', { keySize: 128/32, iterations: 1}).toString();; 
                                let salt = this.model.userid ; 
                                console.log(salt) ; 
                                let token =  CryptoJS.PBKDF2(response,  salt, { keySize: 128/32, iterations: 100 }).toString();; 
                                                  
                                this.userService.createUser( this.model.fullname, this.model.phone, token, this.model.userid )
                         //     .pipe(first())
                                    .subscribe (
                                
                                    
                                    data=> {
                                             if (data['auth'] ) {
                                                
                                                   let userid: string = this.model.userid;
                                                  // localStorage.setItem('currentUser', JSON.stringify({userid,  token: data['token'] }));
                                                    //   console.log(localStorage.getItem('currentUser'));
                                                 //localStorage.setItem('currentUser', JSON.stringify({userid:this.model.userid,  token: data['token'] }));
                                                //create userdetails in store 
                                                              this.userdetailsService.postUserAccount (this.model.fullname, this.model.phone)
                                                                .subscribe(
                                                                      data3=>{
                                                                            console.log(data3);
                                                                          this.loading2 = false ; 
                                                                      
                                                                          this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/'+data3['_id'];

                                                                          localStorage.setItem('currentUser', JSON.stringify({userid:this.model.userid,  token: data['token']}));

                                                                             this.router.navigateByUrl(this.returnUrl);
                                                                      },error3=>{
                                                                          console.log(error3);
                                                                      }
                                                                  );
                                                 
                                                
                                                 console.log(data);
                                                }
                                         
                                    },error0=>{
                                       if (error0.status == 401) {
                                          let noauth = true;
                                  
                                    }});  
                                // create user session and useraccount ! 
                                
                                
                        },
                        (error: any) => {
                            
                                console.error(error)
                        
                        } );
                    

                }else {
                    this.login  = !this.login; 
                    this.justLog = true ; 
                    this.loading2 = false ; 
                }
            }
            ,error => {
                    console.log(error ) ; 
                    this.loading2 = false ; 
                    //some technical issue to solve 
                
            }); 
        
        }
       }
/*    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }*/
    
    /*
   cancel (){
    this.loading = false ;     
    this.loading2 = false ;
        this.model = {}; 
        window.location.reload(); 
    }
    
    changeLang(event){
            let temp = this.langue; 
            this.langue = event ; 
            this.langue2= temp ; 
        //       localStorage.setItem('Language', event);
       //      window.location.href="http://"+window.location.hostname+":8080/"+event ; 

         }*/
 
    
    textChangeM(event){
     console.log(event ) ;     
    }
}