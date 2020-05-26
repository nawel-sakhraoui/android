import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthenticationService } from '../_services/index'
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions'; 
 
//import * as Permissions "nativescript-permissions" ;


@Injectable()//{ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
 
    constructor(private router: Router, private authService: AuthenticationService, 
                private permissionsService: NgxPermissionsService, 
                private rolesService : NgxRolesService     ) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log(localStorage.getItem('currentUser')) ; 
        
        
        if (localStorage.getItem('currentUser')) {
        
            let me= JSON.parse(localStorage.getItem('currentUser'))["userid"] ; 
            let home = route.params.myhome;  
             console.log(JSON.parse(localStorage.getItem('currentUser')).token) ;  
            
             if ( me == home ) {
         
                this.permissionsService.addPermission('readUserAccount', () => {
                return true;
                });
               
                this.permissionsService.addPermission('writeUserAccount', () => {
                return true;
                });
                this.rolesService.addRole('ADMIN', ['readUserAccount','writeUserAccount' ]);  
             
             }
              if ( me == '1820ad1b57ff06677e1044be32659c3c') {
         
                this.permissionsService.addPermission('readSuperAdmin',() => {
                return true;
                });
               
                this.permissionsService.addPermission('writeSuperAdmin',() => {
                return true;
                });
                  
                this.rolesService.addRole('SUPERADMIN', ['readSuperAdmin','writeSuperAdmin' ]);  
             
             }
             
            this.permissionsService.addPermission('readStore', () => {
                return true;
                });
                 this.permissionsService.addPermission('readProfile', () => {
                    return true;
                });
            //store admin ! 
            
                 
           
           // console.log(localStorage.getItem('currentUser'));
           
            // logged in so return true
            return true ;
        }
 
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
    
    
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        //   console.log("aaaaaaaaaaaaaaaaaaaa");
         //   console.log( this.canActivate(route, state));

            return this.canActivate(route, state);
  }
    
    
}