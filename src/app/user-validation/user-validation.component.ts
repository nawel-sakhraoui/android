import { Component, OnInit } from '@angular/core';
import {  UserService, StoreService ,UserdetailsService} from '../_services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-user-validation',
  templateUrl: './user-validation.component.html',
  styleUrls: ['./user-validation.component.css']
})
export class UserValidationComponent implements OnInit {

  alreadyEnable = false ; 
  userid:string = "" ; 
  enable :boolean ; 
  constructor(private userService : UserService, 
              private storeService : StoreService, 
              private userdetailsService: UserdetailsService,
              private route : ActivatedRoute,
              private router : Router) { }
              


  ngOnInit() {
    //check if user enable  enable user then create user account 
  /*  let sub = this.route.params.subscribe(params => {
     
    this.userid = params['userid'];
    
    this.userService.checkEnable (this.userid ) 
    .subscribe(
        data0 =>{
            if (data0['enable'] ) {
                
                this.alreadyEnable = true ; 
                
                }
            else {
                 this.userService.enable(this.userid )
                 .subscribe (
                            data2 =>{
                            
                                     console.log(data2)  ; 
                                     this.alreadyEnable = false ;
                                     let userid = this.userid ;
                                     localStorage.setItem('currentUser', JSON.stringify({userid,  token: data2['token'] }));
                               
                                
                                    //create user account 
                                    this.userdetailsService.postUserAccount (data2['fullname'], data2["email"])
                                    .subscribe(
                                        data3=>{console.log(data3);
                                        
                                                  this.router.navigate(["../../home/", this.userid], { relativeTo: this.route });

                                            
                                        
                                        }
                                        ,error3=>{console.log(error3);}
                                     );
                                //nav to main
                                
                            }
                          ,error2 =>{
                                        console.log(error2 );
                           }) ; 
                    
                    }
                    
                
                },error0=>{
                    
                    console.log(error0) ; 
                
                });

        
    }) ; 
/*
    
*/
  }


}
