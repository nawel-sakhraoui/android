import {Component,ViewChild, OnDestroy, OnInit, AfterViewInit,  ChangeDetectorRef, ElementRef } from '@angular/core';

import { FirebaseService, OngoingService, StoreService, MessagesService, UserdetailsService} from '../_services/index';
import { Router, ActivatedRoute, ParamMap, NavigationEnd   } from '@angular/router';

import {Subscription} from 'rxjs';

import * as prettyMs from 'pretty-ms';

//import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  

import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';


@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
 
})
export class SalesComponent implements OnInit {
        
   me= JSON.parse(localStorage.getItem('currentUser')).userid ; 

   query = ""; 
   busy : Subscription;  
   sales :boolean = false ; 
   loading = false ; 
   ongoing :boolean= false ;  ;    
   model :any =  []; 
   storetitle = "" ; 
   avatarlist = {} ; 
   fullnamelist = {};
   messages = []; 
   connection;
   message:any = {};
   totalcommand= 0 ; 
   open = true ; 
   store :any={}; 
   notif:any=[] ; 
   isopen = {}; 
  size= 5 ;
   maxpage = 1 ; 
   page = 1 ; 
   fragment :string ; 
   menuhide = false ; 
   opened= true ; 
    loading0 = false ; 
    ongoing2 :boolean = false ; ; 
    loadingsale = false ; 
        @ViewChild(RadSideDrawerComponent, { static: false }) public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;
  constructor(private ongoingService :OngoingService, 
              private storeService: StoreService, 
              private  route : ActivatedRoute, 
              private router : Router, 
              private messagesService: MessagesService ,
              private userdetailsService : UserdetailsService,
              private firebaseService: FirebaseService,
       //       private rolesService:  NgxRolesService , 
        //      private permissionsService : NgxPermissionsService, 
              private _changeDetectionRef: ChangeDetectorRef) {
    

  
      
  }

  ngOnInit() {
      
          this.loading0 =true ; 
       
       console.log('store') ; 
        let sub = this.route.parent.params.subscribe(params => {
        console.log (params) ;
        this.storetitle = params['store'];
        
          
             this.storeService.getStore( this.storetitle)
                      .subscribe(
                         data => {
                        //        this.permissionsService.addPermission('readStore', () => {
                       //     return true;
                         //  }) 
                    
                        /*  this.store = data ; 
                            console.log(this.store) ; 
                            let admin = false ; 
                             for (let a of this.store.admins  ){
                               if( a.userid == this.me ) {
                                   admin = true ; 
                                   break ; 
                                   }
                               
                               }*/
       
                      /*       if (this.me == this.store.userid ||  admin ) {
                                 
                                    this.permissionsService.addPermission('writeStore', () => {
                                          return true;
                                    })
                    
                                  
                                    this.rolesService.addRole('ADMINStore', ['readStore','writeStore' ]);
                                 
                             }*/
                             
                             
                        //   console.log(this.store) ; 
                        },error => {
                              console.log(error);    
                             
                        });
      
            this.storeService.getStoreStatus( this.storetitle  )
            .subscribe(
                data0 =>{
                    //console.log(data0 ) ; 
                    this.open = data0['open']; 
                    }
                , error0=>{
                    console.log(error0); 
                    }) ; 
        //console.log(this.fragment ) ; 
      
        this.ongoingService.getCountArticlesByStoreId (this.storetitle)
        .subscribe(
            
         data6=>{
             
                this.totalcommand= data6['count'] ; 
                             this.ongoing = true ; 
 
                                 this.maxpage = Math.ceil( this.totalcommand/this.size)  ; 

            console.log(data6);
                this.loading0 = false ;  
         if( this.totalcommand != 0 ) {
                  this.getPage(1)   ;               
                 this.sales=true  ;
          }  else 

                   this.sales = false ; 
    
          },error6 =>{
              this.loading0 = false ; 
                    console.log(error6) ;
                     this.ongoing = false ;  
 
            }
            );
            

      
       });
  }
    
    gotoArticle(id ) {
                 this.router.navigate(["../articles/", id], { relativeTo: this.route });

        }
    
    gotoStore(id ) {
                this.router.navigate(['../store'], { relativeTo: this.route });

        }
    
    gotoUser(id ) {
                this.router.navigate(["../../../home/"+this.me+"/profile/"+id], { relativeTo: this.route });

        }

