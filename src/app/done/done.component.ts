import { Component, OnInit, OnDestroy } from '@angular/core';
//import {RatingModalComponent} from './rating-modal.component';
import {PicService, RatingModalService, MessagesService, OngoingService, StoreService, UserdetailsService} from '../_services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as  prettyMs from 'pretty-ms'  ;
import * as utils from "utils/utils";

import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label';
import { SearchBar } from "tns-core-modules/ui/search-bar"; 

import * as  clipboard from "nativescript-clipboard" ;
import { Frame, topmost } from "tns-core-modules/ui/frame"; 
import { RadListView, ListViewItemSnapMode } from "nativescript-ui-listview";
 
 

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.css']
})
    
export class DoneComponent implements OnInit {

  ongoing = false ; 
  loading :boolean ;    
  model:any = [] ; 
  tempmodel:any = [] ; 
  messages:any = []; 
  message:any ;
  isopen = {} ; 
  avatarlist:any = {};
  fullnamelist :any= {};

  rating :any={};
  feedback: any ={}; 
  alert :any =[];
  alert2 :any =[];
  me="" ; 
  totalcommand= 0 ; 
  size =2 ; 
  maxpage = 1 ; 
  page = 1; 
  open = false;
    
  constructor(private messagesService: MessagesService,
              private ongoingService :OngoingService, 
              private storeService: StoreService, 
              private ratingModalService : RatingModalService,
              private userdetailsService : UserdetailsService,
              private route : ActivatedRoute, 
              private picService: PicService, 
              private router : Router ) {
  
      
  }
    
  

