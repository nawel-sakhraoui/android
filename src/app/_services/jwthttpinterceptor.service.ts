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
            Authorization: `key=AAAANtPCp6A:APA91bFMWJoFX8wlUhQQWVoV5qqb2qX78CdezMQ6asyTjhgPQZOutXXWS8tkwEY6XuRaO23y1YSuQ1y68ePbnU5YCfAZ19QGUWJtCalXw9r38TJzOGhvBGT9y-T56GhPgsytvflfBSNQ`
            
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