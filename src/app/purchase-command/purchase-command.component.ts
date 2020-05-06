
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {PicService, FirebaseService, OngoingService, UserdetailsService, MessagesService  ,RatingModalService,  StoreService } from '../_services/index';
import { Router, ActivatedRoute, ParamMap, NavigationEnd  } from '@angular/router';
import {ArticlePurchase } from '../_models/index'; 
import {Subscription} from 'rxjs';
import * as prettyMs from 'pretty-ms';
 

@Component({
  selector: 'app-purchase-command',
  templateUrl: './purchase-command.component.html',
  styleUrls: ['./purchase-command.component.css']
})
export class  PurchaseCommandComponent implements OnInit {
    query :string=""; 
    alert :boolean;
    alertA= {};
    alert2:boolean; 
    commandid :string ; 
    model :any = {};
    userrating =0;
    articlesrating ={};
    feedback:any ;
    feedbackA={}; 
    avatarlist = {};
    fullnamelist = {}; 
    sales :boolean ; 
    ongoing :boolean  ; 
    isopen =false ;
    fragment :string ="";
    busy : Subscription;  
    nosale= false ; 
    message :any ; 
    me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
    fullname ="" ; 
  constructor(private ongoingService:OngoingService, 
              private router :Router, 
              private route : ActivatedRoute, 
              private userdetailsService : UserdetailsService,
              private messagesService : MessagesService, 
              private storeService : StoreService,
              private  ratingModalService: RatingModalService, 
              private firebaseService: FirebaseService, 
              private picService: PicService) {
      
     this.router.events.subscribe(s => {
       //console.log(s) ; 
      if (s instanceof NavigationEnd) {
       // console.log(s) ; 
        let tree = this.router.parseUrl(this.router.url);
         // console.log(tree) ; 
          this.fragment = tree.fragment ; 
       
      }
   });    
  
  }

    ; 
    
