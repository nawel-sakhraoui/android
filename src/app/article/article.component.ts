import {Component,ViewChild, OnInit,ViewContainerRef, AfterViewInit,  ChangeDetectorRef, ElementRef  } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {PicService, StoreService, CartService, BuynowService, UserdetailsService} from '../_services/index'; 
//import { DialogService } from "ng2-bootstrap-modal";
import {Subscription} from 'rxjs'
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  
import { SelectedIndexChangedEventData } from "nativescript-drop-down";
 
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import {ModalComponent} from './modal.component'; 
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label';

//import * as prettyMs from 'pretty-ms';

import { Carousel } from "nativescript-carousel"; 
import * as util from "utils/utils";

@Component({
     moduleId: module.id, 
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})


export class ArticleComponent implements OnInit {
    maxcart = 30; 
    row = true ; 
    row2 = false ; 
    loading0:boolean  ; 
    display = false ; 
    loading = false ; 
    existstore = false ; 
    show = false ; 
    model : any = {'delivery':{}, "color":{}};
    modelOk = false ; 
    articletitle :string ;
    total = 0 ; 
    banner ="" ;
    quantity = 1 ; 
    choosedelivery =[]; 
    choosecolor ="" ; 
    articleCart :any ;  
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
    choosenAddressTitle = ''; 
    choosenAddress = '' ; 
    warning = false ; 
    selectdelivery = [] ; 
    delivery = [] ; 
    size =[] ; 
    choosesize = ''; 
    boolsize  = false ; 
    selectedIndex;
    delTitle = []; 
    form=false;
    showdesc = true ; 
    showeval = false ; 
    showdel = false; 
    gallery = [] ; 
    send = false ; 
    boolrating = false ; 
    reload = false ; 
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
  private modal: ModalDialogService , 
  private vcRef: ViewContainerRef , 
  private picService: PicService ) { }

   
  ngOnInit() {
            this.init() ;
        }

  init(){
        
        this.loading0 = true ; 
        console.log('article') ; 
        this.loading = true ; 
        this.route.params.subscribe(params => {
          
        this.storetitle= params.store ; 
        this.articletitle = params.article ;  
               
        this.storeService.getStoreStatus( this.storetitle  )
            .subscribe(
                data0 =>{
                    this.reload = false ; 
                     console.log(data0 ) ; 
                     this.open = data0['open']; 
                     this.permissionsService.addPermission('readStore', () => {
                            return true;
                           }) 
                    
                    
                     if (this.open ) {
                          this.rolesService.addRole('GUESTStore', ['readStore' ]);
                     }
                    
                    this.storeService.getStore( this.storetitle)
                     .subscribe(
                         data1=> {
                             this.nostore = false ; 
                             this.store = data1 ; 
                             this.existstore = true ; 
                             //console.log(this.store) ; 
                             this.loading = false ;
                             //check if i'm the store admin
                            let admin = false ; 
                             for (let a of this.store.admins  ){
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

              
              
              
                
             /*    this.storeService.getBanner (this.storetitle)
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
              this.reload = true; 
          }); 
     
   
           
         
        
       this.storeService.getArticle(this.articletitle )
             .subscribe(
                data => {
                    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') ;
                    console.log(data['sizing']) ;
                    console.log(data['color']) ;  
                    this.model = data ;
 
                    //this.model.gallery  = []; 
                    this.model.pic = '' ; 
                     //        window.scroll(0,300 )  ; 
                    if ( !this.model.hasOwnProperty('delivery') ) 
                            this.model.delivery = [] ; 
                

                    //console.log(this.model.color) ; 
                   if (!this.model.hasOwnProperty('color') ) 
                            this.model.color =[] ; 
                    
                    
                    this.delTitle = this.model.delivery.reduce((result, filter) => {
                         result =result.concat([filter.title]) ;
                        return result;
                        },[]);
            //        this.model.created = prettyMs( new Date().getTime() -  this.model.created );
                    
                    this.art = true ; 
                    //if (this.model.delivery.length !=0 ) 
                     //   this.choosedelivery.push(this.model.delivery[0]); 
                   // else
                    this.choosedelivery = [] ; 
                     
                    if (this.model.color.length!=0 ) 
                    this.choosecolor = this.model["color"][0];
                    //   if (this.choosedelivery.length!=0 ) 
                     // this.total = (this.model.price *this.quantity )   +this.choosedelivery[0]['price']; 
                    //else 
                 
                    this.total = (this.model.price *this.quantity );
                    this.model.tempdelivery = this.model.delivery ; 
                    this.delivery = this.model.delivery ; 
                    this.loading0 = false ;
                    this.display = true ; 
                    
                    this.model.pic = this.picService.getPicLink(this.model.picname)
                    this.gallery.push( this.model.pic) ;
                     
                    if( this.model.hasOwnProperty('gallerynames') )
                    for (let m of this.model.gallerynames ) 
                           this.gallery.push( this.picService.getGalleryLink(m)) ; 

                    
                  /*     this.storeService.getPic(this.articletitle )
                     .subscribe(
                          data4=> {
                    
                              this.model['pic']= data4['pic'] ; 
                                 console.log(this.model.pic ) ;
                              this.model.gallery = [this.model.pic] ; 
                               this.storeService.getGallery(this.articletitle )
                             .subscribe(
                             data3=> {
                    
                              this.model.gallery =  this.model.gallery.concat(data3['gallery']); 
                                         console.log("abc") ; 
                              console.log(this.model.gallery) ; 
                               },
                               error3 =>{
                                        this.loading0 = false ; 
                                console.log(error3) ; 
                     
                             }) ;
                              
                              
                           },
                          error4 =>{
                             console.log(error4) ; 
                     
                          }) ;*/
                    
                           
                             if(this.model.hasOwnProperty('sizing'))
                             if (Object.keys(this.model.sizing).length!=0) {
                                         this.boolsize =true ; 
                                         this.choosesize = this.model.sizing[this.choosecolor][0] ; 
                               
                                         this.size = [].concat.apply([], Object.values(this.model['sizing'] )).filter((v, i, a) => a.indexOf(v) === i); ; 
                             
                                         //this.size = Object.values(this.model.sizing ).filter((item, index)=> Object.values(this.model.sizing ).indexOf(item)===index) ; 
                             
                             }else 
                                         this.boolsize = false ; 
                              
                    //get users feedback  
                   if (!this.model.rating )
                         this.boolrating = false ; 
                   
                   else {
                        this.boolrating = true ; 
                        for (let m of this.model['rating']  ) {
                        this.userdetailsService.getFullname (m.userid) 
                        .subscribe (
                            data => {
                                
                                this.fullnamelist[m.userid] = data["fullname"]; 
                                console.log(this.fullnamelist) ; 
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
                            
                            console.log(this.avatarlist ) ;
                            console.log(this.fullnamelist) ;  
                        
                         /*  this.userdetailsService.getAvatar(m.userid) 
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
                      }}
                 }, 
                 error =>{
                    // console.log("xxxxxxxxxxxxxxxxxxxx") ; 
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
  
    loadingcart  = false ; 
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
                   this.loadingcart = true ; 
                   console.log(data0) ; 
               if ( data0['cartcount']>=this.maxcart ){
                        //the cart is full
                   this.fullcartwarning = true ;  
                    this.loadingcart = false ; 
                   //
               }else{
                    this.fullcartwarning = false ;  
                  
                this.cartService.postToCart ( this.articletitle)
                .subscribe(
                    data => {
                        this.loadingcart = false ; 

                        console.log(data) ;
                      this.showModal();
                
                  }, 
                    error =>{
                        this.loadingcart = false ; 

                        console.log(error) ;     
                    }) ;
                   
               }
      
           }, error0=> {
                 this.loadingcart = false ; 

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
                           'size': this.choosesize , 
                           'picname': article._source.picname, 
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
        this.send = true ; 
 
        if(this.model.available && !this.model.suspend && this.choosenAddress!="" && this.choosedelivery.length!=0  ) {
           
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
    
    getQuantity () {
                
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
        /*
        if (this.model.delivery.length!=0 ) {
            this.selectedIndex=0;
            this.choosedelivery = [this.model.delivery[0]] ;
        }else 
       */     this.choosedelivery=[];
        
       
        //if( this.model.delivery.length >0 )
         //      this.choosedelivery = [this.model.delivery[0]]  ;
        //else  
            //    this.choosedelivery = [] ; 
       
        this.delTitle = this.model.delivery.reduce((result, filter) => {
                         result =result.concat([filter.title]) ;
                        return result;
                        },[]);
     //  console.log(this.model.delivery ) ; 
   }
    checkSizing(s) { 
        if ( this.model.sizing[this.choosecolor].includes(s) ) {
          
            return true ; 
        }else {
            return false ; 
        }
        
        }
    chooseSizing(s){
        this.choosesize = s ; 
      }
    
      @ViewChild("carouseln", { static: false }) carouselView: ElementRef<Carousel>;

     myTapPageEvent(args) {
    console.log('Tapped page index: ' + (this.carouselView.nativeElement.selectedPage));
    }

    myChangePageEvent(args) {
    console.log('Page changed to index: ' + args.index);
    };
    
      public onchange(event: SelectedIndexChangedEventData){
       //console.log(event) ;
        
         this.choosedelivery= [this.model.delivery[event.newIndex]] ;  
                console.log( this.choosedelivery) ; 
          
          if (this.choosedelivery.length!=0 ) 
                      this.total = (this.model.price *this.quantity )   +this.choosedelivery[0]['price']; 
                   else 
                       this.total = (this.model.price *this.quantity );

       } 
    
    
      private  showModal() {
        let options = {
            context: {'fullcart':this.fullcartwarning},
            fullscreen: false,
            viewContainerRef: this.vcRef
        };
        this.modal.showModal(ModalComponent, options).then(res => {
           
                console.log(res) ;
                
            
        });
     
    }
    
 
    showDesc(){
         this.showdesc = true ; 
         this.showeval = false ; 
         this.showdel = false; 
        }
    
    showEval(){
        this.showdesc = false ; 
         this.showeval = true;  
         this.showdel = false; 
        }
    showDel(){
        this.showdesc = false ; 
         this.showeval = false;  
         this.showdel = true; 
        }
    enable (){
        return !this.model.available|| this.model['delivery'].length==0 || this.choosedelivery.length==0 ||(this.choosesize=='' &&  this.boolsize)
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
 chooseAddress(){
     this.show = !this.show; 
     }

hide(){
          util.ad.dismissSoftInput() ;  
        }
    
    reloading(){   
        console.log('reloading') ; 
        this.init() ; 
  
     }

}
