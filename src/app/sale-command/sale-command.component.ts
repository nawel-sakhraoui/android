import { Component, OnInit, AfterViewInit, ViewChild, ElementRef,AfterViewChecked } from '@angular/core';
import { FirebaseService,OngoingService, UserdetailsService, MessagesService  , StoreService } from '../_services/index';
import { Router, ActivatedRoute, ParamMap, NavigationEnd  } from '@angular/router';
import * as prettyMs from 'pretty-ms';
import * as utils from "utils/utils";
import { RadListView, ListViewItemSnapMode } from "nativescript-ui-listview";
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label';

import * as  clipboard from "nativescript-clipboard" ;

 
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions'; 

@Component({
  selector: 'app-sale-command',
  templateUrl: './sale-command.component.html',
  styleUrls: ['./sale-command.component.css']
})
export class SaleCommandComponent implements OnInit, AfterViewChecked {
        
   
        @ViewChild("scrollView", { static: true }) scrollView :ElementRef;
        @ViewChild("message", { static: true } ) messageView: ElementRef; 
        @ViewChild("msgs", { static: true } ) msgsView: ElementRef; 
        @ViewChild("top", { static: true } ) topView: ElementRef ;
        @ViewChild("rating", { static: true } ) ratingView: ElementRef ; 
    query :string=""; 
    alert :boolean=false;
    textmessage ="" ; 
    alert2:boolean; 
    commandid :string ; 
    model :any= {'steps':{"stop":0}} ;
    userrating =0;
    feedback:any ; 
    avatarlist :any= {}; 
    fullnamelist:any = {};
    sales :boolean ; 
    ongoing :boolean =false  ; 
    isopen =false ;
    message :any = {};
    fragment :string ;
    nosale= false ; 
    opened = true ;
    menuhide = false ;  
    storetitle ="" ;
    steps:any= {'stop': 0} ;
    delivery:any ={} ;  
    loading:boolean ; 
    choosenAddress:any = {} ; 
    alertM=false ;
    firebase='';
    loadingM=false ; 
    flag= false ; 
    admins :any[] = [] ; 
     me= JSON.parse(localStorage.getItem('currentUser')).userid ; 

    constructor(private ongoingService:OngoingService, 
              private router :Router, 
              private route : ActivatedRoute, 
              private userdetailsService : UserdetailsService,
              private messagesService : MessagesService, 
              private storeService : StoreService, 
              private firebaseService : FirebaseService, 
              private rolesService:  NgxRolesService , 
              private permissionsService : NgxPermissionsService) {
      
   this.router.events.subscribe(s => {
       console.log(s) ; 
      if (s instanceof NavigationEnd) {
        console.log(s) ; 
        let tree = this.router.parseUrl(this.router.url);
          console.log(tree) ; 
          this.fragment = tree.fragment ; 
       
      }
   });    
  
  }

    ; 
    
