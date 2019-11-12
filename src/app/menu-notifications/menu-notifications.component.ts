

import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { UserdetailsService } from '../_services/index'; 
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import * as prettyMs from 'pretty-ms';
import {Subscription} from 'rxjs';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions'; 
 

@Component({
  selector: 'app-menu-notifications',
  templateUrl: './menu-notifications.component.html',
  styleUrls: ['./menu-notifications.component.css']
})
export class MenuNotificationsComponent implements OnInit  {
    loading = false ; 
    myhome:string = '' ; 

    checkStores:boolean =false ; 
    notifications:any = []; 
notif :any ; 
    temptime = [] ;

     data3 :any ; 
     @Output() notifCount = new EventEmitter<string>();
 
   
    constructor(
        private router: Router,
        private userdetailsService : UserdetailsService,  
        private activatedRoute : ActivatedRoute, 
        private permissionsService : NgxPermissionsService, 
        private rolesService : NgxRolesService)
     {    
     }

    
      
 
     
    
      ngOnInit() {
          
          this.loading = true ; 
          this.myhome = JSON.parse(localStorage.getItem('currentUser')).userid ; 
          console.log(this.myhome) ; 
          
          
          
          this.userdetailsService.getNotifications (this.myhome)
          .subscribe(
              data =>{
                  this.notifications = data ; 
                   console.log(data ) ; 
                   for (let i= 0 ; i<  this.notifications.notification.length ; i++ ) {   
                    this.notifications.notification[i].time = prettyMs( new Date().getTime() - this.notifications.notification[i].time,  {compact: true}  );
                    }
                this.notifications.notification= this.notifications.notification.reverse(); 
                                   this.notifCount.emit(this.notifications.notificationcount);

                  
                  
              }
              ,error =>{
                  console.log(error) ; 
                  }) ;
          
          
             
           
          
          
            
           this.userdetailsService.getNotif(this.myhome)
            .subscribe(
                data2=> {
                   this.notif= data2 ;
                    this.notif = JSON.parse (this.notif ) ;  
                    console.log(data2);
                   
                     this.notif['time'] =prettyMs( new Date().getTime() -this.notif['time'],  {compact: true} ) ;  
                       
                    this.notifications.notification.unshift(this.notif ) ; 
                    this.notifications.notificationcount+=1; 
                  this.notifCount.emit(this.notifications.notificationcount);
 
                
                }
                ,error2 =>{
                 console.log(error2 )     ;
                }) ;
          
          
            
          
          this.userdetailsService.getRemoveNotif(this.myhome). 
          subscribe (
              datan=> {
                  this.data3 = datan  ;
                  this.data3 = JSON.parse(this.data3) ;  
                  console.log(this.notifications.notification) ; 
                 // console.log(data3) ;
                   for (let n of  this.notifications.notification) { 
                        console.log(n.commandid) ; 
                       if(n.commandid.localeCompare(this.data3['commandid'])==0  &&  this.data3['value'].localeCompare( n.value) ==0) {
                                    
                              let index = this.notifications.notification.indexOf(n);
                             console.log(index) ;     
                                     
                               this.notifications.notification.splice(index,1);
                                this.notifications.notificationcount -=1 ; 
                              this.notifCount.emit(this.notifications.notificationcount);


                        }else {
                            if(n.commandid.localeCompare( this.data3['commandid'] )==0)  {
                                let index = this.notifications.notification.indexOf(n);
                                 console.log(index) ;     

                              this.notifications.notification.splice(index,1);
                                       this.notifications.notificationcount -=1 ; 
                     this.notifCount.emit(this.notifications.notificationcount);


                            }
                            }
                            
                      }
              },error3 =>{
                  console.log(error3) ; 
                  
          });
              
      }
              
               
          
          
     
          
   
  
    goToLink(commandid , notif ){
        console.log(notif) ; 
        if (notif.localeCompare("rating")==0){
             //  console.log(notif.localeCompare("rating")) ; 
          this.router.navigateByUrl('/home/'+this.myhome+'/done');//, '/#/'+commandid);
        //    .then(()=>{this.router.navigatebyUrl('#'+commandid)});
        }
        else{
             console.log(notif.localeCompare("rating")) ;  
          this.router.navigateByUrl('/home/'+this.myhome+'/ongoing/#/'+commandid);

        }
        
    
     }
    
     removeStep(n){
       //  console.log(n) ;
          let index = this.notifications.notification.indexOf(n) ; 
         // n.time= this.temptime[index]  ;
         let notifs = [n] ; 
      
        for (let nn of this.notifications.notification){
            if (nn!=n && nn.commandid ==n.commandid && nn.value !="message" && nn.value !="rating"){
                let index = this.notifications.notification.indexOf(nn);
              //  nn.time = this.temptime[index]  ; 
                notifs.push(nn)  ;  
      
        
            }
          }
     
               this.userdetailsService.removeNotification(this.myhome, notifs)
                .subscribe(
                 data => {
                     console.log(data) ;
                     for (let n0 of notifs){
                       let index = this.notifications.notification.indexOf(n0);

                       if (index > -1) {
                         this.notifications.notification.splice(index, 1);
                        
                       }  
                       this.notifications.notificationcount -=1 ; 
                       this.notifCount.emit(this.notifications.notificationcount);
 
                     }
                }
                ,error =>{
                   console.log(error ) ; 
                }
            );
     
     }
    
   
    
        

       

}
    
