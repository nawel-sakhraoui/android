
import { Component, OnInit, OnDestroy } from '@angular/core';
//import {RatingModalComponent} from './rating-modal.component';
import {PicService, RatingModalService, MessagesService, OngoingService, StoreService, UserdetailsService} from '../_services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Subscription} from 'rxjs';
import * as  prettyMs from 'pretty-ms';
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  

@Component({
    selector: 'app-historic-sales',
  templateUrl: './historic-sales.component.html',
  styleUrls: ['./historic-sales.component.css']
})
    
export class  HistoricSalesComponent implements OnInit {
    query = ""; 
    
  ongoing = false ;    
  model : any = []; 
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
    page:number ; 
    loading = false ; 
open:boolean; 
opened = true ; 
    menuhide = false ; 
    loading0 :boolean ; 
    historic :boolean ; 
   constructor(private messagesService: MessagesService,
              private ongoingService :OngoingService, 
              private storeService: StoreService, 
              private ratingModalService : RatingModalService,
              private userdetailsService : UserdetailsService,
              private route : ActivatedRoute, 
              private router : Router ,
              private rolesService:  NgxRolesService , 
              private permissionsService : NgxPermissionsService, 
              private picService :PicService)  {
  
      
  }
    
  

  ngOnInit() {
      this.loading0 = true ; 
       console.log('store') ; 
        let sub = this.route.params.subscribe(params => {
        console.log (params) ;
        this.storetitle = params['store'];
  
      
       this.storeService.getStore( this.storetitle)
                      .subscribe(
                         data => {
                          this.store = data ;
                            this.permissionsService.addPermission('readStore', () => {
                            return true;
                           }) 
                    
                        
                            console.log(this.store) ; 
                            let admin = false ; 
                              if (this.store.hasOwnProperty("administrators") ) 
                             for (let a of this.store.administrators  ){
                               if( a.userid == this.me ) {
                                   admin = true ; 
                                   break ; 
                                   }
                               
                               }
       
                             if (this.me == this.store['userid'] ||  admin ) {
                                 
                                    this.permissionsService.addPermission('writeStore', () => {
                                          return true;
                                    })
                    
                                  
                                    this.rolesService.addRole('ADMINStore', ['readStore','writeStore' ]);
                                 
                             } 
                           console.log(this.store) ; 
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
      
       this.ongoingService.getCountArticlesByStoreIdClose (this.storetitle)
        .subscribe(
            
       data6=>{
                console.log(data6['count']); 
                this.totalcommand= data6['count'] ; 
           
          
                 
      if( this.totalcommand != 0 ) {
                this.ongoing = true ; 
               
          this.getPage(1)   ;               
          
       }  else 

                       this.ongoing = false ;  
                      this.loading0 = false ;
                      this.historic = true ;

       },error6 =>{
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
                this.router.navigate(["../../../home/"+this.me+"/profile/"+id], { relativeTo: this.route });

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
    
     sendMessage(i, id, f, storetitle){
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
             }) ; 

         
       /*        this.storeService.putNotification( id, 'message', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid ) 
        .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
        */

     }
  /*   onClick(event, articleid){
         console.log(event) ; 
         console.log(articleid ) ; 
         }*/
   
  onClick(event, i ,id ) {
      console.log(event) ; 
      this.model[i].userrating = event.rating ; 
       //console.log(id ) ;  
       this.alert[id] = false ; 
      
  }
    
  sendRating (command) { 
           console.log(command.userrating);
          if (command.userrating !=0  ) {
               this.alert[command._id ] = false  ; 
//                 
                this.userdetailsService.putRating(command._source.userid, command.userrating, command._source.feedback ,this.storetitle) 
                .subscribe(
                    data => {
                        console.log(data); 
                        
                            this.ongoingService.putRatingUser(command._id, command.userrating, command._source.userfeedback)
                .subscribe(
                    data => {
                        console.log(data) ; 
                        command._source.userrating = command.userrating ; 
                    },error =>{
                        console.log(error) ; 
                     }
                    )  
                    },error =>{
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
           
        this.loading = true;

         this.busy=  this.ongoingService.getArticlesByStoreIdClose (this.storetitle,  (page-1)*5, 5 )
      .subscribe (
          
          data =>{
               console.log(data ) ; 
              this.model = data ; 
                this.loading=false ; 
              this.loading0 = false ; 
              this.historic = true ;
                        this.page = page ; 
                        this.sales = true ;
                        window.scrollTo(0, 0);

              
              if(Object.keys( this.model).length !== 0 ) 
                this.ongoing = true ; 
              else 
                  this.ongoing = false ; 
              
              for( let i  = 0 ; i < this.model.length ; i++ ) {
                
                            if (! this.model[i]._source.choosenAddress ) 
                     this.model[i]._source.choosenAddress = {} ;  
                     this.avatarlist[this.model[i]._source.userid ] =""
                     this.userdetailsService.getProfilePicName(this.model[i]._source.userid)
                     .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                               this.avatarlist[this.model[i]._source.userid] = this.picService.getProfileLink (data['profilepicname']) 
                       },error=>{}) ;    
                  
                  /* this.userdetailsService.getAvatar(this.model[i]._source.userid)
                       .subscribe( 
                           datan => {
                                 this.avatarlist[this.model[i]._source.userid ] = datan['avatar'] ;  
                             console.log(datan) ;    
                           }
                           ,errorn=> {
                                 console.log (errorn ) ;    
                           }
                           );*/
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
                  
                  
                  
                  this.model[i].userrating = this.model[i]._source.userrating; 
                 console.log(    this.model[i].userrating);
                   for( let j = 0 ;j < this.model[i]._source.messages.length; j++ ) {
             //    console.log( JSON.parse(this.model[i]._source.messages[j]) );
                   try{
                      // this.model[i]._source.messages[j] = JSON.parse(this.model[i]._source.messages[j]); 
                        console.log(this.model[i]._source.messages[j].from) ; 
                       if (! this.avatarlist[this.model[i]._source.messages[j].from ]) {
                           
                        this.avatarlist[this.model[i]._source.messages[j].from] =""
                     this.userdetailsService.getProfilePicName(this.model[i]._source.messages[j].from)
                     .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                               this.avatarlist[this.model[i]._source.messages[j].from] = this.picService.getProfileLink (data['profilepicname']) 
                       },error=>{}) 
                           
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

                       this.model[i]._source.messages[j].date =prettyMs( new Date().getTime() -  this.model[i]._source.messages[j].date , {compact: true} );
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

                   if (this.model[i]._source.steps.close!=0)
                       this.model[i]._source.steps.close = new Date (this.model[i]._source.steps.close).toLocaleString("fr-FR").replace("à","-"); 

                    if (this.model[i]._source.steps.stop!=0)
                       this.model[i]._source.steps.stop = new Date (this.model[i]._source.steps.stop).toLocaleString("fr-FR").replace("à","-"); 

                  
                  /* let connection = this.messagesService.getOngoingMessages(this.model[i]._id)
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
                   );
                  console.log (connection ) ; */
                  
              for( let j = 0 ;j < this.model[i]._source.articles.length; j++ ) {
                                     this.model[i]._source.articles[j].pic  = this.picService.getPicLink( this.model[i]._source.articles[j].picname);

                /*   this.storeService.getPic(this.model[i]._source.articles[j].articleid )
                                    .subscribe(
                                     data4=> {
                                          console.log( this.model[i][j] ) ; 
                                        this.model[i]._source.articles[j].pic = data4['pic'];
                                    }, error4 =>{
                                          console.log(error4) ; 
                                    }) ; */
                  
              }
              }
         }
          ,error => {
              console.log(error ) ; 
              this.loading0 = false ; 
              if (error.status==401){
                  
                  
              }
              this.ongoing = false ; 
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
}