    ngOnInit() {
        
        this.loading = true ; 
        console.log('commandid') ; 
        this.route.params.subscribe(params => {
        
        console.log (params) ;
        this.commandid = params['commandid'];
            this.route.parent.params.subscribe(parent =>{
                console.log(parent) ; 
                this.storetitle = parent["store"]
            });
        
      this.router.events.subscribe(s => {
           // console.log(s) ; 
      if (s instanceof NavigationEnd) {
         // console.log(s) ; 
        let tree = this.router.parseUrl(this.router.url);
          console.log(tree) ; 
          this.fragment = tree.fragment ; 
           // console.log(this.fragment) ; 
          //  if (this.fragment) {
           //   this.isopen = true ;
                    //  this.ngxAutoScroll.forceScrollDown(); 
           //   let element = document.getElementById(this.fragment);
             // console.log(element ) ; 
             // if (element) { element.scrollIntoView(); }
             // const collapse =  document.getElementById('collapseOne_' + this.fragment); 
             //     collapse.scrollIntoView(false);
        //} 
   
       
      }
             });
        this.storeService.getAdmins(this.storetitle)
            .subscribe(
                data0=>{
                    this.admins =[ data0['userid'] ] ; 
                       for (let x of data0['administrators']) 
                            this.admins.push (x.userid);  
                         if ( this.admins.includes(this.me ) ) {
                                  this.flag = true ; 
                                    this.permissionsService.addPermission('writeStore', () => {
                                          return true;
                                    })
                    
                                  
                                    this.rolesService.addRole('ADMINStore', ['readStore','writeStore' ]);
                             
                             
                                       
      this.ongoingService.getOngoingById(this.commandid)
                .subscribe(
                    _source =>{
                        this.model = _source ; 
                        console.log(this.model.steps) ; 
                        this.steps= this.model.steps ; 
                        this.delivery = this.model.delivery; 
                        
                        if ( this.model.choosenAddress ) 
                             this.choosenAddress =   this.model.choosenAddress; 
                        console.log(this.model) ; 
                        this.sales= true; 
                        //_source= JSON.parse(_source) ; 
                       // console.log(_source['userid']);
                       let val="other" ;  
                        if (this.fragment=="message")
                          val = "message"; 
                       else 
                            if (this.fragment =='rating') 
                                val='rating' ;  
                        
                        console.log(val) ; 
                        //remove store notif 
                       this.storeService.removeNotificationByCommandid(this.model.storetitle, this.commandid , val )
                        .subscribe(
                            datas =>{
                                console.log(datas) ; 
                                }
                            ,errors =>{
                                console.log(errors);
                                }
                           );
                       
                
                      
                       this.userdetailsService.getAvatar(this.model.userid)
                       .subscribe( 
                           datan => {
                                 this.avatarlist[this.model.userid ] = datan['avatar'] ;  
                                console.log(datan) ;    
                           }
                           ,errorn=> {
                                 console.log (errorn) ;    
                           }
                           );
                  
                            this.userdetailsService.getFullname(this.model.userid)
                       .subscribe( 
                           datan => {
                                 this.fullnamelist[this.model.userid ] = datan['fullname'] ;  
                                console.log(datan) ;    
                           }
                           ,errorn=> {
                                 console.log (errorn) ;    
                           }
                           );
                        
                     
                             this.userdetailsService.getFirebase(this.model.userid)
                          .subscribe(
                               data=>{
                                 this.firebase = data['firebase']; 
                  
                         
                     
                               },error=>{
                                    console.log(error ) ; 
                                 }) ; 
        
                        
                for( let j = 0 ;j < this.model.messages.length; j++ ) {
                        //    console.log( JSON.parse(this.model.messages[j]) );
                                
                     //  try{
                     //    this.model.messages[j] = JSON.parse(this.model.messages[j]); 
                         /*if (! this.avatarlist[this.model.messages[j].from ]) {
                           
                         this.userdetailsService.getAvatar(this.model.messages[j].from)
                         .subscribe( 
                           data => {
                                 this.avatarlist[this.model.messages[j].from ] = data['avatar'] ;  
                        //       console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                      }*/
                           
                           
                            if (! this.fullnamelist[this.model.messages[j].from ]) {
                           
                         this.userdetailsService.getFullname(this.model.messages[j].from)
                         .subscribe( 
                           data => {
                               console.log(data) ; 
                                 this.fullnamelist[this.model.messages[j].from ] = data['fullname'] ;  
                        //       console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                      }
                           
                       
                     this.model.messages[j].date = prettyMs( new Date().getTime() - this.model.messages[j].date, {compact: true}  );
             
                        if (this.model.messages[j].from == this.model.userid) 
                            this.model.messages[j].fromMe  = false ; 
                       else 
                            this.model.messages[j].fromMe = true ; 
                       
                           
                           
                           
                 //      } catch (error ) {
                  //       console.log(error) ;   
                   //     }
                  }
                  
                  this.model.steps.prepareBool = false ;  
                    this.model.steps.sendBool = false ; 
                  this.model.startdate = this.getLocalDateTime(this.model.startdate);
                  if (this.model.steps.prepare!=0) 
                  this.model.steps.prepare = this.getLocalDateTime(this.model.steps.prepare); 
                  if ( this.model.steps.send !=0 ) 
                  this.model.steps.send = this.getLocalDateTime(this.model.steps.send); 
                  if ( this.model.steps.receive !=0 ) 
                  this.model.steps.receive=this.getLocalDateTime (this.model.steps.receive); 
                  if (this.model.steps.solvedlitige!=0)
                       this.model.steps.solvedlitige = this.getLocalDateTime (this.model.steps.solvedlitige);

                   if (this.model.steps.litige!=0)
                       this.model.steps.litige = this.getLocalDateTime (this.model.steps.litige); 

                   if (this.model.steps.close!=0)
                       this.model.steps.close = this.getLocalDateTime(this.model.steps.close);

                   if (this.model.steps.stop!=0)
                       this.model.steps.stop = this.getLocalDateTime(this.model.steps.stop); 

                  this.ongoing = true ; 
 
               
                   this.messagesService.getOngoingMessages(this.commandid)
                  .subscribe(
                   message => 
                   {
                      // console.log(message) ;
                    this.message =message ;  
                     this.message = JSON.parse(this.message ) ;
                    this.message.date = prettyMs( new Date().getTime() - this.message.date, {compact: true}  );

                       if(JSON.parse(localStorage.getItem('currentUser')).userid== this.message.from ) 
                           this.message.fromMe= true ; 
                       else 
                           this.message.fromMe= false ;  
                            this.message.new = true ; 
                   //   console.log(message.text ) ; 
                     this.model.messages.push(this.message);
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
                   }
                   ,errors =>
                    {
                       console.log(errors) ; 
                    }
                   );  
                  
                  
              for( let j = 0 ;j < this.model.articles.length; j++ ) {
                   this.storeService.getPic(this.model.articles[j].articleid )
                                    .subscribe(
                                     data4=> {
                                       //   console.log( this.model[i][j] ) ; 
                                        this.model.articles[j].pic = data4['pic'];
                                    }, error4 =>{
                                          console.log(error4) ; 
                                    }) ; 
                  
              }
              this.loading = false ;
              
            }
          
            ,error7=> {
                        this.nosale = true ; 
                        console.log(error7) ; 
                this.loading = false ; 
                    }) ; 
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                                 
                             }else
                                this.permissionsService.removePermission('writeStore');

                              
                },error=>{
                 console.log(error) ;    
                })
  

  });
}
   
      ngAfterViewChecked() {
   
       let interval = setInterval(()=> {
     
           if ( this.fragment=="message") {
                         this.isopen = true ;
                         this.scrollView.nativeElement.scrollToVerticalOffset(this.messageView.nativeElement.getLocationRelativeTo(this.topView.nativeElement)['y'], false);
 
                        this.msgsView.nativeElement.scrollToIndex(this.model.messages.length - 1, false, ListViewItemSnapMode.Auto);

           }else{
               
              if ( this.fragment=="rating") {
                 this.scrollView.nativeElement.scrollToVerticalOffset(this.ratingView.nativeElement.getLocationRelativeTo(this.topView.nativeElement)['y'], false);
 
                }   
               
            }
             
      }, 500);  
          
   }
 
 
    
       gotoArticle(id ) {
                 this.router.navigate(["../../articles/"+id], { relativeTo: this.route });

        }

    
    gotoUser(id ) {
                this.router.navigate(["../../../../home/"+this.me+"/profile/"+id], { relativeTo: this.route });

        }

    prepareDone (id , to ){
       this.model.steps.prepareBool = true ; 
        this.model.steps.prepareloading = true ; 
            let time = new Date ().getTime() ;
            this.ongoingService.putPrepare(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model.steps.prepare = this.getLocalDateTime (time) ;  
                           this.model.steps.prepareBool= false;
                                this.model.steps.prepareloading = false ; 
                },
                error => {console.log(error) ;
                             this.model.steps.prepareloading = false ;  
                })  ;
        
        this.userdetailsService.putNotification(to, id, 'prepare', time, this.model.storetitle) 
        .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    });   
            this.firebaseService.prepareNotif(this.firebase, this.model.storetitle, this.commandid )
                     .subscribe(
                         d=>{
                           console.log(d) ;    
                         },e=>{
                           console.log(e) ; 
                         });
        
    }
    
    
   sendDone (id,  to   ){
                 this.model.steps.sendBool = true ; 
                 this.model.steps.sendloading = true ;
            let time = new Date().getTime() ; 
    this.ongoingService.putSend(id, time ) 
            .subscribe(
                data =>{ //console.log(data) ; 
                this.model.steps.send =this.getLocalDateTime( time );  
                this.model.steps.sendBool = false ; 
                                     this.model.steps.sendloading = false ; 
 
                }, 
                error => {console.log(error) ; 
                         this.model.steps.sendloading = false ; 

                })  ;
              this.userdetailsService.putNotification(to, id, 'send', time, this.model.storetitle) 
            .subscribe (
                data => { 
                       // console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    });    
       
             this.firebaseService.sendNotif(this.firebase, this.model.storetitle , this.commandid)
                     .subscribe(
                         d=>{
                           console.log(d) ;    
                         },e=>{
                           console.log(e) ; 
                         });
    
    }
    
  /*    closeDone (id,  to  ){
          
            let time = new Date().getTime() ; 
            this.ongoingService.putClose(id, time ) 
            .subscribe(
                data =>{ console.log(data) ; 
                this.model.steps.close =new Date( time ).toLocaleString("fr-FR").replace("à","-");  }, 
                error => {console.log(error) ; })  ;
    }

    */
    
   /* litigeDone (id, index  ){
          
            let time = new Date().getTime() ; 
            this.ongoingService.putLitige(id, time ) 
            .subscribe(
                data =>{ console.log(data) ; 
                this.model.steps.litige =new Date( time ).toLocaleString("fr-FR").replace("à","-");  }, 
                error => {console.log(error) ; })  ;
    }*/

 sendMessage( id,  userid ){
     if(this.textmessage==""){  
        this.alertM=true ; 
     }else {
         this.loadingM = true ; 
         this.alertM= false ; 
         let time = new Date().getTime() ;
         //this.messagesService.sendMessage({"from": localStorage.getItem('currentUser'), "message": this.model[i].message, "id":id}); 
       
         this.messagesService.putOngoingMessage(id, this.textmessage)
         .subscribe(
             data =>{    
           //   this.model.messages.push({'text':this.model.message, 'date': time, 'from':this.me}) ; 
                
                   this.textmessage = '' ; 
                 utils.ad.dismissSoftInput() ; 
            // console.log(f) ;     
                 this.isopen = true ;
                //f.reset();
                 this.loadingM=false  ;
                this.msgsView.nativeElement.scrollToIndex(this.model.messages.length-1, false, ListViewItemSnapMode.Auto);

             }
             ,error =>{        
                   console.log(error) ; 
             }) ; 
          
          //add put notification !! 

             this.userdetailsService.putNotification(userid, id, 'message', time, this.model.storetitle) 
            .subscribe (
                data => { 
                        //console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    });  
          
                   this.firebaseService.storemessageNotif(this.firebase, this.model.storetitle, this.commandid )
                     .subscribe(
                         d=>{
                           console.log(d) ;    
                         },e=>{
                           console.log(e) ; 
                         });
              }
         
     }
    backToStore () {
         this.router.navigate(["../../store"], { relativeTo: this.route });

        }
    
     onClick(event) {
      console.log(event) ; 
      this.userrating = event.rating ; 
       //console.log(id ) ;  
       this.alert = false ;
      
  }
    
  sendRating () { 
                  utils.ad.dismissSoftInput() ; 
 
          if (this.userrating !=0  ) {
               this.alert = false  ; 
//                 
                this.userdetailsService.putRating(this.model.userid, this.userrating, this.model.feedback ,this.model.storetitle) 
                .subscribe(
                    data => {
                        console.log(data); 
                        
                   this.ongoingService.putRatingUser(this.commandid, this.userrating, this.model.userfeedback)
                   .subscribe(
                    data => {
                        console.log(data) ; 
                        this.model.userrating = this.userrating ; 
                    },error =>{
                        console.log(error) ; 
                     }
                    )  
                  },error =>{
                        console.log(error) ; 
                 })
       }else{
             
              console.log('ici') ; 
              this.alert = true ; 
       } 
}

 setScore(e,id){
        console.log(e.object.get('value')) ; 
         this.userrating = Number(e.object.get('value'));
          this.alert = false ; 
       }
    
         openMsgs(){
        
      
         this.isopen= !this.isopen   ;
         
         if (this.isopen ) 
            setTimeout(()=>{
                
                      this.scrollView.nativeElement.scrollToVerticalOffset(this.messageView.nativeElement.getLocationRelativeTo(this.topView.nativeElement).y, false);
                      this.msgsView.nativeElement.scrollToIndex(this.model.messages.length - 1, false, ListViewItemSnapMode.Auto);

//                this.msgsView.nativeElement.scrollToVerticalOffset(this.msgsView.nativeElement.scrollableHeight, false);
             },150); 
        
     
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
   
    
}
