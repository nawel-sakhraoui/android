import { Component, OnInit } from '@angular/core';
import * as localStorage from  "nativescript-localstorage" ; 
import { RouterExtensions } from "nativescript-angular/router";  
import {SearchService, UserService, StoreService,  AuthenticationService, UserdetailsService , AddressService} from '../_services/index'; 
import { Router, ActivatedRoute, NavigationEnd, NavigationStart , NavigationError, Event } from '@angular/router';
import { map } from 'rxjs/operators';
//import * as prettyMs from 'pretty-ms';
import {Subscription} from 'rxjs';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions'; 
import { SearchBar } from "tns-core-modules/ui/search-bar"; 
import {Page} from "ui/page" ; 
 import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label';
//geolocalisation ici !! 
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";


@Component({
     moduleId: module.id,
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


      me= JSON.parse(localStorage.getItem('currentUser')).userid ; 

               
    /*notifCount=0 ; 
    boolNotif= false ;*/ 
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
    cities = [];
    city:string="" ;
    cityAr:string ='' ; 
    selectedIndex = 0 ;   
    langue :string ;
    langue2:string ;  
    hiddensearch :boolean=false; 
   
    myhome = JSON.parse(localStorage.getItem('currentUser')).userid ; 

  
    
    gotoprofile(){
          console.log(this.myhome) ; 
           this.router.navigateByUrl("/home/"+this.myhome+"/profile"); 
      
      
    }
    
    constructor(
        private router: Router,
        private route : ActivatedRoute, 
        private storeService: StoreService, 
        private  authenticationService:  AuthenticationService,
        private userdetailsService : UserdetailsService,  
        private activatedRoute : ActivatedRoute, 
        private permissionsService : NgxPermissionsService, 
        private rolesService : NgxRolesService, 
        private userService: UserService, 
        private addressService: AddressService, 
        private searchService : SearchService,
        private page : Page) {
       
        
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

     this.userdetailsService.getLocation(this.myhome)
     .subscribe(
         data=>{
             console.log(data) ; 
             if (data['location']) {
                this.city = data['location'];   
                this.cityAr  = data['locationAr'] ; 
                 this.selectedIndex = this.cities.indexOf(this.city) ; 
                 }
             else {
                    this.city= 'Toutes les villes'; 
                    this.cityAr='كل الولايات'; 
                 }
               this.searchService.sendCity({
                               "city": this.city}) ;
         },error=>{
             console.log(error) ; 
             this.city= 'Toutes les villes'; 
             this.cityAr='كل الولايات';
        });
         this.addressService.getCities () 
          .subscribe (
             data => {
                    console.log(data) ; 
                    this.cities = data['cities'];   
                     this.cities = this.cities.reduce((result, filter) => {
                         result =result.concat([filter.name]) ;
                        return result;
                        },[]);
                 this.cities.unshift("Toutes les villes") ;
                 this.selectedIndex = this.cities.indexOf(this.city) ; 

             }, error => {
                    console.log(error);   
        
          });
      
             //language 
          if (localStorage.getItem('Language')=="fr") {
              this.langue2 = 'ar' ; 
              this.langue='fr';
         }else {
              this.langue2='fr' ; 
                this.langue='ar'; 
          }
*/
     }

    
      
 
     
    
      ngOnInit() {
          
          this.loading = true ; 
          this.myhome = JSON.parse(localStorage.getItem('currentUser')).userid ; 
          console.log(this.myhome) ; 
          
  
          
          this.addressService.getCities () 
          .subscribe (
             data => {
                    //console.log(data) ; 
                    this.cities = data['cities'];   
                    this.cities.unshift({"id":0, "name": 'Toutes les villes', "nameAr": 'كل الولايات'});
                   this.cities = this.cities.reduce((result, filter) => {
                         result =result.concat([filter.name]) ;
                        return result;
                        },[]);
               
                this.userdetailsService.getLocation(this.myhome)
                 .subscribe(
                     data=>{
                      console.log(data) ; 
                      if (data['location']) {
                      this.city = data['location'];   
                      this.cityAr  = data['locationAr'] ; 
                      this.selectedIndex = this.cities.indexOf(this.city) ; 
                    }
                    else {
                        this.city= 'Toutes les villes'; 
                        this.cityAr='كل الولايات'; 
                   }
                       this.searchService.sendCity({
                               "city": this.city}) ;
                 },error=>{
                     console.log(error) ; 
                    this.city= 'Toutes les villes'; 
                    this.cityAr='كل الولايات';
                        this.searchService.sendCity({
                               "city": this.city}) 
                 });
                 
                 
                 
               }, error => {
                    console.log(error);   
        
                }); 
          
              this.userdetailsService.getFullname (this.myhome)
              .subscribe(
                data=>{
                //   console.log(data) ; 
                    this.name = data['fullname']; 
                
                     this.loading= false ; 

        
          
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
          
          
              
            let connect =  this.userdetailsService.getNotif(this.myhome)
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
           
          
            let connect2 =  this.userdetailsService.getMessagesNotif(this.myhome)
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
          
          
           let connect3 =  this.userdetailsService.getMessagesNotifDown(this.myhome)
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
                   console.log(this.data3) ;
                   for (let n of  this.notifications.notification) { 
                        console.log(n.commandid) ; 
                       if( n.commandid== this.data3['commandid'] &&  this.data3['value']==n.value) {
                                    
                             // let index = this.notifications.notification.indexOf(n);
                            // console.log(index) ;     
                                     
                            //   this.notifications.notification.splice(index,1);
                               this.notificationsCount -=1 ; 

                        }else {
                            if(n.commandid == this.data3['commandid'] )  {
                             //   let index = this.notifications.notification.indexOf(n);
                              //   console.log(index) ;     

                            //  this.notifications.notification.splice(index,1);
                                 this.notificationsCount -=1 ; 

                            }
                            }
                            
                      }
              },error3 =>{
                  console.log(error3) ; 
                  
          });
              
      }
                  
               ,error=>{
                 
                        
                 //   this.logout () ; 
               
                 });
               
          
          
     
    //    let searchbar:SearchBar = <SearchBar>this.page.getViewById("searchbarid");
      //           searchbar.dismissSoftInput();
 
          
    }
   
    logout() {
   
        this.permissionsService.flushPermissions();
        this.rolesService.flushRoles();
       // this.authenticationService.logout();
        localStorage.removeItem('currentUser');
         //       localStorage.removeItem('Language');

        this.router.navigateByUrl('/');// || '/home/'+this.userid;

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
                console.log(data ) ; 
                localStorage.removeItem('currentUser');
                localStorage.removeItem('Language');
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
                   
        

  getQuery(event){
        
        console.log('search ... ' ) ; 
        let searchBar = <SearchBar>event.object;
       this.query = searchBar.text ; 
      searchBar.text = "" ; 
     searchBar.dismissSoftInput();
        if (this.query !="" ){
                                this.searchService.sendSearch({
                                   "query": this.query});
                               
                                this.router.navigate(["/home/"+this.me+"/result"]);
                                 this.query = ""; 
                                event = "" ; 
            
            }
    
    }
     
    sBLoaded(args){
        let searchbar:SearchBar = <SearchBar>args.object;
        
            
            searchbar.android.clearFocus();
        
    }
   onClear(args){
        let searchbar:SearchBar = <SearchBar>args.object;

        searchbar.dismissSoftInput();
    }

         
  /*  OnNotifCount(event) {
        this.notifCount= event ; 
       } 
*/
    
  /*  public enableLocationTap() {
        geolocation.isEnabled().then(function (isEnabled) {
            if (!isEnabled) {
                geolocation.enableLocationRequest(true, true).then(() => {
                    console.log("User Enabled Location Service");
                }, (e) => {
                    console.log("Error: " + (e.message || e));
                }).catch(ex => {
                    console.log("Unable to Enable Location", ex);
                });
            }
        }, function (e) {
            console.log("Error: " + (e.message || e));
        });
    }

    public buttonGetLocationTap() {
        let that = this;
        geolocation.getCurrentLocation({
            desiredAccuracy: Accuracy.high,
            maximumAge: 5000,
            timeout: 10000
        }).then(function (loc) {
            if (loc) {
                that.locations.push(loc);
            }
        }, function (e) {
            console.log("Error: " + (e.message || e));
        });
    }

    public buttonStartTap() {
        try {
            let that = this;
            this.watchIds.push(geolocation.watchLocation(
                function (loc) {
                    if (loc) {
                        that.locations.push(loc);
                    }
                },
                function (e) {
                    console.log("Error: " + e.message);
                },
                {
                    desiredAccuracy: Accuracy.high,
                    updateDistance: 1,
                    updateTime: 3000,
                    minimumUpdateTime: 100
                }));
        } catch (ex) {
            console.log("Error: " + ex.message);
        }
    }

    public buttonStopTap() {
        let watchId = this.watchIds.pop();
        while (watchId != null) {
            geolocation.clearWatch(watchId);
            watchId = this.watchIds.pop();
        }
    }

    public buttonClearTap() {
        this.locations.splice(0, this.locations.length);
    }
    */
     
      public onchange(event: SelectedIndexChangedEventData){
       //console.log(event) ;
        this.city= this.cities[event.newIndex] ;  
             this.selectCity(this.city,"") ;

       } 
    
   ontouch(args: TouchGestureEventData) {
    const label = <Label>args.object
    switch (args.action) {
        case 'up':
            label.deletePseudoClass("pressed");
            break;
        case 'down':
            label.addPseudoClass("pressed");
            break;
    }
   
}

}
