import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JwtHttpInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('currentUser');
      let clone: HttpRequest<any>;
      console.log('interceptor') ; 
      console.log(request) ; 
      if(request.url=="https://fcm.googleapis.com/fcm/send"){
           clone = request.clone({
          setHeaders: {
            Accept: `application/json`,
            'Content-Type': `application/json`,
            Authorization: `key=AAAAqbHsZxk:APA91bHJCcsIXCGsaOknEfhMa6DRFO-x27elF49hXZamf764YvzHGDpQVq8hyoKGudvNPG97_cNTY1QL_e7DmM80H4xDOOTMJQJ6BX8BSEPfIiCMb6LTo2L9jnmV-4p18ckHiLA4YVXm`
            
          }
        });
       }else{
      if (token) {
        clone = request.clone({
          setHeaders: {
            Accept: `application/json`,
            'Content-Type': `application/json`,
            Authorization: `Bearer ${token}`
            
          }
        });
      } else {
        clone = request.clone({
          setHeaders: {
            Accept: `application/json`,
            'Content-Type': `application/json`
          }
        });
      }
          }
      return next.handle(clone);
  
      }
}