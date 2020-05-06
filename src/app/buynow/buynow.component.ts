import { Component, OnInit } from '@angular/core';
import {FirebaseService, BuynowService, OngoingService, StoreService, CartService, UserdetailsService} from '../_services/index';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
 
import {Subscription} from 'rxjs'
import  {map} from 'rxjs/operators';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-buynow',
  templateUrl: './buynow.component.html',
  styleUrls: ['./buynow.component.css']
})
    
    
export class BuynowComponent implements OnInit {
  busy : Subscription ; 
  model : any ={};  
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
 
  loading = false ; 
  display1 = false ; 
  display2 = false ;
  fullname = "" ; 
  firebase=[]; 
    
  constructor(private buynowService  : BuynowService, 
              private ongoingService: OngoingService, 
              private route : ActivatedRoute, 
              private storeService : StoreService,
              private router : Router, 
              private cartService : CartService, 
              private userdetailsService: UserdetailsService, 
              private firebaseService : FirebaseService) { }

  
    
  ngOnInit() {
      
    this.buynowService.currentArticle
      .subscribe (
         article => {
                   if (Object.keys(article).length !== 0 ) {
                      this.model= article; 
                       console.log(this.model ) ; 
                       this.display1 = true ; 
                       this.display2 = false ; 
                     /* var x = document.getElementById("buynow");
                        x.style.display = "block";
                        var x2 = document.getElementById("nobuynow");
                        x2.style.display = "none"; */
                        }
                    else  {
                       this.display2 = true ; 
                       this.display1= false ; 
                    /*  var x = document.getElementById("buynow");
                        x.style.display = "none";
                        var x2 = document.getElementById("nobuynow");
                        x2.style.display = "block";  
                */      
          }
                }) ;
      
        
        
          this.userdetailsService.getFullname (this.me)
              .subscribe(
                data=>{
                //   console.log(data) ; 
                    this.fullname = data['fullname']; 
                }
                  
                  ,error=>{}
                  
                  )  
      
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
                                       this.firebase.push(data['firebase']) ; 
                                      
                         
                     
                            },error=>{
                                      console.log(error ) ; 
                             }) ;
                        
                        }
                
                  }
            ,error0=>{  })   
    
  }
    
    buynow(){
             

        this.loading = true ; 
        console.log(" add article to purchase") ; 
        console.log(this.model ) ; 
        let articles = [];
        for (let a of this.model.articles ){
            
            articles.push ({'articleid':a.articletitle, 
                                            'title':a.title,
                                            'color': a.color,
                                            'quantity':a.quantity,
                                            'price': a.price,
                                            'size': a.size, 
                                            'picname':a.picname}) 
        }
        
        this.ongoingService.postArticle ({ 
                                            
                                            'articles' : articles, 
                                            'delivery': this.model.delivery,
                                            'choosenAddress':this.model.choosenAddress, // should contain estimate duration ! 
                                            'messages': [],
                                            'storetitle': this.model.storetitle , 
                                            'totalprice': this.model.totalprice, 
                                            'startdate':"",
                                            'userid':"",
                                            'steps':{'prepare':0, 'send':0,'stop':0,  'receive':0, 'close':0, 'refund':0,'litige':0},//'litige':0, 'solvedlitige':0},
                                             'articlesrating':{},
                                             'articlesfeedback':{},
                                             "userrating": 0 , 
                                             "userfeedback": "",
                                            })
            
        // .pipe(map(res => res.json()))
         .finally(
                    () =>{
                                                  this.router.navigate(["../../../../../home/"+this.me+"/ongoing"], { relativeTo: this.route });

                    } )
        .subscribe(
            data =>{ 
              let time = new Date().getTime() ; 
                console.log(data) ;  
                    this.storeService.putNotification( data['_id'], 'command', time, this.model.storetitle  , JSON.parse(localStorage.getItem('currentUser')).userid, this.fullname) 
                     .subscribe (
                      data2 => { 
                        console.log(data2)  ; 
                         }
                        ,error2=>{
                          console.log(error2) ; 
                         }); 
            
                  
                        this.loading = false ;
                        
                 for (let firebase of this.firebase)
                 this.firebaseService.commandNotif( firebase,this.fullname, this.model.storetitle,data['_id'] ) 
                                        .subscribe(
                                            d=>{
                                                console.log(d) ;    
                                            },e=>{
                                                console.log(e) ; 
                                          });
                  
                //remove from cart by articleid 
                for (let a of this.model.articles ) {
                     this.cartService.deleteCart( a.articletitle)
                    .subscribe(
                          data => {console.log(data) ;}, 
                              error => {console.log(error) ; }    
                      );
        
                    
                    }
         
            }
          
            ,error => { 
                console.log(error ) ;
             } 
            ) ; 
        
        
     
    }

    
    back(){
    
           //                  
            console.log(this.model.back._routerState.snapshot.url ) ; 
            this.router.navigateByUrl(this.model.back._routerState.snapshot.url);
        
    }
}
