import { Component, OnInit, Input,Output , OnChanges, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {StoreService} from '../_services/index'; 
//import { RouterModule, Routes } from '@angular/router'; 
import * as  prettyMs from 'pretty-ms';

@Component({
      
  selector: 'app-store-menu',
  templateUrl: './store-menu.component.html',
  styleUrls: ['./store-menu.component.css'], 
})
export class StoreMenuComponent implements OnInit, OnChanges {
      
      @Input()  storetitle:string  ; 
      me= JSON.parse(localStorage.getItem('currentUser')).userid ; 

      //@Output notifCount:any ; 
      @Output() notifCount = new EventEmitter<string>();

      notif :any ={"notification":[]};
      data2 :any ; 
      data3 :any ; 
      constructor(
            private route: ActivatedRoute,
            private router: Router,
            private storeService: StoreService
           )
           {}     
        
    
    
      ngOnChanges(changes ) {

        console.log(changes  ) ;
        
         console.log(changes.storetitle) ; 
         if (changes.storetitle.previousValue && changes.storetitle.previousValue!= changes.storetitle.currentValue) {
             
          
             this.storetitle = changes.storetitle.currentValue; 
                   
        
           console.log(this.storetitle) ; 
   
           this.storeService.getNotifications (this.storetitle)
          .subscribe(
              data =>{
                  this.notif = data; 
                   this.notifCount.emit(this.notif.notificationcount);
 
                   console.log(data ) ; 
                   for (let i= 0 ; i<  this.notif.notification.length ; i++ ) 
                        this.notif.notification[i].time=  prettyMs( new Date().getTime() - this.notif.notification[i].time,   {compact: true}  );
                        this.notif.notification= this.notif.notification.reverse(); 
                        
                          
                  
                  
                }
              ,error =>{
                  console.log(error) ; 
                 
               }) ; 
          
          
             
            
              this.storeService.getNotif(this.storetitle)
              .subscribe(
                data=> {
                    this.data2 = data ; 
                    this.data2= JSON.parse(this.data2) ; 
                    console.log(this.data2) ; 
                 //data2 = JSON.parse(data2);
                    
                    this.data2['time'] = prettyMs( new Date().getTime() - this.data2['time'],   {compact: true}  );

                    this.notif.notification.unshift(this.data2 ) ; 
                    this.notif.notificationcount+=1; 
                    this.notifCount.emit(this.notif.notificationcount);

                
                },error2 =>{
                   console.log(error2 )     ;
               
                    
                });
        
            this.storeService.getRemoveNotif(this.storetitle)
              .subscribe(
                data=> {
                    this.data3 = data ; 
                    this.data3 = JSON.parse(this.data3) ; 
                       for (let n of  this.notif.notification) { 
                    
                       if(n.commandid.localeCompare(this.data3['commandid'])==0  &&  this.data3['value'].localeCompare( n.value) ==0) {
                                    
                              let index = this.notif.notification.indexOf(n);
                             console.log(index) ;     
                                     
                               this.notif.notification.splice(index, 1);
                                this.notif.notificationcount -=1 ; 
                                this.notifCount.emit(this.notif.notificationcount);


                        }else {
                            
                          if(n.commandid.localeCompare( this.data3['commandid'] )==0) {
                                let index = this.notif.notification.indexOf(n);
                                 console.log(index) ;     

                                 this.notif.notification.splice(index, 1);
                                 this.notif.notificationcount -=1 ; 
                                 this.notifCount.emit(this.notif.notificationcount);

                            }
                            }
                            
                      }
                    
                     console.log(data )  ;
                    
                
                },error2 =>{
                   console.log(error2 )     ;
               
                    
                });
        
         }
      
  }


       
    
    
    ngOnInit() { 
    
                 
        
           console.log(this.storetitle) ; 
   
           this.storeService.getNotifications (this.storetitle)
          .subscribe(
              data =>{
                  this.notif = data; 
                   ; 
                 
                     this.notifCount.emit(this.notif.notificationcount);
                   console.log(data ) ; 
                   for (let i= 0 ; i<  this.notif.notification.length ; i++ ) 
                        this.notif.notification[i].time=  prettyMs( new Date().getTime() - this.notif.notification[i].time,   {compact: true} );
                        this.notif.notification= this.notif.notification.reverse(); 
                        
                          
                  
                  
                }
              ,error =>{
                  console.log(error) ; 
                 
               }) ; 
          
          
             
              
             this.storeService.getNotif(this.storetitle)
              .subscribe(
                data=> {
                    this.data2 = data ; 
                    this.data2= JSON.parse(this.data2) ; 
                   console.log(this.data2) ; 
                 //data2 = JSON.parse(data2);
                    
                    this.data2['time'] = prettyMs( new Date().getTime() - this.data2['time'],   {compact: true}  );

                    this.notif.notification.unshift(this.data2 ) ; 
                    this.notif.notificationcount+=1; 
                    this.notifCount.emit(this.notif.notificationcount);

                
                },error2 =>{
                   console.log(error2 )     ;
               
                    
                });
        
            this.storeService.getRemoveNotif(this.storetitle)
              .subscribe(
                data=> {
                    this.data3 = data ; 
                    this.data3 = JSON.parse(this.data3) ; 
                       for (let n of  this.notif.notification) { 
                    
                       if(n.commandid.localeCompare(this.data3['commandid'])==0  &&  this.data3['value'].localeCompare( n.value) ==0) {
                                    
                              let index = this.notif.notification.indexOf(n);
                             console.log(index) ;     
                                     
                               this.notif.notification.splice(index, 1);
                                this.notif.notificationcount -=1 ; 
                                                   this.notifCount.emit(this.notif.notificationcount);
 

                        }else {
                            
                          if(n.commandid.localeCompare( this.data3['commandid'] )==0) {
                                let index = this.notif.notification.indexOf(n);
                                 console.log(index) ;     

                              this.notif.notification.splice(index, 1);
                                       this.notif.notificationcount -=1 ; 
                                                  this.notifCount.emit(this.notif.notificationcount);


                            }
                            }
                            
                      }
                    
                     console.log(data )  ;
                    
                
                },error2 =>{
                   console.log(error2 )     ;
               
                    
                });
        
}

 /* storetitle: string ="" ;  
  userid : string = '' ;
  store : Store ; 
  restrict: boolean = true ; 
  private sub :any ; 
  constructor(
  private route: ActivatedRoute,
  private router: Router,
  private storeService: StoreService)

  {}

  ngOnInit() {
 
        this.sub = this.route.params.subscribe(params => {
              this.storetitle = params['store']; // (+) converts string 'id' to a number
              // In a real app: dispatch action to load the details here.
         });
       
         
      
        this.storeService.getStore( this.storetitle)
            .subscribe(
                        data => {
                           
                                    console.log('storemenu' ) ; 
                                   console.log(data)  ; 
                                    var x = document.getElementById("storemenu");
                                    x.style.display = "block";
                                    var x2 = document.getElementById("notstore");
                                    x2.style.display = "none";    
                        }, 
                        error => {
                            console.log("no store menu ");
                            console.log(error) ; 
                             var x = document.getElementById("storemenu");
                                 x.style.display = "none";
                             var x2 = document.getElementById("notstore");
                                 x2.style.display = "block";   
                            // var x3 = document.getElementById("restrict");
                            //        x3.style.display = "none";
                        }
       
     
               );
      
      
  }
    
     ngOnDestroy() {
    this.sub.unsubscribe();
  }

*/
    
    
}



