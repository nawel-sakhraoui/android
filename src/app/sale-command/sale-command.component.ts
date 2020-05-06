import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DeliveryService, PicService,  FirebaseService, OngoingService, UserdetailsService, MessagesService  , StoreService } from '../_services/index';
import { Router, ActivatedRoute, ParamMap, NavigationEnd  } from '@angular/router';
import {ArticlePurchase } from '../_models/index'; 
import {Subscription} from 'rxjs';

import * as prettyMs from 'pretty-ms';

@Component({
  selector: 'app-sale-command',
  templateUrl: './sale-command.component.html',
  styleUrls: ['./sale-command.component.css']
})
export class SaleCommandComponent implements OnInit {
    query :string=""; 
    alert :boolean;
    alert2:boolean; 
    commandid :string ; 
    model :any= {} ;
    userrating =0;
    feedback:any ; 
    avatarlist = {}; 
    fullnamelist = {};
    sales :boolean ; 
    ongoing :boolean  ; 
    isopen =false ;
    message :any = {};
    fragment :string ;
    busy : Subscription;  
    nosale= false ; 
    opened = true ;
    menuhide = false ;  
    storetitle ="" ;
    firebase="" ; 
     me= JSON.parse(localStorage.getItem('currentUser')).userid ; 

    constructor(private ongoingService:OngoingService, 
              private router :Router, 
              private route : ActivatedRoute, 
              private userdetailsService : UserdetailsService,
              private messagesService : MessagesService, 
              private storeService : StoreService, 
              private firebaseService : FirebaseService,
              private picService : PicService, 
              private deliveryService : DeliveryService) {
      
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
   
        console.log('store') ; 
         this.route.params.subscribe(params => {
        console.log (params) ;
        this.storetitle = params['store'];
        })
        
      console.log('commandid') ; 
         this.route.params.subscribe(params => {
        //console.log (params) ;
        this.commandid = params['commandid'];
      this.router.events.subscribe(s => {
           // console.log(s) ; 
      if (s instanceof NavigationEnd) {
         // console.log(s) ; 
        let tree = this.router.parseUrl(this.router.url);
          console.log(tree) ; 
          this.fragment = tree.fragment ; 
           // console.log(this.fragment) ; 
            if (this.fragment) {
              this.isopen = true ;
                    //  this.ngxAutoScroll.forceScrollDown(); 
              let element = document.getElementById(this.fragment);
             // console.log(element ) ; 
              if (element) { element.scrollIntoView(); }
             // const collapse =  document.getElementById('collapseOne_' + this.fragment); 
             //     collapse.scrollIntoView(false);
        } 
   
       
      }
             });
            
            
        this.busy = this.ongoingService.getOngoingById(this.commandid)
                .subscribe(
                    _source =>{
                        this.model = _source ; 
                                  if (! this.model.choosenAddress ) 
                                this.model.choosenAddress = {} ;  
                        console.log(this.model) ; 
                        this.sales= true; 
                        this.ongoing = true ; 
                        //_source= JSON.parse(_source) ; 
                       // console.log(_source['userid']);
                        let val="other" ;  
                        if (this.fragment=="message")
                          val = "message"; 
                       else (this.fragment =='rating') 
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
                       
                
                      /*
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
                            */               
                        
                        
                         this.avatarlist[this.model.userid ] ="";   
                        this.userdetailsService.getProfilePicName(this.model.userid)
                        .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                               this.avatarlist[this.model.userid] = this.picService.getProfileLink (data['profilepicname']) 
                        },error=>{}) 
                        
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
                        
                    for( let j = 0 ;j < this.model.messages.length; j++ ) {
                        //    console.log( JSON.parse(this.model.messages[j]) );
                                
                  
                         if (! this.avatarlist[this.model.messages[j].from ]) {
                           
                       /*  this.userdetailsService.getAvatar(this.model.messages[j].from)
                         .subscribe( 
                           data => {
                                 this.avatarlist[this.model.messages[j].from ] = data['avatar'] ;  
                        //       console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );*/
                                 this.avatarlist[this.model.messages[j].from ] ="";   
                        this.userdetailsService.getProfilePicName(this.model.messages[j].from)
                        .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                               this.avatarlist[this.model.messages[j].from ] = this.picService.getProfileLink (data['profilepicname']) 
                        },error=>{}) ; 
                         }
                           
                           
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
                       
                           
              
                  }
                  
                  this.model.steps.prepareBool = false ;  
                    this.model.steps.sendBool = false ; 
                  this.model.startdate = new Date (this.model.startdate).toLocaleString("fr-FR").replace("à","-"); 
                  if (this.model.steps.prepare!=0) 
                  this.model.steps.prepare = new Date (this.model.steps.prepare).toLocaleString("fr-FR").replace("à","-"); 
                  if ( this.model.steps.send !=0 ) 
                  this.model.steps.send = new Date (this.model.steps.send).toLocaleString("fr-FR").replace("à","-"); 
                  if ( this.model.steps.receive !=0 ) 
                  this.model.steps.receive= new Date (this.model.steps.receive).toLocaleString("fr-FR").replace("à","-"); 
                  if (this.model.steps.solvedlitige!=0)
                       this.model.steps.solvedlitige = new Date (this.model.steps.solvedlitige).toLocaleString("fr-FR").replace("à","-"); 

                   if (this.model.steps.litige!=0)
                       this.model.steps.litige = new Date (this.model.steps.litige).toLocaleString("fr-FR").replace("à","-"); 

                   if (this.model.steps.close!=0)
                       this.model.steps.close = new Date (this.model.steps.close).toLocaleString("fr-FR").replace("à","-"); 

                      if (this.model.steps.stop!=0)
                       this.model.steps.stop = new Date (this.model.steps.stop).toLocaleString("fr-FR").replace("à","-"); 

                     
               
                   let connection = this.messagesService.getOngoingMessages(this.commandid)
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
                     if (!this.avatarlist[this.message.from]) {
                         
                      this.avatarlist[this.message.from ] ="";   
                        this.userdetailsService.getProfilePicName(this.message.from)
                        .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                               this.avatarlist[this.message.from ] = this.picService.getProfileLink (data['profilepicname']) 
                        },error=>{}) ; 
                     /*   this.userdetailsService.getAvatar(this.message.from)
                       .subscribe( 
                           data => {
                                this.avatarlist[this.message.from]= data['avatar'] ;  
                               
                               
 
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );*/
                         
                          
                         }
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
              
                this.userdetailsService.getFirebase(this.model.userid)
                          .subscribe(
                               data=>{
                                 this.firebase = data['firebase']; 
                  
                         
                     
                               },error=>{
                                    console.log(error ) ; 
                                 }) ;  
            }
          
            ,error7=> {
                        this.nosale = true ; 
                        console.log(error7) ; 
                    }) ; 

  });
}
    
    ngAfterViewInit() {
   
       let interval = setInterval(()=> {
     
           if ( this.fragment) {
            this.isopen = true ;
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
             
      }, 1000);  
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
                        this.model.steps.prepare = new Date (time).toLocaleString("fr-FR").replace("à","-"); ;  
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
                this.model.steps.send =new Date( time ).toLocaleString("fr-FR").replace("à","-");  
                this.model.steps.sendBool = false ; 
                this.model.steps.sendloading = false ; 
                    
                       
                this.deliveryService.putOngoingDelivery (id , this.model.delivery.id  , this.storetitle , 
                                    this.model.userid ,time, this.model.totalprice- this.model.delivery.price, this.model.choosenAddress )
                     .subscribe(
                         data0 =>{
                             
                                console.log(data0) ;
                             },error0 =>{
                                console.log(error0) ; 
                             }
                         )
 
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
          
               this.firebaseService.sendNotif(this.firebase, this.model.storetitle, this.commandid )
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

      sendMessage( id,  userid , f){
          let time = new Date().getTime() ;
         //this.messagesService.sendMessage({"from": localStorage.getItem('currentUser'), "message": this.model[i].message, "id":id}); 
       
         this.messagesService.putOngoingMessage(id, this.model.message)
         .subscribe(
             data =>{    
            // console.log(f) ;     
                 this.isopen = true ;
                f.reset();
                 this.model.message = '' ;  
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
        _toggleSidebar() {
    this.opened = !this.opened;
  }
    onclose (e) {
        
      this.menuhide=false ;   
     }    
  onopen (e) {
        this.menuhide= true ;
        }

    
}