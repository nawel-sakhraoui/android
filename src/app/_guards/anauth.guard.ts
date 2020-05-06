import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()//{ providedIn: 'root' })
export class AnAuthGuard implements CanActivate {
 
    constructor(private router: Router) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
            
          console.log(localStorage.getItem('currentUser'));
          let  userid = JSON.parse(localStorage.getItem('currentUser')).userid; 
           
          if (userid !="annonym"){ 
                this.router.navigate(['/']);//, { queryParams: { returnUrl: state.url }});

                // not logged in so return true
                return false ;
          }else 
                return true ; 
        }
        //console.log(localStorage.getItem('currentUser'));
            
        // logged in so redirect to myhome  page with the return url
          
        return true;
    }
}