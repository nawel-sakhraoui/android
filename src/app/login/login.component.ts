import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import {  AuthenticationService } from '../_services/index';
import * as CryptoJS from 'crypto-js'; 
import { first } from 'rxjs/operators';


@Component({
  moduleId: module.id.toString(),
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    noemail = false ; 
    noauth = false ; 
    error = ""; 
    userid = ""; 
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
        ) { }
    
    ngOnInit() {
        // reset login status
        //    this.authenticationService.logout();

        // get return url from route parameters or default to '/'
         this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;
           
        this.authenticationService.getUserId(this.model.useremail )
            .subscribe(
                data => {
                    console.log (data) ; 
                    if (!data  ) {
                            this.noemail = true ;    
                           
                            this.loading = false ;     
                     }else {
                        this.noemail = false ; 
                        this.model["userid"] = data['id'];
                      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || "/";

                        console.log(this.model) ;
                        
                          var salt =  data["id"];
                          var pwd =   CryptoJS.PBKDF2(this.model["password"], salt, { keySize: 128/32, iterations: 1000 }).toString();
                         // this.model["password"]=""; 
                      
                        console.log ('login') ;
                        console.log(pwd) ; 
                         
                        this.authenticationService.login(this.model["userid"] , pwd)
                         .pipe(first())
                            .subscribe(
                        data2 => {
                        
                            console.log (data2) ;
                            if (data2['auth'] ) {
                                 console.log("DONE")  ; 
                                 let userid: string = this.model.userid;
                                 localStorage.setItem('currentUser', JSON.stringify({userid,  token: data2['token'] }));
                                console.log(localStorage.getItem('currentUser'));
                                 this.router.navigateByUrl(this.returnUrl);
                                console.log(data2);
                            }
                        },
                        error2 => {
                             
                                console.log(error2.status) ; 
                                 this.error = error2; 
                                 if (error2.status == 401) {
                                         this.noauth = true;
                                       
                                }
                            //console.log(error2) ; 
                           // this.alertService.error(error2);
                             
                          
                        });
                    }
                    
                   
                },
                error => {
                  
                    console.log(error) ; 
                    //this.alertService.error(error);
                    this.error = error ; 
                    });
        
       this.loading= false ; 
    }
    
  
    /* onuseremailChange(this.model.useremail : string ) {  
        this.model.userid = ""; 
        this.model.useremail = this.model.useremail ; 
    }*/
}
