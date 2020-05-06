import { Component, OnInit, ViewChild ,  ElementRef } from '@angular/core';

import { AuthService, UserService, UserdetailsService } from '../_services/index';
//import { AccountKit, AuthResponse } from 'ng2-account-kit'; 

import * as CryptoJS from 'crypto-js'; 

import { Router, ActivatedRoute } from '@angular/router';
import {ModalhomeComponent} from './modalhome.component' ; 
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
declare var grecaptcha: any;

                            
@Component({
    //moduleId: module.id.toString(),
    selector: 'app-home',
    templateUrl: 'home.component.html', 
    styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {
    currentUser:any;
    phonemask = ["0",/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," "]

    login = true ; 
    loading = false ; 
    loading2 = false ; 
    showmodal=true ; 
    lengthphone:boolean 
    UserPhone =false ; 
    pleaseRegister = false ;
    justLog = false ; 
    model : any= {phone:""} ; 
    suspended = false ; 
    returnUrl =""; 
    langue:string="fr" ;
    langue2:string ; 
    verificationId = "" ; 
    loginerror ="" ; 
    code ="" ; 
    openmodal=false ; 
    phoneRecaptchaVerifier: auth.RecaptchaVerifier; 
    confirmResult :any ;
    @ViewChild('modal',{static: true}) modal:ModalhomeComponent;
    constructor(private route :ActivatedRoute, 
                private router :Router,
                private userService: UserService, 
                public  afAuth:  AngularFireAuth,
                private authService :AuthService, 
                private userdetailsService : UserdetailsService
             ) {

    
   }

    ngOnInit() {


                this.phoneRecaptchaVerifier = new auth.RecaptchaVerifier('phone-sign-in-recaptcha', {
                'size': 'invisible',//"normal",//'invisible',
                'callback': function(response) {
                    console.log("xxxxxxxxxxx")  ;
                    console.log(response) ; 
                        // reCAPTCHA solved - will proceed with submit function
                    
                    
                    },
                'expired-callback': function() {
                          // Reset reCAPTCHA?
                  this.phoneRecaptchaVerifier.render().then(function(widgetId) {
                              grecaptcha.reset(widgetId);
                                this.loading=false;
                                 });
                }
                });   
 
                this.afAuth.auth.useDeviceLanguage();
                this.afAuth.auth.languageCode = 'fr';


                
      //  this.loadAllUsers();
     // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/'+this.model.userid ;
   //  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/'+this.model.userid ||'/home';

        //language 
          if (localStorage.getItem('Language')=="fr") {
              this.langue2 = 'ar' ; 
              this.langue='fr';
         }else {
              if (localStorage.getItem('Language')=="ar"){
              this.langue2='fr' ; 
                this.langue='ar'; 
              }

          }
         console.log(this.model['phone']) ; 
         if(!this.model.phone.includes("_") && this.model.phone.length!=0)
                 this.lengthphone =false ; 
    }

    deleteUser(id: number) {
      //  this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    }

    logins(){
        this.justLog=false ; 
        this.loginerror ="";
        this.loading = true ; 
        this.loading2 = false ; 
        let that = this ; 
        //check if userphone is already register 
        let f = this.model.phone.replace(/\s/g, "");
        
        this.model.phone = this.model.phone.replace(/\s/g, "") ; 
        console.log(this.model.phone ) 
        
        if(this.model.phone.includes("_") ){
                 this.lengthphone =true ; 
                  this.loading = false ; 
        }else {
            this.lengthphone=false ; 
        this.userService.checkUserPhone (this.model.phone)
        .subscribe (
            data =>{
                console.log(data );  
                if (data['total']['value']!=0 ){
                if ( data['hits'][0]['_source']['enable'] ==true ) {   
                // continuous with login 
                //AccountKit login 
                    this.model.userid =data['hits'][0]['_id']; 
                    // AccountKit.login('PHONE', { countryCode: '+213', phoneNumber: f.substr(1) }).then(
                    console.log(this.phoneRecaptchaVerifier);

                     this.afAuth.auth.signInWithPhoneNumber('+213'+f.substr(1), this.phoneRecaptchaVerifier)
                    //.then(
                         

                   .then(function (response) {
                  
                        
                            console.log(response);
                            that.confirmResult = response;
                            that.verificationId = response.verificationId ;
                        
                            that.modal.show();  
                    
                                
                       
                        }).catch(function (error) {
                          
                           //   let grecaptcha: any ;
                                console.error(error)
                                that.loading = false ; 
                                that.loginerror ='problème de connexion reessayer ultérieurement';
                                that.phoneRecaptchaVerifier.render().then(function(widgetId) {
                                  //  console.log(grecaptcha);
                                    grecaptcha.reset(widgetId);
                                 });
                            

                        });          

                     
                    
                }else {
                   
                        this.suspended = true ; 
                        this.loading = false ;
                   }}else {
                    this.login  = !this.login; 
                    //the phone is not registered please register first 
                    this.pleaseRegister = true ; 
                    this.loading = false ; 
                }
                
            }
            ,error => {
                    console.log(error ) ; 
                    this.loading = false ; 
                    //some technical issue to solve 
                
            });

        }
            
            
        
   }
                
                
    
    getValidate(event) {
         if (event!="") {
           this.loginerror=event ; 
             this.loading = false ;   
           this.phoneRecaptchaVerifier.render().then(function(widgetId) {
                              grecaptcha.reset(widgetId);
                                 });
                          

          }
             
        }
                
           /*     getValidate(event) {
                    console.log('event') ; 
                    console.log(event ) ; 
                    let e = event
                           // const credential = auth.PhoneAuthProvider.credential(this.verificationId, e);
                                      
                    
                           // auth.signInWithCredential(credential).then(a => {
                                   // after successful verification.
                               
                    this.confirmResult.confirm(e)
                            
                    .then(function (result) {
                         //// User signed in successfully.
                          //var user = result.user;
                             // ...
                              console.log(result);
 
                            
                             //CryptoJS.PBKDF2(this.model.phone, 'abc', { keySize: 128/32, iterations: 1}).toString();; 
                                
                            
                                let salt = this.model.userid ; 
                                console.log(salt) ; 
                                let token =  CryptoJS.PBKDF2(e,  salt, { keySize: 128/32, iterations: 100 }).toString();; 
                                                  
                                this.userService.loginUser( this.model.userid, token )
                             // .pipe(first())
                                    .subscribe (
                                     data=> {
                                             if (data['auth'] ) {
                                                 
                                                    let userid: string = this.model.userid;
                                                    localStorage.setItem('currentUser', JSON.stringify({userid,  token: data['token'] }));
                                                        console.log(localStorage.getItem('currentUser'));
                                                // localStorage.setItem('currentUser', JSON.stringify({userid:this.model.userid,  token: data['token'] }));
                                                 //create userdetails in store 
                                                // this.router.navigateByUrl(this.returnUrl);
                                                 this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/'+this.model.userid;
                                                 this.loading= false ; 
                                                 console.log(this.returnUrl) ;  
                                                 this.router.navigateByUrl(this.returnUrl);

                                                
                                                 console.log(data);
                                                }
                                         
                                      },error0=>{
                                       if (error0.status == 401) {
                                          let noauth = true;
                                  
                                    }});  
                                // create user session and useraccount ! 
                        //    });
                    
                               }).catch(function (error) {
                                     // User couldn't sign in (bad verification code?)
                                     // ...
                                });
                               
                    }*/
    register(){
        this.pleaseRegister=false ; 
         this.loginerror ="";
        let that = this ;  
         this.loading2 = true ; 
         this.loading =false ; 
        //check if userphone is already register 
        let f = this.model.phone.replace(/\s/g, "");
        this.model.phone = this.model.phone.replace(/\s/g, "") ; 
        
         if(this.model.phone.includes("_") ){
                 this.lengthphone =true ; 
                  this.loading = false ; 
        }else {
            this.lengthphone=false ; 
        this.userService.checkUserPhone (this.model.phone)
        .subscribe (
            data =>{
                console.log(data ) ;  
                if (data['total']['value']==0 ) {   
                    //continuous with register 
                    
                         this.afAuth.auth.signInWithPhoneNumber('+213'+f.substr(1), this.phoneRecaptchaVerifier)
                    //.then(
                         

                   .then(function (response) {
                  
                        
                            console.log(response);
                            that.confirmResult = response;
                            that.verificationId = response.verificationId ;
                        
                            that.modal.show();  
                    
                                
                       
                        }).catch(function (error) {
                          
                           //   let grecaptcha: any ;
                                console.log(error);
                                that.loading = false ; 
                                that.loginerror ='problème de connexion reessayer ultérieurement';
                                that.phoneRecaptchaVerifier.render().then(function(widgetId) {
                                  //  console.log(grecaptcha);
                                    grecaptcha.reset(widgetId);
                                 });
                            

                        }); 
                    
                    
                    /*AccountKit.login('PHONE', { countryCode: '+213', phoneNumber: f.substr(1) }).then(
                        (response: AuthResponse) =>{
                        
                                console.log(response);
                               
                                this.model.userid = CryptoJS.PBKDF2(this.model.phone, 'abc', { keySize: 128/32, iterations: 1}).toString();; 
                                let salt = this.model.userid ; 
                                console.log(salt) ; 
                                let token =  CryptoJS.PBKDF2(response.code,  salt, { keySize: 128/32, iterations: 100 }).toString();; 
                                                  
                                this.userService.createUser( this.model.fullname, this.model.phone, token, this.model.userid )
                         //     .pipe(first())
                                    .subscribe (
                                
                                    
                                    data=> {
                                             if (data['auth'] ) {
                                                
                                                   let userid: string = this.model.userid;
                                                    localStorage.setItem('currentUser', JSON.stringify({userid,  token: data['token'] }));
                                                        console.log(localStorage.getItem('currentUser'));
                                                 //localStorage.setItem('currentUser', JSON.stringify({userid:this.model.userid,  token: data['token'] }));
                                                //create userdetails in store 
                                                              this.userdetailsService.postUserAccount (this.model.fullname, this.model.phone)
                                                                .subscribe(
                                                                      data3=>{
                                                                            console.log(data3);
                                                                          this.loading2 = false ; 
                                                                      
                                                                          this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/'+data3['_id'];

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
                        
                        } );*/
                    

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
    
    
    cancel (){
    this.loading = false ;     
    this.loading2 = false ;
        this.model = {}; 
 //       window.location.reload(); 
         this.router.navigateByUrl('/');

    }
    
    changeLang(event){
            let temp = this.langue; 
            this.langue = event ; 
            this.langue2= temp ; 
               localStorage.setItem('Language', event);
             window.location.href="http://"+window.location.hostname+":8080/"+event ; 

         }
    change(){
        this.login=!this.login; 
        this.loginerror = ""; 
        
        }
 
}