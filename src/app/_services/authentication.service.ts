import { HttpClient } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';
//import { map } from 'rxjs/operators';
//import {decode} from 'jwt-decode';
//import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
 

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }
    
        
    public getToken(): string {
        return localStorage.getItem('token');
    }

    public isAuthenticated(): boolean {
       // get the token
       const token = this.getToken();
        return true ;
    }
    
    
      getUserId (useremail : String ) {
        return   this.http.get ('http://localhost:4000/api/users/'+useremail+"/id") ; 
        }
    
      

      login(userid: string, password: string) {
       
        return this.http.post('http://localhost:4000/api/authenticate', { 'userid': userid, 'password': password })
         //  .pipe( => {
                // login successful if there's a jwt token in the response
          //      if (res.auth && res.token) {
            //        console.log(res) ; 
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
              //   localStorage.setItem('currentUser', JSON.stringify({ userid, token: res.token }));
                //}
               // return res; 
               
           // });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}