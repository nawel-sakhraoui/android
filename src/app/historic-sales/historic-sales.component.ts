import {Component,ViewChild, OnDestroy, OnInit, AfterViewInit,  ChangeDetectorRef, ElementRef } from '@angular/core';

import {PicService, RatingModalService, OngoingService, StoreService, MessagesService, UserdetailsService} from '../_services/index';
import { Router, ActivatedRoute, ParamMap, NavigationEnd   } from '@angular/router';

import {Subscription} from 'rxjs';

import * as prettyMs from 'pretty-ms';

//import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  

import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
    import * as utils from "utils/utils";

import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label';
import { SearchBar } from "tns-core-modules/ui/search-bar"; 
import * as  clipboard from "nativescript-clipboard" ;
import { Frame, topmost } from "tns-core-modules/ui/frame"; 
import { RadListView, ListViewItemSnapMode } from "nativescript-ui-listview";
 import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";

 
@Component({
    selector: 'app-historic-sales',
  templateUrl: './historic-sales.component.html',
  styleUrls: ['./historic-sales.component.css']
})
    
export class  HistoricSalesComponent implements OnInit, AfterViewInit{
    query = ""; 
    
  ongoing = false ;    
  model : any = []; 
    tempmodel:any =[] ; 
  messages = []; 
  connection;
  message;
  avatarlist = {};
  fullnamelist = {} ; 
  rating :any={};
  feedback ={}; 
  alert :any ={};
  alert2 :any =[];
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
  storetitle ="";
    busy:Subscription; 
    totalcommand:number; 
    sales :boolean ; 
    store:any ={};
    page:number=1 ; 
    loading = false ; 
    size = 1; 
    maxpage =1 ;
    
    open:boolean; 
    opened = true ; 
    menuhide = false ; 
    loading0 :boolean ; 
    historic :boolean ; 
    isopen = {} ; 
    loadingR :any = {};
    reload = false ; 
    loadmorebool = false ; 
    @ViewChild(RadSideDrawerComponent, { static: false }) public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;
    
   constructor(private messagesService: MessagesService,
              private ongoingService :OngoingService, 
              private storeService: StoreService, 
              private ratingModalService : RatingModalService,
              private userdetailsService : UserdetailsService,
              private picService : PicService, 
              private route : ActivatedRoute, 
              private router : Router ,
           //   private rolesService:  NgxRolesService , 
           //   private permissionsService : NgxPermissionsService
                private _changeDetectionRef: ChangeDetectorRef
       )  {
  
      
  }
    
  

  ngOnInit() {

      this.init() ;
  }
    
    
    init(){
              this.loading = true ; 
       console.log('store') ; 
        let sub = this.route.params.subscribe(params => {
        console.log (params) ;
        this.storetitle = params['store'];
  
      
     
       this.storeService.getStoreStatus( this.storetitle  )
            .subscribe(
                data0 =>{
                    //console.log(data0 ) ; 
                    this.open = data0['open']; 
                    }
                , error0=>{
                    console.log(error0); 
                    }) ;
      
       this.ongoingService.getCountArticlesByStoreIdClose (this.storetitle)
        .subscribe(
            
       data6=>{
           this.reload = false ; 
                console.log(data6['count']); 
                this.totalcommand= data6['count'] ; 
           
               this.maxpage = Math.ceil( this.totalcommand/this.size)  ;
                 
      if( this.totalcommand != 0 ) {
                this.ongoing = true ; 
               
                 this.getPage(1)   ;  
                if (this.page==this.maxpage)
                         this.loadmorebool = false ; 
                 else 
                         this.loadmorebool = true ;             
          
       }  else 

                       this.ongoing = false ;  
                      this.loading0 = false ;
                      this.historic = true ;

       },error6 =>{
           this.reload = true ; 
                    console.log(error6) ;
                     this.ongoing = false ;  
                    this.loading0 = false ; 
            }
            );
       });
      
      
        
        }
    
 
 /*   rating(commandidx) {
    

    this.ratingModalService.rating(this.model[commandidx]);
    //this.history.push(`Mission "${mission}" announced`);
   // if (this.nextMission >= this.missions.length) { this.nextMission = 0; }
  }*/
   
    
    gotoArticle(id ) {
            this.router.navigate(["../articles/"+id], { relativeTo: this.route });

        }
    
    gotoStore(id ) {
                this.router.navigate(["../stores/"+id], { relativeTo: this.route });

        }

    gotoUser(id ) {
                this.router.navigate(["../../../profile/"+id], { relativeTo: this.route });

        }

