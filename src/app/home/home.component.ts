import { Component, OnInit, NgZone } from '@angular/core';
 
import { UserService, UserdetailsService } from '../_services/index';
import { FacebookAccountKit, AccountKitResponseType,AccountKitOptions  } from 'nativescript-facebook-account-kit';
import * as CryptoJS from 'crypto-js'; 
import { Color } from "tns-core-modules/color";
import * as localStorage from  "nativescript-localstorage" ; 
import { ActivatedRoute, Router } from "@angular/router";

import * as firebase from 'nativescript-plugin-firebase';
import { Page } from "tns-core-modules/ui/page"; 
 import { RouterExtensions } from "nativescript-angular/router";
import { getConnectionType } from "tns-core-modules/connectivity"; 
import * as Connectivity from "tns-core-modules/connectivity"; 
import * as util from "utils/utils";
 

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

    processing = false;
    login = true ; 
    wait = false ; 
    loading = false ; 
    loading2 = false ; 
    UserPhone =false ; 
    pleaseRegister = false ;
    justLog = false ; 
    model : any= {}//'phone':''} ; 
    suspended = false ; 
    returnUrl =""; 
    langue:string ;
    langue2:string ;
    alertLength = false ;
    alertphone = false ; 
    alertnamelength = false ;
    alertname = false ; 
    response:any ="" ; 
    countcode =0  ; 
    noConnexion; 
    connection ;
    constructor(
               private router: Router,
                private route :ActivatedRoute, 
                //private router :Router,
                private userService: UserService,
               private userdetailsService : UserdetailsService, 
               private page :Page , 
               
               private routerE: RouterExtensions,
               private ngZone : NgZone
               
        ) {

                this.page.actionBarHidden = true; 
   }
 
    
    ngOnInit() {
        this.countcode = 0 ; 
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
        
        
        
          
           this.connection = Connectivity.getConnectionType();
            if ( this.connection == Connectivity.connectionType.none )  
               this.noConnexion = true ; 
            else 
                 this.noConnexion =false; 
          console.log(this.connection ) 
        console.log( Connectivity.connectionType.none) ; 
        Connectivity.startMonitoring(connectionType => {
            this.ngZone.run(() => {
                this.connection =  Connectivity.getConnectionType();
                console.log(this.connection);
                 if ( this.connection == Connectivity.connectionType.none )  
               this.noConnexion = true ; 
            else 
                  
                 this.noConnexion =false;  
            });
        });
        }

 /*   deleteUser(id: number) {
      //  this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    }*/

    logins(){
          this.countcode = 0 ; 
        this.justLog = false ; 
           this.response = "" ;  
       
        let that = this ; 
    if (this.loading == false ) {
    if ( !('phone' in this.model)) {
        this.alertphone = true ; 
    }else {
            this.alertphone= false ; 
       
        this.loading = true ; 
        this.loading2 = false ; 
        //check if userphone is already register 
     //   let f = this.model.phone.replace(/\s/g, "_");
       // console.log(f) ; 
       // console.log(f.length) ; 
        if ( this.model.phone.includes('_') ) {
            this.alertLength = true ; 
            this.loading = false ; 
        }else{
        
        this.alertLength = false ; 
        this.model.phone = this.model.phone.replace(/\s/g, "") ; 
        this.userService.checkUserPhone (this.model.phone)
        .subscribe (
            data =>{
                console.log(data );  
                if (data['total']['value']!=0 ) {
                if ( data['hits'][0]['_source']['enable'] ==true ) {  
                    this.model.userid =data['hits'][0]['_id'];  
                       // continuous with login 
                    
                     /*       this.options= {
                                prefillPhoneNumber :this.model.phone.substr(1), 
                                prefillCountryCode : "+213",
                                  defaultCountryCode : "DZ",
                                whitelistedCountryCodes : ["DZ"],
                                 blacklistedCountryCodes : [],
                                 enableGetACall : true,
                                  presentAnimated : false,
                                enableSendToFacebook : true,
                                       primaryColor : new Color("orange")
                                    };*/
                           //  this.facebookAccountKit.loginWithPhoneNumber(this.options).then(response => {}
                    
               
                  
                   this.firebaseLogin(this.countcode);
                
                }else {
                  
                        this.suspended = true ; 
                        this.loading = false ;
                 }
                
                } else {
                    this.login  = !this.login; 
                    //the phone is not registered please register first 
                    this.pleaseRegister = true ; 
                    this.loading = false ; 
                }
            }
            ,error => {
                    console.log(error ) ; 
                    this.loading = false ; 
                     this.response ="Problème de connexion, réessayer ultérieurement"

                    //some technical issue to solve 
                
            }); 
            
   
       } }
   }}
    
    register(){
          this.countcode = 0 ; 
        this.pleaseRegister = false ;
        this.response = "" ; 
    if (this.loading == false ) {
      
       if (!('fullname' in this.model )) 
              this.alertname = true ; 
      else  {
           
           this.alertname = false;  
        if (this.model.fullname.length < 5 ) 
             this.alertnamelength =true
        else 
            this.alertnamelength= false ;  
     }   
        
      if ( !('phone' in this.model)) 
              this.alertphone = true ; 
        else {
           this.alertphone=false ; 
           if ( this.model.phone.includes('_') ) {
               this.alertLength = true ; 
          } else {
                this.alertLength = false ; 
          
          if (this.model.fullname.length < 5 ) 
             this.alertnamelength =true
          else 
            this.alertnamelength= false ;   
               
               
       if ( !this.alertLength  && !this.alertphone && !this.alertnamelength && !this.alertname)
       { 
        this.loading2 = true ;
         this.loading =false ; 
        //check if userphone is already register 
        this.model.phone = this.model.phone.replace(/\s/g, "") ; 
        this.userService.checkUserPhone (this.model.phone)
        .subscribe (
            data =>{
                console.log(data ) ;  
                if (data['total']['value']==0 ) {   
                 
                        
                    /*     this.options= {
                                prefillPhoneNumber :this.model.phone.substr(1), 
                                prefillCountryCode : "+213",
                                  defaultCountryCode : "DZ",
                                whitelistedCountryCodes : ["DZ"],
                                 blacklistedCountryCodes : [],
                                 enableGetACall : true,
                                  presentAnimated : false,
                                enableSendToFacebook : true,
                                       primaryColor : new Color("orange")
                                    };*/
                        this.firebaseSignin(this.countcode) ;
                    

                }else {
                    this.login  = true; 
                    this.justLog = true ; 
                    this.loading2 = false ; 
                    this.loading=false;
                }
            }
            ,error => {
                    console.log(error ) ; 
                    this.loading2 = false ; 
                    //some technical issue to solve 
                  this.response ="Problème de connexion, réessayer ultérieurement"

                
            }); 
        
        }}
            }
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
    
    
    
    
    
    firebaseLogin (countcode ){
        let that=this; 
        that.countcode= countcode; 
        let prompt =''  ; 
        if (that.countcode ==0) 
            prompt ='Taper votre code ' ;
        else{
            let i = 3-that.countcode ;    
            prompt ="Taper votre code, il vous reste "+i+" essaies";  
        }
          firebase.login({
                          
                      type: firebase.LoginType.PHONE,
                      phoneOptions: {
                         phoneNumber: '+213'+this.model.phone.substr(1),
                         verificationPrompt: prompt, // default "Verification code"
                         // Optional
                        android: {
                            timeout: 60 // The maximum amount of time you are willing to wait for SMS auto-retrieval to be completed by the library
                            }
                        }
                }).then(
                 function(result) {
                     
                     if (result.phoneNumber.substr(4) == that.model.phone.substr(1)){ 
                           console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
                           // JSON.stringify(result);
                     
                          //  that.response = result ; 
                            console.log(result) ; 
                           
                                 
                             //          this.wait = true ; 
                             //   console.log(response);
                           
                                //CryptoJS.PBKDF2(this.model.phone, 'abc', { keySize: 128/32, iterations: 1}).toString();; 
                                //let userid = result['phoneNumber'].substr(4);
                            
                               let salt = that.model.userid ; 
                             
                                let token =  CryptoJS.PBKDF2(JSON.stringify(result),  salt, { keySize: 128/32, iterations: 100 }).toString();; 
                                                  
                                that.userService.loginUser( that.model.userid, token )
                                // .pipe(first())
                                 .subscribe (
                                     data=> {
                                           
                                   
                                                if (data['auth'] ) {
                                             let userid: string = that.model.userid;
                                                    
                                             localStorage.setItem('currentUser', JSON.stringify({userid:that.model.userid,  token: data['token'] }));
                                             that.returnUrl = '/home/'+that.model.userid; //this.route.snapshot.queryParams['returnUrl'] || 
                                                    
                                                      firebase.deleteUser().then(
                                                       function () {
                                                             that.loading= false ; 

                                                           // called when the user was successfully deleted
                                                            //  that.router.navigateByUrl(that.returnUrl); 
                                                             
                                                                that.routerE.navigate([that.returnUrl], {clearHistory: true});

                                                       },
                                                         function (errorMessage) {
                                                              console.log(errorMessage);
                                                             
                                                      }
                                                        );
                                          
                                                        
    
           
                                    }},error0=>{
                                       if (error0.status == 401) {
                                          let noauth = true;
                                            that.response ="Problème de connexion, réessayer ultérieurement"
                                             that.loading = false ; 
                                  
                                    }});  
                            
                      }else {
                           that.response ="Problème de connexion, réessayer ultérieurement"
                            that.loading = false ; 

                        
                            } 
                     
                     
                  
                      },  function(error) {
                            //that.response= error;
                          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa") ; 
                          console.log(error);
                          //that.response =error ; 
                          console.log(that.countcode ) ; 
                            that.countcode+=1 
                          if (that.countcode < 3){
                              that.firebaseLogin (that.countcode);
                           }else {
                             // that.countcode = 0 ; 
                                that.response ="Vous avez atteint le nombre d'essaie maximal reesayer ultérieurement"
                                that.loading = false ; 
                            }

                        } );
        
        
        }
    
    
        
    firebaseSignin (countcode ){
        let that=this; 
        that.countcode= countcode; 
        let prompt =''  ; 
        if (that.countcode ==0) 
            prompt ='Taper votre code ' ;
        else{
            let i = 3-that.countcode ;    
            prompt ="Taper votre code, il vous reste "+i+" essaies";  
        }
          firebase.login({
                          
                      type: firebase.LoginType.PHONE,
                      phoneOptions: {
                         phoneNumber: '+213'+this.model.phone.substr(1),
                         verificationPrompt: prompt, // default "Verification code"
                         // Optional
                        android: {
                            timeout: 60 // The maximum amount of time you are willing to wait for SMS auto-retrieval to be completed by the library
                            }
                        }
                }).then(
                 function(result) {
                           console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
                           // JSON.stringify(result);
                 
                         if (result.phoneNumber.substr(4) == that.model.phone.substr(1)){ 
                                console.log(result);
                               
                                that.model.userid = CryptoJS.PBKDF2(that.model.phone, 'abc', { keySize: 128/32, iterations: 1}).toString();; 
                                let salt = that.model.userid ; 
                                console.log(salt) ; 
                                let token =  CryptoJS.PBKDF2(JSON.stringify(result),  salt, { keySize: 128/32, iterations: 100 }).toString();; 
                                                  
                                that.userService.createUser( that.model.fullname, that.model.phone, token, that.model.userid )
                         //     .pipe(first())
                                    .subscribe (
                                
                                    
                                    data=> {
                                             if (data['auth'] ) {
                                                         
                                                   let userid: string = that.model.userid;
                                                 //localStorage.setItem('currentUser', JSON.stringify({userid,  token: data['token'] }));
                                                    //   console.log(localStorage.getItem('currentUser'));
                                                 //localStorage.setItem('currentUser', JSON.stringify({userid:this.model.userid,  token: data['token'] }));
                                                //create userdetails in store 
                                                   
                                             localStorage.setItem('currentUser', JSON.stringify({userid:that.model.userid,  token: data['token'] }));
                                             that.returnUrl = '/home/'+that.model.userid; //this.route.snapshot.queryParams['returnUrl'] || 
                                             //that.loading= false ; 
                                             //that.router.navigateByUrl(that.returnUrl);   
                                                 
                                                 that.userdetailsService.postUserAccount (that.model.fullname, that.model.phone)
                                                                .subscribe(
                                                                      data3=>{
                                                                            console.log(data3);
                                                                   
                                                                     
                                                                          //that.returnUrl = that.route.snapshot.queryParams['returnUrl'] || '/home/'+data3['_id'];

                                                                          //localStorage.setItem('currentUser', JSON.stringify({userid:that.model.userid,  token: data['token']}));

                                                                            firebase.deleteUser().then(
                                                                       function () {
                                                                            // called when the user was successfully deleted
                                                                           //that.router.navigateByUrl(that.returnUrl); 
                                                                          that.routerE.navigate([that.returnUrl], {clearHistory: true});
 
                                                                           that.loading2 = false ; 
                                                                               
                                                                      },
                                                         function (errorMessage) {
                                                              console.log(errorMessage);
                                                             
                                                      }
                                                        );
                                           
                                                                      },error3=>{
                                                                          console.log(error3);
                                                                      }
                                                                  );
                                                 
                                                
                                                 console.log(data);
                                                }
                                         
                                    },error0=>{
                                       if (error0.status == 401) {
                                          let noauth = true;
                                           that.response ="Problème de connexion, réessayer ultérieurement"
                                           that.loading2 = false ; 
                                  
                                    }});  
                                // create user session and useraccount ! 
                                
                          }else {
                           that.response ="Problème de connexion, réessayer ultérieurement"
                            that.loading2 = false ; 

                        
                            } 
                       
                     
                  
                      },  function(error) {
                            //that.response= error;
                            console.log(error);
                            that.countcode+=1 
                          if (that.countcode < 3){
                              that.firebaseSignin (that.countcode);
                           }else {
                              that.countcode = 0 ; 
                                that.response ="Vous avez atteint le nombre d'essaie maximal reesayer ultérieurement"
                                that.loading2 = false ; 
                            }

                        } );
        
                    
        
        
        }
    
}