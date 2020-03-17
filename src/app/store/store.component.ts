import {Component,ViewChild, OnDestroy ,OnInit, AfterViewInit,AfterContentInit,  ChangeDetectorRef, ElementRef,NgZone  } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {PicService, StoreService, CartService, SearchService} from '../_services/index'; 
import {Subscription} from 'rxjs';
//import * as prettyMs from 'pretty-ms'; 
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { SearchBar } from "tns-core-modules/ui/search-bar"; 
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label'; 
import {Image } from 'tns-core-modules/ui/image'; 
//import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  
import * as imagepicker from "nativescript-imagepicker"; 
import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";
import {ImageSource, fromFile, fromResource, fromBase64} from "tns-core-modules/image-source";
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions'; 
import {Folder, path, knownFolders} from "tns-core-modules/file-system"; 
import * as BitmapFactory from "nativescript-bitmap-factory"; 


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit , OnDestroy,  AfterViewInit{

  maxcart =30 ;
  subarticles :any =[]  ; 
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
  menuhide = false ; 
  boolNotif = false ;

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
    size = 6; 
    totalArticles =0;
    nosearch :boolean ;
    nothing : boolean ; 
    suspend :boolean=false ;
    disp =[] ; 
    maxpage = 1; 
    alertimg = false ; 
    notifCount= 0 ; 
    saveloading = false ; 
    bannerExt="";
    tempbannername ="" ;
    imgbanner :ImageSource ;  
    private notif:any= {} ;
    private opened: boolean = true ;
    reload = false ; 
  constructor(
            private route: ActivatedRoute,
            private router: Router,
            private storeService: StoreService, 
            private cartService: CartService, 
            private searchService : SearchService, 
            private rolesService:  NgxRolesService , 
            private permissionsService : NgxPermissionsService,
            private _changeDetectionRef: ChangeDetectorRef, 
            private ngZone : NgZone, 
            private picService :PicService ){
      
            }
 
   
     
    ngOnInit() {
     this.init() 
 
  }
    
    init(){
        
           this.loading0 = true;
        this.loading = true ;  
        this.loading2 = true ;
        
        
        this.route.params.subscribe(params => {
     
            
        this.storetitle = params['store']; // (+) converts string 'id' to a number
         
       // this.storetitle= this.storetitle.replace(/ /g, "%20");
     
        
        
        this.storeService.getSuspend(this.storetitle )
        .subscribe(     
           data0 =>{
               this.reload= false ; 
           // console.log(data0) ; 
            this.nostore = false ; 
              this.suspend = data0['suspend']; 
            console.log(this.suspend) ; 
            if (!this.suspend) {         
            this.storeService.getStoreStatus( this.storetitle )
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
                             
                                   console.log(this.store) ;   
                              if (this.store.hasOwnProperty('bannername')){
                              
                                    this.banner = this.picService.getBannerLink(this.store.bannername) ; 
                                    this.store.banner = this.banner ; 
                                    this.tempbannername = this.store.bannername ;
                                    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"); 
                                    console.log(this.banner) ;
                                  this.loading0 = false ;  

    
                               }else{
                                  
                                   this.store.banner = "" ;
                                  this.banner ="" ; 
                                  this.loading0 = false ;
                               }
                             
                             this.loading=false ;  
                             console.log(this.store) ; 
                             //check if i'm the store admin
                             let admin = false ; 
                             if (this.store.hasOwnProperty("administrators") ) 
                             for (let a of this.store.administrators  ){
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

                                 
                          
                      /*        this.picService.getBanner(this.storetitle)
                                 .subscribe (
                                        data=>{
                                         //    this.ngZone.run(() => {
                                            try {
                                              console.log(data);
                                                this.banner = JSON.parse(data['banner'] );
                                              // console.log(this.banner) ;  
                                               this.store.banner = this.banner; 
                                                
                                                this.loading0 = false ; 
                                            }catch(error) {
                                                this.banner = "" ; 
                                                this.loading0 = false ; 
                                               }
                                        //   });
                                            
                                        }
                                        ,error=>{
                                            this.loading0 = false ; 
                                            console.log(error) ;     
                                        }
                                     ); 
                                 */
                            
                       this.storeService.getArticlesCount (this.storetitle, true)
                       .subscribe(
                       data1=> {
                            console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"); 
                           console.log(data1) ;
                            this.totalArticles = data1['count'] ; 
                            this.maxpage = Math.ceil( this.totalArticles/this.size)  ;
                          
                               
                          if( this.totalArticles == 0) {
                                this.nothing = true ; 
                              this.loading2 = false ;
                          }else {
                               this.nothing =false ; 
                                this.getPage(1);
                              }
                            }
                        ,error1 =>{
                            console.log(error1) ; 
                            this.loading2 = false ; 
                           }
                        
                        )
                    
                   
                            
                        },error1 => {
                            this.display1 = true ; 
                              console.log(error1);    
                             this.loading0 = false ; 
                            this.loading = false ; 
                            this.loading2 = false ; 
                        });
      
               

           
               }
                
                ,error0=>{
                            this.display1 = true ; 
                             this.loading0 = false ;  
                    this.loading=false ; 
                    this.loading2=false ; 
                   this.nostore = true ; 
                 
                        console.log(error0) ; 
                }); 
            
           
       
        
       }else {
           
        this.loading = false ;  
        this.loading2 = false; 
            this.storeService.getBanner(this.storetitle)
             .subscribe (
                                        data=>{
                                            try {
                                                this.banner = data['banner'] ;  
                                                this.store.banner = this.banner; 
                                                console.log(data);
                                                this.loading0 = false ; 
                                            }catch(error) {
                                                this.banner = "" ; 
                                                this.loading0 = false ; 
                                               }
                                            
                                        }
                                        ,error=>{
                                            this.loading0 = false ; 
                                            console.log(error) ;     
                                        }
                                     );    
                
                
            }}
       ,error0=>{
                console.log(error0 ) ;    
                this.loading0 = false  ; 
         //  this.nostore= true ; 
                this.loading= false ; 
           this.reload = true ; 
                this.loading2= false ; 
                }
         ) 
               }); 
        
        
        }
    
    addToCart(article){
         article.loadingcart = 1  ;

          this.cartService.getCountCart()
          .subscribe( 
               data0 => {
                   console.log(data0) ; 
               if ( data0['cartcount']>this.maxcart){
                    
                   this.fullcartwarning = true ;  
                     article.loadingcart = 3; 
               }else{
                    this.fullcartwarning = false ;
        
                    console.log(article) ; 
                    this.cartService.postToCart( article._id  ) 
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
        
 
              this.selectArticles = this.articles.map(x => x)  ; 
                    this.nosearch = false ;  
                    this.drawer.closeDrawer();
            
            }
  
    }
    enterQuery2(event){
      let searchBar = <SearchBar>event.object;
       this.query = searchBar.text ;  
        
      if (this.query =="" ) 
      {
             this.selectArticles = this.articles.map(x => x)  ; 
                    this.nosearch = false ; 
          }
        
    }
    
    
     covsave() {
       this.saveloading = true ; 
       console.log ('saving cover') ; 
         
       if (this.tempbannername !="" ) {
         //remove before add 
           this.picService.deleteBanner(this.tempbannername ) 
           .subscribe (
               data => {
                     console.log(data ) ; 
                       this.picService.putBanner(this.store.bannername, this.banner, this.bannerExt)//postBanner(this.storetitle, this.banner)
                       .subscribe(
                        data => {
                         this.ngZone.run(() => {
                         //this.images.push(path.replace(/^.*[\\\/]/, ''));
                  
                            this.isValid =true ; 
                            //console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
                            //console.log(data)  ;
                            this.store.banner = this.banner ;  
                           // this.router.navigate([this.returnUrl]);
                           this.saveloading = false ;
                           this.storeService.putBannerName( this.storetitle , this.store.bannername)
                            .subscribe( data =>{ console.log('done'); this.tempbannername= this.store.bannername} 
                            ,error=>{ });
         
                                    
                         });
                        },
                        error => {
                            
                            console.log(error) ; 
                           // this.alertService.error(error2);
                           this.saveloading = false ;
                        });
                        
                     
                   
                   },error=>{}
               
               ) 
        }    else {
           
           
     
       this.picService.putBanner(this.store.bannername, this.banner, this.bannerExt)//postBanner(this.storetitle, this.banner)
          .subscribe(
                        data => {
                         this.ngZone.run(() => {
                         //this.images.push(path.replace(/^.*[\\\/]/, ''));
                  
                            this.isValid =true ; 
                            console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
                            console.log(data)  ;
                            this.store.banner = this.banner ;  
                             this.tempbannername = this.store.bannername ; 
                           // this.router.navigate([this.returnUrl]);
                           this.saveloading = false ;
                           this.storeService.putBannerName( this.storetitle , this.store.bannername)
                            .subscribe( data =>{ console.log('done');} 
                            ,error=>{ });
         
                                    
                         });
                        },
                        error => {
                            
                            console.log(error) ; 
                           // this.alertService.error(error2);
                           this.saveloading = false ;
                        });
       /*this.storeService.postCover(this.storename, this.read)
       .then((result) => {
            console.log(result);
        }, (error) => {
            console.error(error);
        });
         */
           
           }
  }
    
    
   covremove(){
    this.isValid = true ; 
    this.store.bannername =  this.tempbannername ; 
    this.banner = this.store.banner ;   
    
   // this.imgbanner = <ImageSource> ImageSource.fromFileSync(this.banner);
      
  }                   


 
  

  gotoArticle( id:string ) {
      this.router.navigate(["./../articles/"+id], { relativeTo: this.route });

  }
   
  updateArticle( id:string ) {
      this.router.navigate(["./../articles/"+id+"/update"], { relativeTo: this.route });

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
           
            this.storeService.getArticlesByStoreTitle(this.storetitle, (page-1)*this.size, this.size)
                     .subscribe( 
                          data=>{
                              console.log('articles'); 
                             this.subarticles = data ; 
                              console.log(data) ; 
                              this.page = page ; 
                              for ( let i = 0; i < this.subarticles.length; i++) {
                                  // console.log(articles[i]) ; 
                                   this.disp[this.subarticles[i]._id ] = false ; 
                                  this.subarticles[i]._source.pic = this.picService.getPicLink(this.subarticles[i]._source.picname) ;
                               /*   this.storeService.getPic( this.subarticles[i]._id )
                                  .subscribe(
                                      data2=> {
                                         
                                         this.subarticles[i]._source.pic= data2['pic'] ; 
                                      }
                                      ,error2=>{
                                          console.log(error2) ; 
                                          });
                                */
                              }   
                          
                              this.articles = this.articles.concat(this.subarticles)  
                              //this.articles = data ;
                              this.selectArticles =  this.articles.map(x => x) ;

                              if (this.articles.length == 0 ) 
                                this.nothing = true ; 
                              else 
                                   this.nothing = false  ;  
                           
                               this.loading2 = false ; 
                                  
                        }, error=>{
                          console.log(error) ;     
                            this.loading2 = false ; 
                         } ) ; 
             
     
     }
  
    
    ngOnDestroy(){
        //  this.sub.unsubscribe(); 
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
    
    
       @ViewChild(RadSideDrawerComponent, { static: false }) public  drawerComponent: RadSideDrawerComponent;
        private drawer: RadSideDrawer;


        
     ngAfterViewInit() {
               
         
              this.drawer = this.drawerComponent.sideDrawer;
                    this._changeDetectionRef.detectChanges(); 
    }
     /* ngAfterContentInit(): void {
    // a little delay so the spinner has time to show up
                setTimeout(() => {
      this.listLoaded = true;
    }, 500);
  }*/
 
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
              //selection[0].options = {width:600, height:500, keepAspectRatio:true };

           
                const img:ImageSource = <ImageSource> ImageSource.fromFileSync(selection[0]._android);
                // selection[0].options = {width:500, height:300, keepAspectRatio:true };
              //  let base =img.toBase64String(extension ); 
               
               console.log(img) ; 
                this.resizeImageSource(img, 1600).then((resizedImageSrc: ImageSource) => {
                   
               console.log(img) ; 
            
                const folderDest = knownFolders.temp();
                const pathDest = path.join(folderDest.path, selection[0]._android.split('/').pop()) ;
                const saved: boolean = resizedImageSrc.saveToFile(pathDest, extension);
                if (saved) {
                    console.log("Image saved successfully!");
                }

                     
                     
     

                
                 this.banner = pathDest ;
                
                
                console.log("aaaaaaaaaaaaaaaaaaaaaa") ; 
                console.log(this.banner) ;
                this.store.bannername = this.storetitle+'.'+extension ;  
                //    this.imgbanner = <ImageSource> ImageSource.fromFileSync(this.banner);

               //  this.store.banner = this.banner; 
                 this.bannerExt= extension;
                 
               
                 //  console.log(this.banner) ; 
                 this.isValid = false ; 
            })
            }else 
                this.alertimg = true ; 
                
           
            
        }).catch(function (e) {
            console.log(e);
        });
    }
    
    OnNotifCount(event) {
        this.notifCount= event ; 
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

    
    loadBanner() {
        this.loading0 = false ; 
     }
    
  private resizeImageSource(imageSrc:ImageSource, maxSize) : Promise<ImageSource> {
    return new Promise((resolve, reject) => {
      const bitmap = BitmapFactory.create(imageSrc.width, imageSrc.height);
      bitmap.dispose((imageBitmap) => {
        imageBitmap.insert(BitmapFactory.makeMutable(imageSrc));
        const resizedBitmap = imageBitmap.resizeMax(maxSize);
        resolve(resizedBitmap.toImageSource());
      }, (error) => { reject(error); });
    });
  }
    
    
      reloading(){
        
        console.log('reloading') ; 
      this.init() ; 
        
        
        
        }    
} 




