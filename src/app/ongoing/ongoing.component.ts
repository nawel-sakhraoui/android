import { Component, OnInit,ViewChild,ViewContainerRef , ElementRef,AfterViewInit,   AfterViewChecked, AfterContentInit} from '@angular/core';
//import {RatingModalComponent} from './rating-modal.component';
import {FirebaseService, RatingModalService, MessagesService, OngoingService, StoreService, UserdetailsService} from '../_services/index';
import { Router, ActivatedRoute, ParamMap, NavigationEnd  } from '@angular/router';
import {Subscription} from 'rxjs';
import * as prettyMs from 'pretty-ms';
import { filter } from 'rxjs/operators';
 
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import {StopModalComponent} from './stop-modal.component'; 
import {RatingModalComponent} from './rating-modal.component'; 
import * as utils from "utils/utils";

import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label';
import { SearchBar } from "tns-core-modules/ui/search-bar"; 

import * as  clipboard from "nativescript-clipboard" ;
import { Page } from "ui/page"; 
import { Frame, topmost } from "tns-core-modules/ui/frame"; 
import { RadListView, ListViewItemSnapMode } from "nativescript-ui-listview";
 

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.component.html',
  styleUrls: ['./ongoing.component.css']
})
export class OngoingComponent implements OnInit , AfterViewInit{
  
 msgsViews:ElementRef[] ; 
 loading :boolean  ; 
  ongoing :boolean ;    
  model :any =[]; 
  messages = []; 
  connection;
  tempmodel :any = []  ; 
  message:any={} ;
  avatarlist = {};
  fullnamelist = {};
  isopen = {}; 
  fragment :string='' ;
  totalcommand= 0 ; 
  size = 3; 
  page = 1;
  maxpage =1;  
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
  open = false ;
  fullname ="" ; 
  alertM = {} ; 
    loadingM= {};
 
  constructor(private messagesService: MessagesService,
              private ongoingService :OngoingService, 
              private storeService: StoreService, 
              private ratingModalService : RatingModalService,
              private userdetailsService : UserdetailsService,
              private route : ActivatedRoute, 
              private router : Router, 
              private vcRef: ViewContainerRef, 
              private modal: ModalDialogService , 
              private firebaseService: FirebaseService
              ) {
   //   let sub = this.route.fragment.pipe(filter(f => !!f)).subscribe(f => document.getElementById(f).scrollIntoView());
   //   console.log(sub) ; 
 /*  this.router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        let tree = this.router.parseUrl(this.router.url); 
          this.fragment = tree.fragment ; 
       
      }
   });*/
  }
    
  
  
  ngOnInit() {
     
     this.loading = true ; 
   /*    this.router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        let tree = this.router.parseUrl(this.router.url);
          this.fragment = tree.fragment ; 
            if (this.fragment) {
           //   this.isopen[this.fragment] = true ;
                    //  this.ngxAutoScroll.forceScrollDown(); 
           //   let element = document.getElementById(this.fragment);
              console.log(element ) ; 
              if (element) { element.scrollIntoView(); }
             // const collapse =  document.getElementById('collapseOne_' + this.fragment); 
             //     collapse.scrollIntoView(false);
        } 
   
       
      }
             });*/
     
          
          this.userdetailsService.getFullname (this.me)
              .subscribe(
                data=>{
                //   console.log(data) ; 
                    this.fullname = data['fullname']; 
                }
                  
                  ,error=>{})   
       
          this.ongoingService.getCountArticlesByUserId (this.me)
        .subscribe(
            data =>{
                console.log(data) ; 
                this.totalcommand= data['count'] ;
                 this.maxpage = Math.ceil( this.totalcommand/this.size)  ; 

                console.log(this.maxpage );
                 if(this.totalcommand ==  0 ) {
                    this.ongoing = false    ; 
                     this.loading = false ;
                 }else{
                    
                      this.ongoing = true  ; 
                      this.getPage(1)   ;           
                
                }}
            ,error =>{
                console.log(error) ; 
            }) ; 
      }
    
    
    
