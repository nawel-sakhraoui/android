import { Component, OnInit } from '@angular/core';
import { UserService} from '../_services/index'; 
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
//import * as prettyMs from 'pretty-ms';
import {Subscription} from 'rxjs';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions'; 
 

@Component({
  selector: 'app-menu-stores',
  templateUrl: './menu-stores.component.html',
  styleUrls: ['./menu-stores.component.css']
})
export class MenuStoresComponent  implements OnInit {

    storeModel: any = {};
    stores:any = [] ;
    checkStores:boolean =false ; 
    myhome; // = JSON.parse(localStorage.getItem('currentUser')).userid ; 

    constructor(
        private router: Router,
        private activatedRoute : ActivatedRoute, 
        private permissionsService : NgxPermissionsService, 
        private rolesService : NgxRolesService, 
        private userService: UserService) {
       }
 
     
    
    ngOnInit() {
          
          this.myhome = JSON.parse(localStorage.getItem('currentUser')).userid ; 
       
        
          
            this.userService.getStores(this.myhome)
            .subscribe( 
             data => {
              //  console.log(data._source.store ) ; 
               if (data['_source']['store'] ) {
                   
                  this.stores = data['_source']['store'].filter(x => x ).reverse() ; 
                   
                   
                   console.log(this.stores) ; 
                  
                 
               
              }}, error => {
                 console.log( error) ; 
                    
                
               }); 
    }

    createStore(){
        
    }

}