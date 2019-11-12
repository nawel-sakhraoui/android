import {Component,ViewChild, OnDestroy, OnInit, AfterViewInit,  ChangeDetectorRef, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {StoreService, CartService, SearchService} from '../_services/index'; 
import {Subscription} from 'rxjs';
//import * as prettyMs from 'pretty-ms'; 
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { SearchBar } from "tns-core-modules/ui/search-bar"; 

//import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  
import * as imagepicker from "nativescript-imagepicker"; 

import {ImageSource, fromFile, fromResource, fromBase64} from "tns-core-modules/image-source";
 
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions'; 

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit , OnDestroy{
  maxcart =30 ;
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
 menuhide = false ; 
  boolNotif = false ;
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
  selectArticles :any =[] ; 
  articles :any= [] ; 
  read :any ='' ; 
  banner = "";
    displaybanner = false ;  
  query = ""; 
  fullcartwarning:boolean; 
    share = false ; 
    loading0=false ; 
    loading = false ; 
    loading2 = false ; 
    display1 = false ; 
    display2 = false ; 
    page= 1; 
    size = 4; 
    totalArticles =0;
    nosearch :boolean ;
    nothing : boolean ; 
    suspend :boolean ;
    disp =[] ; 
    maxpage = 1; 
    alertimg = false ; 
    notifCount= 0 ; 
  private notif:any= {} ;
     private opened: boolean = true ;
  constructor(
            private route: ActivatedRoute,
            private router: Router,
            private storeService: StoreService, 
            private cartService: CartService, 
            private searchService : SearchService, 
            private rolesService:  NgxRolesService , 
            private permissionsService : NgxPermissionsService,
            private _changeDetectionRef: ChangeDetectorRef ){}
 
    
    ngOnInit() {
        this.loading0 = true ; 
        console.log('store') ; 
        this.sub = this.route.parent.params.subscribe(params => {
        console.log (params) ;
            
        this.storetitle = params['store']; // (+) converts string 'id' to a number
        
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
                             this.loading0=false ; 
                             this.display1 = true ; 
                             this.store = data1 ; 
                             console.log(this.store) ; 
                             //check if i'm the store admin
                            let admin = false ; 
                             for (let a of this.store.admins  ){
                               if( a.userid == this.me ) {
                                   admin = true ; 
                                   break ; 
                                   }
                               
                               }
       
                             console.log(this.me) ; 
                             console.log(this.store.userid) ; 
                             
                             if (this.me == this.store.userid ||  admin ) {
                                 
                                    this.permissionsService.addPermission('writeStore', () => {
                                          return true;
                                    })
                    
                                  
                                    this.rolesService.addRole('ADMINStore', ['readStore','writeStore' ]);
                                 
                             }else
                                             this.permissionsService.removePermission('writeStore');

                                 
                                  
                               
              
                                 
                                 
                              this.loading = true ; 
                             this.busy= this.storeService.getBanner(this.storetitle)
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
                                 
                            
                             this.storeService.getArticlesCount (this.storetitle, true)
                    .subscribe(
                        data1=> {
                            //console.log("XXXXXXXXXXXXXXXXXXXX"); 
                           // console.log(data1) ;
                            this.totalArticles = data1['count'] ; 
                            this.maxpage = Math.ceil( this.totalArticles/this.size)  ; 
                            }
                        ,error1 =>{
                            console.log(error1) ; 
                           }
                        
                        )
                    
                    this.getPage(1);  
                            
                        },error1 => {
                            this.display1 = true ; 
                              console.log(error1);    
                             this.loading0 = false ; 
                        });
      
               

           
               }
                
                ,error0=>{
                            this.display1 = true ; 
                             this.loading0 = false ;  
                        this.nostore = true ; 
                        console.log(error0) ; 
                }); 
            
           
       
        
       }else {
             this.loading0 = false ;    
             this.display1 = true ;
             this.loading = true ; 
             this.busy= this.storeService.getBanner(this.storetitle)
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
                
                
            }}
       ,error0=>{
                console.log(error0 ) ;    
                
                }
         ) 
       })
  }
    addToCart(article){
         article.loadingcart = 1  ;

          this.cartService.getCountCart ()
          .subscribe( 
               data0 => {
                   console.log(data0) ; 
               if ( data0['cartcount']>this.maxcart){
                    
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
 
                            this.boolNotif = false ; 

        this.enterQuery2(event); 
        
        if (this.query!="" ) {
        let q= this.query;
        //search article in store 
         this.searchService.searchArticlesStore(this.storetitle, this.query, true )
         .subscribe(
             data => {

                 console.log(data ) ;
                 this.selectArticles = data;
                 if (this.selectArticles.length ==0 ) {
                        this.nosearch = true ;
                                              this.drawer.closeDrawer();
 
               }  else {
                        this.nosearch = false ; 
                for ( let i = 0; i <  this.selectArticles.length; i++) {
                               
                                  this.storeService.getPic(this.selectArticles[i]._id )
                                  .subscribe(
                                      data2=> {
                                         
                                         this.selectArticles[i]._source.pic= data2['pic'] ; 
                                      ; 
                                      }
                                      ,error2=>{
                                          console.log(error2) ; 
                                          });
                              
                }   
                 
                }
                 this.query = '' ; 
                 this.drawer.closeDrawer();
             }, error =>{
                 console.log(error ) ; 
                         this.drawer.closeDrawer();

             }) ;
    //  this.selectArticles=  this.articles.filter(function(element){console.log(element['_source']['title']) ; return element['_source']['title'].includes(q);});
       }   else {
        
 
              this.selectArticles = this.articles ; 
                    this.nosearch = false ;  
                    this.drawer.closeDrawer();
            
            }
  
    }
    enterQuery2(event){
      let searchBar = <SearchBar>event.object;
       this.query = searchBar.text ;  
        
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
     //   if (this.banner !=""){
       //   this.banner = resizeb64(this.banner,  '800' , "auto"); 
      
        // console.log(this.store.banner) ;}
     //}
    }
        
            
      
}
    
 getPage (page){
            this.loading2 = true ; 
            this.storeService.getArticlesByStoreTitle(this.storetitle, (page-1)*this.size, this.size)
                     .subscribe( 
                          data=>{
                              console.log('articles'); 
                              this.articles = this.articles.concat(data)  
                              //this.articles = data ;
                                 
                             this.display2 = true ;
                              console.log(data) ; 
                               if (this.articles.length == 0 ) 
                                this.nothing = true ; 
                              else 
                                   this.nothing = false  ; 
                              for ( let i = 0; i < this.articles.length; i++) {
                                   console.log(this.articles[i]) ; 
                                   this.disp[this.articles[i]._id ] = false ; 
                                  this.storeService.getPic( this.articles[i]._id )
                                  .subscribe(
                                      data2=> {
                                         
                                         this.articles[i]._source.pic= data2['pic'] ; 
                                         this.page = page ; 
                                      }
                                      ,error2=>{
                                          console.log(error2) ; 
                                          });
                              
                              }   
                               this.selectArticles =  this.articles ;
                               this.loading2 = false ; 
                                  
                        }, error=>{
                          console.log(error) ;     
                            this.loading2 = false ; 
                         } ) ; 
             
     
     }
  
    
    ngOnDestroy(){
           this.sub.unsubscribe(); 
   //        this.permissionsService.flushPermissions();
    //    this.rolesService.flushRoles();
         
     }
    
  
 
    _toggleSidebar() {
    this.opened = !this.opened;
  }
    onclose(e) {
        
      this.menuhide=false ;   
     }
    onopen (e) {
        this.menuhide= true ;
        }
    
    
    public openDrawer() {
        this.drawer.showDrawer();
        this.boolNotif = false ; 
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
    
      display(a) {
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
    
       sBLoaded(args){
        let searchbar:SearchBar = <SearchBar>args.object;
        
            
            searchbar.android.clearFocus();
        
    }
   onClear(args){
        let searchbar:SearchBar = <SearchBar>args.object;

        searchbar.dismissSoftInput();
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
    
    OnNotifCount(event) {
        this.notifCount= event ; 
       }

} 




