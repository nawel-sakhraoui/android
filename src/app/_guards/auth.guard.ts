import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthenticationService, UserService } from '../_services/index'
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions'; 
 


@Injectable()//{ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
 
    constructor(private router: Router, 
                private authService: AuthenticationService, 
                private userService : UserService,
                private permissionsService: NgxPermissionsService, 
                private rolesService : NgxRolesService     ) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log(localStorage.getItem('currentUser')) ; 
        
        
        if (localStorage.getItem('currentUser')) {
        
            let me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
            let home = route.params.myhome;  
            let store = route.params.store
            //  console.log(JSON.parse(localStorage.getItem('currentUser')).token) ;  
               this.permissionsService.addPermission('readUserAccount', () => {
                return true;
                });
               
            if (me == "annonym") {
                                           

                 this.rolesService.addRole('GUEST', ['readUserAccount' ]);  
                  this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});

                 return false;

                
            }else {
             if ( me == home ) {
         
             
                this.permissionsService.addPermission('writeUserAccount', () => {
                return true;
                });
                this.rolesService.addRole('ADMIN', ['readUserAccount','writeUserAccount' ]);  
                 
                 this.userService.getStores(me)
                 .subscribe(
                     data=> {
                         console.log("wvwvwvwvvwvwvwvwvwvwvwvwvvw") ; 
                         console.log(data) ; 
                          if (store in data ) {
                                  this.permissionsService.addPermission('writeStore', () => {
                                          return true;
                                    });
                    
                                    this.permissionsService.addPermission('readStore', () => {
                                          return true;
                                    });
                    
                                    this.rolesService.addRole('ADMINStore', ['readStore','writeStore' ]);
                              
                           }else
                                 this.permissionsService.removePermission('writeStore'); 
                     },error=> {
                     
                         console.log(error) ; 
                     }
                  )
                
             
             }else {
                   this.rolesService.addRole('USER', ['readUserAccount' ]);  

            
                 
                 
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
               /*this.permissionsService.addPermission('readStore', () => {
                return true;
                });
                 this.permissionsService.addPermission('readProfile', () => {
                    return true;
                });*/
            
                return true ;
            }
                 
           
           // console.log(localStorage.getItem('currentUser'));
           
            // logged in so return true
 
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