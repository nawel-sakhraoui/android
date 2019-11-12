import { Component, OnInit } from '@angular/core';
import {UserdetailsService, MessagesService } from '../_services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Subscription} from 'rxjs';



@Component({
  selector: 'app-list-messages',
  templateUrl: './list-messages.component.html',
  styleUrls: ['./list-messages.component.css']
})
export class ListMessagesComponent implements OnInit {

    listmessage =false ;
    me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
    to ="";
   
    unread:any ; 
    model :any=[] ;
    loading = false ; 
    countmsg = 0 ; 
    sizemsg = 2; 
    page =1 ; 
    constructor(
              private messagesService: MessagesService,
              private userdetailsService: UserdetailsService,
              private route :ActivatedRoute, 
              private  router : Router
              ) { }

    avatars = {};  
    
  ngOnInit() {
       this.loading = true ; 
       this.messagesService.getCountUserMessages ( )
       .subscribe (
           data=>{
                this.countmsg = data['count'] ; 
                this.getPage (1) ; 
               
               }, error =>{
                   console.log(error) ;  
               }) ;
           

  
  }
      
 
  
  getPage (page) {
          
              this.messagesService.getUserMessages((page-1)*this.sizemsg , this.sizemsg )
        .subscribe (
            data => {
                 console.log(data) ; 
               this.model = this.model.concat(data)  ; 
                this.page = page ; 
                this.loading = false ;
                if (this.model.length ==0 ) 
                    this.listmessage =false ; 
                else 
                    this.listmessage = true ; 
                
                for (let i = 0 ; i < this.model.length; i++){
                
              //  this.model[i]._source.last.date =  prettyMs( new Date().getTime()-this.model[i]._source.last.date, {compact: true} );
                
                this.model[i]._source.unread = 0 ;     
                if (this.model[i]._source.users[0] == this.me ) {
                        this.model[i]._source.unread = this.model[i]._source.unread0 ; 
                        this.model[i].to = this.model[i]._source.users[1];
                  
                    }
                if (this.model[i]._source.users[1] == this.me ){ 
                        this.model[i]._source.unread = this.model[i]._source.unread1 ;            
                        this.model[i].to = this.model[i]._source.users[0] ; 
              
                }
                    
              /* this.messagesService.getUnreadMessages(this.to, this.me )
                    .subscribe(
                        data4=>{
                               console.log(data4 ) ; 
                           this.unread = data4;
                            this.unread = JSON.parse(this.unread ) ; 
                           // this.model[i]._source.last.date =  prettyMs( new Date().getTime() -   this.unread['last']['date'],  {compact: true}   );
                            this.model[i]._source.last.text= this.unread['last']['text']; 
                            this.model[i]._source.unread +=1 ; 
                        
                              
                            
                        }
                        ,error =>{
                            
                        }
                        )*/
                    
                    
                 if (this.model[i]._source.last.to!= this.me)
                                  this.model[i]._source.last.userid = this.model[i]._source.last.to;
                
               // if (this.model[i]._source.last.from!= this.me)
                else 
                    this.model[i]._source.last.userid = this.model[i]._source.last.from;
                    
               
                this.userdetailsService.getFullname(this.model[i]._source.last.from) 
                .subscribe(
                    data3=>{
                        console.log(data3) ; 
                        
                        this.model[i]._source.last.userfullname= data3['fullname']; 
                       /* if (this.me ==  this.model[i]._source.last.from){
                           this.model[i]._source.last.lastfrom = "Moi"; 
                         /*  this.userdetailsService.getFullname(this.me)
                           .subscribe(
                               data=>{
                                      console.log(data) ; 
                                     this.model[i]._source.last.lastfrom  = data['fullname' ]
                               },error =>{
                                   console.log(error) ; 
                               }
                               ) 

                            
                        }else  */
                         this.model[i]._source.last.lastfrom=  this.model[i]._source.last.userfullname;
                    }
                    ,error3=>{
                     console.log(error3) ;     
                    }
                    ); 
                  this.userdetailsService.getAvatar(this.model[i].to)
                .subscribe (
                  data=>{
                   try {
                       this.model[i]._source.last.avatar = data['avatar'] ; 
                   
                   }catch(error) {
                       this.model[i]._source.last.avatar ="" ;  
                   }
                                            
                   }
                   ,error=>{
                          console.log(error) ;     
                   } ); 
  
             
                 this.userdetailsService.getFullname(this.model[i].to) 
                .subscribe(
                    data3=>{
                        console.log(data3) ; 
                        
                        this.model[i].tofullname= data3['fullname']; 
                   },error3=>{
                     console.log(error3) ;     
                    }
                   );
              }
            }
            ,error => {
                this.loading = false ; 
                 console.log(error )  ; 
                
                }
         );
  }
goToMessage(me, userid, fullname, avatar, unread){
     
       
         this.messagesService.upMessageTo({"fromMe":me,"to":userid, "fullname": fullname, 'avatar' :avatar});
           // put unread to 0 
           //update user unread msg ! 
    
            this.router.navigate(["./tosend"], { relativeTo: this.route });

      /*  this.messagesService.putRead( me, userid)
        .subscribe(
            data => {
                console.log(data ) ; 
                this.userdetailsService.putMessagesNotificationdown (me, unread )
                .subscribe(
                   data1 =>{
                        this.router.navigate(["./tosend"], { relativeTo: this.route });
                        console.log(data1) ; 
                     }
                    ,error1=>{
                        console.log(error1); 
                     }
                 )
               
                
            }
            ,error =>{
                console.log(error) ;
             }
            )
        */
    

}

   public onLoadMoreItemsRequested(args )
    {
     
       console.log('ondemand') ; 
       const listView = args.object;
       this.page+=1;
       if (this.sizemsg *this.page <= this.countmsg) {
      
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
