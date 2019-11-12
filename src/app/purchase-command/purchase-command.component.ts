
import { Component, OnInit, AfterViewInit,ViewContainerRef , ViewChild, ElementRef} from '@angular/core';
import { FirebaseService, OngoingService, UserdetailsService, MessagesService  , StoreService } from '../_services/index';
import { Router, ActivatedRoute, ParamMap, NavigationEnd  } from '@angular/router';
    import {Subscription} from 'rxjs';
import * as prettyMs from 'pretty-ms';
 import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import {StopModal2Component} from './stop-modal2.component'; 
import {RatingModal2Component} from './rating-modal2.component'; 

@Component({
  selector: 'app-purchase-command',
  templateUrl: './purchase-command.component.html',
  styleUrls: ['./purchase-command.component.css']
})
export class  PurchaseCommandComponent implements OnInit {
         @ViewChild("msgs", { static: true } ) msgsView: ElementRef; 

        @ViewChild("scrollView", { static: true }) scrollView :ElementRef;
       @ViewChild("message", { static: true } ) messageView: ElementRef; 
        @ViewChild("top", { static: true } ) topView: ElementRef ;
        @ViewChild("rating", { static: true } ) ratingView: ElementRef ;
    query :string=""; 
    alert :boolean;
    alertA= {};
    alert2:boolean; 
    alertM=false ; 
    commandid :string ; 
    model :any = {};
    userrating =0;
    articlesrating ={};
    feedback:any ;
    feedbackA={}; 
    avatarlist = {};
    fullnamelist = {}; 
    sales :boolean ; 
    ongoing :boolean =false  ; 
    isopen =false ;
    fragment :string ="";
    busy : Subscription;  
    nosale= false ; 
    message :any ; 
    me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
    fullname ="" ; 
    delivery = {}; 
    steps = {};
    choosenAddress = {} ; 
    marticlesrating = {}; 
    articles =[] ; 
  constructor(private ongoingService:OngoingService, 
              private router :Router, 
              private route : ActivatedRoute, 
              private userdetailsService : UserdetailsService,
              private messagesService : MessagesService, 
              private storeService : StoreService,
               private vcRef: ViewContainerRef, 
              private modal: ModalDialogService, 
              private firebaseService: FirebaseService ) {
      
     this.router.events.subscribe(s => {
       //console.log(s) ; 
      if (s instanceof NavigationEnd) {
        console.log(s) ; 
        let tree = this.router.parseUrl(this.router.url);
          console.log(tree) ; 
          this.fragment = tree.fragment ; 
          
       
      }
   });    
  
  }

    
    
    ngOnInit() {
   
      console.log('commandid') ; 
        console.log(this.fragment)  ; 
        let sub = this.route.params.subscribe(params => {
      
        this.commandid = params['commandid'];
    
      this.router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
       
          console.log(s) ; 
        let tree = this.router.parseUrl(this.router.url);
          console.log(tree) ; 
          this.fragment = tree.fragment ; 
      
   
       
      }
             });
        this.userdetailsService.getFullname(this.me)
              .subscribe(
                data=>{
                //   console.log(data) ; 
                    this.fullname = data['fullname']; 
                }
                  
                  ,error=>{}
                  
                  )   

