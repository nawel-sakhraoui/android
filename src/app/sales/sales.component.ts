import {Component,ViewChild, OnDestroy, OnInit, AfterViewInit,  ChangeDetectorRef, ElementRef } from '@angular/core';

import { FirebaseService, OngoingService, StoreService, MessagesService, UserdetailsService} from '../_services/index';
import { Router, ActivatedRoute, ParamMap, NavigationEnd   } from '@angular/router';
    import * as utils from "utils/utils";

import {Subscription} from 'rxjs';

import * as prettyMs from 'pretty-ms';
import { RadListView, ListViewItemSnapMode } from "nativescript-ui-listview";

import { Frame, topmost } from "tns-core-modules/ui/frame"; 


//import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  

import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label';
import { SearchBar } from "tns-core-modules/ui/search-bar"; 

import * as  clipboard from "nativescript-clipboard" ;

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
 
})
export class SalesComponent implements OnInit, AfterViewInit {
        
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
  size= 3 ;
   maxpage = 1 ; 
   page = 1 ; 
   fragment :string ; 
   menuhide = false ; 
    tempmodel : any= [] ; 
   opened= true ; 
    loading0 = false ; 
    ongoing2 :boolean = false ; ; 
    loadingsale = false ;
    alertM:any={};
    loadingM :any={}; 
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
        let sub = this.route.params.subscribe(params => {
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
                        this.model[index]['_source']['steps']['prepare'] = this.getLocalDateTime(time)  ;  
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
            
                     this.firebaseService.prepareNotif(this.model[index].firebase, this.storetitle, id )
                     .subscribe(
                         d=>{
                           console.log(d) ;    
                         },e=>{
                           console.log(e) ; 
                         });
                         
                     
           
        
        
        
        
    }
    
    
      sendDone (id, index, to   ){
            this.model[index]['_source']['steps']['sendBool'] = true ; 
            this.model[index]['_source']['steps']['sendloading']=true ; 
 
            let time = new Date().getTime() ; 
            this.ongoingService.putSend(id, time ) 
            .subscribe(
                data =>{ //console.log(data) ; 
                this.model[index]['_source']['steps']['send'] =this.getLocalDateTime (time) ; 
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
          
         
                     this.firebaseService.sendNotif(this.model[index].firebase, this.storetitle, id )
                     .subscribe(
                         d=>{
                           console.log(d) ;    
                         },e=>{
                           console.log(e) ; 
                         });
                         
         
          
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
       if(this.model[i]._source.message!="" ){ 
       this.alertM[this.model[i]._id] =false ; 
       this.loadingM [this.model[i]._id] =true ; 
         this.messagesService.putOngoingMessage(this.model[i]._id, this.model[i]._source.message)
         .subscribe(
             data =>{    
            // console.log(f) ;     
              
                 
                   this.isopen["message"+this.model[i]._id] = true  ;
                  this.model[i]._source.message = '' ;  
                 utils.ad.dismissSoftInput() ; ;  
               this.isopen["message"+this.model[i]._id] = true  ;
                    if ( this.model[i]._source.messages.length >2) {
             
                    let listView: RadListView = <RadListView>(Frame.topmost().currentPage.getViewById(id));
                    setTimeout(()=>{
                       listView.scrollToIndex( this.model[i]._source.messages.length - 1, false, ListViewItemSnapMode.Auto);
                     },150); 
                    }
  //             time =prettyMs( new Date().getTime()-time, {compact: true}   );

            //     this.model[i]._source.messages.push({'text':this.model[i].message, 'date': time,'from':this.me}) ; 
               
                 
                    this.userdetailsService.putNotification(userid, id, 'message', time, this.storetitle) 
            .subscribe (
                data => { 
                       console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    });  
          
             this.firebaseService.storemessageNotif(this.model[i].firebase, this.storetitle, id )
                     .subscribe(
                         d=>{
                           console.log(d) ;    
                         },e=>{
                           console.log(e) ; 
                         });

          this.loadingM [this.model[i]._id] =false ; 
                 
             }
             ,error =>{        
                   console.log(error) ; 
                 this.loadingM [this.model[i]._id] =false ; 
             }) ; 
          
          //add put notification !! 
        }else {
           
               this.alertM[this.model[i]._id] =true ; 
           }
          
  } 
  
     
  getPage(page: number) {
    
        this.loading = true;

        this.ongoingService.getArticlesByStoreId (this.storetitle, (page-1)*this.size, this.size)
                .subscribe (
          
                data =>{
               
                        // this.model= this.model.concat(data) ; 
                    this.tempmodel = data ; 
                        this.loading=false ; 
                        this.page = page ; 
                        this.sales = true ;
                    this.ongoing2 = true ; 
                      //  window.scrollTo(0, 0);

                        //window.scrollTo(200,0);
                       // this.router.navigate(["../", id], { relativeTo: this.route, fragment: 'top'  });


                        console.log(this.tempmodel) ; 
                        //console.log(data.length) ; 
                     for( let i  = 0 ; i < this.tempmodel.length ; i++ ) {
                         this.tempmodel[i]._source.message ="";
                  if (! this.tempmodel[i]._source.choosenAddress ) 
                     this.tempmodel[i]._source.choosenAddress = {} ; 
                       this.isopen["message"+this.tempmodel[i]._id] = false ;
                       this.alertM[this.tempmodel[i]._id] = false; 
                       this.loadingM[this.tempmodel[i]._id] = false; 
                         this.userdetailsService.getAvatar(this.tempmodel[i]._source.userid)
                       .subscribe( 
                           datan => {
                                 this.avatarlist[this.tempmodel[i]._source.userid ] = datan['avatar'] ;  
                        //     console.log(datan) ;    
                           }
                           ,errorn=> {
                                 console.log (errorn ) ;    
                           }
                           );
                         
                         
                       this.userdetailsService.getFullname(this.tempmodel[i]._source.userid)
                       .subscribe( 
                           datan => {
                                 this.fullnamelist[this.tempmodel[i]._source.userid ] = datan['fullname'] ;  
                        //     console.log(datan) ;    
                           }
                           ,errorn=> {
                                 console.log (errorn ) ;    
                           }
                           );
                  
                    for( let j = 0 ;j < this.tempmodel[i]._source.messages.length; j++ ) {
                        //    console.log( JSON.parse(this.tempmodel[i]._source.messages[j]) );
                                
                     //  try{
                      //this.tempmodel[i]._source.messages[j] = JSON.parse(this.tempmodel[i]._source.messages[j]); 
                        /* if (! this.avatarlist[this.tempmodel[i]._source.messages[j].from ]) {
                           
                       this.userdetailsService.getAvatar(this.tempmodel[i]._source.messages[j].from)
                       .subscribe( 
                           data => {
                                 this.avatarlist[this.tempmodel[i]._source.messages[j].from ] = data['avatar'] ;  
                        //       console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                      }*/
                           
                       if (! this.fullnamelist[this.tempmodel[i]._source.messages[j].from ]) {
                           
                       this.userdetailsService.getFullname(this.tempmodel[i]._source.messages[j].from)
                       .subscribe( 
                           data => {
                                 this.fullnamelist[this.tempmodel[i]._source.messages[j].from ] = data['fullname'] ;  
                        //       console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                      }
                           
                     this.tempmodel[i]._source.messages[j].date = prettyMs( new Date().getTime() - this.tempmodel[i]._source.messages[j].date, {compact: true}  );
                      

                           
                       if (this.tempmodel[i]._source.messages[j].from != this.me) 
                            this.tempmodel[i]._source.messages[j].fromMe  = false ; 
                       else 
                            this.tempmodel[i]._source.messages[j].fromMe = true ; 
                       
                           
                           
                           
                    //   } catch (error ) {
                      //   console.log(error) ;   
                        //}
                  }
                  
                  this.tempmodel[i]._source.steps.prepareBool = false ;  
                    this.tempmodel[i]._source.steps.sendBool = false ; 
                  this.tempmodel[i]._source.startdate = this.getLocalDateTime(this.tempmodel[i]._source.startdate);;
                  if (this.tempmodel[i]._source.steps.prepare!=0) 
                  this.tempmodel[i]._source.steps.prepare = this.getLocalDateTime(this.tempmodel[i]._source.steps.prepare) ; 
                  if ( this.tempmodel[i]._source.steps.send !=0 ) 
                  this.tempmodel[i]._source.steps.send = this.getLocalDateTime(this.tempmodel[i]._source.steps.send);
                  if ( this.tempmodel[i]._source.steps.receive !=0 ) 
                  this.tempmodel[i]._source.steps.receive= this.getLocalDateTime(this.tempmodel[i]._source.steps.receive);
                  if (this.tempmodel[i]._source.steps.solvedlitige!=0)
                       this.tempmodel[i]._source.steps.solvedlitige = this.getLocalDateTime(this.tempmodel[i]._source.steps.solvedlitige);

                   if (this.tempmodel[i]._source.steps.litige!=0)
                       this.tempmodel[i]._source.steps.litige = this.getLocalDateTime(this.tempmodel[i]._source.steps.litige);

                   if (this.tempmodel[i]._source.steps.close!=0)
                       this.tempmodel[i]._source.steps.close = this.getLocalDateTime(this.tempmodel[i]._source.steps.close);

                   if (this.tempmodel[i]._source.steps.stop!=0)
                       this.tempmodel[i]._source.steps.stop = this.getLocalDateTime(this.tempmodel[i]._source.steps.stop);
 
      
                          
              this.userdetailsService.getFirebase(this.tempmodel[i]._source.userid)
               .subscribe(
                 data=>{
                      console.log(data) ; 
                     this.tempmodel[i].firebase   = data['firebase']; 
                   
                         
                     
                },error=>{
                       console.log(error ) ; 
                }) ; 
                   let connection = this.messagesService.getOngoingMessages(this.tempmodel[i]._id)
                  .subscribe(
                   message => 
                   {
                      // console.log(message) ;
                    this.message = message ; //
                        console.log("aaaaa" ) ; 
                       console.log(this.message ) ; 
                       this.message = JSON.parse(this.message ) ;
                       if(JSON.parse(localStorage.getItem('currentUser')).userid== this.message.from ) 
                           this.message['fromMe']= true ; 
                       else 
                           this.message.fromMe= false ;  
                            this.message.new = true ; 
                   //   console.log(message.text ) ; 
                  this.message.date = prettyMs( new Date().getTime() - this.message.date, {compact: true}  );

                     this.tempmodel[i]._source.messages.push(this.message);
                   /* if (!this.avatarlist[this.message.from]) {
                       this.userdetailsService.getAvatar(this.message.from)
                       .subscribe( 
                           data => {
                                this.avatarlist[this.message.from]= data['avatar'] ;  
                               
                               
 
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                          
                         }*/
                       
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
                  
                  
              for( let j = 0 ;j < this.tempmodel[i]._source.articles.length; j++ ) {
                   this.storeService.getPic(this.tempmodel[i]._source.articles[j].articleid )
                                    .subscribe(
                                     data4=> {
                                       //   console.log( this.tempmodel[i][j] ) ; 
                                        this.tempmodel[i]._source.articles[j].pic = data4['pic'];
                                    }, error4 =>{
                                          console.log(error4) ; 
                                    }) ; 
                  
              }
              }
                            this.model = this.model.concat(this.tempmodel );//.map(x=>x) ; 

            
          },error => {
              console.log(error ) ; 
              this.ongoing = false ; 
              this.loading = false ;
              }
          
      
           ) ;
      
      
   
      
      
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
     //  const listview = args.object;
     //   const selectedItems = listview.getSelectedItems();
        console.log('selected') ; 
    //   console.log( selectedItems);
    }

    public onItemSelecting(args) {
        console.log('selecting') ;
      // console.log(args) ; 
    
    }
    
    
getLocalDateTime(date) {

   date = new Date(date) ; 
  let hours = date.getHours();
  //if (hours < 10) hours = '0' + hours;

  let minutes = date.getMinutes();
  if (minutes < 10) minutes = '0' + minutes;

  //let timeOfDay = hours < 12 ? 'AM' : 'PM';

  return date.getMonth() + '/' + date.getDate() + '/' +
         date.getFullYear() + ', ' + hours + ':' + minutes 
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
    
ontouch3(args: TouchGestureEventData) {
    const label = <Label>args.object
    switch (args.action) {
        case 'up':
            label.deletePseudoClass("pressed3");
            break;
        case 'down':
            label.addPseudoClass("pressed3");
            break;
    }
   
}
 
    
        getQuery2(event){
            let searchBar = <SearchBar>event.object;
            let query = searchBar.text ; 
        
             if (query!="" ) {
        
                       this.router.navigate(["./purchase/"+query], { relativeTo: this.route });
                                 this.router.navigate(["../commands/", query ], { relativeTo: this.route });

                //  this.selectArticles=  this.articles.filter(function(element){console.log(element['_source']['title']) ; return element['_source']['title'].includes(q);});
             }   
  
      }
    
     selectText(args) {
          const label = <Label>args.object
    switch (args.action) {
        case 'up':
            label.deletePseudoClass("selected");
            break;
        case 'down':
            label.addPseudoClass("selected");
            break;
    }
         let text = args.object.text;  
         clipboard.setText( text ).then(function() {
                 console.log("OK, copied to the clipboard");
            });
         
 
     }
hide(){
                     utils.ad.dismissSoftInput() ; 

   }
    
      openMsgs(i, id){
       // let view :ElementRef ; 
       //@ViewChild("msgs"+id, { static: true } )view: ElementRef ; 

         this.isopen['message'+id]= !this.isopen['message'+id]    ;
         if (  this.isopen['message'+id]==true && this.model[i]._source.messages.length >2) {
             
         let listView: RadListView = <RadListView>(Frame.topmost().currentPage.getViewById(id));
           setTimeout(()=>{
          //      let mview:ElementRef;     
         //   @ViewChild(id, { static: false })  mview: ElementRef; 

             listView.scrollToIndex( this.model[i]._source.messages.length - 1, false, ListViewItemSnapMode.Auto);
             },150); 
       }
     
    }
}
