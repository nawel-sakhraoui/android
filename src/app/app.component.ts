import { Component, OnInit } from "@angular/core";

import * as firebase from 'nativescript-plugin-firebase';
import { registerElement } from 'nativescript-angular/element-registry';
// Register Custom Elements for Angular
import {  UserdetailsService } from './_services/index';
import { Carousel, CarouselItem } from 'nativescript-carousel';
registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);

import { FilterSelect } from 'nativescript-filter-select';
registerElement('FilterSelect', () => FilterSelect);


registerElement("Ripple", () => require("nativescript-ripple").Ripple);

@Component({
      moduleId: module.id,

  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    token ='';
    user=''; 
    constructor(private userdetailsService:UserdetailsService){
        
        
        }
  
    ngOnInit(): void {
      
                            
             this.user=JSON.parse(localStorage.getItem('currentUser')).userid ; 

            firebase.init({
                         showNotifications: true,
                         showNotificationsWhenInForeground: true,

                         onPushTokenReceivedCallback: (token) => {
                                    console.log('[Firebase] onPushTokenReceivedCallback:', { token });
                                    this.token = token ; 
                                    this.userdetailsService.addFirebase(this.user, this.token) 
                                    .subscribe(
                                             data0=>{
                                                    console.log(data0 ) ;
                                                   // localStorage.setItem('currentUser', JSON.stringify({userid:this.model.userid,  token: data['token'] }));
                                                    
                                              },error0=>{
                                                   console.log(error0) ;    
                                              } ); 
      
                         },

      /*
    onMessageReceivedCallback: (message: firebase.Message) => {
        console.log('[Firebase] onMessageReceivedCallback:', { message });
      }*/
    })
      .then(() => {
        console.log('[Firebase] Initialized');
      })
      .catch(error => {
        console.log('[Firebase] Initialize', { error });
      });

   /* firebase.init({
      showNotifications: true,
      showNotificationsWhenInForeground: true,

      onPushTokenReceivedCallback: (token) => {
        console.log('[Firebase] onPushTokenReceivedCallback:', { token });
      },

      onMessageReceivedCallback: (message: firebase.Message) => {
        console.log('[Firebase] onMessageReceivedCallback:', { message });
      }
    })
      .then(() => {
        console.log('[Firebase] Initialized');
      })
      .catch(error => {
        console.log('[Firebase] Initialize', { error });
      });*/

  }


}