       this.ongoingService.getOngoingById(this.commandid)
        .subscribe(
                    _source =>{
                        this.model = _source ; 
                        this.steps = this.model.steps 
                        this.delivery = this.model.delivery; 
                        this.marticlesrating = this.model.articlesrating; 
                        this.articles = this.model.articles
                        if ( this.model.choosenAddress ) 
                             this.choosenAddress =   this.model.choosenAddress; 
           
                        this.sales= true; 
                         
                        if (! this.model.choosenAddress ) 
                                this.model.choosenAddress = {} ; 
                        //_source= JSON.parse(_source) ; 
                       // console.log(_source['userid']);
                        
          // if ( this.fragment=="message") {
           // this.isopen = true ;
               
                   if (this.fragment !="rating") {
                        console.log(this.fragment) ; 
                        //remove store notif 
                        this.userdetailsService.removeNotifByCommandId(this.me, this.commandid , this.fragment )
                        .subscribe(
                            datas =>{
                                console.log(datas) ; 
                                }
                            ,errors =>{
                                console.log(errors);
                                }
                           );
                       
                        }
             //    }     
                       this.userdetailsService.getAvatar(this.model.userid)
                       .subscribe( 
                           datan => {
                                 this.avatarlist[this.model.userid ] = datan['avatar'] ;  
                          console.log(datan) ;    
                           }
                           ,errorn=> {
                                 console.log (errorn ) ;    
                           }
                           );
                        
                         this.userdetailsService.getFullname(this.model.userid)
                       .subscribe( 
                           datan => {
                                 this.fullnamelist[this.model.userid ] = datan['fullname'] ;  
                          console.log(datan) ;    
                           }
                           ,errorn=> {
                                 console.log (errorn ) ;    
                           }
                           );
                  
                    for( let j = 0 ;j < this.model.messages.length; j++ ) {
                        //    console.log( JSON.parse(this.model.messages[j]) );
                                
                       try{
                        // this.model.messages[j] = JSON.parse(this.model.messages[j]); 
                         if (! this.avatarlist[this.model.messages[j].from ]) {
                           
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
                      }
                           
                         if (! this.fullnamelist[this.model.messages[j].from ]) {
                           
                         this.userdetailsService.getFullname(this.model.messages[j].from)
                         .subscribe( 
                           data => {
                                 this.fullnamelist[this.model.messages[j].from ] = data['fullname'] ;  
                        //       console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                      }    
                           
                      this.model.messages[j].date =prettyMs( new Date().getTime() -   this.model.messages[j].date,  {compact: true}   );

                       //this.model.messages[j].date = new Date (this.model.messages[j].date)..toLocaleString("fr-FR").replace("à","-"); 
                        if (this.model.messages[j].from == this.model.userid) 
                            this.model.messages[j].fromMe  = false ; 
                       else 
                            this.model.messages[j].fromMe = true ; 
                       
                           
                           
                           
                       } catch (error ) {
                         console.log(error) ;   
                        }
                  }
                  
                  this.model.steps.prepareBool = false ;  
                    this.model.steps.sendBool = false ; 
                  this.model.startdate = new Date (this.model.startdate).toLocaleString("ar-AR");//"fr-FR").replace("à","-"); 
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

                this.ongoing = true ; 
                let connection = this.messagesService.getOngoingMessages(this.commandid)
                  .subscribe(
                   message0 => 
                   {
                      // console.log(message) ;
                    this.message = message0 ; 
                       this.message = JSON.parse(this.message ) ;
                       if(JSON.parse(localStorage.getItem('currentUser')).userid== this.message.from ) 
                           this.message.fromMe= true ; 
                       else {
                            this.message.fromMe= false ;  
                            this.message.new = true ; 
                           }
                   //this.message.date = new Date (this.message.date)..toLocaleString("fr-FR").replace("à","-"); 
  
                  this.message.date =prettyMs( new Date().getTime() -  this.message.date,  {compact: true}   );

                   //   console.log(message.text ) ; 
                     this.model.messages.push(this.message);
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
                  
                 // console.log(this.model.articles) ; 
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
              
              
            }
          
            ,error7=> {
                        this.nosale = true ; 
                        console.log(error7) ; 
                    }) ; 

  });
}
  
    ngAfterViewInit() {
   
       let interval = setInterval(()=> {
     
           if ( this.fragment=="message") {
                         this.isopen = true ;
                         this.scrollView.nativeElement.scrollToVerticalOffset(this.messageView.nativeElement.getLocationRelativeTo(this.topView.nativeElement).y, false);
 
           }else{
               
              if ( this.fragment=="rating") {
                 this.scrollView.nativeElement.scrollToVerticalOffset(this.ratingView.nativeElement.getLocationRelativeTo(this.topView.nativeElement).y, false);
 
                }   
               
            }
             
      }, 1000);  
   }
 
       
    
    
   gotoArticle(id , storeid) {
                 this.router.navigate(["../../../../stores/"+storeid+"/articles/"+id], { relativeTo: this.route });

        }

    
    gotoStore(id ) {
                this.router.navigate(["../../../../stores/"+id], { relativeTo: this.route });

        }


    
    
          
    receiveDone(id , index , storetitle){
             this.model.steps.receiveloading = true ; 
            let time = new Date().getTime() ;
            this.ongoingService.putReceive(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model.steps.receive = new Date(time).toLocaleString("fr-FR").replace("à","-");  
                             this.model.steps.receiveloading = false ;  }, 
                error => {console.log(error) ; 
                             this.model.steps.receiveloading = false ; })  ;
        
         this.storeService.putNotification( id, 'receive', time, storetitle , this.me, this.fullname ) 
        .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
        
           //get store admin and creator 1, get tokens !  send notif ! 
        this.storeService.getAdmins(storetitle)
        .subscribe(
            data0=>{
                    let admins =[ data0['userid'] ].concat(data0['admins']) ;   
                    for (let admin of admins){
                         let firebase ="" ; 
                            this.userdetailsService.getFirebase(admin)
                            .subscribe(
                                data=>{
                                        console.log(data) ; 
                                        firebase = data['firebase']; 
                                        this.firebaseService.receiveNotif( firebase,this.me, storetitle) 
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
                      
            }
            ,error0=>{})
        
          
    }
    
    litigeDone (id , i,  storetitle ){
            this.model.steps.litigeloading = true ; 
            let time = new Date().getTime() ;
            this.ongoingService.putLitige(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model.steps.litige = new Date(time).toLocaleDateString("it-IT") ; 
                            this.model.steps.litigeloading = false ;  }, 
                error => {console.log(error) ;
                                this.model.steps.litigeloading = false ;  })  ;
        
               this.storeService.putNotification( id, 'litige', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid, this.fullname ) 
                .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    });         
        
           //get store admin and creator 1, get tokens !  send notif ! 
        this.storeService.getAdmins(storetitle)
        .subscribe(
            data0=>{
                    let admins =[ data0['userid'] ].concat(data0['admins']) ;   
                    for (let admin of admins){
                         let firebase ="" ; 
                            this.userdetailsService.getFirebase(admin)
                            .subscribe(
                                data=>{
                                        console.log(data) ; 
                                        firebase = data['firebase']; 
                                        this.firebaseService.litigeNotif( firebase,this.me, storetitle) 
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
                      
            }
            ,error0=>{})
        
    }
  
    closeDone(id ,  storetitle ){
        //this.model._id = this.commandid ; 
        //    this.ratingModalService.rating(this.model);
        //    let modal = document.getElementById("modal" ) ;
          //  modal.show() ;  
          //   this.model[index]._source.closeloading = true ; 
            //this.ratingModalService.rating(this.model[index]);
          //  let modal = document.getElementById("modal" ) ;
          //  modal.show() ;  
        this.showRatingModal(this.model); 
         
          this.model.steps.closeloading = true ;
           let time = new Date().getTime() ;
        
           this.ongoingService.putClose(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model.steps.close = new Date(time).toLocaleDateString("it-IT") ;  
                        this.model.steps.closeloading = false ; 
                      let price = this.model.totalprice - this.model.delivery.price ;   
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
                            this.model.steps.closeloading = false ;  })  ;
         this.storeService.putNotification( id, 'closed', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid, this.fullname ) 
             .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
        
           //get store admin and creator 1, get tokens !  send notif ! 
        this.storeService.getAdmins(storetitle)
        .subscribe(
            data0=>{
                    let admins =[ data0['userid'] ].concat(data0['admins']) ;   
                    for (let admin of admins){
                         let firebase ="" ; 
                            this.userdetailsService.getFirebase(admin)
                            .subscribe(
                                data=>{
                                        console.log(data) ; 
                                        firebase = data['firebase']; 
                                        this.firebaseService.closeNotif( firebase,this.me, storetitle) 
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
                      
            }
            ,error0=>{})
        
    }
    
    solvedlitigeDone (id ,  storetitle ){
        this.model.steps.solvedlitigeloading = true ; 
            let time = new Date().getTime() ;
            this.ongoingService.putSolvedLitige(id, time ) 
            .subscribe(
                data =>{ console.log(data) ; 
                          console.log(time); 
                        this.model.steps.solvedlitige = new Date(time).toLocaleDateString("it-IT") ;
                        this.model.steps.solvedlitigeloading = false ;   }, 
                error => {console.log(error) ;
                            this.model.steps.solvedlitigeloading = false ;  })  ;
               this.storeService.putNotification( id, 'solvedlitige', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid, this.fullname ) 
             .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
        
           //get store admin and creator 1, get tokens !  send notif ! 
        this.storeService.getAdmins(storetitle)
        .subscribe(
            data0=>{
                    let admins =[ data0['userid'] ].concat(data0['admins']) ;   
                    for (let admin of admins){
                         let firebase ="" ; 
                            this.userdetailsService.getFirebase(admin)
                            .subscribe(
                                data=>{
                                        console.log(data) ; 
                                        firebase = data['firebase']; 
                                        this.firebaseService.closelitigeNotif( firebase,this.me, storetitle) 
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
                      
            }
            ,error0=>{})
        
    }
    

    
    
    sendMessage( id, storetitle){
      
        
          let time:number = new Date().getTime() ;
         //this.messagesService.sendMessage({"from": localStorage.getItem('currentUser'), "message": this.model[i].message, "id":id}); 
         if (!this.model.message  ||this.model.message.length==0 ){
                this.alertM = true ;  
         }else {
        
            this.messagesService.putOngoingMessage(id, this.model.message)
            .subscribe(
             data =>{    
            // console.log(f) ;     
                         
                  this.isopen = true ;

                // time =prettyMs( new Date().getTime() - time, {compact: true}   );

                 this.model.messages.push({'text':this.model.message, 'date': time}) ; 
                
                
        
                
                 this.model.message = '' ;  
             }
             ,error =>{        
                   console.log(error) ; 
             }) ; 
          
          //add put notification !! 
          this.storeService.putNotification( id, 'message', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid, this.fullname ) 
          .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    });   
        }
        
           //get store admin and creator 1, get tokens !  send notif ! 
        this.storeService.getAdmins(storetitle)
        .subscribe(
            data0=>{
                    let admins =[ data0['userid'] ].concat(data0['admins']) ;   
                    for (let admin of admins){
                         let firebase ="" ; 
                            this.userdetailsService.getFirebase(admin)
                            .subscribe(
                                data=>{
                                        console.log(data) ; 
                                        firebase = data['firebase']; 
                                        this.firebaseService.usermessageNotif( firebase,this.me, storetitle) 
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
                      
            }
            ,error0=>{})
     }
    
    backToStore () {
                         this.router.navigate(["../../"], { relativeTo: this.route });

        }
    
     onClick(event) {
      console.log(event) ; 
      this.userrating = event.rating ; 
       //console.log(id ) ;  
       this.alert = false ;
      
  }
/*  sendRating () { 
          
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
                     }
                    )
       }   else{
             
              console.log('ici') ; 
              this.alert = true ; 
              } 
}
    */
  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }
    
    
  onClickA(event,  id ) {
      console.log(event) ; 
      this.model.articlesrating[id] = event.rating ; 
       //console.log(id ) ;  
       this.alertA[id] = false ; 
      }
    
    
    
  sendRatingA () { 
         let bool = true ; 
         for (let a of this.model.articles) {
             if (!this.articlesrating.hasOwnProperty(a.articleid))
             {     
                 this.alertA[a.articleid] = true ; 
                 bool = false ; 
             }
             
             else 
                 this.alertA[a.articleid] = false ; 
             
            
           }
             if (bool) {
                 //send to data base !! the rating then close tsthe command then put in archieve 
                 for (let m of this.model.articles){
                 this.storeService.putRating(m.articleid,this.articlesrating[m.articleid ],  
                                             this.me, this.feedbackA[m.articleid] ) 
                 .subscribe(
                     data => {
                         console.log(data) ; 
                         this.storeService.putRatingStore ( this.model.storetitle, this.articlesrating[m.articleid ])
                         .subscribe (
                             data2 =>{
                                 console.log(data2) ;
                                //put rating in ongoing 
                               this.model.articlesrating[m.articleid ] = this.articlesrating[m.articleid ];
                                    this.articlesrating[m.articleid] =  this.articlesrating[m.articleid ];
                             }
                             ,error2 =>{
                                 console.log(error2 ) ; 
                                 })
                      }
                     ,error =>{
                         console.log(error) 
                      })
             
                 }
     this.ongoingService.putAllRatingArticle(this.commandid , this.articlesrating, this.feedbackA )
                                 .subscribe (
                                     data3=> {
                                                
                                        console.log(data3) ;
                                             this.userdetailsService.removeNotifByCommandId(this.me, this.commandid , "rating" )
                                             .subscribe(
                                                  datas =>{
                                                    console.log(datas) ;
                                                       
                                                    }
                                                 ,errors =>{
                                                   console.log(errors);
                                                    }
                                             );    
                                     },
                                     error3=> {
                                        console.log(error3) ; 
                                     }
                                     )
    
         }}

 
    /*stopSend(id, index, storetitle){
         
            this.ratingModalService.stop({"id":id, "index":index, "storetitle": storetitle});
              
    }*/
    getStop(event) {
        let stop = event ;
        console.log(event) ;  
        this.model.steps.stoploading = true ; 
         this.ongoingService.putStop(this.commandid, stop.time ) 
            .subscribe(
                data =>{ console.log(data) ; 
                                   this.ongoingService.putClose(this.commandid, stop.time ) 
                                     .subscribe(
                                       data =>{ console.log(data) ;
                                        this.model.steps.stoploading = false ; 
                                         this.model.steps.close = new Date(stop.time).toLocaleDateString("it-IT") ;  }, 
                                       error => {console.log(error) ; 
                                                this.model.steps.stoploading = false ; 
                                       })  
                        
                        this.model.steps.stop = new Date(stop.time).toLocaleDateString("it-IT") ;  }, 
                error => {console.log(error) ; })  ;
               this.storeService.putNotification( this.commandid, 'stop', stop.time, this.model.storetitle , JSON.parse(localStorage.getItem('currentUser')).userid, this.fullname ) 
             .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
        
           //get store admin and creator 1, get tokens !  send notif ! 
        this.storeService.getAdmins(this.model.storetitle)
        .subscribe(
            data0=>{
                    let admins =[ data0['userid'] ].concat(data0['admins']) ;   
                    for (let admin of admins){
                         let firebase ="" ; 
                            this.userdetailsService.getFirebase(admin)
                            .subscribe(
                                data=>{
                                        console.log(data) ; 
                                        firebase = data['firebase']; 
                                        this.firebaseService.stopNotif( firebase,this.me, this.model.storetitle) 
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
                      
            }
            ,error0=>{})
        
    }

    
     
    private  showModal(id, storetitle) {
        let options = {
            context: {},
            fullscreen: false,
            viewContainerRef: this.vcRef
        };
        this.modal.showModal(StopModal2Component, options).then(res => {
            if (res) {
                console.log(res) ;
                let mod = {'time':res.time} ;
                console.log(mod) ; 
                this.getStop(mod);
                }
            
        });
     
    }
    
    
    private  showRatingModal(model) {
    
        let options = {
            context: {"model":model,"commandid" :this.commandid},
            fullscreen: false,
            viewContainerRef: this.vcRef
        };
        this.modal.showModal(RatingModal2Component, options).then(res => {
            if (res) {
                console.log(res) ;
          
                }
            
        });
     
    }
        setScore(e,id){
        console.log(e.object.get('value')) ; 
        this.articlesrating[id] = Number(e.object.get('value'));
          this.alert[id] = false ; 
       }
     openMsgs(){
        
      
         this.isopen= !this.isopen   ;
            setTimeout(()=>{
                this.msgsView.nativeElement.scrollToVerticalOffset(this.msgsView.nativeElement.scrollableHeight, false);
             },150); 
        
     
    } 
}
    