   /* receiveDone(id , index , storetitle){
            let time = new Date().getTime() ;
            this.ongoingService.putReceive(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model[index]._source.steps.receive = new Date(time).toLocaleString("fr-FR").replace("à","-");   }, 
                error => {console.log(error) ; })  ;
        
           this.storeService.putNotification( id, 'receive', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid ) 
        .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
        
          
    }
    
    litigeDone (id , index, storetitle ){
            let time = new Date().getTime() ;
            this.ongoingService.putLitige(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model[index]._source.steps.litige = new Date(time).toLocaleDateString("it-IT") ;  }, 
                error => {console.log(error) ; })  ;
        
               this.storeService.putNotification( id, 'litige', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid ) 
                .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    });         
    }
  
    closeDone(id , index, storetitle ){
            this.ratingModalService.rating(this.model[index]);
          //  let modal = document.getElementById("modal" ) ;
          //  modal.show() ;  
        
           let time = new Date().getTime() ;
        
            this.ongoingService.putClose(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model[index]._source.steps.close = new Date(time).toLocaleDateString("it-IT") ;  }, 
                error => {console.log(error) ; })  ;
    }
    
    solvedlitigeDone (id , index, storetitle ){
            let time = new Date().getTime() ;
            this.ongoingService.putSolvedLitige(id, time ) 
            .subscribe(
                data =>{ console.log(data) ; 
                          console.log(time); 
                        this.model[index]._source.steps.solvedlitige = new Date(time).toLocaleDateString("it-IT") ;  }, 
                error => {console.log(error) ; })  ;
               this.storeService.putNotification( id, 'solvedlitige', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid ) 
             .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
    }
    */
    
   /*  sendMessage(i, id, f, storetitle){
           let time = new Date().getTime() ;
         //this.messagesService.sendMessage({"from": localStorage.getItem('currentUser'), "message": this.model[i].message, "id":id}); 
       
         this.messagesService.putOngoingMessage(id, this.model[i].message)
         .subscribe(
             data =>{    
            // console.log(f) ;     
                f.reset();
                 this.model[i].message = '' ;  
             }
             ,error =>{        
                   console.log(error) ; 
             }) ; */

         
       /*        this.storeService.putNotification( id, 'message', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid ) 
        .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
        */

     //}
  /*   onClick(event, articleid){
         console.log(event) ; 
         console.log(articleid ) ; 
         }*/
   

    
        setScore(e,i,id){
            console.log(e.object.get('value')) ; 
            this.model[i].userrating = Number(e.object.get('value'));
             this.alert[id] = false ; 
        }
    
    
    sendRating (command, i) { 
          console.log(command.userrating);
          utils.ad.dismissSoftInput() ; 

          if (command.userrating !=0  ) {
              this.loadingR[command._id] = true ; 
               this.alert[command._id ] = false  ; 
               
                this.userdetailsService.putRating(command._source.userid, command.userrating, command._source.userfeedback ,this.storetitle) 
                .subscribe(
                    data => {
                        console.log(data); 
                        
                this.ongoingService.putRatingUser(command._id, command.userrating, command._source.userfeedback)
                .subscribe(
                    data => {
                        console.log(data) ; 
                        this.model[i]._source.userrating = command.userrating ; 
                                    this.loadingR[command._id] = false ; 
                    },error =>{
                        console.log(error) ; 
                                    this.loadingR[command._id] = false;
                     }
                    )  
                    },error =>{
                                    this.loadingR[command._id] = false ; 
                        console.log(error) ; 
                     }
                    )
       }   else{
              console.log(command._id) ; 
              console.log('ici') ; 
              this.alert[command._id ] = true ; 
              }
}
   
    
   getPage(page: number) {
           console.log(page); 
       
        this.loading = true;
       this.ongoingService.getArticlesByStoreIdClose (this.storetitle,  (page-1)*this.size, this.size )
      .subscribe (
          
          data =>{
                console.log(data ) ; 
                this.tempmodel = data ; 
            ; 
                this.historic = true ;
                this.page = page ; 
                this.sales = true ;
               //   window.scrollTo(0, 0);

              
              if(Object.keys( this.tempmodel).length != 0 ) 
                this.ongoing = true ; 
              else 
                  this.ongoing = false ; 
              
              for( let i  = 0 ; i < this.tempmodel.length ; i++ ) {
                
                 if (! this.tempmodel[i]._source.choosenAddress ) 
                       this.tempmodel[i]._source.choosenAddress = {} ; 
                                   this.tempmodel[i].userrating ="" 
                                //   this.tempmodel[i]._source.userfeedback = "" ;  
                                this.loadingR[this.tempmodel[i]._id] = false ; 
                     
                  
                     this.avatarlist[this.tempmodel[i]._source.userid ] =""
                     this.userdetailsService.getProfilePicName(this.tempmodel[i]._source.userid)
                     .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                               this.avatarlist[this.tempmodel[i]._source.userid] = this.picService.getProfileLink (data['profilepicname']) 
                       },error=>{}) ;
                      /*this.userdetailsService.getAvatar(this.tempmodel[i]._source.userid)
                       .subscribe( 
                           datan => {
                                 this.avatarlist[this.tempmodel[i]._source.userid ] = datan['avatar'] ;  
                                 console.log(datan) ;    
                           }
                           ,errorn=> {
                                 console.log (errorn ) ;    
                           }
                           );*/
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
                  
                  
                  this.isopen["message"+this.tempmodel[i]._id] = false ; 
                // this.tempmodel[i].userrating = this.tempmodel[i]._source.userrating; 
                 //console.log(    this.tempmodel[i].userrating);
                   for( let j = 0 ;j < this.tempmodel[i]._source.messages.length; j++ ) {
             //    console.log( JSON.parse(this.tempmodel[i]._source.messages[j]) );
                
                      // this.tempmodel[i]._source.messages[j] = JSON.parse(this.model[i]._source.messages[j]); 
                    //    console.log(this.tempmodel[i]._source.messages[j].from) ; 
                     /*  if (! this.avatarlist[this.tempmodel[i]._source.messages[j].from ]) {
                           
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
                       if (!this.avatarlist[this.tempmodel[i]._source.messages[j].from]) {
                     this.avatarlist[this.tempmodel[i]._source.messages[j].from] =""
                     this.userdetailsService.getProfilePicName(this.tempmodel[i]._source.messages[j].from)
                     .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                               this.avatarlist[this.tempmodel[i]._source.messages[j].from] = this.picService.getProfileLink (data['profilepicname']) 
                       },error=>{}) ;
                       
                       }
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

                  this.tempmodel[i]._source.messages[j].date =prettyMs( new Date().getTime() -  this.tempmodel[i]._source.messages[j].date , {compact: true} );
                       // console.log(JSON.parse(localStorage.getItem('currentUser')).userid) ; 
                       if (this.tempmodel[i]._source.messages[j].from == this.me) 
                            this.tempmodel[i]._source.messages[j].fromMe = true ; 
                       else 
                            this.tempmodel[i]._source.messages[j].fromMe = false ; 
                       
                       
                   
                  }
                   
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
 
               
                   /*let connection = this.messagesService.getOngoingMessages(this.model[i]._id)
                  .subscribe(
                   message => 
                   {
                       console.log(message) ;
                    this.message =message; // JSON.parse(message ) ;
                       if(JSON.parse(localStorage.getItem('currentUser')).userid== this.message.from ) 
                           this.message.fromMe= true ; 
                       else 
                           this.message.fromMe= false ;  
                       this.message.new = true ; 
                     // console.log(message.text ) ; 
                    this.message.date =prettyMs( new Date().getTime() - this.message.date );

                       
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
                   }
                   ,errors =>
                    {
                       console.log(errors) ; 
                    }
                   );*/
                 // console.log (connection ) ; 
                  
              for( let j = 0 ;j < this.tempmodel[i]._source.articles.length; j++ ) {
                   this.tempmodel[i]._source.articles[j].pic  = this.picService.getPicLink( this.tempmodel[i]._source.articles[j].picname);

                  /* this.storeService.getPic(this.tempmodel[i]._source.articles[j].articleid )
                                    .subscribe(
                                     data4=> {
                                          console.log( this.tempmodel[i][j] ) ; 
                                        this.tempmodel[i]._source.articles[j].pic = data4['pic'];
                                    }, error4 =>{
                                          console.log(error4) ; 
                                    }) ; 
                  */
              }
              }
              console.log('arrivee la') ; 
                
              this.model = this.model.concat(this.tempmodel) ; 
           this.loading = false ; 
          console.log(this.model.length) ; 
         }
          ,error => {
              console.log(error ) ; 
              this.loading = false ; 
              
              this.ongoing = false ; 
              }
          
      
      ) ; 
          
          }
    
    
   /* getQuery2(event){
         
         this.router.navigate(["../commands/", this.query ], { relativeTo: this.route });

    
    }
    enterQuery2(event){
      
    
    }*/
     
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
       
