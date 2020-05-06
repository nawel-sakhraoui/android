import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {MyhomeService, AuthenticationService} from '../_services/index'; 
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions'; 


@Component({
  selector: 'app-my-home',
  templateUrl: './my-home.component.html',
  styleUrls: ['./my-home.component.css']
})

 
  
export class MyHomeComponent implements OnInit {
    
   
     constructor(private permissionsService: NgxPermissionsService, 
                 private rolesService : NgxRolesService, 
                 private route : ActivatedRoute, 
                 private router : Router ) {} 
  
     me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
     userid =""; 
     countStore= 0  ; 
   
     ngOnInit() {
        
     console.log('myhome') ; 
     let sub = this.route.params.subscribe(params => {
      
            //this.userid = params['myhome'];
         
            this.me = JSON.parse(localStorage.getItem('currentUser')).userid ; 
         
     });
       
             
        this.me = JSON.parse(localStorage.getItem('currentUser')).userid ; 
         console.log(this.me) ;   
    }

}