    prepareDone (id , index , to ){
         this.model[index]['_source']['steps']['prepareloading']=true ; 
       this.model[index]['_source']['steps']['prepareBool'] = true ; 
            let time = new Date ().getTime() ;
            this.ongoingService.putPrepare(id, time ) 
            .subscribe(
                data =>{ //console.log(data) ;
                        this.model[index]['_source']['steps']['prepare'] = new Date (time).toLocaleDateString("it-IT") ;  
                           this.model[index]['_source']['steps']['prepareBool']= false;
                           this.model[index]['_source']['steps']['prepareloading']=false; 
                },
                error => {console.log(error) ; 
                           this.model[index]['_source']['steps']['prepareloading']=false ; 
                })  ;
        
        this.userdetailsService.putNotification(to, id, 'prepare', time, this.storetitle) 
        .subscribe (
                data => { 
                       // console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    });  
              let firebase ="" ; 
              this.userdetailsService.getFirebase(to)
               .subscribe(
                 data=>{
                      console.log(data) ; 
                      firebase = data['firebase']; 
                     this.firebaseService.prepareNotif(firebase, this.storetitle )
                     .subscribe(
                         d=>{
                           console.log(d) ;    
                         },e=>{
                           console.log(e) ; 
                         });
                         
                     
                },error=>{
                       console.log(error ) ; 
                }) ; 
        
        
        
        
    }
    
    
      sendDone (id, index, to   ){
            this.model[index]['_source']['steps']['sendBool'] = true ; 
            this.model[index]['_source']['steps']['sendloading']=true ; 
 
            let time = new Date().getTime() ; 
            this.ongoingService.putSend(id, time ) 
            .subscribe(
                data =>{ //console.log(data) ; 
                this.model[index]['_source']['steps']['send'] =new Date( time ).toLocaleString("fr-FR").replace("à","-"); 
                this.model[index]['_source']['steps']['sendBool'] = false ; 
                this.model[index]['_source']['steps']['sendloading']=false ; 

                }, 
                error => {console.log(error) ; 
                   this.model[index]['_source']['steps']['sendloading']=false; 

                })  ;
              this.userdetailsService.putNotification(to, id, 'send', time, this.storetitle) 
            .subscribe (
                data => { 
                       // console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    });    
          
            let firebase ="" ; 
              this.userdetailsService.getFirebase(to)
               .subscribe(
                 data=>{
                      console.log(data) ; 
                      firebase = data['firebase']; 
                     this.firebaseService.sendNotif(firebase, this.storetitle )
                     .subscribe(
                         d=>{
                           console.log(d) ;    
                         },e=>{
                           console.log(e) ; 
                         });
                         
                     
                },error=>{
                       console.log(error ) ; 
                }) ; 
          
    }
    
    
     
      closeDone (id, index , to  ){
          
            let time = new Date().getTime() ; 
            this.ongoingService.putClose(id, time ) 
            .subscribe(
                data =>{ //console.log(data) ; 
                this.model[index]['_source']['steps']['close'] =new Date( time ).toLocaleString("fr-FR").replace("à","-"); }, 
                error => {console.log(error) ; })  ;
    }

    
   /* 
   litigeDone (id, index  ){
          
            let time = new Date().getTime() ; 
            this.ongoingService.putLitige(id, time ) 
            .subscribe(
                data =>{ console.log(data) ; 
                this.model[index]._source.steps.litige =new Date( time ).toLocaleString("fr-FR").replace("à","-"); }, 
                error => {console.log(error) ; })  ;
    }*/

      sendMessage(i, id,  userid ){
          let time = new Date().getTime() ;
         //this.messagesService.sendMessage({"from": localStorage.getItem('currentUser'), "message": this.model[i].message, "id":id}); 
       
         this.messagesService.putOngoingMessage(id, this.model[i].message)
         .subscribe(
             data =>{    
            // console.log(f) ;     
              
                 this.model[i].message = '' ;  
                  this.isopen["message"+this.model[i]._id] = true ; 
             }
             ,error =>{        
                   console.log(error) ; 
             }) ; 
          
          //add put notification !! 

             this.userdetailsService.putNotification(userid, id, 'message', time, this.storetitle) 
            .subscribe (
                data => { 
                       console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    });  
          
            let firebase ="" ; 
              this.userdetailsService.getFirebase(userid)
               .subscribe(
                 data=>{
                      console.log(data) ; 
                      firebase = data['firebase']; 
                     this.firebaseService.storemessageNotif(firebase, this.storetitle )
                     .subscribe(
                         d=>{
                           console.log(d) ;    
                         },e=>{
                           console.log(e) ; 
                         });
                         
                     
                },error=>{
                       console.log(error ) ; 
                }) ; 

     }
    
  
     
  getPage(page: number) {
    
        this.loading = true;

  this.busy = this.ongoingService.getArticlesByStoreId (this.storetitle, (page-1)*this.size, this.size)
                .subscribe (
          
                data =>{
               
                         this.model= this.model.concat(data) ; 
                        this.loading=false ; 
                        this.page = page ; 
                        this.sales = true ;
                    this.ongoing2 = true ; 
                      //  window.scrollTo(0, 0);

                        //window.scrollTo(200,0);
                       // this.router.navigate(["../", id], { relativeTo: this.route, fragment: 'top'  });


                        console.log(this.model) ; 
                        //console.log(data.length) ; 
                     for( let i  = 0 ; i < this.model.length ; i++ ) {
                  if (! this.model[i]._source.choosenAddress ) 
                     this.model[i]._source.choosenAddress = {} ; 
                       this.isopen["message"+this.model[i]._id] = false ;
 
                       this.userdetailsService.getAvatar(this.model[i]._source.userid)
                       .subscribe( 
                           datan => {
                                 this.avatarlist[this.model[i]._source.userid ] = datan['avatar'] ;  
                        //     console.log(datan) ;    
                           }
                           ,errorn=> {
                                 console.log (errorn ) ;    
                           }
                           );
                         
                         
                       this.userdetailsService.getFullname(this.model[i]._source.userid)
                       .subscribe( 
                           datan => {
                                 this.fullnamelist[this.model[i]._source.userid ] = datan['fullname'] ;  
                        //     console.log(datan) ;    
                           }
                           ,errorn=> {
                                 console.log (errorn ) ;    
                           }
                           );
                  
                    for( let j = 0 ;j < this.model[i]._source.messages.length; j++ ) {
                        //    console.log( JSON.parse(this.model[i]._source.messages[j]) );
                                
                       try{
                      //this.model[i]._source.messages[j] = JSON.parse(this.model[i]._source.messages[j]); 
                         if (! this.avatarlist[this.model[i]._source.messages[j].from ]) {
                           
                       this.userdetailsService.getAvatar(this.model[i]._source.messages[j].from)
                       .subscribe( 
                           data => {
                                 this.avatarlist[this.model[i]._source.messages[j].from ] = data['avatar'] ;  
                        //       console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                      }
                           
                       if (! this.fullnamelist[this.model[i]._source.messages[j].from ]) {
                           
                       this.userdetailsService.getFullname(this.model[i]._source.messages[j].from)
                       .subscribe( 
                           data => {
                                 this.fullnamelist[this.model[i]._source.messages[j].from ] = data['fullname'] ;  
                        //       console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                      }
                           
                     this.model[i]._source.messages[j].date = prettyMs( new Date().getTime() - this.model[i]._source.messages[j].date, {compact: true}  );
                      

                           
                       if (this.model[i]._source.messages[j].from != this.me) 
                            this.model[i]._source.messages[j].fromMe  = false ; 
                       else 
                            this.model[i]._source.messages[j].fromMe = true ; 
                       
                           
                           
                           
                       } catch (error ) {
                         console.log(error) ;   
                        }
                  }
                  
                  this.model[i]._source.steps.prepareBool = false ;  
                    this.model[i]._source.steps.sendBool = false ; 
                  this.model[i]._source.startdate = new Date (this.model[i]._source.startdate).toLocaleString("fr-FR").replace("à","-");
                  if (this.model[i]._source.steps.prepare!=0) 
                  this.model[i]._source.steps.prepare = new Date (this.model[i]._source.steps.prepare).toLocaleString("fr-FR").replace("à","-");
                  if ( this.model[i]._source.steps.send !=0 ) 
                  this.model[i]._source.steps.send = new Date (this.model[i]._source.steps.send).toLocaleString("fr-FR").replace("à","-");
                  if ( this.model[i]._source.steps.receive !=0 ) 
                  this.model[i]._source.steps.receive= new Date (this.model[i]._source.steps.receive).toLocaleString("fr-FR").replace("à","-");
                  if (this.model[i]._source.steps.solvedlitige!=0)
                       this.model[i]._source.steps.solvedlitige = new Date (this.model[i]._source.steps.solvedlitige).toLocaleString("fr-FR").replace("à","-");

                   if (this.model[i]._source.steps.litige!=0)
                       this.model[i]._source.steps.litige = new Date (this.model[i]._source.steps.litige).toLocaleString("fr-FR").replace("à","-");

                   if (this.model[i]._source.steps.close!=0)
                       this.model[i]._source.steps.close = new Date (this.model[i]._source.steps.close).toLocaleString("fr-FR").replace("à","-");

                   if (this.model[i]._source.steps.stop!=0)
                       this.model[i]._source.steps.stop = new Date (this.model[i]._source.steps.stop).toLocaleString("fr-FR").replace("à","-");
 
               
                   let connection = this.messagesService.getOngoingMessages(this.model[i]._id)
                  .subscribe(
                   message => 
                   {
                      // console.log(message) ;
                    this.message = message ; //
                       this.message = JSON.parse(this.message ) ;
                       if(JSON.parse(localStorage.getItem('currentUser')).userid== this.message.from ) 
                           this.message.fromMe= true ; 
                       else 
                           this.message.fromMe= false ;  
                            this.message.new = true ; 
                   //   console.log(message.text ) ; 
                  this.message.date = prettyMs( new Date().getTime() - this.message.date, {compact: true}  );

                     this.model[i]._source.messages.push(this.message);
                     if (!this.avatarlist[this.message.from]) {
                       this.userdetailsService.getAvatar(this.message.from)
                       .subscribe( 
                           data => {
                                this.avatarlist[this.message.from]= data['avatar'] ;  
                               
                               
 
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                          
                         }
                       
                           if (!this.fullnamelist[this.message.from]) {
                       this.userdetailsService.getFullname(this.message.from)
                       .subscribe( 
                           data => {
                                this.fullnamelist[this.message.from]= data['fullname'] ;  
                               
                               
 
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                          
                         }
                   }
                   ,errors =>
                    {
                       console.log(errors) ; 
                    }
                   );  
                  
                  
              for( let j = 0 ;j < this.model[i]._source.articles.length; j++ ) {
                   this.storeService.getPic(this.model[i]._source.articles[j].articleid )
                                    .subscribe(
                                     data4=> {
                                       //   console.log( this.model[i][j] ) ; 
                                        this.model[i]._source.articles[j].pic = data4['pic'];
                                    }, error4 =>{
                                          console.log(error4) ; 
                                    }) ; 
                  
              }
              }
              
            
          },error => {
              console.log(error ) ; 
              this.ongoing = false ; 
              this.loading = false ;
              }
          
      
           ) ;
      
      
   
      
      
}
   getQuery2(event){
         this.router.navigate(["../commands/", this.query ], { relativeTo: this.route });
   }
    enterQuery2(event){
    }
    
 
    _toggleSidebar(){
    this.opened = !this.opened;
  }
  onclose(e){
        
      this.menuhide=false ;   
     }    
  onopen(e){
        this.menuhide= true ;
        }
    
    
   public openDrawer() {
        this.drawer.showDrawer();
    }

    public onCloseDrawerTap() {
        this.drawer.closeDrawer();
    }
    
    


    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    } 
    
       
     public onLoadMoreItemsRequested(args )
    {
     
       console.log('ondemand') ; 
       const listView = args.object;
       this.page+=1;
       if (this.page <=  this.maxpage) {
      
                this.getPage(this.page)  ;
                listView.notifyLoadOnDemandFinished();
          
        } else {
            args.returnValue = false;
            listView.notifyLoadOnDemandFinished(true);
        }
  
   
  //  if (this.sizemsg *this.page < this.countmsg ) 
    
    

}
    
    
    public onItemSelected(args) {
        const listview = args.object;
        const selectedItems = listview.getSelectedItems();
        console.log('selected') ; 
    //   console.log( selectedItems);
    }

    public onItemSelecting(args) {
        console.log('selecting') ;
      // console.log(args) ; 
    
    }
}
