import { Component, OnInit, OnChanges, Input } from '@angular/core';
import {SearchService, UserService, StoreService,  AuthenticationService, UserdetailsService , AddressService} from '../_services/index'; 
import { Router, ActivatedRoute, NavigationEnd, NavigationStart , NavigationError, Event } from '@angular/router';
import { map } from 'rxjs/operators';
import * as prettyMs from 'pretty-ms';
import {Subscription} from 'rxjs';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions'; 
 
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
 


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit,  OnChanges {
    loading = false ; 
   // myhome:string =  JSON.parse(localStorage.getItem('currentUser')).userid ; 
 
    storeModel: any = {};
    stores:any = [] ;
    checkStores:boolean =false ; 
    notifications:any = []; 
    messagesnotif = 0 ; 
    temptime = [] ;
    menuState ="" ;  
    notif :any ;
    mnotif :any ;  
    name:string ="";
    isopen = false ;  
    data3 :any={} ; 
    cities = [];
    
    @Input() myhome:string ;
       
    langue :string ;
    langue2:string ;  
    hiddensearch :boolean=false; 
    city= 'Toutes les villes'; 
    cityAr='كل الولايات';
    ownerstore : boolean ;
    ownerdelivery:boolean; 
    constructor(
        private router: Router,
        private storeService: StoreService, 
        private  authenticationService:  AuthenticationService,
        private userdetailsService : UserdetailsService,  
        private activatedRoute : ActivatedRoute, 
        private permissionsService : NgxPermissionsService, 
        private rolesService : NgxRolesService, 
        private userService: UserService, 
        private addressService: AddressService, 
        private searchService : SearchService,
         public  afAuth:  AngularFireAuth) {
       
        
     /*  router.events.subscribe( (event: Event) => {
              if (event instanceof NavigationStart) {
                  this.menuState = 'out';
              } });*/
        
     /*   
              this.router.events.subscribe( (event: Event) => {
              if (event instanceof NavigationStart) {
                 // this.menuState = 'out';
                 // console.log(event) ;
                  //console.log(this.isopen ) ; 
                  //this.isopen = !this.isopen ;  
              }

              if (event instanceof NavigationEnd) {
                  // Hide loading indicator
                      console.log(event) ;  
              }

              if (event instanceof NavigationError) {
                  // Hide loading indicator
                  // Present error to user
                  console.log(event.error);
              }
               });
        
               this.myhome = JSON.parse(localStorage.getItem('currentUser')).userid ; 
*/
    /*     this.userdetailsService.getLocation(this.myhome)
         .subscribe(
             data=>{
                 console.log(data) ; 
                 if (data['location']) {
                    this.city = data['location'];   
                    this.cityAr  = data['locationAr'] ; 
                     }
                 else {
                        this.city= 'Toutes les villes'; 
                        this.cityAr='كل الولايات'; 
                     }
                 //  this.searchService.sendCity({
                  //                 "city": this.city}) ;
             },error=>{
                 console.log(error) ; 
                 this.city= 'Toutes les villes'; 
                 this.cityAr='كل الولايات';
                 if (error["status"]=="401") 
                    this.logout() ;   
                 
                 
            });
         this.addressService.getCities () 
          .subscribe (
             data => {
                    console.log(data) ; 
                    this.cities = data['cities'];   
                    
                
             }, error => {
                    console.log(error);   
        
          });
      */
             //language 
          if (localStorage.getItem('Language')=="fr") {
              this.langue2 = 'ar' ; 
              this.langue='fr';
         }else {
              if (localStorage.getItem('Language')=="ar"){
              this.langue2='fr' ; 
                this.langue='ar'; 
               }else {
                  
                    this.langue2 = 'ar' ; 
                     this.langue='fr';
                  
                  }
          }

      
     }

    
      
 
    ngOnInit(){
        this.init();   
     }
     
    
    ngOnChanges(changes ) {
          
    if ( changes.myhome.previousValue!= changes.myhome.currentValue) {
             
          
             this.myhome = changes.myhome.currentValue; 
             this.init();
    }
        }

    
    init(){
        
        
        
         this.loading = true ; 
        //  this.myhome = JSON.parse(localStorage.getItem('currentUser')).userid ; 
         // console.log(localStorage.getItem('currentUser')) ; 
         // console.log(this.myhome) ; 
         this.permissionsService.addPermission('readUserAccount', () => {
                return true;
         });
          
          this.addressService.getCities () 
          .subscribe (
             data => {
                    //console.log(data) ; 
                    this.cities = data['cities'];   
                    this.cities.unshift({"id":0, "name": 'Toutes les villes', "nameAr": 'كل الولايات'});
             }, error => {
                    console.log(error);   
        
          }); 
          //this.userdetailsService.getcity (this.myhome) 
          //this.city = data['position']
         
            if (this.myhome  == "annonym") {
                           this.rolesService.flushRoles();
                           this.rolesService.addRole('GUEST', ['readUserAccount' ]); 
            }else {
                  
          
              this.userdetailsService.getFullname (this.myhome)
              .subscribe(
                data=>{
                    
                     
         
             
                this.permissionsService.addPermission('writeUserAccount', () => {
                return true;
                });
                this.rolesService.flushRoles();

                this.rolesService.addRole('ADMIN', ['readUserAccount','writeUserAccount' ]);  
             
             
                //   console.log(data) ; 
                this.name = data['fullname']; 
                
                this.loading= false ; 

        
             this.userService.getOwnerstore(this.myhome)
            .subscribe( 
             data => {
               
              console.log(data ) ; 
               
                   
                  this.ownerstore = data['ownerstore']; 
                   if(this.ownerstore ) 
                        this.userService.getStores(this.myhome)
                        .subscribe( 
                           data => {
                            //  console.log(data._source.store ) ; 
                              if (data['store'] ) {
                   
                               this.stores = data['store'].filter(x => x ).reverse() ; 
                   
                    
                                 console.log(this.stores) ; 
                  
                 
               
                             }}, error => {
                                     console.log( error) ; 
                            
                
                            }) 
                  
                 
               
              }, error => {
                 console.log( error) ; 
                    
                
               });     
                         
             this.userService.getOwnerdelivery(this.myhome)
            .subscribe( 
             data => {
               
                 console.log(data ) ; 
                 this.ownerdelivery = data['ownerdelivery']; 
                  
                  
                 
               
              }, error => {
                 console.log( error) ; 
                    
                
               });       
                    
          
            this.userService.getStores(this.myhome)
            .subscribe( 
             data => {
              //  console.log(data._source.store ) ; 
               if (data['_source']['store'] ) {
                   
                  this.stores = data['_source']['store'].filter(x => x ).reverse() ; 
                   
                   
                   console.log(this.stores) ; 
                  
                 
               
              }}, error => {
                 console.log( error) ; 
                    
                
               }); 
          
          this.userdetailsService.getNotifications (this.myhome)
          .subscribe(
              data =>{
                  this.notifications = data ; 
                   console.log(data ) ; 
                   for (let i= 0 ; i<  this.notifications.notification.length ; i++ ) {   
                    this.notifications.notification[i].time = prettyMs( new Date().getTime() - this.notifications.notification[i].time,  {compact: true}  );
                    }
                this.notifications.notification= this.notifications.notification.reverse(); 
       
              }
              ,error =>{
                  console.log(error) ; 
                  }) ;
          
          
             
            this.userdetailsService.getMessagesNotifications (this.myhome)
            .subscribe(
              data =>{
                 // if (data['messagesnotificationcount'] <0 ) 
                   //     this.messagesnotif= 0 
                 // else 
                        this.messagesnotif = data['messagesnotificationcount'] ; 
                  /* for (let i= 0 ; i<  this.messagesnotif.notification.length ; i++ ) 
                   {    this.temptime [i] =  prettyMs( new Date().getTime() - this.notifications.notification[i].time);
              
                    }*/
                   
              } ,error =>{
                  
                   
                  console.log(error) ; 
              }) ;
          
          
              
            let connect =  this.userdetailsService.getNotif(this.myhome)
            .subscribe(
                data2=> {
                   this.notif= data2 ;
                    this.notif = JSON.parse (this.notif ) ;  
                    console.log(data2);
                   
                     this.notif['time'] =prettyMs( new Date().getTime() -this.notif['time'],  {compact: true} ) ;  
                       
                    this.notifications.notification.unshift(this.notif ) ; 
                    this.notifications.notificationcount+=1; 
                
                }
                ,error2 =>{
                 console.log(error2 )     ;
                }) ;
           
          
             let connect2 =  this.userdetailsService.getMessagesNotif(this.myhome)
            .subscribe(
                data2=> {
                    this.mnotif = data2 ; 
                    this.mnotif = JSON.parse(this.mnotif) ;
                    console.log(data2 ) ; 
                  // // data2.time = prettyMs( new Date().getTime() - data2.time);
                  
              
                     this.messagesnotif+=  this.mnotif['unread']; 
               
                }
                ,error2 =>{
                 console.log(error2)     ;
                }) ;
          
          
           let connect3 =  this.userdetailsService.getMessagesNotifDown(this.myhome)
            .subscribe(
                data2=> {
                    this.mnotif = data2 ; 
                    this.mnotif = JSON.parse(this.mnotif) ;
                    console.log(data2 ) ; 
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
                  console.log(this.notifications.notification) ; 
                 // console.log(data3) ;
                   for (let n of  this.notifications.notification) { 
                        console.log(n.commandid) ; 
                       if(n.commandid.localeCompare(this.data3['commandid'])==0  &&  this.data3['value'].localeCompare( n.value) ==0) {
                                    
                              let index = this.notifications.notification.indexOf(n);
                             console.log(index) ;     
                                     
                               this.notifications.notification.splice(index,1);
                                this.notifications.notificationcount -=1 ; 

                        }else {
                            if(n.commandid.localeCompare( this.data3['commandid'] )==0)  {
                                let index = this.notifications.notification.indexOf(n);
                                 console.log(index) ;     

                              this.notifications.notification.splice(index,1);
                                       this.notifications.notificationcount -=1 ; 

                            }
                            }
                            
                      }
              },error3 =>{
                  console.log(error3) ; 
                  
          });
              }
      
                  
               ,error=>{
                 
               if (error["status"]=="401") 
                    this.logout() ;  
                 //   this.logout () ; 
               
                 });
               
          
          } 
    
    
    
        
        
        }
    
    
    logout() {
             let that=this;
             this.afAuth.auth.signOut().then(function() {
             // Sign-out successful.
                  console.log('signout') ;
                  that.permissionsService.flushPermissions();
                  that.rolesService.flushRoles();
                 // this.authenticationService.logout();
                 localStorage.removeItem('currentUser');
                // localStorage.removeItem('Language');
                  let userid = "annonym"; 
                localStorage.setItem('currentUser', JSON.stringify({userid,  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlUyRnNkR1ZrWDE5QU1kQjBXMWNSMkJlc2ZNUVVMSGt5VEdkaklsZDV3Njg9IiwiaWF0IjoxNTg1Mzc4OTM4fQ.IvZiaXujfWEFauOpCnIfzLv9f1a0VzpHuiYbE_J6kDM" }));
                 window.location.href="http://"+window.location.hostname+":8080/" ;
                // that.router.navigateByUrl('/');// || '/home/'+this.userid;
            }).catch(function(error) {
                  that.permissionsService.flushPermissions();
                  that.rolesService.flushRoles();
                 // this.authenticationService.logout();
                 localStorage.removeItem('currentUser');
                //       localStorage.removeItem('Language');
                 let userid = "annonym"; 
                ;
                localStorage.setItem('currentUser', JSON.stringify({userid,  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlUyRnNkR1ZrWDE5QU1kQjBXMWNSMkJlc2ZNUVVMSGt5VEdkaklsZDV3Njg9IiwiaWF0IjoxNTg1Mzc4OTM4fQ.IvZiaXujfWEFauOpCnIfzLv9f1a0VzpHuiYbE_J6kDM" }));
                //that.router.navigateByUrl('/');// || '/home/'+this.userid;
                window.location.href="http://"+window.location.hostname+":8080/" ;
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

                     }
                }
                ,error =>{
                   console.log(error ) ; 
                }
            );
     
     }
    
    removeMessage(n){
          let index = this.notifications.notification.indexOf(n) ; 
         // n.time= this.temptime[index]  ;
         let notifs = [n] ; 
      
        
        for (let nn of this.notifications.notification){
            if (nn!=n && nn.commandid ==n.commandid && nn.value =="message" ){
                let index = this.notifications.notification.indexOf(nn);
               // nn.time = this.temptime[index]  ; 
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

                     }
                }
                ,error =>{
                   console.log(error ) ; 
                }
            );
        
        }
    
        

      logoutAll () {
        this.userService.logoutall (this.myhome)
        .subscribe (
        
            data => {     
          
               let that=this;
             this.afAuth.auth.signOut().then(function() {
             // Sign-out successful.
                  console.log('signout') ;
                  that.permissionsService.flushPermissions();
                  that.rolesService.flushRoles();
                 // this.authenticationService.logout();
                  localStorage.removeItem('currentUser');
                // localStorage.removeItem('Language');
                 
                 
                let userid = "annonym"; 
                localStorage.setItem('currentUser', JSON.stringify({userid,  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlUyRnNkR1ZrWDE5QU1kQjBXMWNSMkJlc2ZNUVVMSGt5VEdkaklsZDV3Njg9IiwiaWF0IjoxNTg1Mzc4OTM4fQ.IvZiaXujfWEFauOpCnIfzLv9f1a0VzpHuiYbE_J6kDM" }));

                // that.router.navigateByUrl('/');// || '/home/'+this.userid;
            
                           window.location.href="http://"+window.location.hostname+":8080/" ; 

             }).catch(function(error) {
                  that.permissionsService.flushPermissions();
                  that.rolesService.flushRoles();
                 // this.authenticationService.logout();
                 localStorage.removeItem('currentUser');
                 let userid = "annonym"; 
                localStorage.setItem('currentUser', JSON.stringify({userid,  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlUyRnNkR1ZrWDE5QU1kQjBXMWNSMkJlc2ZNUVVMSGt5VEdkaklsZDV3Njg9IiwiaWF0IjoxNTg1Mzc4OTM4fQ.IvZiaXujfWEFauOpCnIfzLv9f1a0VzpHuiYbE_J6kDM" })); 
              //   localStorage.removeItem('Language');
              //  that.router.navigateByUrl('/');// || '/home/'+this.userid;
                window.location.href="http://"+window.location.hostname+":8080/" ;
             });
                
                
            }, error => {
                console.log(error ) ; 
            }
            )
        
        }
          

     
  

       
     changeLang(event){
            let temp = this.langue; 
            this.langue = event ; 
            this.langue2= temp ; 
               localStorage.setItem('Language', event);
           window.location.href="http://"+window.location.hostname+":8080/"+event ; 

         }
 
  
        //select city 
        selectCity(event,event2 ) {
          this.city = event ;      
          this.cityAr = event2 ;   
               this.searchService.sendCity({
                                   "city": this.city}) ; 
            
         }
       

}
    
