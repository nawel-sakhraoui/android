import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {PicService, StoreService, CartService, BuynowService, UserdetailsService} from '../_services/index'; 
import {Article, ArticleCart} from '../_models/index';
//import { DialogService } from "ng2-bootstrap-modal";
import {Subscription} from 'rxjs'
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  
 
import * as prettyMs from 'pretty-ms';



//import {Article} from '../_models/Article' ; 

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
        maxcart = 30 ; 
    row = true ; 
    row2 = false ; 
    loading0:boolean  ; 
    display = false ; 
    loading = false ; 
    existstore = false ; 
    show = false ; 
    model : any = {};
    articletitle :string ;
    total = 0 ; 
    banner ="" ;
    quantity = 1 ; 
    choosedelivery =[]; 
    choosecolor ="" ; 
    articleCart :ArticleCart ;  
    storetitle ="" ; 
    store  :any = {}; 
    nostore :boolean  ; 
    me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
    toDisplay :any ; 
    open :boolean ; 
    fullnamelist = {}
    fullcartwarning :boolean = false ; 
    avatarlist = {}
    art = false;
    choosenAddressTitle = '...'; 
    choosenAddress = '' ; 
    warning = false ; 
    selectdelivery = [] ; 
    delivery = [] ; 
    size :any ; 
    choosesize = ''; 
    boolsize  = false ; 
    deliveryconfig = {
        "search":false, //true/false for the search functionlity defaults to false,
        "height": "auto", //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      "placeholder":'...',// text to be displayed when no item is selected defaults to Select,
    //    "customComparator": ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
        //"limitTo": options.length // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
        'displayKey':'title'
        };
  constructor(
  private route: ActivatedRoute,
  private router: Router,
  private storeService: StoreService, 
  private cartService : CartService, 
  //private dialogService:DialogService, 
  private buynowService : BuynowService, 
  private permissionsService : NgxPermissionsService, 
  private rolesService : NgxRolesService, 
  private userdetailsService : UserdetailsService, 
  private picService : PicService) { }

   
  ngOnInit() {
 
        this.loading0 = true ; 
        console.log('article') ; 
        this.loading = true ; 
          this.route.params.subscribe(params => {
          
            this.storetitle= params.store ; 
            console.log(params ) ;
            
            this.storeService.getStoreStatus( this.storetitle  )
            .subscribe(
                data0 =>{
                     console.log(data0 ) ; 
                     this.open = data0['open']; 
                     this.permissionsService.addPermission('readStore', () => {
                            return true;
                       }) 
                    
                    
                     if (this.open ) {
                         
                       if (this.me  == "annonym") 
                           this.rolesService.addRole('GUEST', ['readStore' ]); 
                       else 
                          this.rolesService.addRole('USER', ['readStore' ]);
                     
                     
                         
                     }
                    
                    this.storeService.getStore( this.storetitle)
                     .subscribe(
                         data1=> {
                             this.nostore = false ; 
                             this.store = data1 ; 
                             
                             if (this.store.hasOwnProperty('bannername')){
                              
                                    this.banner = this.picService.getBannerLink(this.store.bannername) ; 
    
                             }else{
                                  
                                  this.banner ="" ; 
                               }  
                             this.existstore = true ; 
                             //console.log(this.store) ; 
                             this.loading = false ;
                             //check if i'm the store admin
                            let admin = false ; 
                              if (this.store.hasOwnProperty("administrators") ) 
                             for (let a of this.store.administrators  ){
                               if( a.userid == this.me ) {
                                   admin = true ; 
                                   break ; 
                                   }
                               
                               }
       
                             if (this.me == this.store.userid ||  admin ) {
                                 
                                    this.permissionsService.addPermission('writeStore', () => {
                                          return true;
                                    })
                    
                                  
                                    this.rolesService.addRole('ADMINStore', ['readStore','writeStore' ]);
                                 
                             }else
                                 this.permissionsService.removePermission('writeStore');
              
              
              
                
              /*   this.storeService.getBanner (this.storetitle)
                    .subscribe(
                        data2=>{
                           console.log(data2) ; 
                          try {
                            this.banner= data2['banner'];
                          }catch(e) {
                            this.banner ='' ;     
                          }
                
                        },error2=>{
                            this.banner = "" ; 
                            console.log(error2) ; 
                        }
                        ); */
              
              },error1 =>{
                             console.log(error1) ; 
          
               })
                
          }, error0 => {
                    console.log(error0 ) ; 
                     this.loading = false ; 
                    }); 
        });
      
       this.route.params.subscribe(params => {
          
            this.articletitle = params.article ; 
            console.log(params ) ;
           
            
     
              
        
       this.storeService.getArticle(this.articletitle )
             .subscribe(
                data => {
                    console.log(data) ; 
                    this.model = data ;
                    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
                         console.log(this.model.sizing)
                             window.scroll(0,300 )  ; 
                    if ( !this.model.delivery ) 
                            this.model.delivery = [] ; 
                    this.model.created = prettyMs( new Date().getTime() -  this.model.created );
                    this.art = true ; 
                    if (this.model.delivery.length !=0 ) 
                        this.choosedelivery.push(this.model.delivery[0]); 
                    else
                        this.choosedelivery = [] ; 
                     
                    this.choosecolor = this.model.color[0];
                    if (this.choosedelivery.length!=0 ) 
                      this.total = (this.model.price *this.quantity )   +this.choosedelivery[0]['price']; 
                    else 
                       this.total = (this.model.price *this.quantity );
                    this.model.tempdelivery = this.model.delivery ; 
                     this.delivery = this.model.delivery ; 
                     this.loading0 = false ;
                    this.display = true ; 
                    
                    
                    this.model.pic = this.picService.getPicLink(this.model.picname)
                    
                    this.model.gallery= [] 
                    if( this.model.hasOwnProperty('gallerynames') )
                    for (let m of this.model.gallerynames ) 
                           this.model.gallery.push( this.picService.getGalleryLink(m)) ; 
                     /*this.storeService.getGallery(this.articletitle )
                     .subscribe(
                          data3=> {
                    
                              this.model.gallery = data3['gallery'] ; 
                                         
                              //console.log(data3.gallery) ; 
                           },
                          error3 =>{
                                        this.loading0 = false ; 
                             console.log(error3) ; 
                     
                          }) ; 
                     this.storeService.getPic(this.articletitle )
                     .subscribe(
                          data4=> {
                    
                              this.model.pic= data4['pic'] ; 
                                 //console.log(data4.pic) ;
                           },
                          error4 =>{
                             console.log(error4) ; 
                     
                          }) ; 
                    */
                           
                             if('sizing' in this.model  )
                             if( Object.keys(this.model.sizing).length !== 0)  {
                            
                                         this.boolsize =true ; 
                                           this.choosesize = this.model.sizing[this.choosecolor][0] ; 

                                         this.size =new Set([].concat.apply([], Object.values(this.model['sizing'] ))); 
                             
                                         //this.size = Object.values(this.model.sizing ).filter((item, index)=> Object.values(this.model.sizing ).indexOf(item)===index) ; 
                             
                             }else 
                                         this.boolsize = false ; 
                              
                    //get users feedback  
                    for (let m of this.model.rating  ) {
                        this.userdetailsService.getFullname (m.userid) 
                        .subscribe (
                            data => {
                                this.fullnamelist[m.userid] = data["fullname"]; 
                           },error => {
                               console.log(error) ; 
                           }
                            ); 
                            this.avatarlist[m.userid] = ''; 
                           this.userdetailsService.getProfilePicName(m.userid)
                           .subscribe(
                           data =>{ 
                           if (data.hasOwnProperty('profilepicname')) 
                                this.avatarlist[m.userid] = this.picService.getProfileLink (data['profilepicname']) 
                          },error=>{}) ; 
                        
                        
                      /*     this.userdetailsService.getAvatar(m.userid) 
                        .subscribe (
                            data => {
                                 try {
                                        this.avatarlist[m.userid] = data["avatar"]; 
                                 }catch (err){
                                          this.avatarlist[m.userid] = ''; 
                                  }
                                
                           },error => {
                               this.avatarlist[m.userid] = '';  
                               console.log(error) ; 
                           }
                            );  */
                        }
                 }, 
                 error =>{
                     this.loading0 = false ; 
                 console.log(error) ;  
                     this.nostore = false ;    
                }) ; 
             
      });
  }
    
    
    goTo (img ) {
            this.toDisplay = img ; 
       this.row2 = true ; 
        this.row = false ;
        
        }
    close (){
              this.row2 = false ; 
               this.row = true ; 
        }
  
    addToCart(){
      /*  this.articleCart  = {"articleid":this.articletitle,
                                        // "storeid": this.model.storetitle, 
                                        // "title": this.model.title, 
                                         //"delivery": this.choosedelivery ,
                                         //"price": this.model.price,
                                         //"quantity": this.quantity,
                          rewards              //"available": true
                                         }; 
           console.log(this.articleCart) ; */
      
        this.cartService.getCountCart ()
          .subscribe( 
               data0 => {
                   console.log(data0) ; 
               if ( data0['cartcount']> this.maxcart  ){
                        //the cart is full
                   this.fullcartwarning = true ;  
               }else{
                    this.fullcartwarning = false ;  
                this.cartService.postToCart ( this.articletitle)
                .subscribe(
                    data => {
                        console.log(data) ;
               
                
                  }, 
                    error =>{
                        console.log(error) ;     
                    }) ;
                   
               }
      
           }, error0=> {
              
              console.log(error0 ) ; 
         }) ; 
        
        }
    
        buynow(storeid, article) {
        
        var index = this.model[storeid].indexOf(article, 0);
        this.model[storeid][index].loading = true; 
        console.log(article) ; 
        let  buynow = {};
         let A = {
                         'price': article._source.price, 
                          'articletitle': article._id,
                          'pic':article.pic ,
                          'title':article._source.title, 
                          'quantity':article.choosequantity, 
                          'color': article.choosecolor, 
                           'size': article.choosesize , 
                            'picname': this.model.picname,  
                }
            
            buynow['articles']=[A];
            buynow['totalprice']= (article._source.price* article.choosequantity)+article.choosedelivery[0].price;
            buynow['delivery']=  article.choosedelivery[0];
            buynow['storetitle']= storeid;
            buynow['choosenAddress'] = this.choosenAddress;

            buynow['back']=this.route;
           
        
             this.buynowService.upArticle(buynow);
             this.router.navigate(["../articles/buynow/article"], { relativeTo: this.route });

          this.model[storeid][index].loading =false; 
        }
    
    
    buyNow(){
        
        if(this.choosenAddress!="") {
           
        let  buynow = {};
          let A = {
                         'price': this.model.price, 
                          'articletitle': this.articletitle,
                          'pic':this.model.pic ,
                          'title':this.model.title, 
                          'quantity':this.quantity, 
                          'color': this.choosecolor, 
                          'size': this.choosesize , 
                           'picname': this.model.picname, 
                }
            
            buynow['articles']=[A];
            buynow['totalprice']=this.total ; 
            buynow['delivery']=  this.choosedelivery[0];
            buynow['storetitle']= this.model.storetitle;
            buynow['back']=this.route;
            buynow["choosenAddress"] = this.choosenAddress ,
 
            
             this.buynowService.upArticle(buynow);
             this.router.navigate(["../buynow/article"], { relativeTo: this.route });

         }else {
            this.warning = true ; 
            }
    }
    
    getQuantity (q) {
                
                    if (this.choosedelivery.length!=0 ) 
                      this.total = (this.model.price *this.quantity )   +this.choosedelivery[0]['price']; 
                    else 
                       this.total = (this.model.price *this.quantity );
    }
    getColor(c){
      
        this.choosecolor = c; 
        if (this.boolsize) 
         this.choosesize = this.model.sizing[this.choosecolor][0] ; 

     
        }
    getDeliveryMethod(event){
        console.log(event ) ;  
                   if (this.choosedelivery.length!=0 ) 
                      this.total = (this.model.price *this.quantity )   +this.choosedelivery[0]['price']; 
                    else 
                       this.total = (this.model.price *this.quantity );
    }
        
     updateArticle(  ) {
      this.router.navigate(["update"], { relativeTo: this.route });

     }     
    getAddress(event ) {
        this.model.delivery = this.model.tempdelivery.filter(n=>n) ;  ; 

        console.log(event) ;
       
      // if(event) 
        this.show = false ; 
     //   window.scroll(0,300 )  ; 
        this.choosenAddressTitle = event._source.title
        this.choosenAddress = event._source ; 
        
                this.warning = false  ; 
        console.log(this.show) ;  
         let  ad = [] ; 
         for (let geo of this.store.geo) 
            if (geo.name == this.choosenAddress['city'] ) {
                   
        
              for (let del of this.model.delivery ) {
      
                console.log(del) ; 
                for (let v of del.villes ) 
            
                 if ( v.name== this.choosenAddress['city']  ) 
               
                    ad.push (del ) ; 
               }
                break ; 
            }
        this.model.delivery = ad ; 
        if( this.model.delivery.length >0 )
               this.choosedelivery = [this.model.delivery[0]]  ;
        else  
                this.choosedelivery = [] ; 
       
        
        console.log(this.model.delivery ) ; 
   }
    checkSizing(s) { 
        if ( this.model.sizing[this.choosecolor].includes(s) ) {
          
            return true ; 
        }else {
            return false ; 
        }
        
        }
    chooseSizing(event, s){
        this.choosesize = s ; 
      }
    
    }