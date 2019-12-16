import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {UserdetailsService, StoreService, MessagesService , FirebaseService} from '../_services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Subscription} from 'rxjs';
import * as  prettyMs from 'pretty-ms';



@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
    
    
export class MessageComponent implements OnInit {
 @ViewChild("View", { static: true }) view: ElementRef; 
//  @ViewChild("top", { static: true }) top: ElementRef; 
 // @ViewChild("scroll", { static: true }) scroll: ElementRef; 

  constructor(
              private usersdetailsService : UserdetailsService,
            //  private storeService : StoreService, 
              private messagesService : MessagesService,
              private   router : Router, 
              private route : ActivatedRoute, 
              private firebaseService: FirebaseService
      ) { }
    loading = false ;
    loading1= false ;
    display1 = false ; 
    display2 = false ; 
    model:any  = {"message":""};
    avatarFromMe = "";
    avatarTo=""; 
    fullname ="" ; 
    message : any ={} ; 
    messages:any  = []  ;
    countMessages = 0 ; 
    page= 1 ; 
    size =3  ;
    maxpage = 0 ; 
    count = 0 ; 
    me = JSON.parse(localStorage.getItem('currentUser')).userid ;
     source :any ;
    firebaseToken ="" ;  
    msgAlert = false ; 
  ngOnInit() {
    //   this.loading = true ; 
       this.messagesService.currentMessageTo
      .subscribe (
          data  => {
              
                  
                   this.model = data ; 
                   if (Object.keys(data).length !== 0 ) {
                    console.log('model') ; 
                       console.log(data ) ; 
                       this.avatarTo = data['avatar'];
                          this.usersdetailsService.getAvatar(this.model.fromMe)
                       .subscribe( 
                           data => {
                                 this.avatarFromMe = data['avatar'] ;  
                            //console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                       
                   this.usersdetailsService.getFullname (this.me)
              .subscribe(
                data=>{
                //   console.log(data) ; 
                    this.fullname = data['fullname']; 
                }
                  
                  ,error=>{}) 
                  
                       
                       
                       this.usersdetailsService.getFirebase(this.model.to)
                       .subscribe(
                           data=>{
                               console.log(data) ; 
                                this.firebaseToken = data['firebase']; 
                           },error=>{
                                console.log(error ) ; 
                           }) ; 
                       
                      this.messagesService.getCountPrivateMessages(this.model.fromMe,this.model.to)
                       .subscribe(
                           dataw => {
                               console.log(dataw) ; 
                                if (dataw['count'] ) {
                                    this.count = dataw['count']  ; 
                                      this.maxpage = Math.ceil( this.count/this.size)  ; 

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
               
                       
                       
                       } 
                       
                       else {
                        
                       this.display2 = true ; 
                       this.display1= false ; 
                      
                    }
                }) ; 
                 
                       
               
      
      
  }
 
    getPage (page ) {
              
                    this.loading = true ;  
                                     //window.scrollTo(0, 0); 
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
                            let tempmessage = this.source.inner_hits.messages.hits.hits
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
                         for( let j = 0 ;j < tempmessage.length; j++ ) {
                     
                               tempmessage[j]._source.date =prettyMs( new Date().getTime() -  tempmessage[j]._source.date,  {compact: true}   );
                                //console.log(JSON.parse(localStorage.getItem('currentUser')).userid) ; 
                                if (tempmessage[j]._source.from == JSON.parse(localStorage.getItem('currentUser')).userid) 
                                  tempmessage[j]._source.fromMe = true ; 
                                else 
                                tempmessage[j]._source.fromMe = false ; 
                          
                        }
                    
                            this.messages = this.messages.concat( tempmessage) ;

                           //  setTimeout(this.updateScroll(),1000);
                        }
                         
                          
                         
                        ,error =>{
                             console.log(error ) ; 
                            this.loading = false ; 
                        }
                      ) ; 
      
        
        

                   
                   }
                  
      
      
                
                  
               
      
    
    sendMessage(){
        this.loading1 = true ; 
        if (this.model.message.length ==0 ) {
           this.msgAlert = true  ;
           this.loading1= false ; 
           this.view.nativeElement.dismissSoftInput();
           this.view.nativeElement.android.clearFocus();   
        }else {
            this.msgAlert = false ; 
          this.messagesService.putPrivateMessage(this.model.fromMe, this.model.to, this.model.message )
        .subscribe (
            data =>{
                this.usersdetailsService.putMessagesNotification (this.model.to )
                .subscribe(
                    data =>{
                             console.log(data) ; 
                             this.model.message = '' ;  
                             this.view.nativeElement.dismissSoftInput();
                             this.view.nativeElement.android.clearFocus();
                             this.loading1=false ; 
                             this.firebaseService.messageNotif(this.firebaseToken, this.fullname) 
                             .subscribe(
                                data=>{
                                console.log(data) ; 
                                },error=>{
                                    console.log(error) ; 
                                }
                            )
                   

            },error =>{
                    console.log(error ) ;
                    this.loading1=false ;    
                    this.view.nativeElement.dismissSoftInput();
                    this.view.nativeElement.android.clearFocus();
                            
             
            
            }
                    );
             
                  
           
                
        
                }, 
            error => {
               console.log(error ) ;  
                }
            ) ; 
            }
        }
    
    updateScroll () {
            
           let element = document.getElementById("scroll");
                      element.scrollTop = element.scrollHeight;
        }
    back() {
              this.router.navigate(["../"], { relativeTo: this.route });

        }
    
    
   hide () {
    this.view.nativeElement.dismissSoftInput();
    this.view.nativeElement.android.clearFocus();
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
    
}

