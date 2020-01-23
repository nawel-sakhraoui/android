import {Component,ViewChild, OnDestroy, OnInit, AfterViewInit,AfterContentInit,  ChangeDetectorRef, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {PicService, StoreService, CartService, SearchService} from '../_services/index'; 
import {Subscription} from 'rxjs';
//import * as prettyMs from 'pretty-ms'; 
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { SearchBar } from "tns-core-modules/ui/search-bar"; 
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label'; 
//import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  
import * as imagepicker from "nativescript-imagepicker"; 

import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";



import {ImageSource, fromFile, fromResource, fromBase64} from "tns-core-modules/image-source";
 
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions'; 

@Component({
  selector: 'app-soldout',
  templateUrl: './soldout.component.html',
  styleUrls: ['./soldout.component.css']
})
export class SoldoutComponent implements OnInit, AfterViewInit , OnDestroy{
        
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 

  display = false ;   
    display1 = false ;     
  busy: Subscription;
  busy2: Subscription;
  busy3: Subscription;
  open:boolean = true ; 
  nostore = false ; 
  storetitle: string ="" ;  
  userid : string = '' ;
  store : any= {} ; 
  isValid :boolean = true ;
  private sub :any ;
  selectArticles :any=[] ; 
  articles:any = [] ; 
  read :any ='' ; 
  banner = ""; 
  query = ""; 
    display2=false ; 
    page= 1; 
    size = 20; 
    totalArticles =0;
    opened = true ; 
     menuhide = false ; 
    loading0 = false ; 
    loading2 = false ; 
    loading = false ; 
    nothing:boolean ; 
    nosearch :boolean ; 
    fullcartwarning:boolean ; 
    suspend :boolean ; 
    maxpage = 1; 
    disp = [] ;
    alertimg = false ; 
    displaybanner = false ; 
  private notif:any= {} ;
  
  constructor(
            private route: ActivatedRoute,
            private router: Router,
            private storeService: StoreService, 
            private cartService: CartService, 
            private searchService: SearchService, 
            private _changeDetectionRef: ChangeDetectorRef,
            private rolesService:  NgxRolesService , 
            private picService : PicService,
            private permissionsService : NgxPermissionsService 
      ){}
 
    
    ngOnInit() {
        this.loading0 = true ; 
        console.log('store') ; 
        this.sub = this.route.params.subscribe(params => {
        console.log (params) ;
        this.storetitle = params['store'];
            
         this.storeService.getSuspend (this.storetitle )
        .subscribe(     
        data0 =>{
        this.suspend = data0['suspend']; 
           
       if (!this.suspend) {     
            
        this.storeService.getStoreStatus( this.storetitle  )
            .subscribe(
                data0 =>{
                     console.log(data0 ) ; 
                     this.open = data0['open']; 
                     this.permissionsService.addPermission('readStore', () => {
                            return true;
                           }) 
                    
                    
                     if (this.open ) {
                          this.rolesService.addRole('GUESTStore', ['readStore' ]);
                     }
                        
                     console.log(this.storetitle) ; 
                         
                     this.storeService.getStore( this.storetitle)
                     .subscribe(
                         data1=> {
                             
                             this.store = data1 ; 
                             this.loading0 = false ; 
                             console.log(this.store) ; 
                             //check if i'm the store admin
                            let admin = false ; 
                             if (this.store.hasOwnProperty("administrators")) 
                             for (let a of this.store.adminisrators  ){
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

                                 
                                  
                               
              
                                 
                                 
                             this.loading = true ;  
                             
                               if (this.store.hasOwnProperty('bannername')){                          
                                    this.banner = this.picService.getBannerLink(this.store.bannername) ; 
                                    this.loading = false ;
                               }else{
                                  this.banner ="" ;       
                                   this.loading = false ;                          
                               }
                             
                           /*  this.storeService.getBanner(this.storetitle)
                                 .subscribe (
                                        data=>{
                                            try {
                                                this.banner = data['banner'] ;  
                                                console.log(data);
                                                this.loading = false ; 
                                                this.display = true ; 
                                            }catch(error) {
                                                this.banner = "" ; 
                                                this.loading = false ; 
                                                this.display = true ; 
                                               }
                                            
                                        }
                                        ,error=>{
                                            console.log(error) ;     
                                            this.loading =false ; 
                                            this.display = true ; 
                                        }
                                     ); 
                                 
                            */
                            
                            
                        },error1 => {
                            this.loading0 = false ; 
                              console.log(error1);    
                            this.display = true ; 
                             
                        });
      
                  this.storeService.getArticlesCount (this.storetitle, true)
                    .subscribe(
                        data1=> {
                            console.log("XXXXXXXXXXXXXXXXXXXX"); 
                            console.log(data1) ;
                            this.totalArticles = data1['count'] ; 
                            this.maxpage = Math.ceil( this.totalArticles/this.size)  ; 

                           if( this.totalArticles == 0 ) 
                                this.nothing =true ; 
                            else {
                               this.nothing = false; 
                               this.getPage(1);
                            }
                            }
                        ,error1 =>{
                            console.log(error1) ; 
                            this.nothing = true ; 
                           }
                        
                        )
                 

           
               }
                
                ,error0=>{
                        this.nostore = true ; 
                        console.log(error0) ; 
                }); 
            
             }else {
             this.loading0 = false ;    
             this.display1 = true ;
             this.loading = true ; 
            
              if (this.store.hasOwnProperty('bannername')){                          
                                    this.banner = this.picService.getBannerLink(this.store.bannername) ; 
               }else{
                                  this.banner ="" ;                                
               } 
           
           /*this.busy= this.storeService.getBanner(this.storetitle)
             .subscribe (
                                        data=>{
                                            try {
                                                this.banner = data['banner'] ;  
                                                this.store.banner = this.banner; 
                                                console.log(data);
                                                this.loading = false ; 
                                            }catch(error) {
                                                this.banner = "" ; 
                                                this.loading = false ; 
                                               }
                                            
                                        }
                                        ,error=>{
                                            this.loading = false ; 
                                            console.log(error) ;     
                                        }
                                     );    
                */
                
            }}
       ,error0=>{
                console.log(error0 ) ;    
                
        }
       )}) ; 
              
        
      
  }

       addToCart(article){
         article.loadingcart = 1  ;

          this.cartService.getCountCart ()
          .subscribe( 
               data0 => {
                   console.log(data0) ; 
               if ( data0['cartcount']>=100){
                    
                   this.fullcartwarning = true ;  
                     article.loadingcart = 3; 
               }else{
                    this.fullcartwarning = false ;
        
                    console.log(article) ; 
                    this.cartService.postToCart ( article._id  ) 
                    .subscribe(
                       data => {
                        console.log(data) ; 
                         article.loadingcart = 2 ; 
                      }, 
                        error =>{
                         console.log(error) ;     
                    }) ;
            }
            }, error0=>{
              console.log(error0 ) ; 
        });
        }

        
    getQuery2(event){
 
    
        if (this.query!="" ) {
        let q= this.query;
        //search article in store 
         this.searchService.searchArticlesStore(this.storetitle, this.query, false )
         .subscribe(
             data => {
                 console.log(data ) ;
                 this.selectArticles = data;
                 if (this.selectArticles.length ==0 ) 
                        this.nosearch = true ; 
                 else 
                        this.nosearch = false ; 
                for ( let i = 0; i <  this.selectArticles.length; i++) {
                      this.selectArticles[i]._source.pic = this.picService.getPicLink(this.selectArticles[i]._source.picname) ;
     
                            /*      this.storeService.getPic(this.selectArticles[i]._id )
                                  .subscribe(
                                      data2=> {
                                         
                                         this.selectArticles[i]._source.pic= data2['pic'] ; 
                                      ; 
                                      }
                                      ,error2=>{
                                          console.log(error2) ; 
                                          });
                              */
                }   
               //  this.query = '' ; 
             }, error =>{
                 console.log(error ) ; 
             }) ;
    //  this.selectArticles=  this.articles.filter(function(element){console.log(element['_source']['title']) ; return element['_source']['title'].includes(q);});
       }   else 
              this.selectArticles = this.articles ; 
                    this.nosearch = false ;  
  
    }
    enterQuery2(event){
      if (this.query =="" ) 
      {
             this.selectArticles = this.articles ; 
                    this.nosearch = false ; 
          }
        
    }
    
    
     covsave() {
       console.log ('saving cover') ; 
    this.storeService.postBanner(this.storetitle, this.banner)
                        .subscribe(
                        data => {
                            this.isValid =true ; 
                            console.log(data)  ;
                            this.store.banner = this.banner ;  
                           // this.router.navigate([this.returnUrl]);
                        },
                        error => {
                            
                            console.log(error) ; 
                           // this.alertService.error(error2);
                          
                        });
       /*this.storeService.postCover(this.storename, this.read)
       .then((result) => {
            console.log(result);
        }, (error) => {
            console.error(error);
        });
         */                          
  }
    
    
   covremove(){
    this.isValid = true ; 
    this.banner =  this.store.banner ;         
  }                   



  gotoArticle( id:string ) {
      this.router.navigate(["../articles/"+id], { relativeTo: this.route });

  }
   
  updateArticle( id:string ) {
      this.router.navigate(["../articles/"+id+"/update"], { relativeTo: this.route });

  } 
 
   
    readUrl(event:any) {
    if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();

        reader.onload = (event:any) => {
            this.banner = event.target.result;
           // console.log(this.banner) ;
       }
        
        reader.readAsDataURL(event.target.files[0]);
        this.isValid = false ; 
        this.read = event.target.files[0] ; 
        if (this.banner !=""){
         //   this.banner = resizeb64(this.banner,  '1000' , "800"); 
      
        // console.log(this.store.banner) ;}
     }
    }
        
            
      
}
    subarticles:any = []; 
 getPage (page){
            
     this.loading2 = true ; 
     this.storeService.getSoldoutArticlesByStoreTitle(this.storetitle, (page-1)*this.size, this.size)
                     .subscribe( 
                          data=>{
                       
                             
                              this.subarticles = data ;
                              this.display2= true ; 
                              if (this.subarticles.length ===0 ) {
                                  this.nothing = true ; 
                                  
                                  }
                              else 
                                  this.nothing = false ; 
                               this.display1 = true ; 
                               for ( let i = 0; i < this.subarticles.length; i++) {
                                   console.log(this.subarticles[i]) ; 
                                   this.disp[this.subarticles[i]._id ] = false ; 

                                    this.subarticles[i]._source.pic = this.picService.getPicLink(this.subarticles[i]._source.picname) ;

                                /*  this.storeService.getPic( this.articles[i]._id )
                                  .subscribe(
                                      data2=> {
                                         
                                          this.articles[i]._source.pic= data2['pic'] ; 
                                         this.page = page ; 
                                      }
                                      ,error2=>{
                                          console.log(error2) ; 
                                          });
                              */
                              }   
                                  
                              
                                this.selectArticles =  this.selectArticles.concat(this.subarticles) ; 
                               this.loading2 = false ;  
                        }, error=>{
                          console.log(error) ;   
                            this.loading2 = false ;   
                         } ) ; 
            
     
     }
    
       _toggleSidebar() {
    this.opened = !this.opened;
  }
    onclose (e) {
        
      this.menuhide=false ;   
     }
    
     onopen (e) {
        this.menuhide= true ;
        }
      ngOnDestroy(){
           this.sub.unsubscribe(); 
          // this.permissionsService.flushPermissions();
       // this.rolesService.flushRoles();
         
     }
        
    public openDrawer() {
        this.drawer.showDrawer();
    }

    public onCloseDrawerTap() {
        this.drawer.closeDrawer();
    }
    
    
       @ViewChild(RadSideDrawerComponent, { static: false }) public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }
  
    
    
      displ(a) {
         this.disp[a]= !this.disp[a];
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
    
  

     public onSelectTap() {
       // this.isSingleMode = false;

        let context = imagepicker.create({
            mode: "single"
        });
        this.startSelection(context);
    }


 
private startSelection(context) {
        let that = this;

        context
        .authorize()
        .then(() => {
          
         
            return context.present();
        })
        .then((selection) => {
           //that.imageSrc =  selection.length > 0 ? selection[0] : null;

            let  extension = selection[0]._android.split('.').pop() ;
            if( extension =="png" || extension =="jpg" ||  extension =="jpeg" ){
              this.alertimg = false ; 
                const img:ImageSource = <ImageSource> fromFile(selection[0]._android);
           
                 this.store.banner = this.banner; 
                 this.banner  =  "data:image/"+extension+";base64,"+img.toBase64String(extension );
              //  console.log(this.banner) ; 
                        this.isValid = false ; 

            }else 
                this.alertimg = true ; 
                
           
            
        }).catch(function (e) {
            console.log(e);
        });
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
   
  ontouch2(args: TouchGestureEventData) {
    const label = <GridLayout>args.object
    switch (args.action) {
        case 'up':
            label.deletePseudoClass("pressed");
            break;
        case 'down':
            label.addPseudoClass("pressed");
            break;
    }
   
}

  
    
    
    
} 





