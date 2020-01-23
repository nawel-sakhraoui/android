import { Component, OnInit } from "@angular/core";
import { Router} from '@angular/router';
import * as firebase from 'nativescript-plugin-firebase';
import { Injectable } from '@angular/core';
import { Resolve ,  ActivatedRouteSnapshot , RouterStateSnapshot ,  NavigationExtras  } from '@angular/router';
import {  UserdetailsService, MessagesService} from './_services/index';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

@Injectable()
export class Resolver implements Resolve<Observable<string>> {
        
  constructor(private router:Router,
              private userdetailsService:UserdetailsService, 
              private messagesService : MessagesService
      ) {}

  user=JSON.parse(localStorage.getItem('currentUser')).userid ; 
    
    
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

          
            //firebase push notification tap event
          return  firebase.addOnMessageReceivedCallback(
            (message) => {
                console.log("********************************************************************************************************************************************************");
                console.log('push notif ') ; 
                console.log(message) ;
                if (!message['foreground']){
                       if (message['notif']=='message' ){
                          this.userdetailsService.getAvatar(message['userid']) 
                         .subscribe(
                            data =>{
                                this.messagesService.upMessageTo({"fromMe":this.user, "to": message['userid'] , "fullname": message['userfullname'], 'avatar' : data['avatar']});
                                this.router.navigateByUrl("/home/"+this.user+"/messages/tosend");
                            },error=>{
                                this.messagesService.upMessageTo({"fromMe":this.user,"to":message['userid'], "fullname": message['userfullname'], 'avatar' : ''});
                                this.router.navigateByUrl("/home/"+this.user+"/messages/tosend");
                            })
                            
                        }else {
                          
                           if (message["notif"]=='store') {
                                let storeid= message['storeid'].replace(/ /g, "%20");
                              if (message["fragment"]=="no") 
                                //setTimeout(()=>{
                                     this.router.navigate(["/stores/"+storeid+"/commands/"+message["commandid"]]);
                                //  },1000); 
                                else 
                                //setTimeout(()=>{
                                     this.router.navigate(["/stores/"+storeid+"/commands/"+message["commandid"]], {fragment: message["fragment"]});
                                // },1000);
                                   
                           }else{
                               
                               
                              if  (message["notif"]=="ongoing" ){
                                  if (message["fragment"]=="no")  
                                  //setTimeout(()=>{
                                     this.router.navigate(["/home/"+this.user+"/ongoing/purchase/"+message["commandid"]]); 
                                   // },1000);
                                  else 
                                //  setTimeout(()=>{
                                      this.router.navigate(["/home/"+this.user+"/ongoing/purchase/"+message["commandid"]], {fragment: message["fragment"]} );
                                 // },1000);
                              } 
                                   
                           }}
                }

                
            });
      
                        
  
          }     


}