    ngOnInit() {
   
      console.log('commandid') ; 
        let sub = this.route.params.subscribe(params => {
      
        this.commandid = params['commandid'];
      this.router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
       
        let tree = this.router.parseUrl(this.router.url);
          //console.log(tree) ; 
          this.fragment = tree.fragment ; 
           // console.log(this.fragment) ; 
            if (this.fragment=="message") {
              this.isopen = true ;
              let element = document.getElementById(this.fragment);
             // console.log(element ) ; 
              if (element) { element.scrollIntoView(); }
             // const collapse =  document.getElementById('collapseOne_' + this.fragment); 
             //     collapse.scrollIntoView(false);
        } 
   
       
      }
             });
            
            
            
           
          this.userdetailsService.getFullname (this.me)
              .subscribe(
                data=>{
                //   console.log(data) ; 
                    this.fullname = data['fullname']; 
                }
                  
                  ,error=>{}
                  
                  )   
        console.log(this.commandid) ; 
        this.busy = this.ongoingService.getOngoingById(this.commandid)
        .subscribe(
                    _source =>{
                        this.model = _source ; 
                        console.log(this.model) ; 
                        this.sales= true; 
                        this.ongoing = true ; 
                        if (! this.model.choosenAddress ) 
                                this.model.choosenAddress = {} ; 
                        //_source= JSON.parse(_source) ; 
                       // console.log(_source['userid']);
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
                        
                        
                      /*
                       this.userdetailsService.getAvatar(this.model.userid)
                       .subscribe( 
                           datan => {
                                 this.avatarlist[this.model.userid ] = datan['avatar'] ;  
                          console.log(datan) ;    
                           }
                           ,errorn=> {
                                 console.log (errorn ) ;    
                           }
                           );*/
                        
                        this.avatarlist[this.model.userid ] ="";   
                        this.userdetailsService.getProfilePicName(this.model.userid )
                        .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                               this.avatarlist[this.model.userid] = this.picService.getProfileLink (data['profilepicname']) 
                            },error=>{}) ; 
                      
                        
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
                                
    
                        // this.model.messages[j] = JSON.parse(this.model.messages[j]); 
                         if (! this.avatarlist[this.model.messages[j].from ]) {
                             this.avatarlist[this.model.messages[j].from ] ="";   
                        this.userdetailsService.getProfilePicName(this.model.messages[j].from )
                        .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                               this.avatarlist[this.model.messages[j].from ] = this.picService.getProfileLink (data['profilepicname']) 
                        },error=>{}) ; 
                             
                             
                         /* this.userdetailsService.getAvatar(this.model.messages[j].from)
                         .subscribe( 
                           data => {
                                 this.avatarlist[this.model.messages[j].from ] = data['avatar'] ;  
                        //       console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );*/
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
                         /*
                       this.userdetailsService.getAvatar(this.message.from)
                       .subscribe( 
                           data => {
                                this.avatarlist[this.message.from]= data['avatar'] ;  
                               
   
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                          */
                         
                          this.avatarlist[this.message.from ] ="";   
                        this.userdetailsService.getProfilePicName(this.message.from)
                        .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                               this.avatarlist[this.message.from ] = this.picService.getProfileLink (data['profilepicname']) 
                        },error=>{}) ;
                       
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
                  
                  
              for( let j = 0 ;j < this.model.articles.length; j++ ) {
                   /*this.storeService.getPic(this.model.articles[j].articleid )
                                    .subscribe(
                                     data4=> {
                                       //   console.log( this.model[i][j] ) ; 
                                        this.model.articles[j].pic = data4['pic'];
                                    }, error4 =>{
                                          console.log(error4) ; 
                                    }) ; */
                  
                                      this.model.articles[j].pic = this.picService.getPicLink( this.model.articles[j].picname);

                  
              }
              
             this.model.firebases = [] ; 
             this.storeService.getAdmins(this.model.storetitle)
            .subscribe(
               data0=>{
              
                       let  admins =[ data0['userid'] ] ; 
                    if (data0.hasOwnProperty("administrators") ) 
                       for (let x of data0['administrators']) 
                            admins.push (x.userid);  
      
                    for (let admin of admins){
                         
                            this.userdetailsService.getFirebase(admin)
                            .subscribe(
                                data=>{
                                        console.log(data) ; 
                                       this.model.firebases.push(data['firebase']) ; 
                                      
                         
                     
                            },error=>{
                                      console.log(error ) ; 
                             }) ;
                        
                        }
                
                  }
            ,error0=>{  })  
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
             //this.ngxAutoScroll.forceScrollDown();
            //console.log(this.ngxAutoScroll) ; 
            const element = document.getElementById(this.fragment);
            //console.log(element ) ; 
            if (element) {
                 element.scrollIntoView(); 
              clearInterval(interval);
            }
            // const collapse =  document.getElementById('collapseOne_' + this.fragment); 
            //      collapse.scrollIntoView(false);
           }
             
      }, 1000);  
   }
 
    
       gotoArticle(id , storeid) {
                 this.router.navigate(["../../../../stores/"+storeid+"/articles/"+id], { relativeTo: this.route });

        }

    
    gotoStore(id ) {
                this.router.navigate(["../../../../stores/"+id], { relativeTo: this.route });

        }


    
    
          
    receiveDone(id ,  storetitle){
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
          for (let firebase of this.model['firebases']) 
               this.firebaseService.receiveNotif( firebase,this.fullnamelist[this.model.userid ] , storetitle, this.commandid)
                .subscribe(
                    data=>{},error=>{}) ;
          
    }
    
    litigeDone (id ,  storetitle ){
            this.model.steps.litigeloading = true ; 
            let time = new Date().getTime() ;
            this.ongoingService.putLitige(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model.steps.litige = new Date(time).toLocaleString("fr-FR").replace("à","-");
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
        
          for (let firebase of this.model['firebases']) 
               this.firebaseService.litigeNotif( firebase,this.fullnamelist[this.model.userid ] , storetitle, this.commandid)
                .subscribe(
                    data=>{},error=>{}) ;
    }
  
    closeDone(id ,  storetitle ){
        this.model._id = this.commandid ; 
            this.ratingModalService.rating(this.model);
            let modal = document.getElementById("modal" ) ;
          //  modal.show() ;  
            this.model.steps.closeloading = true ;
           let time = new Date().getTime() ;
        
           this.ongoingService.putClose(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model.steps.close = new Date(time).toLocaleString("fr-FR").replace("à","-");
                        this.model.steps.closeloading = false ; 
                      let price = this.model.totalprice - this.model.delivery.price ; 
                    
                    if (    this.model.steps.litige ==0 )
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
          for (let firebase of this.model['firebases']) 
               this.firebaseService.closeNotif( firebase,this.fullnamelist[this.model.userid ] , storetitle, this.commandid)
                .subscribe(
                    data=>{},error=>{}) ;
        
    }
    
    solvedlitigeDone (id ,  storetitle ){
        this.model.steps.solvedlitigeloading = true ; 
            let time = new Date().getTime() ;
            this.ongoingService.putSolvedLitige(id, time ) 
            .subscribe(
                data =>{ console.log(data) ; 
                          console.log(time); 
                        this.model.steps.solvedlitige = new Date(time).toLocaleString("fr-FR").replace("à","-");
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
          for (let firebase of this.model['firebases']) 
               this.firebaseService.closelitigeNotif( firebase,this.fullnamelist[this.model.userid ] , storetitle, this.commandid)
                .subscribe(
                    data=>{},error=>{}) ;
    }
    

      sendMessage( id,  userid , f, storetitle){
          console.log('ici ') ; 
          let time = new Date().getTime() ;
         //this.messagesService.sendMessage({"from": localStorage.getItem('currentUser'), "message": this.model[i].message, "id":id}); 
         console.log(this.model.message) ; 
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
         this.storeService.putNotification( id, 'message', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid, this.fullname ) 
        .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    });   
          
          
          for (let firebase of this.model['firebases']) 
               this.firebaseService.usermessageNotif( firebase,this.fullnamelist[this.model.userid ]  , storetitle, this.commandid)
                .subscribe(
                    data=>{},error=>{}) ;

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
                     }
                    )
       }   else{
             
              console.log('ici') ; 
              this.alert = true ; 
              } 
}
    
  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
} 
  onClickA(event,  id ) {
      console.log(event) ; 
      this.articlesrating[id] = event.rating ; 
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
                 //send to data base !! the rating then close the command then put in archieve 
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
                                 console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
                                 console.log(this.articlesrating[m.articleid ]);
                               this.model.articlesrating[m.articleid ] = this.articlesrating[m.articleid ];

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

 
    stopSend(id, index, storetitle){
         
            this.ratingModalService.stop({"id":id, "index":index, "storetitle": storetitle});
              
    }
    getStop(event) {
        let stop = event ; 
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
               this.storeService.putNotification( this.commandid, 'stop', stop.time, stop.storetitle , JSON.parse(localStorage.getItem('currentUser')).userid, this.fullname ) 
             .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
        
                  for (let firebase of this.model['firebases']) 
               this.firebaseService.usermessageNotif( firebase,this.fullnamelist[this.model.userid ]  , stop.storetitle, this.commandid)
                .subscribe(
                    data=>{},error=>{}) ;
    }

}
    
