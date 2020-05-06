import { Component, OnInit, OnDestroy } from '@angular/core';
//import {RatingModalComponent} from './rating-modal.component';
import {PicService, RatingModalService, MessagesService, OngoingService, StoreService, UserdetailsService} from '../_services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {ArticlePurchase } from '../_models/index'; 
import {Subscription} from 'rxjs';
import * as  prettyMs from 'pretty-ms'  ;


@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.css']
})
    
export class DoneComponent implements OnInit {

  busy:Subscription;
  ongoing = false ; 
    loading :boolean ;    
  model : any ; 
  messages = []; 
  connection;
  message:any ;
    
  avatarlist = {};
     fullnamelist = {};
    
  rating :any={};
  feedback: any ={}; 
  alert :any =[];
  alert2 :any =[];
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
  totalcommand= 0 ; 
  size = 5 ; 
  page = 1; 
  open = false;
    isopen = {} ; 
    
  constructor(private messagesService: MessagesService,
              private ongoingService :OngoingService, 
              private storeService: StoreService, 
              private ratingModalService : RatingModalService,
              private userdetailsService : UserdetailsService,
              private route : ActivatedRoute, 
              private router : Router , 
              private picService : PicService) {
  
      
  }
    
  

  ngOnInit() {
      this.loading = true ; 
      this.ongoingService.getCountArticlesByUserIdClose (this.me)
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
    
     getPage(page) {
         this.loading = true ; 
       this.busy=  this.ongoingService.getArticlesByUserIdClose (this.me, (page-1)*this.size , this.size)
      .subscribe (
          
          data =>{
               console.log(data ) ; 
              this.model = data ; 
              this.open = true ; 
              this.page = page ; 
              this.loading = false ; 
             
              
              for( let i  = 0 ; i < this.model.length ; i++ ) {
                       if (! this.model[i]._source.choosenAddress ) 
                   this.model[i]._source.choosenAddress = {} ; 
                  
                  this.model[i].articlesrating =Object.assign({}, this.model[i]._source.articlesrating); 
                 console.log(    this.model[i].articlesrating);
                   for( let j = 0 ;j < this.model[i]._source.messages.length; j++ ) {
             //    console.log( JSON.parse(this.model[i]._source.messages[j]) );
                   try{
                      // this.model[i]._source.messages[j] = JSON.parse(this.model[i]._source.messages[j]); 
                        console.log(this.model[i]._source.messages[j].from) ; 
                       if (! this.avatarlist[this.model[i]._source.messages[j].from ]) {
                            this.userdetailsService.getProfilePicName(this.model[i]._source.messages[j].from)
                     .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                                this.avatarlist[this.model[i]._source.messages[j].from ] = this.picService.getProfileLink (data['profilepicname']) 
                       },error=>{}) ; 
                           
                      /* this.userdetailsService.getAvatar(this.model[i]._source.messages[j].from)
                       .subscribe( 
                           data => {
                                 this.avatarlist[this.model[i]._source.messages[j].from ] = data['avatar'] ;  
                        //       console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                           */
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

                       this.model[i]._source.messages[j].date =prettyMs( new Date().getTime() -  this.model[i]._source.messages[j].date ,  {compact: true}  );
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
                       this.model[i]._source.steps.prepare = new Date (this.model[i]._source.steps.prepare).toLocaleString("fr-FR").replace("à","-"); ;
                   if (this.model[i]._source.steps.send!=0)
                       this.model[i]._source.steps.send = new Date (this.model[i]._source.steps.send).toLocaleString("fr-FR").replace("à","-"); ;
                   if (this.model[i]._source.steps.receive!=0)
                       this.model[i]._source.steps.receive = new Date (this.model[i]._source.steps.receive).toLocaleString("fr-FR").replace("à","-"); ;
                   if (this.model[i]._source.steps.solvedlitige!=0)
                       this.model[i]._source.steps.solvedlitige = new Date (this.model[i]._source.steps.solvedlitige).toLocaleString("fr-FR").replace("à","-"); ;

                   if (this.model[i]._source.steps.litige!=0)
                       this.model[i]._source.steps.litige = new Date (this.model[i]._source.steps.litige).toLocaleString("fr-FR").replace("à","-"); ;

                   if (this.model[i]._source.steps.close!=0)
                       this.model[i]._source.steps.close = new Date (this.model[i]._source.steps.close).toLocaleString("fr-FR").replace("à","-"); ;

                   if (this.model[i]._source.steps.stop!=0)
                       this.model[i]._source.steps.stop = new Date (this.model[i]._source.steps.stop).toLocaleString("fr-FR").replace("à","-");  
 
               /*    let connection = this.messagesService.getOngoingMessages(this.model[i]._id)
                  .subscribe(
                   message => 
                   {
                       console.log(message) ;
                    this.message =message ; //  JSON.parse(message ) ;
                       if(JSON.parse(localStorage.getItem('currentUser')).userid== message['from'] ) 
                           this.message['fromMe']= true ; 
                       else 
                           this.message['fromMe']= false ;  
                       this.message['new'] = true ; 
                     // console.log(message.text ) ; 
                      this.message['date'] =prettyMs( new Date().getTime() - this.message['date'] ,  {compact: true}  );

                       
                     this.model[i]._source.messages.push(this.message);
                     if (!this.avatarlist[this.message['from']]) {
                         
                       
                     
                   /*    this.userdetailsService.getAvatar(this.message['from'])
                       .subscribe( 
                           data => {
                                this.avatarlist[this.message['from']]= data['avatar'] ;  
                               
                               
 
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                          */
               /*          }
                       
                   if (!this.fullnamelist[this.message['from']]) {
                       this.userdetailsService.getFullname(this.message['from'])
                       .subscribe( 
                           data => {
                                this.fullnamelist[this.message['from']]= data['fullname'] ;  
                               
                               
 
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
            
                  
              for( let j = 0 ;j < this.model[i]._source.articles.length; j++ ) {
                 /*  this.storeService.getPic(this.model[i]._source.articles[j].articleid )
                                    .subscribe(
                                     data4=> {
                                          console.log( this.model[i][j] ) ; 
                                        this.model[i]._source.articles[j].pic = data4['pic'];
                                    }, error4 =>{
                                          console.log(error4) ; 
                                    }) ; 
                  */
                  
                                    this.model[i]._source.articles[j].pic  = this.picService.getPicLink( this.model[i]._source.articles[j].picname);

              }
              }
       
          }
          ,error => {
              console.log(error ) ; 
              if (error.status==401){
                  
                  
              }
              this.ongoing = false ;
              this.loading = false ; 
              }
          
      
      ) ; 
      
      
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
                this.router.navigate(["../../../stores/"+id+"/store"], { relativeTo: this.route });

        }

      gotoPurchase(id){
          console.log(id)  ; 
                            this.router.navigate(["../purchase/"+id], { relativeTo: this.route });

           } 
        
   /* receiveDone(id , index , storetitle){
            let time = new Date().getTime() ;
            this.ongoingService.putReceive(id, time ) 
            .subscribe(
                data =>{ console.log(data) ;
                        this.model[index]._source.steps.receive = new Date(time).toLocaleString("fr-FR").replace("à","-"); .replace("à","-");  }, 
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
                        this.model[index]._source.steps.litige = new Date(time).toLocaleString() ;  }, 
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
                        this.model[index]._source.steps.close = new Date(time).toLocaleString() ;  }, 
                error => {console.log(error) ; })  ;
    }
    
    solvedlitigeDone (id , index, storetitle ){
            let time = new Date().getTime() ;
            this.ongoingService.putSolvedLitige(id, time ) 
            .subscribe(
                data =>{ console.log(data) ; 
                          console.log(time); 
                        this.model[index]._source.steps.solvedlitige = new Date(time).toLocaleString() ;  }, 
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
    
  /*   sendMessage(i, id, f, storetitle){
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

         
               this.storeService.putNotification( id, 'message', time, storetitle , JSON.parse(localStorage.getItem('currentUser')).userid ) 
        .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    }); 
        

     }*/
  /*   onClick(event, articleid){
         console.log(event) ; 
         console.log(articleid ) ; 
         }*/
       
  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
} 
  onClick(event, i, id ) {
      console.log(event) ; 
      this.model[i].articlesrating[id] = event.rating ; 
       //console.log(id ) ;  
       this.alert[id] = false ; 
      }
  sendRating (i, storetitle) { 
         let bool = true ; 
         
            for (let a of this.model[i]._source.articles){
             if (!this.model[i].articlesrating.hasOwnProperty(a.articleid))
             {    
                 this.alert[a.articleid] = true ; 
                 bool = false ; 
             }
             else 
                 this.alert[a.articleid] = false ; 
             
             if(!this.feedback[a.articleid]) {
                 this.alert2[a.articleid] = true ;
                 //bool=false ; 
                 }
             else
                 this.alert2[a.articleid] = false ;  
             }
      
             if (bool) {
                 
              for (let m of this.model[i]._source.articles){
                 //send to data base !! the rating then close the command then put in archieve 
                 this.storeService.putRating(m.articleid,this.model[i].articlesrating[m.articleid ],  
                                             this.me, this.feedback[m.articleid] ) 
                 .subscribe(
                     data => {
                         console.log(data) ; 
                         this.storeService.putRatingStore ( storetitle, this.model[i].articlesrating[m.articleid ])
                         .subscribe (
                             data2 =>{
                                 console.log(data2) 
                                 this.model[i]._source.articlesrating[m.articleid ] = this.model[i].articlesrating[m.articleid ]

                              }      ,error2 =>{
                                 console.log(error2 ) ; 
                                 })
                      }
                     ,error =>{
                         console.log(error) 
                      })
             }   
                                                                     //put rating in ongoing 
                                  this.ongoingService.putAllRatingArticle(this.model[i]._id  , this.model[i].articlesrating, this.feedback )
                                 .subscribe (
                                     data3=> {

                                        console.log(data3) ;    
                                     
                                             this.userdetailsService.removeNotifByCommandId(this.me, this.model[i]._id , "rating" )
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
                             }

  }
    


}