getLocalDateTime(date) {

   date = new Date(date) ; 
  let hours = date.getHours();
  //if (hours < 10) hours = '0' + hours;

  let minutes = date.getMinutes();
  if (minutes < 10) minutes = '0' + minutes;

  //let timeOfDay = hours < 12 ? 'AM' : 'PM';

  return date.getDate() + '/' +  (parseInt(date.getMonth())+1) + '/' +
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
    
getQuery2(event){
            let searchBar = <SearchBar>event.object;
            let query = searchBar.text ; 
        
             if (query!="" ) {
        
                  //     this.router.navigate(["./purchase/"+query], { relativeTo: this.route });
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
    
 
     openMsgs(i, id){
       // let view :Elemen-tRef ; 
       //@ViewChild("msgs"+id, { static: true } )view: ElementRef ; 

         this.isopen['message'+id]= !this.isopen['message'+id]    ;
         if (  this.isopen['message'+id]==true && this.model[i]._source.messages.length >2) {
             
         let listView: RadListView = <RadListView>(Frame.topmost().currentPage.getViewById(id));
           setTimeout(()=>{
          //      let mview:ElementRef;     
         //   @ViewChild(id, { static: false })  mview: ElementRef; 

             listView.scrollToIndex( this.model[i]._source.messages.length - 1, false, ListViewItemSnapMode.Auto);
             },1500); 
       }
     
    }
    
      
    reloading(){   
        console.log('reloading') ; 
        this.init() ; 
  
     } 

 loadmore(){
       
       this.page +=1 ; 
        if (this.page <= this.maxpage) {
            this.getPage(this.page) ;
         }
        if (this.page==this.maxpage){
                this.loadmorebool = false ; 
          }
  }
  ontouch2(args: TouchGestureEventData) {
    const label = <GridLayout>args.object
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
