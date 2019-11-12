import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()//{ providedIn: 'root' })
export class AnAuthGuard implements CanActivate {
 
    constructor(private router: Router) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
         //  console.log(localStorage.getItem('currentUser'));
           var userid = JSON.parse(localStorage.getItem('currentUser'))['userid']; 

           this.router.navigate(['/home/'+userid]);//, { queryParams: { returnUrl: state.url }});

            // not logged in so return true
            return false ;
        }
        //console.log(localStorage.getItem('currentUser'));
            
        // logged in so redirect to myhome  page with the return url
        
        return true;
    }
}