  ngOnInit() {
      this.me= JSON.parse(localStorage.getItem('currentUser'))['userid'] ; 
 
      this.loading = true ; 
      this.ongoingService.getCountArticlesByUserIdClose(this.me)
        .subscribe(
            data =>{
                console.log(data) ; 
                this.totalcommand= data['count'] ;
                this.maxpage = Math.ceil( this.totalcommand/this.size)  ; 

                 if(this.totalcommand ==  0 ) {
                     this.ongoing = false    ; 
                     this.loading = false ; 
                 }else{
                    
                      this.ongoing = true  ; 
                      this.getPage(1)   ;           
                 this.loading = false ;  
                }}
            ,error =>{
                console.log(error) ; 
                this.loading = false ; 
            }) ;
      
              
      }
    
    
    getPage (page ) {
        this.loading = true ; 
        this.page = page ;
         this.ongoingService.getArticlesByUserIdClose (this.me, (this.page-1)*this.size, this.size )
         .subscribe (
          
            data =>{
                 this.open = true ;
                 this.tempmodel = data ; 
                // this.model= this.model.concat(data) ; 
                    //  this.page = page ; 
                     //window.scrollTo(0, 0);
                this.loading = false ; 
              for( let i  = 0 ; i < this.tempmodel.length ; i++ ) {
                 
                  this.tempmodel[i].articlesrating = {} ; 
                  if (! this.tempmodel[i]._source.choosenAddress ) 
                   this.tempmodel[i]._source.choosenAddress = {} ; 
                 // console.log();
                  this.isopen["message"+this.tempmodel[i]._id] = false ;
                
                   for( let j = 0 ;j < this.tempmodel[i]._source.messages.length; j++ ) {
             //    console.log( JSON.parse(this.tempmodel[i]._source.messages[j]) );
                 
                       this.tempmodel[i]._source.messages[j].date =prettyMs( new Date().getTime() -  this.tempmodel[i]._source.messages[j].date, {compact: true}   );

                      // this.tempmodel[i]._source.messages[j] = JSON.parse(this.tempmodel[i]._source.messages[j]); 
                   /*     console.log(this.tempmodel[i]._source.messages[j].from) ; 
                       if (! this.avatarlist[this.tempmodel[i]._source.messages[j].from ]) {
                           
                       this.userdetailsService.getAvatar(this.tempmodel[i]._source.messages[j].from)
                       .subscribe( 
                           data => {
                                 this.avatarlist[this.tempmodel[i]._source.messages[j].from ] = data['avatar'] ;  
                        //       console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                      }*/
                       
                      /*  if (! this.fullnamelist[this.tempmodel[i]._source.messages[j].from ]) {
                           
                       this.userdetailsService.getFullname(this.tempmodel[i]._source.messages[j].from)
                       .subscribe( 
                           data => {
                                 this.fullnamelist[this.tempmodel[i]._source.messages[j].from ] = data['fullname'] ;  
                        //       console.log(data) ;    
                           }
                           ,error=> {
                                 console.log (error ) ;    
                           }
                           );
                      }*/
                        

                      //  console.log(JSON.parse(localStorage.getItem('currentUser')).userid) ; 
                       if (this.tempmodel[i]._source.messages[j].from == JSON.parse(localStorage.getItem('currentUser')).userid) 
                            this.tempmodel[i]._source.messages[j].fromMe = true ; 
                       else 
                            this.tempmodel[i]._source.messages[j].fromMe = false ; 
                       
                       
                 
                  }
                  
                 // let  options =  {   day: 'numeric', month: 'numeric', year: 'numeric', hour:'2-digit', minute:'2-digit'};

                       this.tempmodel[i]._source.startdate =  this.getLocalDateTime(this.tempmodel[i]._source.startdate); 
                   if (this.tempmodel[i]._source.steps.prepare!=0)
                       this.tempmodel[i]._source.steps.prepare = this.getLocalDateTime( this.tempmodel[i]._source.steps.prepare);//.replace("à","-"); 
                   if (this.tempmodel[i]._source.steps.send!=0)
                       this.tempmodel[i]._source.steps.send = this.getLocalDateTime(this.tempmodel[i]._source.steps.send)//.replace("à","-"); 
                   if (this.tempmodel[i]._source.steps.receive!=0)
                       this.tempmodel[i]._source.steps.receive = this.getLocalDateTime( this.tempmodel[i]._source.steps.receive);//"fr-FR").replace("à","-"); 
                   if (this.tempmodel[i]._source.steps.solvedlitige!=0)
                       this.tempmodel[i]._source.steps.solvedlitige = this.getLocalDateTime(this.tempmodel[i]._source.steps.solvedlitige);//"fr-FR").replace("à","-"); 

                   if (this.tempmodel[i]._source.steps.litige!=0)
                       this.tempmodel[i]._source.steps.litige = this.getLocalDateTime(this.tempmodel[i]._source.steps.litige);//"fr-FR").replace("à","-"); 
                    try {
                   if (this.tempmodel[i]._source.steps.stop!=0)
                       this.tempmodel[i]._source.steps.stop = this.getLocalDateTime(this.tempmodel[i]._source.steps.stop);//"fr-FR").replace("à","-"); 
                    }catch(e) {
                        this.tempmodel[i]._source.steps.stop=0; 
                        }
                   if (this.tempmodel[i]._source.steps.close!=0)
                       this.tempmodel[i]._source.steps.close = this.getLocalDateTime(this.tempmodel[i]._source.steps.close);//"fr-FR").replace("à","-"); 

                this.messagesService.getOngoingMessages(this.tempmodel[i]._id)
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

                       
                     this.tempmodel[i]._source.messages.push(this.message);
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
                  //console.log (connection ) ; 
                  
              for( let j = 0 ;j < this.tempmodel[i]._source.articles.length; j++ ) {
                  console.log(this.tempmodel[i]._source.articles) ; 
                  
                                   this.tempmodel[i]._source.articles[j].pic  = this.picService.getPicLink( this.tempmodel[i]._source.articles[j].picname);

                  /* this.storeService.getPic(this.tempmodel[i]._source.articles[j].articleid )
                                    .subscribe(
                                     data4=> {
                                       //   console.log( this.model[i][j] ) ; 
                                        this.tempmodel[i]._source.articles[j].pic = data4['pic'];
                                    }, error4 =>{
                                          console.log(error4) ; 
                                    }) ; 
                  */
              }
              }
                this.model = this.model.concat(this.tempmodel); 
              
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
    
 
 /*   rating(commandidx) {
    

    this.ratingModalService.rating(this.model[commandidx]);
    //this.history.push(`Mission "${mission}" announced`);
   // if (this.nextMission >= this.missions.length) { this.nextMission = 0; }
  }*/
   
    
    gotoArticle(id, storeid ) {
            this.router.navigate(["../../../stores/"+storeid+"/articles/"+id], { relativeTo: this.route });

        }
    
    gotoStore(id ) {
                this.router.navigate(["../../../stores/"+id], { relativeTo: this.route });

        }

      gotoPurchase(id){
          console.log(id)  ; 
                            this.router.navigate(["./../purchase/"+id], { relativeTo: this.route });

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

    
    
    setScore(e,i,id){
        console.log(e.object.get('value')) ; 
      
        this.model[i].articlesrating[id] = Number(e.object.get('value'));
          this.alert[id] = false ; 
       }
    
  sendRating (i, storetitle) { 
         let bool = true ; 
         utils.ad.dismissSoftInput() ; 

            for (let a of this.model[i]._source.articles){
             if (!(this.model[i].articlesrating.hasOwnProperty(a.articleid)) || this.model[i].articlesrating[a.articleid] ==0 )
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
                                  this.ongoingService.putAllRatingArticle(this.model[i]._id  , this.model[i]._source.articlesrating, this.feedback )
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
        //const listview = args.object;
       // const selectedItems = listview.getSelectedItems();
        console.log('selected') ; 
    //   console.log( selectedItems);
    }

    public onItemSelecting(args) {
        console.log('selecting') ;
      // console.log(args) ; 
    
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
         getQuery2(event){
            let searchBar = <SearchBar>event.object;
            let query = searchBar.text ; 
        
             if (query!="" ) {
        
                       this.router.navigate(["./../purchase/"+query], { relativeTo: this.route });

                //  this.selectArticles=  this.articles.filter(function(element){console.log(element['_source']['title']) ; return element['_source']['title'].includes(q);});
             }   
  
      }

     selectText(args) {
         let text = args.object.text;  
         clipboard.setText( text ).then(function() {
      console.log("OK, copied to the clipboard");
  });
         
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
    
     openMsgs(i, id){
       // let view :ElementRef ; 
       //@ViewChild("msgs"+id, { static: true } )view: ElementRef ; 

         this.isopen['message'+id]= !this.isopen['message'+id]    ;
         if (  this.isopen['message'+id]==true && this.model[i]._source.messages.length >2) {
             
         let listView: RadListView = <RadListView>(Frame.topmost().currentPage.getViewById(id));
           setTimeout(()=>{
          //      let mview:ElementRef;     
         //   @ViewChild(id, { static: false })  mview: ElementRef; 

             listView.scrollToIndex( this.model[i]._source.messages.length - 1, false, ListViewItemSnapMode.Auto);
             },150); 
       }
     
    }
}
