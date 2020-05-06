import { Component, OnInit,ViewChild ,  AfterViewInit , AfterViewChecked, AfterContentInit} from '@angular/core';
import {RatingModalComponent} from './rating-modal.component';
import {FirebaseService, RatingModalService, MessagesService, OngoingService, StoreService, UserdetailsService, PicService} from '../_services/index';
import { Router, ActivatedRoute, ParamMap, NavigationEnd  } from '@angular/router';
import {ArticlePurchase } from '../_models/index'; 
import {Subscription} from 'rxjs';
import * as prettyMs from 'pretty-ms';
import { filter } from 'rxjs/operators';
 
@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.component.html',
  styleUrls: ['./ongoing.component.css']
})
export class OngoingComponent implements OnInit , AfterViewInit {
 loading :boolean  ; 
  busy :Subscription; 
  ongoing :boolean ;    
  model :any =[]; 
  messages = []; 
  connection;
  message:any={} ;
  avatarlist = {};
  fullnamelist = {};
  isopen = {}; 
  fragment :string='' ;
  totalcommand= 0 ; 
    size = 5 ; 
    page = 0; 
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
 open = false ;
    fullname ="" ; 
  constructor(private messagesService: MessagesService,
              private ongoingService :OngoingService, 
              private storeService: StoreService, 
              private ratingModalService : RatingModalService,
              private userdetailsService : UserdetailsService,
              private route : ActivatedRoute, 
              private router : Router, 
              private firebaseService: FirebaseService , 
              private picService :PicService) {
   //   let sub = this.route.fragment.pipe(filter(f => !!f)).subscribe(f => document.getElementById(f).scrollIntoView());
   //   console.log(sub) ; 
   this.router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        let tree = this.router.parseUrl(this.router.url); 
          this.fragment = tree.fragment ; 
       
      }
   });
  }
    
  
  
  ngOnInit() {
     
     this.loading = true ; 
       this.router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        let tree = this.router.parseUrl(this.router.url);
          this.fragment = tree.fragment ; 
            if (this.fragment) {
           //   this.isopen[this.fragment] = true ;
                    //  this.ngxAutoScroll.forceScrollDown(); 
              let element = document.getElementById(this.fragment);
              console.log(element ) ; 
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
       
          this.ongoingService.getCountArticlesByUserId (this.me)
        .subscribe(
            data =>{
                console.log(data) ; 
                this.totalcommand= data['count'] ;
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
         this.busy = this.ongoingService.getArticlesByUserId (this.me, (page-1)*this.size, this.size )
         .subscribe (
          
            data =>{
                 this.open = true ; 
                 console.log(data ) ; 
                 this.model = data ; 
                      this.page = page ; 
                     window.scrollTo(0, 0);
                this.loading = false ; 
              for( let i  = 0 ; i < this.model.length ; i++ ) {
                  if (! this.model[i]._source.choosenAddress ) 
                   this.model[i]._source.choosenAddress = {} ; 
                 // console.log();
                  this.isopen["message"+this.model[i]._id] = false ;
                
                   for( let j = 0 ;j < this.model[i]._source.messages.length; j++ ) {
             //    console.log( JSON.parse(this.model[i]._source.messages[j]) );
                   try{
                      // this.model[i]._source.messages[j] = JSON.parse(this.model[i]._source.messages[j]); 
                        console.log(this.model[i]._source.messages[j].from) ; 
                       if (! this.avatarlist[this.model[i]._source.messages[j].from ]) {
                           
                           this.avatarlist[this.model[i]._source.messages[j].from ]  =""
                     this.userdetailsService.getProfilePicName(this.model[i]._source.messages[j].from)
                     .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                                this.avatarlist[this.model[i]._source.messages[j].from ] = this.picService.getProfileLink (data['profilepicname']) 
                       },error=>{}) ; 
                       
                           
                     /*  this.userdetailsService.getAvatar(this.model[i]._source.messages[j].from)
                       .subscribe( 
                           data => {
                                 this.avatarlist[this.model[i]._source.messages[j].from ] = data['avatar'] ;  
                        //       console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );*/
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
                        

                       this.model[i]._source.messages[j].date =prettyMs( new Date().getTime() -  this.model[i]._source.messages[j].date, {compact: true}   );
                        console.log(JSON.parse(localStorage.getItem('currentUser')).userid) ; 
                       if (this.model[i]._source.messages[j].from == JSON.parse(localStorage.getItem('currentUser')).userid) 
                            this.model[i]._source.messages[j].fromMe = true ; 
                       else 
                            this.model[i]._source.messages[j].fromMe = false ; 
                       
                       
                       } catch (error ) {
                         console.log(error) ;   
                        }
                  }
                       this.model[i]._source.startdate = new Date (this.model[i]._source.startdate).toLocaleString("fr-FR").replace("à","-"); 
                   if (this.model[i]._source.steps.prepare!=0)
                       this.model[i]._source.steps.prepare = new Date (this.model[i]._source.steps.prepare).toLocaleString("fr-FR").replace("à","-"); 
                   if (this.model[i]._source.steps.send!=0)
                       this.model[i]._source.steps.send = new Date (this.model[i]._source.steps.send).toLocaleString("fr-FR").replace("à","-"); 
                   if (this.model[i]._source.steps.receive!=0)
                       this.model[i]._source.steps.receive = new Date (this.model[i]._source.steps.receive).toLocaleString("fr-FR").replace("à","-"); 
                   if (this.model[i]._source.steps.solvedlitige!=0)
                       this.model[i]._source.steps.solvedlitige = new Date (this.model[i]._source.steps.solvedlitige).toLocaleString("fr-FR").replace("à","-"); 

                   if (this.model[i]._source.steps.litige!=0)
                       this.model[i]._source.steps.litige = new Date (this.model[i]._source.steps.litige).toLocaleString("fr-FR").replace("à","-"); 
                    try {
                   if (this.model[i]._source.steps.stop!=0)
                       this.model[i]._source.steps.stop = new Date (this.model[i]._source.steps.stop).toLocaleString("fr-FR").replace("à","-"); 
                    }catch(e) {
                        this.model[i]._source.steps.stop=0; 
                        }
                   if (this.model[i]._source.steps.close!=0)
                       this.model[i]._source.steps.close = new Date (this.model[i]._source.steps.close).toLocaleString("fr-FR").replace("à","-"); 

                   let connection = this.messagesService.getOngoingMessages(this.model[i]._id)
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

                       
                     this.model[i]._source.messages.push(this.message);
                     if (!this.avatarlist[this.message.from]) {
                         
                         this.avatarlist[this.message.from] ="";   
                        this.userdetailsService.getProfilePicName(this.message.from)
                        .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                               this.avatarlist[this.message.from] = this.picService.getProfileLink (data['profilepicname']) 
                        },error=>{}) ; 
                       
                       /*this.userdetailsService.getAvatar(this.message.from)
                       .subscribe( 
                           data => {
                                this.avatarlist[this.message.from]= data['avatar'] ;  
                               
                               
 
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );*/
                          
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
                           );}
                       
                   }
                   ,errors =>
                    {
                       console.log(errors) ; 
                    }
                   );
                  console.log (connection ) ; 
                  
              for( let j = 0 ;j < this.model[i]._source.articles.length; j++ ) {
                  
                                   this.model[i]._source.articles[j].pic  = this.picService.getPicLink( this.model[i]._source.articles[j].picname);
 
                 /*  this.storeService.getPic(this.model[i]._source.articles[j].articleid )
                   .subscribe(
                             data4=> {
                                       //   console.log( this.model[i][j] ) ; 
                                        this.model[i]._source.articles[j].pic = data4['pic'];
                             }, error4 =>{
                                          console.log(error4) ; 
                                    }) ; */
                  
              }
                  
                   this.model[i].firebases = [] ; 
           this.storeService.getAdmins(this.model[i]._source.storetitle)
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
                                       this.model[i].firebases.push(data['firebase']) ; 
                                      
                         
                     
                            },error=>{
                                      console.log(error ) ; 
                             }) ;
                        
                        }
                
                  })
              }
              
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
   
    let interval = setInterval(()=> {
     
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
             
    }, 1000);  
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
                        this.model[index]._source.steps.receive = new Date(time).toLocaleString("fr-FR").replace("à","-");   
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
        
            for (let firebase of this.model[index].firebases) 
               this.firebaseService.receiveNotif( firebase,this.fullname, storetitle, id)
                .subscribe(
                    data=>{},error=>{}) ; 
    }
    
    litigeDone (id , index, storetitle ){
           this.model[index]._source.steps.litigeloading = true ; 
            let time = new Date().getTime() ;
            this.ongoingService.putLitige(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model[index]._source.steps.litige = new Date(time).toLocaleString("fr-FR").replace("à","-"); 
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
        
               for (let firebase of this.model[index].firebases) 
                   this.firebaseService.litigeNotif( firebase,this.fullname, storetitle,id)
                  .subscribe(
                    data=>{},error=>{}) ; 
    }
  
    stopSend(id, index, storetitle){
        
            this.ratingModalService.stop({"id":id, "index":index, "storetitle": storetitle});
              
    }
    closeDone(id , index, storetitle ){
               this.model[index]._source.closeloading = true ; 
            this.ratingModalService.rating(this.model[index]);
          //  let modal = document.getElementById("modal" ) ;
          //  modal.show() ;  
        
           let time = new Date().getTime() ;
        
           this.ongoingService.putClose(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model[index]._source.steps.close = new Date(time).toLocaleString("fr-FR").replace("à","-");  ;   
                        this.model[index]._source.closeloading = false ; 
                    // add to the store income
                    let price = this.model[index]._source.totalprice - this.model[index]._source.delivery.price ;   
                    
                     if (this.model[index]._source.steps.litige==0 )  
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
        
          for (let firebase of this.model[index].firebases) 
               this.firebaseService.closeNotif( firebase,this.fullname, storetitle, id)
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
                        this.model[index]._source.steps.solvedlitige = new Date(time).toLocaleDateString("it-IT") ; 
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
        
          for (let firebase of this.model[index].firebases) 
               this.firebaseService.closelitigeNotif( firebase,this.fullname, storetitle, id)
                .subscribe(
                    data=>{},error=>{}) ; 
    }
    
    
     sendMessage(i, id, f, storetitle){
           let time = new Date().getTime() ;
         //this.messagesService.sendMessage({"from": localStorage.getItem('currentUser'), "message": this.model[i].message, "id":id}); 
       
         this.messagesService.putOngoingMessage(id, this.model[i].message)
         .subscribe(
             data =>{    
            // console.log(f) ;     
                 this.isopen["message"+this.model[i]._id] = true  ;

                f.reset();
                 this.model[i].message = '' ;  
             }
             ,error =>{        
                   console.log(error) ; 
             }) ; 

         
               this.storeService.putNotification( id, 'message', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid, this.fullname ) 
        .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
          for (let firebase of this.model[i].firebases) 
               this.firebaseService.usermessageNotif( firebase,this.fullname, storetitle, id)
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
                             this.model[stop.index]._source.steps.close = new Date(stop.time).toLocaleDateString("it-IT") ; 
                                          this.model[stop.index]._source.steps.stoploading = false ; 
 
                        }, 
                       error => {console.log(error) ; 
                                          this.model[stop.index]._source.steps.stoploading = false; 
 
                       })      
                    
                    
                        this.model[stop.index]._source.steps.stop = new Date(stop.time).toLocaleDateString("it-IT") ;  }, 
                error => {console.log(error) ; })  ;
               this.storeService.putNotification( stop.id, 'stop', stop.time, stop.storetitle , JSON.parse(localStorage.getItem('currentUser')).userid, this.fullname ) 
             .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
       
             for (let firebase of this.model[stop.index].firebases) 
               this.firebaseService.stopNotif( firebase,this.fullname, stop.storetitle, stop.id )
                .subscribe(
                    data=>{},error=>{}) ; 
       
       
    }
}
