import { Component, OnInit } from '@angular/core';
import {PicService, UserdetailsService, StoreService, MessagesService, FirebaseService  } from '../_services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Subscription} from 'rxjs';
import * as  prettyMs from 'pretty-ms';



@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
    
    
export class MessageComponent implements OnInit {

  constructor(
              private usersdetailsService : UserdetailsService,
            //  private storeService : StoreService, 
              private messagesService : MessagesService,
              private   router : Router, 
              private route : ActivatedRoute, 
              private firebaseService : FirebaseService, 
              private picService : PicService
      ) { }
    loading = false ;
    display1 = false ; 
    display2 = false ; 
    model:any  = {}
    avatarFromMe = "";
    avatarTo=""; 
    message : any ={} ; 
    messages:any  = []  ;
    countMessages = 0 ; 
    page= 1 ; 
    size = 5  ;
    count = 0 ; 
    me = JSON.parse(localStorage.getItem('currentUser')).userid ;
    firebaseToken=""; 
     source :any ; 
    fullname='' ; 
  ngOnInit() {
    //   this.loading = true ; 
       this.messagesService.currentMessageTo
      .subscribe (
          data  => {
              
                   this.model = data ; 
                   if (Object.keys(data).length !== 0 ) {
                    
                       console.log(data ) ; 
                       this.avatarTo = data['avatar'];
                          /*this.usersdetailsService.getAvatar(this.model.fromMe)
                       .subscribe( 
                           data => {
                                 this.avatarFromMe = data['avatar'] ;  
                            //console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );*/
                            
                            this.usersdetailsService.getProfilePicName(this.model.fromMe)
                       .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                                this.avatarFromMe = this.picService.getProfileLink (data['profilepicname']) 
                       },error=>{}) ; 
                       
                       
                            this.usersdetailsService.getFullname (this.me)
                              .subscribe(
                                 data=>{
                                    //   console.log(data) ; 
                                     this.fullname = data['fullname']; 
                                }
                  
                               ,error=>{})
                      this.messagesService.getCountPrivateMessages(this.model.fromMe,this.model.to)
                       .subscribe(
                           dataw => {
                               console.log(dataw) ; 
                                if (dataw['count'] ) {
                                    this.count = dataw['count']  ; 
                                     this.getPage(1) ; 
                                    }
                              
                               }
                           ,errorw => {
                               console.log(errorw) ; 
                               }
                           
                           );
                       
                       
                             this.display1 = true ; 
                       this.display2 = false ; 
                       
               
                   let connection = this.messagesService.getPrivateMessage(this.model.fromMe,this.model.to)
                  .subscribe(
                   message => 
                   {
                       
                       
                       console.log(message) ;
                      this.message =message ;  
                       this.message= JSON.parse(this.message ) ;
                       if(this.me == this.message._source.from ) 
                           this.message._source.fromMe= true ; 
                       else {
                           this.message._source.fromMe= false ;  
                       this.message.new = true ; 
                     
                        if (this.me == this.source._source.users[0] ){ 
                                //if ( this.source._source.unread0 > 0 ) 
                                this.messagesService.putRead(this.model.fromMe,this.model.to , 1)
                                    .subscribe (
                                        d=> {console.log(d) ;
                                            this.usersdetailsService.putMessagesNotificationdown (this.me , 1)

                                            .subscribe(
                                                    data =>{
                                                          console.log(data) ;    
                                                   },
                                                    error =>{
                                                            console.log(error ) ;    
                                                                  }
                                                                    );
                                        },
                                        er=> {console.log(er) ; }
                                        
                                        )
                           }else{
                                  this.messagesService.putRead(this.model.fromMe,this.model.to , 1)
                                    .subscribe (
                                        d=> {console.log(d) ;
                                                this.usersdetailsService.putMessagesNotificationdown (this.me ,1)
                                                .subscribe(
                                                    data =>{
                                                                           console.log(data) ;    
                                                                      },
                                                                           error =>{
                                                            console.log(error ) ;    
                                                                  }
                                                                    );
                                        
                                        },
                                        er=> {console.log(er) ; }
                                        
                                        ) 
                                
                            }
                       }
                     // console.log(message.text ) ; 
                      this.message._source.date =prettyMs( new Date().getTime() - this.message._source.date,  {compact: true}  );

                       
                      this.messages.unshift( this.message);
                      
                  //   setTimeout(this.updateScroll(),1000);

                   
                   }
                   ,errors =>
                    {
                       console.log(errors) ; 
                    }
                   )
                       this.usersdetailsService.getFirebase(this.model.to)
                   .subscribe(
                       data=>{
                           console.log(data) ; 
                            this.firebaseToken = data['firebase']; 
                       },error=>{
                            console.log(error ) ; 
                       }) ; 
                       
                       
                       } 
                       
                       else {
                        
                       this.display2 = true ; 
                       this.display1= false ; 
                      
                    }
                }) ; 
                 
                       
               
      
      
  }
 
    getPage (page ) {
              
                    this.loading = true ;  
                                     window.scrollTo(0, 0); 
                     /* this.usersdetailsService.getAvatar(this.model.to)
                       .subscribe( 
                           data => {
                                 this.avatarTo = data.avatar ;  
                        //       console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );*/
                 

                     this.messagesService.getPrivateMessages(this.model.fromMe,this.model.to, (page-1)*this.size, this.size )
                     .subscribe(
                        data => {
                        
                            this.source = data ; 
                            this.messages = this.source.inner_hits.messages.hits.hits;
                            console.log(this.source) ; 
                            
                            this.loading = false ; 
                            
                            this.page = page; 
                          
                            //if (this.page == 1){
                                
                                if (this.me == this.source._source.users[0] ){ 
                                if ( this.source._source.unread0 > 0 ) 
                                this.messagesService.putRead(this.model.fromMe,this.model.to , this.source._source.unread0)
                                    .subscribe (
                                        d=> {console.log(d) ;
                                            this.usersdetailsService.putMessagesNotificationdown (this.me , this.source._source.unread0)

                                            .subscribe(
                                                    data =>{
                                                          console.log(data) ;  
                                                         this.source._source.unread0  = 0 

                                                   },
                                                    error =>{
                                                            console.log(error ) ;    
                                                                  }
                                                                    );
                                        },
                                        er=> {console.log(er) ; }
                                        
                                        )
                                }else{
                               if ( this.source._source.unread1 > 0 ) {
                                  this.messagesService.putRead(this.model.fromMe,this.model.to , this.source._source.unread1)
                                    .subscribe (
                                        d=> {console.log(d) ;
                                                this.usersdetailsService.putMessagesNotificationdown (this.me , this.source._source.unread1)
                                                .subscribe(
                                                    data =>{
                                                                           console.log(data) ; 
                                                                         this.source._source.unread1  = 0 
                                                                       },
                                                                           error =>{
                                                            console.log(error ) ;    
                                                                  }
                                                                    );
                                        
                                        },
                                        er=> {console.log(er) ; }
                                        
                                        ) 
                                }
                            }
                            //  console.log(this.messages.length) ; 
                         for( let j = 0 ;j < this.messages.length; j++ ) {
                     
                               this.messages[j]._source.date =prettyMs( new Date().getTime() -  this.messages[j]._source.date,  {compact: true}   );
                                //console.log(JSON.parse(localStorage.getItem('currentUser')).userid) ; 
                                if (this.messages[j]._source.from == JSON.parse(localStorage.getItem('currentUser')).userid) 
                                  this.messages[j]._source.fromMe = true ; 
                                else 
                                 this.messages[j]._source.fromMe = false ; 
                                  console.log(this.messages[j]) ; 
                        }
                    
                           //  setTimeout(this.updateScroll(),1000);
                        }
                         
                          
                         
                        ,error =>{
                             console.log(error ) ; 
                            this.loading = false ; 
                        }
                      ) ; 
      
        
        

                   
                   }
                  
      
      
                
                  
               
      
    
    sendMessage(f){
          this.messagesService.putPrivateMessage(this.model.fromMe, this.model.to, this.model.message )
        .subscribe (
            data =>{
                this.usersdetailsService.putMessagesNotification (this.model.to )
                .subscribe(
                    data =>{
                    console.log(data) ;    
                            this.firebaseService.messageNotif(this.firebaseToken, this.fullname, this.model.fromMe, this.avatarFromMe ) 
                             .subscribe(
                                data=>{
                                console.log(data) ; 
                                },error=>{
                                    console.log(error) ; 
                                }
                            )
                        
                    },
                    error =>{
                    console.log(error ) ;    
                    }
                    ),
                
                f.reset();
                 this.model.message = '' ;  
                }, 
            error => {
               console.log(error ) ;  
                }
            ) ; 
        }
    
    updateScroll () {
            
           let element = document.getElementById("scroll");
                      element.scrollTop = element.scrollHeight;
        }
    back() {
              this.router.navigate(["../"], { relativeTo: this.route });

        }
}