    getPage (page ) {
        this.loading = true ; 
        this.page = page ;
         this.ongoingService.getArticlesByUserId (this.me, (this.page-1)*this.size, this.size )
         .subscribe (
          
            data =>{
                 this.open = true ;
                 this.tempmodel = data ; 
                // this.model= this.model.concat(data) ; 
                    //  this.page = page ; 
                     //window.scrollTo(0, 0);
                this.loading = false ; 
              for( let i  = 0 ; i < this.tempmodel.length ; i++ ) {
                  this.tempmodel[i].message = ""; 
                  if (! this.tempmodel[i]._source.choosenAddress ) 
              
                   this.tempmodel[i]._source.choosenAddress = {} ; 
                 // console.log();
                  this.isopen["message"+this.tempmodel[i]._id] = false ;
                          this.loadingM[this.tempmodel[i]._id ]= false  ; 
                   for( let j = 0 ; j < this.tempmodel[i]._source.messages.length; j++ ) {
             //    console.log( JSON.parse(this.tempmodel[i]._source.messages[j]) );
                 
                       this.tempmodel[i]._source.messages[j].date =prettyMs( new Date().getTime() -  this.tempmodel[i]._source.messages[j].date, {compact: true}   );

                      // this.tempmodel[i]._source.messages[j] = JSON.parse(this.tempmodel[i]._source.messages[j]); 
                      /*  console.log(this.tempmodel[i]._source.messages[j].from) ; 
                       if (! this.avatarlist[this.tempmodel[i]._source.messages[j].from ]) {
                           
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
                        

                      //  console.log(JSON.parse(localStorage.getItem('currentUser')).userid) ; 
                       if (this.tempmodel[i]._source.messages[j].from == JSON.parse(localStorage.getItem('currentUser')).userid) 
                            this.tempmodel[i]._source.messages[j].fromMe = true ; 
                       else 
                            this.tempmodel[i]._source.messages[j].fromMe = false ; 
                       
                       
                 
                  }
                  
                 // let  options =  {   day: 'numeric', month: 'numeric', year: 'numeric', hour:'2-digit', minute:'2-digit'};

                       this.tempmodel[i]._source.startdate =  this.getLocalDateTime(this.tempmodel[i]._source.startdate); 
                   if (this.tempmodel[i]._source.steps.prepare!=0)
                       this.tempmodel[i]._source.steps.prepare = this.getLocalDateTime( this.tempmodel[i]._source.steps.prepare);//.replace("à","-"); 
                   if (this.tempmodel[i]._source.steps.send!=0)
                       this.tempmodel[i]._source.steps.send = this.getLocalDateTime(this.tempmodel[i]._source.steps.send)//.replace("à","-"); 
                   if (this.tempmodel[i]._source.steps.receive!=0)
                       this.tempmodel[i]._source.steps.receive = this.getLocalDateTime( this.tempmodel[i]._source.steps.receive);//"fr-FR").replace("à","-"); 
                   if (this.tempmodel[i]._source.steps.solvedlitige!=0)
                       this.tempmodel[i]._source.steps.solvedlitige = this.getLocalDateTime(this.tempmodel[i]._source.steps.solvedlitige);//"fr-FR").replace("à","-"); 

                   if (this.tempmodel[i]._source.steps.litige!=0)
                       this.tempmodel[i]._source.steps.litige = this.getLocalDateTime(this.tempmodel[i]._source.steps.litige);//"fr-FR").replace("à","-"); 
                    try {
                   if (this.tempmodel[i]._source.steps.stop!=0)
                       this.tempmodel[i]._source.steps.stop = this.getLocalDateTime(this.tempmodel[i]._source.steps.stop);//"fr-FR").replace("à","-"); 
                    }catch(e) {
                        this.tempmodel[i]._source.steps.stop=0; 
                        }
                   if (this.tempmodel[i]._source.steps.close!=0)
                       this.tempmodel[i]._source.steps.close = this.getLocalDateTime(this.tempmodel[i]._source.steps.close);//"fr-FR").replace("à","-"); 

                this.messagesService.getOngoingMessages(this.tempmodel[i]._id)
                  .subscribe(
                   message0 => 
                   {
                        console.log(message0) ;
                        this.message =message0 ; 
                        this.message = JSON.parse(this.message ) ;
                        if(JSON.parse(localStorage.getItem('currentUser')).userid== this.message.from ) 
                           this.message.fromMe= true ; 
                        else 
                           this.message.fromMe= false ;  
                       
                        this.message.new = true ; 
                        // console.log(message.text ) ; 
                       this.message.date =prettyMs( new Date().getTime() - this.message.date,  {compact: true}  );

                       
                     this.tempmodel[i]._source.messages.push(this.message);
                     /*if (!this.avatarlist[this.message.from]) {
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
                           );}
                       
                   }
                   ,errors =>
                    {
                       console.log(errors) ; 
                    }
                   );
                  //console.log (connection ) ; 
                  
              for( let j = 0 ;j < this.tempmodel[i]._source.articles.length; j++ ) {
                  console.log(this.tempmodel[i]._source.articles) ; 
                   this.storeService.getPic(this.tempmodel[i]._source.articles[j].articleid )
                                    .subscribe(
                                     data4=> {
                                       //   console.log( this.model[i][j] ) ; 
                                        this.tempmodel[i]._source.articles[j].pic = data4['pic'];
                                    }, error4 =>{
                                          console.log(error4) ; 
                                    }) ; 
                  
              }
                     this.tempmodel[i].firebases = [] ; 
           this.storeService.getAdmins(this.tempmodel[i]._source.storetitle)
        .subscribe(
            data0=>{
              
                        let  admins =[ data0['userid'] ] ; 
                       for (let x of data0['administrators']) 
                            admins.push (x.userid);  
      
                    for (let admin of admins){
                         
                            this.userdetailsService.getFirebase(admin)
                            .subscribe(
                                data=>{
                                        console.log(data) ; 
                                       this.tempmodel[i].firebases.push(data['firebase']) ; 
                                      
                         
                     
                            },error=>{
                                      console.log(error ) ; 
                             }) ;
                        
                        }
                
                  }
            ,error0=> {console.log(error0);}  )  
              }
             
                
                
                this.model = this.model.concat(this.tempmodel);
              
              }
          ,error => {
              //this.loading = false 
              console.log(error ) ; 
          //    if (error.status==401){
                  
                  
            //  }
              this.ongoing = false ; 
              this.loading = false ;
              }
          
      
      ) ; 
    
      
      
     /*  if (this.fragment) {
          let element = document.getElementById(this.fragment);
          if (element) { element.scrollIntoView(); }
        }
      
      */
      
  }
  
  ngAfterViewInit() {
      // this.mviews= this.mview.map(view => {
     // return view.nativeElement;
  //  })
      
   
  /*  let interval = setInterval(()=> {
     
           if ( this.fragment) {
           // this.isopen[this.fragment] = true ;
             //this.ngxAutoScroll.forceScrollDown();
            //console.log(this.ngxAutoScroll) ; 
            const element = document.getElementById(this.fragment);
            console.log(element ) ; 
            if (element) {
                 element.scrollIntoView(); 
              clearInterval(interval);
            }
            // const collapse =  document.getElementById('collapseOne_' + this.fragment); 
            //      collapse.scrollIntoView(false);
           }
             
    }, 1000);  */
}
       
   

  
 /*   rating(commandidx) {
    

    this.ratingModalService.rating(this.model[commandidx]);
    //this.history.push(`Mission "${mission}" announced`);
   // if (this.nextMission >= this.missions.length) { this.nextMission = 0; }
  }*/
   
    
    gotoArticle(id, storeid ) {
            this.router.navigate(["../../../stores/"+storeid+"/articles/"+id], { relativeTo: this.route });

        }
    
    gotoStore(id ) {
                this.router.navigate(["../../../stores/"+id+'/store'], { relativeTo: this.route });

        }

        gotoPurchase(id){
                            this.router.navigate(["../purchase/"+id], { relativeTo: this.route });

           }
        
    receiveDone(id , index , storetitle){
                 this.model[index]._source.steps.receiveloading = true ; 
            let time = new Date().getTime() ;
            this.ongoingService.putReceive(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model[index]._source.steps.receive = this.getLocalDateTime(time);   
                             this.model[index]._source.steps.receiveloading = false ; }
               , error => {console.log(error) ; 
                                 this.model[index]._source.steps.receiveloading = false ;
                    })  ;
        
         this.storeService.putNotification( id, 'receive', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid, this.fullname ) 
        .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
        //get store admin and creator 1, get tokens !  send notif ! 
        for (let firebase of this.model[index].firebases) 
               this.firebaseService.receiveNotif( firebase,this.fullname, storetitle)
                .subscribe(
                    data=>{},error=>{}) ; 

        
          
    }
    
    litigeDone (id , index, storetitle ){
           this.model[index]._source.steps.litigeloading = true ; 
            let time = new Date().getTime() ;
            this.ongoingService.putLitige(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model[index]._source.steps.litige = this.getLocalDateTime(time)  ; 
                        this.model[index]._source.steps.litigeloading = false ; 
                }, 
                error => {    console.log(error) ; 
                              this.model[index]._source.steps.litigeloading = false ; 
                    })  ;
        
               this.storeService.putNotification( id, 'litige', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid, this.fullname ) 
                .subscribe (
                data => { 
                        console.log(data)  ; 
                    
                 }
                ,error=>{
                    console.log(error) ; 
                    });      
        
        
        //get store admin and creator 1, get tokens !  send notif ! 
             //get store admin and creator 1, get tokens !  send notif ! 
        for (let firebase of this.model[index].firebases) 
               this.firebaseService.litigeNotif( firebase,this.fullname, storetitle)
                .subscribe(
                    data=>{},error=>{}) ; 

        
    }
  
    stopSend(id, index, storetitle){
       // console.log("stop") ; 
            this.ratingModalService.stop({"id":id, "index":index, "storetitle": storetitle});
              
    }
    closeDone(id , index, storetitle ){
         
        
   
        this.model[index]._source.closeloading = true ; 
            //this.ratingModalService.rating(this.model[index]);
          //  let modal = document.getElementById("modal" ) ;
          //  modal.show() ;  
        this.showRatingModal(this.model[index]);
        
         let time = new Date().getTime() ;
        
           this.ongoingService.putClose(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model[index]._source.steps.close = this.getLocalDateTime(time) ;   
                        this.model[index]._source.closeloading = false ; 
                    // add to the store income
                    let price = this.model[index]._source.totalprice - this.model[index]._source.delivery.price ; 
                    if(this.model[index]._source.steps.litige==0 )   
                    this.storeService.putIncome(storetitle, {'price':price,'total':1,'month': new Date().getMonth(), 'year': new Date().getFullYear()})
                    .subscribe(
                        data3 =>{
                           console.log(data3) ;         
                        }, error3=>{
                            console.log(error3) ;     
                        }
                        )
                    
                },

                error => {console.log(error) ; 
                          this.model[index]._source.closeloading = false ; 

                })  ;
         this.storeService.putNotification( id, 'closed', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid, this.fullname ) 
             .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
        
        //get store admin and creator 1, get tokens !  send notif ! 
          for (let firebase of this.model[index].firebases) 
               this.firebaseService.closeNotif( firebase,this.fullname, storetitle)
                .subscribe(
                    data=>{},error=>{}) ; 
    }
    
    solvedlitigeDone (id , index, storetitle ){
         this.model[index]._source.steps.solvedlitigeloading = true ; 
            let time = new Date().getTime() ;
            this.ongoingService.putSolvedLitige(id, time ) 
            .subscribe(
                data =>{ console.log(data) ; 
                          console.log(time); 
                        this.model[index]._source.steps.solvedlitige = this.getLocalDateTime(time) ; 
                     this.model[index]._source.steps.solvedlitigeloading = false ;
                }, 
                        
                error => {console.log(error) ;
                         this.model[index]._source.steps.solvedlitigeloading = false ; 
                })  ;
               this.storeService.putNotification( id, 'solvedlitige', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid, this.fullname ) 
             .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
        
        //get store admin and creator 1, get tokens !  send notif ! 
          for (let firebase of this.model[index].firebases) 
               this.firebaseService.closelitigeNotif( firebase,this.fullname, storetitle)
                .subscribe(
                    data=>{},error=>{}) ; 
    }
    
    
     sendMessage(i, id, storetitle){
          this.loadingM[this.model[i]._id ]= true ;  
           let time :number = new Date().getTime() ;
         //this.messagesService.sendMessage({"from": localStorage.getItem('currentUser'), "message": this.model[i].message, "id":id}); 
        if( this.model[i].message=='' ){
                  this.alertM['message'+this.model[i]._id ] = true ;  
                  this.loadingM[this.model[i]._id ]= false ;  
         }else {
         
             this.alertM['message'+this.model[i]._id ] = false ;  
         this.messagesService.putOngoingMessage(id, this.model[i].message)
         .subscribe(
             data =>{    
              // this.model[i]._source.messages.push( {'date':'~0s','text': this.model[i].message, 'fromMe':true, })

               this.model[i].message = '' ;
               utils.ad.dismissSoftInput() ;  
                 
               this.isopen["message"+this.model[i]._id] = true  ;
               if ( this.model[i]._source.messages.length >2) {
             
                    let listView: RadListView = <RadListView>(Frame.topmost().currentPage.getViewById(id));
                    setTimeout(()=>{
                       listView.scrollToIndex( this.model[i]._source.messages.length - 1, false, ListViewItemSnapMode.Auto);
                     },500); 
                    }
              this.loadingM[this.model[i]._id ]= false  ;  
             }
             ,error =>{        
                   console.log(error) ; 
                   this.loadingM[this.model[i]._id ]= false  ;  
             }) ; 

         
               this.storeService.putNotification( id, 'message', time, storetitle , this.me, this.fullname ) 
             .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
        
        }
         
         //get store admin and creator 1, get tokens !  send notif ! 
         for (let firebase of this.model[i].firebases) 
               this.firebaseService.usermessageNotif( firebase,this.fullname, storetitle)
                .subscribe(
                    data=>{},error=>{}) ; 
     }
    
     getStop(event) {
     
         
          let stop = event ; 
          this.model[stop.index]._source.steps.stoploading = true ; 
           this.ongoingService.putStop(stop.id, stop.time ) 
            .subscribe(
                data =>{ console.log(data) ; 
                     this.ongoingService.putClose(stop.id, stop.time ) 
                     .subscribe(
                        data =>{ console.log(data) ;
                             this.model[stop.index]._source.steps.close = this.getLocalDateTime(stop.time) ; 
                                          this.model[stop.index]._source.steps.stoploading = false ; 
 
                        }, 
                       error => {console.log(error) ; 
                                          this.model[stop.index]._source.steps.stoploading = false; 
 
                       })      
                    
                    
                        this.model[stop.index]._source.steps.stop = this.getLocalDateTime(stop.time) ; 
                 },error => {
                     console.log(error) ;
                     this.model[stop.index]._source.steps.stoploading = false ; 

                 })  ;
               this.storeService.putNotification( stop.id, 'stop', stop.time, stop.storetitle ,this.me, this.fullname ) 
             .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
                
            //get store admin and creator 1, get tokens !  send notif ! 
         for (let firebase of this.model[stop.index].firebases) 
               this.firebaseService.stopNotif( firebase,this.fullname, stop.storetitle)
                .subscribe(
                    data=>{},error=>{}) ; 
       
         
         
    
    }
    
    
    private  showModal(id, i ,storetitle) {
        let options = {
            context: {},
            fullscreen: false,
            viewContainerRef: this.vcRef
        };
        this.modal.showModal(StopModalComponent, options).then(res => {
            if (res) {
                console.log(res) ;
                let mod = {'id':id, 'index':i, 'storetitle':storetitle, 'time':res.time} ;
                console.log(mod) ; 
                this.getStop(mod);
                }
            
        });
     
    }
    
    
    private  showRatingModal(model) {
    
        let options = {
            context: model,
            fullscreen: false,
            viewContainerRef: this.vcRef
        };
        this.modal.showModal(RatingModalComponent, options).then(res => {
            if (res) {
                console.log(res) ;
          
                }
            
        });
     
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
   
     hide () {
         utils.ad.dismissSoftInput() ;  
   // this.view.nativeElement.dismissSoftInput();
   // this.view.nativeElement.android.clearFocus();
   }
}