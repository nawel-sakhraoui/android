import { Component, OnInit , OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {StoreService, CartService, SearchService, PicService} from '../_services/index'; 
import {Store, Article, ArticleCart} from '../_models/index';
import {Subscription} from 'rxjs';
import * as prettyMs from 'pretty-ms'; 
//import * as b64 from 'resize-base64';  
import { NgxPicaService } from 'ngx-pica';
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit{
        
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
 menuhide = false ; 
  maxcart = 30 ; 
    alertimg :boolean ; 
    saveloading:boolean=false  ; 
  busy: Subscription;
  busy2: Subscription;
  busy3: Subscription;
  open:boolean ; 
  extension:string ; 
  nostore = false ; 
  storetitle: string ="" ;   
  userid : string = '' ;
  store : any= {} ; 
  isValid :boolean = true ;
    file:any ; 
  private sub :any ;
  selectArticles :any =[] ; 
  articles :any= [] ; 
  read :any ='' ; 
  banner = ""; 
  query = ""; 
  fullcartwarning:boolean; 
    share = false ; 
    loading0=false ; 
    loading = false ; 
    loading2 = false ; 
    display1 = false ; 
    display2 = false ; 
    page= 1; 
    size = 20; 
    tempbannername :string=""; 
    totalArticles =0;
    nosearch :boolean ;
    nothing : boolean ; 
    suspend :boolean ;

    private notif:any= {} ;
    private opened: boolean = true ;
  constructor(
            private route: ActivatedRoute,
            private router: Router,
            private storeService: StoreService, 
            private cartService: CartService, 
            private searchService : SearchService, 
            private rolesService:  NgxRolesService ,
            private picService :PicService,  
            private permissionsService : NgxPermissionsService,
            private _ngxPicaService: NgxPicaService ){}
 
    
    ngOnInit() {
        this.loading0 = true ; 
        console.log('store') ; 
        this.route.params.subscribe(params => {
        console.log (params) ;
            
        this.storetitle = params['store']; // (+) converts string 'id' to a number
        
        this.storeService.getSuspend (this.storetitle )
        .subscribe(     
        data0 =>{
            this.suspend = data0['suspend']; 
            console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz") ; 
            console.log(this.suspend) ; 
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
                       if (this.me  == "annonym") 
                           this.rolesService.addRole('GUEST', ['readStore' ]); 
                       else 
                          this.rolesService.addRole('USER', ['readStore']);
                     
                     
                     }
                     
                 
                         
             
                         
                     this.storeService.getStore( this.storetitle)
                     .subscribe(
                         data1=> {
                             this.loading0=false ; 
                             this.display1 = true ; 
                             this.store = data1 ; 
                             console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

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
                                  
                            
              
                                 
                                 
                         /*     this.loading = true ; 
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
                           */      
                            
                    this.storeService.getArticlesCount (this.storetitle, true)
                    .subscribe(
                        data1=> {
                            //console.log("XXXXXXXXXXXXXXXXXXXX"); 
                           // console.log(data1) ;
                            this.totalArticles = data1['count'] ; 
                           
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
             //this.loading = true ; 
                            
                              if (this.store.hasOwnProperty('bannername')){
                              
                                    this.banner = this.picService.getBannerLink(this.store.bannername) ; 
                                    this.store.banner = this.banner ; 
                                    this.tempbannername = this.store.bannername ;
                                    // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"); 
                                    //console.log(this.banner) ;
                                  this.loading0 = false ;  

    
                               }else{
                                  
                                   this.store.banner = "" ;
                                  this.banner ="" ; 
                                  this.loading0 = false ;
                               } 
                /* this.busy= this.storeService.getBanner(this.storetitle)
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
         ) 
       });
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
 
    
        if (this.query!="" ) {
        let q= this.query;
        //search article in store 
         this.searchService.searchArticlesStore(this.storetitle, this.query, true )
         .subscribe(
             data => {
                 console.log(data ) ;
                 this.selectArticles = data;
                 if (this.selectArticles.length ==0 ) 
                        this.nosearch = true ; 
                 else 
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
         this.saveloading = true ; 
         console.log(this.file) ; 
  
         this._ngxPicaService.compressImage(this.file, 0.7)//.resizeImage(this.file, 1000, 800)//  {keepAspectRatio: true, forceMinDimensions:false })
            .subscribe((imageResized: File) => {
                let reader: FileReader = new FileReader();
                 reader.addEventListener('load', (event: any) => {
                      this.banner = event.target.result;
                      console.log(this.banner) ; 
                }, false);
                
                reader.readAsDataURL(imageResized);
                this.file = imageResized ; 
                console.log(this.file) ; 
                
         
         
       if (this.tempbannername !="" ) {
         //remove before add 
           this.picService.deleteBanner(this.tempbannername ) 
           .subscribe (
               data => {
                     console.log(data) ; 
                  // let e =this.extension ; 
                   //if (this.extension=="jpg") 
                    //e= "jpeg" ; 
                   // let file  =   new File( [window.atob(this.banner)], this.storetitle+'.'+this.extension, {type: "image/"+e}) ;
                   //console.log(file)   ; 
                   
                   
                   
                     this.picService.putBanner( this.storetitle+'.'+this.extension, this.file,  this.extension)
                    .subscribe(
                        data=>{
                              console.log(data) ; 
                               this.isValid =true ; 
                               this.store.banner = this.banner ;  
                                // this.router.navigate([this.returnUrl]);
                               
                                this.storeService.putBannerName( this.storetitle , this.storetitle+'.'+this.extension)
                               .subscribe( data =>{ console.log('done'); this.tempbannername= this.store.bannername;   this.saveloading = false ; } 
                               ,error=>{  this.saveloading = false ;   });
         
                        }
                        ,error=>{
                              console.log(error) ;   this.saveloading = false ;
                        
                        }) ;
                    
                         //this.images.push(path.replace(/^.*[\\\/]/, ''));
                  
                      
                                    
                       
                        },
                        error => {
                            
                            console.log(error) ; 
                           // this.alertService.error(error2);
                           this.saveloading = false ;
                        });
                        
                     
                   
           
               
                
        }    else {
             let e =this.extension ; 
              //     if (this.extension=="jpg") 
              //      e= "jpeg" ;
              //     let file  =   new File([this.banner.replace(/^data:image\/\w+;base64,/, "")], this.storetitle+'.'+this.extension, {type: "image/"+e}) ;
              //    console.log(file)   ; 
                    
            this.picService.putBanner( this.storetitle+'.'+this.extension, this.file ,  this.extension)
                    .subscribe(
                        data=>{
                             console.log(data) ; 
                                   this.isValid =true ; 
                           ;
                                   this.store.banner = this.banner ;  
                                 // this.router.navigate([this.returnUrl]);
                                 this.saveloading = false ;
                                this.storeService.putBannerName( this.storetitle , this.storetitle+'.'+this.extension)
                               .subscribe( data =>{ console.log('done'); this.tempbannername= this.store.bannername} 
                               ,error=>{ });
         
                        }
                        ,error=>{
                              console.log(error) ;   this.saveloading = false ;
                        
                        }) ;
           
           }
         
         
            }, (err ) => {
                throw err.err;
            })
         
         //this.file = this.blobToFile(this.banner, this.storetitle+'.'+this.extension) ;
         //console.log(this.file) ; 
         

         
     /*  this.storeService.postBanner(this.storetitle, this.banner)
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
                          
                        });*/
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
    if (this.store.banner=='') 
       this.banner ="" ; 
     else 
        this.banner =  this.store.banner ;  
       this.store.bannername = this.tempbannername ;        
  }                   


 
  

  gotoArticle( id:string ) {
      this.router.navigate(["/stores/"+this.storetitle+"/articles/"+id]);

  }
   
  updateArticle( id:string ) {
      this.router.navigate(["/stores/"+this.storetitle+"/articles/"+id+"/update"]);

  } 
 
   
readUrl(event:any) {
    if (event.target.files && event.target.files[0]) {
        this.extension =event.target.files[0]['name'].split('.').pop() ; 
        if( this.extension =="png" || this.extension =="jpg" ||  this.extension =="jpeg" ){
              this.alertimg = false ; 
              this.isValid = false ; 
              let reader = new FileReader();
              reader.onload = (event:any) => {
                        this.banner = event.target.result;
                        console.log(this.banner) ;
              }
              reader.readAsDataURL(event.target.files[0]);
              
               
              this.file = event.target.files[0];
        //     console.log(this.file[0]) ; 
      /*  console.log(event.target.files[0]) ; 
        this.extension =event.target.files[0]['name'].split('.').pop() ; 
     ;
   ;                 
        var reader = new FileReader();
       
       reader.onload = (event:any) => {
            this.banner = event.target.result;
             console.log(this.banner) ;
        }
        reader.readAsDataURL(event.target.files[0]);
        this.isValid = false ; 
        
        this.file = event.target.files[0]; 
        // console.log(event.target.files[0]) ; 
        //   if (this.banner !="")
       // console.log(this.banner) ; 
       // this.banner = b64(this.banner,  500,800 ); 
      

        /* this.compressImage(this.banner, 100, 100).then(compressed => {
                this.banner = compressed;          
                console.log(this.banner) ; 
          })   */ 
            
        }else{
            
            this.alertimg = true ; 
        }
    }
        
  
            
      
}
    
 getPage (page){
            this.loading2 = true ; 
            this.storeService.getArticlesByStoreTitle(this.storetitle, (page-1)*this.size, this.size)
                     .subscribe( 
                          data=>{
                              console.log('articles'); 
                             
                              this.articles = data ;
                             this.display2 = true ;
                              console.log(data) ; 
                               if (this.articles.length == 0 ) 
                                this.nothing = true ; 
                              else 
                                   this.nothing = false  ; 
                              for ( let i = 0; i < this.articles.length; i++) {
                                   console.log(this.articles[i]) ; 
                                  this.articles[i]._source.pic = this.picService.getPicLink(this.articles[i]._source.picname) ;

                                  
                                  
                                  /*  this.storeService.getPic( this.articles[i]._id )
                                  .subscribe(
                                      data2=> {
                                         
                                         this.articles[i]._source.pic= data2['pic'] ; 
                                         this.page = page ; 
                                      }
                                      ,error2=>{
                                          console.log(error2) ; 
                                          });*/
                              
                              }   
                               this.selectArticles =  this.articles ;
                               this.loading2 = false ; 
                                  
                        }, error=>{
                          console.log(error) ;     
                            this.loading2 = false ; 
                         } ) ; 
             
     
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
    

  compressImage(src, newX, newY) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const elem = document.createElement('canvas');
      elem.width = newX;
      elem.height = newY;
      const ctx = elem.getContext('2d');
      ctx.drawImage(img, 0, 0, newX, newY);
      const data = ctx.canvas.toDataURL();
      res(data);
    }
    img.onerror = error => rej(error);
  })
}

    
} 




