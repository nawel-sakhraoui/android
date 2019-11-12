import {Component,ViewChild, OnDestroy, OnInit, AfterViewInit,  ChangeDetectorRef, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {StoreService, UserdetailsService, MessagesService} from '../_services/index'; 
import {Subscription} from 'rxjs';
//import * as prettyMs from 'pretty-ms';
//import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  


@Component({
  selector: 'app-store-details',
  templateUrl: './store-details.component.html',
  styleUrls: ['./store-details.component.css']
})

export class StoreDetailsComponent implements OnInit {
        
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
      

  loading: boolean= false ; 
  show :boolean = false ; 
  open:boolean = true ; 
  nostore = false ; 
  storetitle: string ="" ;  
  userid : string = '' ;
  store : any= {} ; 
  isValid :boolean = true ;
  private sub :any ;
  selectArticles :any =[] ; 
  articles :any [] = [] ; 
  read :any ='' ; 
  banner = ""; 
  query = ""; 
    avatars={}; 
    owner = {}; 
  private notif:any= {} ;
  
  constructor(
            private route: ActivatedRoute,
            private router: Router,
            private storeService: StoreService, 
            private userdetailsService :UserdetailsService, 
            private messagesService : MessagesService
        //    private permissionsService : NgxPermissionsService, 
        //    private rolesService : NgxRolesService
      ){}
 
    
    ngOnInit() {
        this.loading = true ; 
        console.log('store') ; 
        this.sub = this.route.parent.params.subscribe(params => {
        console.log (params) 
        this.storetitle = params['store']; // (+) converts string 'id' to a number
        // In a real app: dispatch action to load the details here.
       // console.log(this.storetitle) ; 
        this.storeService.getStoreStatus( this.storetitle  )
            .subscribe(
                data0 =>{
                    console.log(data0 ) ; 
                    this.open = data0['open']; 
                  /*   this.permissionsService.addPermission('readStore', () => {
                            return true;
                           }) 
                    
                    
                     if (this.open ) {
                          this.rolesService.addRole('GUESTStore', ['readStore' ]);
                     }
                    */
                    
              //      if (this.open ) {
                       },error0=>{
                        this.nostore = true ; 
                        console.log(error0) ; 
                }); 
                
                
                 this.storeService.getStore( this.storetitle)
                      .subscribe(
                         data => {
                          this.store = data ; 
                            this.store.created = new Date(this.store.created).toLocaleDateString() ; 
                            console.log(data ) ; 
                             this.loading = false ; 
                             this.show = true ; 
                              let admin = false ; 
                             for (let a of this.store.administrators  ){
                               if( a.userid == this.me ) {
                                   admin = true ; 
                                   break ; 
                                   }
                               
                               }
       
                        /*    if (this.me == this.store.userid ||  admin ) {
                                 
                                    this.permissionsService.addPermission('writeStore', () => {
                                          return true;
                                    })
                    
                                  
                                    this.rolesService.addRole('ADMINStore', ['readStore','writeStore' ]);
                                 
                             }*/
                             
                           
                            //get owner information 
                             //email; fullname ! 
                             this.userdetailsService.getUserAccount(this.store.userid)
                             .subscribe(
                                 data2 => {
                                     this.owner = data2 ; 
                                    console.log(data2) ;     
                                 }
                                 ,error2=> {
                                     console.log(error2) ; 
                                 }
                                 ) 
                             //get avatars 
                             this.userdetailsService.getAvatar(this.store.userid)
                             .subscribe(
                                 data3 => {
                                  try {
                                     this.avatars[this.store.userid] = data3['avatar'] ; 
                       
                                    
                                  }catch(error) {
                                     this.avatars[this.store.userid] = "" ; 
                                     }  
                                 }
  
                  
                                 )
                             for (let d of this.store.administrators) {
                                 
                              this.userdetailsService.getAvatar(d.userid)
                             .subscribe(
                                 data3 => {
                                  try {
                                     this.avatars[d.userid] = data3['avatar'] ; 
                       
                                    
                                  }catch(error) {
                                     this.avatars[d.userid] = "" ; 
                                     }  
                                 }
                                 ,error3=> {
                                     console.log(error3) ; 
                                 }
                                 )
                                 
                                 }
                              
                            
                        },error => {
                              console.log(error); 
                            this.loading = false ; 
                            this.show = false ;    
                             
                        });
      
      
                   
    /*
   
           this.storeService.getNotifications (this.storetitle)
          .subscribe(
              data =>{
                  this.notif = data ; 
                   console.log(data ) ; 
                   for (let i= 0 ; i<  this.notif.notification.length ; i++ ) 
                        this.notif.notification[i].time=
                          prettyMs( new Date().getTime() - this.notif.notification[i].time);
                         this.notif.notification= this.notif.notification.reverse(); 
                        console.log(connect) ; 
                }
              ,error =>{
                  console.log(error) ; 
                  }) ; 
          
          
             
              let connect =  this.storeService.getNotif(this.storetitle)
                .subscribe(
                data2=> {
                    console.log(data2) ; 
                  // // data2.time = prettyMs( new Date().getTime() - data2.time);

                    this.notif.notification.unshift(data2 ) ; 
                     this.notif.notificationcount+=1; 
                
                }
                ,error2 =>{
                 console.log(error2 )     ;
               
                    
                })
                //}*/
                
             
            
           });}

     sendMessage(userid, fullname, avatar) {
       
       this.messagesService.upMessageTo({"fromMe":this.me,"to":userid, "fullname": fullname, 'avatar' : avatar});
           
       this.router.navigate(["../../../home/"+this.me+"/messages/tosend"], { relativeTo: this.route });

    }

    
 
    
   profile(userid ) {
              this.router.navigate(["../../../home/"+this.me+"/profile/"+userid], { relativeTo: this.route });

       }
    
               

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


 
 
    backToStore () {
                         this.router.navigate(["../"], { relativeTo: this.route });

        }
      

      
}

    


