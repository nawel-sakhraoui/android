import { Component, OnInit } from '@angular/core';
import { UserService} from '../_services/index'; 
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
//import * as prettyMs from 'pretty-ms';
import {Subscription} from 'rxjs';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions'; 
 
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label';
import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout"; 


@Component({
  selector: 'app-menu-stores',
  templateUrl: './menu-stores.component.html',
  styleUrls: ['./menu-stores.component.css']
})
export class MenuStoresComponent  implements OnInit {

    storeModel: any = {};
    stores:any = [] ;
    checkStores:boolean =false ; 
    reload :boolean = false ; 
    
    myhome; // = JSON.parse(localStorage.getItem('currentUser')).userid ; 
    loading :boolean ; 
    constructor(
        private router: Router,
        private activatedRoute : ActivatedRoute, 
        private permissionsService : NgxPermissionsService, 
        private rolesService : NgxRolesService, 
        private userService: UserService) {
       }
 
     
    
    ngOnInit() {
          
       this.init()
    }

    
    init(){
           this.myhome = JSON.parse(localStorage.getItem('currentUser')).userid ; 
        this.loading = true; 
        this.userService.getStores(this.myhome)
            .subscribe( 
             data => {
                this.reload= false ; 
                 //  console.log(data._source.store ) ; 
               if (data['_source']['store'] ) {
                   
                  this.stores = data['_source']['store'].filter(x => x ).reverse() ; 
                   this.loading = false ; 
                   
                   console.log(this.stores) ; 
                  
                 
               
              }}, error => {
                  this.reload= true ;
                 console.log( error) ; 
             this.loading = false ; 
                
               });  
        
        }
    createStore(){
        
    }
   ontouch(args: TouchGestureEventData) {
    const label = <Label>args.object
    switch (args.action) {
        case 'up':
            label.deletePseudoClass("pressed");
            break;
        case 'down':
            label.addPseudoClass("pressed");
            break;
    }
   
} 
   
  ontouch2(args: TouchGestureEventData) {
    const label = <GridLayout>args.object
    switch (args.action) {
        case 'up':
            label.deletePseudoClass("pressed");
            break;
        case 'down':
            label.addPseudoClass("pressed");
            break;
    }
   
}
       reloading(){
        
        console.log('reloading') ; 
      this.init() ; 
        
        
        
        }  
 

}