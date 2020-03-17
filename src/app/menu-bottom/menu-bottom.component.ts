import { Component, OnInit } from '@angular/core';
import { UserService, UserdetailsService} from '../_services/index'; 

@Component({
     moduleId: module.id,
  selector: 'app-menu-bottom',
  templateUrl: './menu-bottom.component.html',
  styleUrls: ['./menu-bottom.component.css']
})
export class MenuBottomComponent implements OnInit {

    loading = false ; 
    query : string =""; 
    storeModel: any = {};
    stores:any = [] ;
    checkStores:boolean =false ; 
    notifications:any = []; 
    notificationsCount = 0 ; 
    messagesnotif = 0 ; 
    temptime = [] ;
    menuState ="" ;  
    notif :any ;
    mnotif :any ;  
    name :string ="";
    isopen = false ;  
    data3 :any={} ; 
    
  myhome = JSON.parse(localStorage.getItem('currentUser')).userid ; 
 
    
    
  constructor(private userdetailsService :UserdetailsService,
              private userService : UserService ) { }

  ngOnInit() {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    
           /*   
                    this.userService.getStores(this.myhome)
                    .subscribe( 
                        data => {
                                //  console.log(data._source.store ) ; 
                               if (data['_source']['store'] ) {
                                    this.stores = data['_source']['store'].filter(x => x ).reverse() ; 
                                    console.log(this.stores) ; 
                  
                 
               
                        }}, error => {
                                console.log( error) ; 
                
                     }); */
          
          this.userdetailsService.getNotifications (this.myhome)
          .subscribe(
              data =>{
                  this.notificationsCount  = data['notificationcount'] ; 
                  this.notifications =data ;
              
              },error =>{
                  console.log(error) ; 
                  }) ;
          
          
             
            this.userdetailsService.getMessagesNotifications (this.myhome)
            .subscribe(
              data =>{
                 if (data['messagesnotificationcount'] <0 ) 
                       this.messagesnotif= 0 
                  else 
                        this.messagesnotif = data['messagesnotificationcount'] ; 
                   /*for (let i= 0 ; i<  this.messagesnotif.notification.length ; i++ ) 
                   {    this.temptime [i] =  prettyMs( new Date().getTime() - this.notifications.notification[i].time);
              
                    }*/
                   
              } ,error =>{
                  
                   
                  console.log(error) ; 
              }) ;
          
          
              
             this.userdetailsService.getNotif(this.myhome)
            .subscribe(
                data2=> {
                   this.notif= data2 ;
                    this.notif = JSON.parse (this.notif ) ;  
                   // console.log(data2);
                   
                   //  this.notif['time'] =prettyMs( new Date().getTime() -this.notif['time'],  {compact: true} ) ;  
                       
                    //this.notifications.notification.unshift(this.notif ) ; 
                   this.notificationsCount +=1;
                
                }
                ,error2 =>{
                 console.log(error2 )     ;
                }) ;
           
          
            this.userdetailsService.getMessagesNotif(this.myhome)
            .subscribe(
                data2=> {
                    this.mnotif = data2 ; 
                    this.mnotif = JSON.parse(this.mnotif) ;
                   // console.log(data2 ) ; 
                 //data2.time = prettyMs( new Date().getTime() - data2.time);
                  
              
                     this.messagesnotif+=  this.mnotif['unread']; 
               
                }
                ,error2 =>{
                 console.log(error2)     ;
                }) ;
          
          
             this.userdetailsService.getMessagesNotifDown(this.myhome)
            .subscribe(
                data2=> {
                    this.mnotif = data2 ; 
                    this.mnotif = JSON.parse(this.mnotif) ;
                    //console.log(data2 ) ; 
                  // // data2.time = prettyMs( new Date().getTime() - data2.time);
                  
                    if (this.messagesnotif >0 ) 
                     this.messagesnotif -=  this.mnotif['read']; 
               
                }
                ,error2 =>{
                 console.log(error2)     ;
                }) ;
             
          
                   
          this.userdetailsService.getRemoveNotif(this.myhome). 
          subscribe (
              datan=> {
                  this.data3 = datan  ;
                  this.data3 = JSON.parse(this.data3) ;  
                  //console.log(this.notifications.notification) ; 
                  console.log("wwwwwwwwwwwwwwwwwwwwwwwww");
                   console.log(this.data3) ;
                   for (let n of  this.notifications.notification) { 
                        console.log(n.commandid) ; 
                       if( n.commandid== this.data3['commandid'] &&  this.data3['value']==n.value) {
                                    
                             // let index = this.notifications.notification.indexOf(n);
                            // console.log(index) ;     
                                     
                            //   this.notifications.notification.splice(index,1);
                           if ( this.notificationsCount >0 ) 

                               this.notificationsCount -=1 ; 

                        }else {
                            if(n.commandid == this.data3['commandid'] )  {
                             //   let index = this.notifications.notification.indexOf(n);
                              //   console.log(index) ;     

                            //  this.notifications.notification.splice(index,1);
                           if ( this.notificationsCount >0 ) 

                                this.notificationsCount -=1 ; 

                            }
                            }
                            
                      }
              },error3 =>{
                  console.log(error3) ; 
                  
          });
                    
          
              
      }
                  
              
               
          
          
     
    //    let searchbar:SearchBar = <SearchBar>this.page.getViewById("searchbarid");
    //           searchbar.dismissSoftInput();
 
                
             
               
            
}
