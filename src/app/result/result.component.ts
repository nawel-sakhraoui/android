
import {Component,ViewChild, OnInit, AfterViewInit,  ChangeDetectorRef, ElementRef  } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {CartService, StoreService, SearchService, MyhomeService, AuthenticationService} from '../_services/index'; 
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { RouterExtensions } from "nativescript-angular/router";
 
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})


export class ResultComponent implements OnInit {


  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
    maxcart =3 ; 
    search :boolean = false ;
    notfound= false ; 
    notfoundstore = false ;   
    articles:any  =[] ;  
    countStore = 0 ;  
    stores:any  =[]; 
    store0 :any ={};
    banners  =[];
    mainpics:any = []; 
    query :string= "" ; 
   
    opened = false ; 
    allCategories = [];
    categoriesAr = [];
    loading :boolean ; 
    nothing1 = false ;  
    nothing2 = false ;
    sub :any ; 
    disp:boolean[] =[]
    storedisp :boolean[] = [] ; 
 
    fullcartwarning:boolean ; 
    articlesize =6; 
    storesize =4;
    
    countarticle = 0  ; 
    countstore = 0 ;
    
    orderby = "newest"; 
    filter = "Indefinie" ; 
    filterAr="غير محدد"; 
    storepage = 1 ; 
    articlepage = 1 ;
    maxarticlepage ; 
    maxstorepage ;
    //size= 12;   
    context = ""; //"filter"; //"query"
    city : string ; 
  constructor(  private route: ActivatedRoute,
  private router: RouterExtensions, 
  private myhomeService: MyhomeService, 
  private authService: AuthenticationService,
  private searchService: SearchService, 
  private storeService : StoreService, 
  private cartService: CartService, 
  private _changeDetectionRef: ChangeDetectorRef

  ) {  this.filterAr="غير محدد"; }
  
 
  ngOnInit() {
        
       this.storeService.getCategories()
       .subscribe (
           d0 => {
               this.allCategories = d0['categories'] ; 
               console.log(d0 ) ; 
               }
           ,e0 => {
               console.log(e0 ) ; 
              }
           ) 
           this.storeService.getCategoriesAr()
                    .subscribe (
                         d1 => {
                             console.log(d1) ; 
                                 this.categoriesAr = d1['categories']; 
                             
                        
         
    this.searchService.sendcity.subscribe((data00)=>{
                 this.loading = true ; 

         this.city = data00['city'] ; 
        console.log(this.city) ; 
     
             
     this.searchService.sendFilters.subscribe((data1)=> {
                   //    window.scroll(0,0);

                 console.log(data1)  ; 
          if (Object.keys(data1).length === 0 ) 
            this.nothing1 = true ; 
             if ( 'filter' in data1 && "orderby" in data1 ) {
                 this.filter = data1['filter']; 
                 this.orderby = data1['orderby']; 
               
                 //this.filterAr = this.categoriesAr[data1['pos']];
                  //  console.log(this.filterAr) ;
                 this.context = "filter"; 
            
          
                 this.searchService.getCountStores(this.filter, this.city)
                  .subscribe(
                   d3  => {
                       console.log(d3) ; 
                       this.countstore = d3['count'];
                       console.log(this.countstore) ; 
                       this.maxstorepage = Math.ceil( this.countstore/this.storesize)  ; 

                       this.getStorePage(1);  
                       },e3 =>{
                       console.log(e3) ; 
                     });
                 
                       this.searchService.getCountArticles (this.filter, this.city)
                         .subscribe(
                           d4  => {
                             //  console.log(d4) ; 
                               this.countarticle = d4['count'];
                              this.maxarticlepage = Math.ceil( this.countarticle/this.articlesize)  ; 

                               this.getArticlePage(1); 
                                
                             },e4 =>{
                                  console.log(e4) ; 
                           });
                      
                   
                    
                  
          
            }
               });
             
                              },e1=>{
                                    console.log(e1) ; 
                             } );
       this.searchService.sendSearchs.subscribe((data) =>{
             console.log(data) ; 
         
             // window.scroll(0,0);
              if (Object.keys(data).length === 0 ) 
                      this.nothing2 = true ; 

           if( 'query' in data ) {
               this.query = data['query'] ;
                this.context = "query" ; 
           if (this.query !="") { 
                //count store and count article 
                 this.searchService.getCountStores2(this.filter, this.query, this.city)
                  .subscribe(
                   d3  => {
                       console.log(d3) ; 
                       this.countstore = d3['count'];
                     this.maxstorepage = Math.ceil( this.countstore/this.storesize)  ; 

                       this.getStorePage(1 ) ; 
                  },e3 =>{
                 
                       console.log(e3) ; 
                     });
                  
                   this.searchService.getCountArticles2 (this.filter, this.query, this.city)
                   .subscribe(
                       d4  => {
                              console.log(d4) ; 
                              this.countarticle = d4['count'];
                            this.maxarticlepage = Math.ceil( this.countarticle/this.articlesize)  ; 

                               this.getArticlePage(1); 
 
                                
                             },e4 =>{
                                  console.log(e4) ; 
                           });
                      
                   
                
  
          } 
          
          }
          
          });
             }); 
             if (this.nothing1 && this.nothing2)  
                               this.router.navigate(["../"], { relativeTo: this.route });
 
     }
    
     gotoArticle( id:string , storeid : string ) {
     
         this.router.navigate(["../../../stores/"+storeid+"/articles/"+id], { relativeTo: this.route });

     }
    
    gotoStore(id){
                 this.router.navigate(["../../../stores/"+id], { relativeTo: this.route });

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
    
      updateArticle( id:string, storeid :string ) {
      this.router.navigate(["../../stores/"+storeid+"articles/"+id+"/update"], { relativeTo: this.route });

  } 
        mouseEnter(a){
   // console.log(a ); 
      this.disp[a] = true ; 
   }

   mouseLeave(a){
     //   console.log(a );  
          this.disp[a] =false ; 

   }
    
   
    
      onclose(e) {
        this.opened = false ; 
    }
    
    onopen(e) {
        this.opened = true ; 
    }
    _toggleSidebar(){
        
        this.opened = !this.opened ; 
       }
    
  
    
    selectFilter(e, i ) {
        this.stores= [] ; 
        this.articles = [] ; 
          this.filter= e ;
          this.filterAr = this.categoriesAr[i];
          
          
         // window.scroll(0,0);

          if (this.query =="") {
              //change filter 
           if (this.filter != "Indefinie" ) {
               this.context = "filter"; 
                  this.searchService.getCountStores(this.filter, this.city)
                  .subscribe(
                   d3  => {
                       console.log(d3) ; 
                       this.countstore = d3['count'];
                        this.maxstorepage = Math.ceil( this.countstore/this.storesize)  ; 

                       this.getStorePage(1);  
                       },e3 =>{
                       console.log(e3) ; 
                     });
                 
                       this.searchService.getCountArticles (this.filter, this.city)
                         .subscribe(
                           d4  => {
                               console.log(d4) ; 
                               this.countarticle = d4['count'];
                       this.maxarticlepage = Math.ceil( this.countarticle/this.articlesize)  ; 

                               this.getArticlePage(1); 
                                
                             },e4 =>{
                                  console.log(e4) ; 
                           });
 
               
               
              }else {
                console.log ('go to main' ) ;
                // go to main  no query and no filter 
               this.router.navigate(["../"], { relativeTo: this.route });

               }
              
              }else {
               this.context ="query";
                 this.searchService.getCountStores2(this.filter, this.query, this.city)
                  .subscribe(
                   d3  => {
                       console.log(d3) ; 
                       this.countstore = d3['count'];
                      this.maxstorepage = Math.ceil( this.countstore/this.storesize)  ; 

                       this.getStorePage(1 ) ; 
                  },e3 =>{
                 
                       console.log(e3) ; 
                     });
                  
                   this.searchService.getCountArticles2 (this.filter, this.query, this.city)
                   .subscribe(
                       d4  => {
                              console.log(d4) ; 
                              this.countarticle = d4['count'];
                            this.maxarticlepage = Math.ceil( this.countarticle/this.articlesize)  ; 
         
                               this.getArticlePage(1); 
 
                                
                             },e4 =>{
                                  console.log(e4) ; 
                           }); 
              
              }
        this.opened = false ; 
      }
    
   getArticlePage (page ){
        
       
       if (this.context == "filter") {
       if (this.filter !="Indefinie")  {

        
           this.searchService.getArticles (this.articlesize, (page-1)*this.articlesize, this.filter, this.orderby, this.city )
        .subscribe(
            data2 => {
            //    console.log(data2 ) ; 
                //this.articles = data2['hits']['hits'] ; 
                this.articles = this.articles.concat(data2['hits']['hits'] )  ;

                this.articleprocess() ; 
                     
                 this.articlepage = page ; 
                 this.loading = false ;
                  this.search = true ;
            },error2 =>{
               console.log(error2) ; 
                this.loading = false ; 
            }) ;   
    
       }}else {
       if(this.context =="query")  {
         
         this.searchService.getQueryArticles (this.articlesize, (page-1)*this.articlesize, this.filter, this.orderby, this.query , this.city)
        .subscribe(
            data2 => {
                //console.log(data2 ) ; 
                this.articles = data2['hits']['hits'] ; 
                this.articleprocess() ;
                this.articlepage = page ; 
                this.loading = false ;
                this.search  = true  ;  
            },error2 =>{
               console.log(error2) ; 
                this.loading = false ; 
            }) ;  
       
                
         
  
         }
       }
   }
    
    
    getStorePage (page ) {
        
        if (this.context =="filter"){
           if (this.filter !="Indefinie")  {
                this.searchService.getStores ( this.storesize, (page-1)*this.storesize, this.filter, this.orderby, this.city )
        .subscribe(
            data => {
                console.log(data ) ; 
                //this.stores = data["hits"]["hits"]; 
                this.stores = this.stores.concat(data['hits']['hits'] )  ;

                this.storeprocess()  ; 
                this.storepage = page ; 
                this.loading = false ; 
                 this.search = true ;
                
            },error =>{
                console.log(error) ; 
                this.loading = false ; 
            }) ;   
            }
         }else{
          if (this.context == "query"){
                  this.searchService.getQueryStores( this.storesize, (page-1)*this.storesize, this.filter, this.orderby, this.query , this.city)
        .subscribe(
            data => {
                console.log(data ) ; 
                this.stores = data["hits"]["hits"]; 
                      this.storeprocess()  ; 
                 this.storepage = page ; 
         
                this.loading = false ;
                this.search = true ;  
            },error =>{
                console.log(error) ; 
                this.loading = false ; 
            }) ;  
        
         }
        }
    
}
  
    storeprocess () {
                if(this.stores.length == 0 ) {
                      
                      this.notfoundstore = true ; 
                     
                  } else {
                     
                         
                      this.notfoundstore =  false ; 
                        for (let i = 0 ; i < this.stores.length; i++){
                         this.storedisp[this.stores[i]._id ] = false ; 

                        this.storeService.getBanner(this.stores[i]._id)
                                 .subscribe (
                                        data1=>{
                                            try {
                                                console.log (data1) ; 
                                                 this.stores[i]['banner'] = data1['banner'];  
                                                // console.log( this.stores[i]['banner']  )  ; 
                                            }catch(error) {
                                                 this.stores[i]['banner'] = "";  

                                            }   
                                        }
                                        ,error=>{

                                            this.stores[i]['banner'] = "";  
                                           console.log(error) ;     
                                        }
                                     ); 
                       }
                      
                   
       
                      
                   }  
        }
    
    articleprocess () {
                if(this.articles.length == 0 ) {
                          
                      this.notfound = true ; 
                      this.loading = false ; 
                     
                  } else {
                          this.loading = false ;
                           this.notfound = false  ;  
                      for (let s of this.articles){
                                this.disp[s._id ] = false ; 
                           this.storeService.getPic(s._id)
                           .subscribe (
                                        data0=>{
                                            try {
                                              //  console.log(data0 ) ;  
                                                this.mainpics[s._id ]  = data0['pic'] ;  
                                            }catch(error) {
                                                this.mainpics[s._id ] = "" ; 
                                               }
                                            
                                        }
                                        ,error=>{
                                         this.mainpics[s._id ] = "" ; 
                                         console.log(error) ;     
                               }); 
                        }
                      
      
                 
                      
                   } 
        
        
        }
        
    removeFilter () {
        this.stores = []  ; 
        this.articles = []  ; 
        this.filter = 'Indefinie'; 
        this.filterAr ="غير محدد" ; 
        console.log(this.query) ; 
         this.searchService.sendFilter({ "filter": this.filter, "orderby": this.orderby});
 
        if (this.query =="" ) {
            //back to main 
             this.router.navigate(["../"], { relativeTo: this.route });

        }else {
            this.context = "query";
               this.searchService.getCountStores2(this.filter, this.query, this.city)
                  .subscribe(
                   d3  => {
                       console.log(d3) ; 
                       this.countstore = d3['count'];
                        this.maxstorepage = Math.ceil( this.countstore/this.storesize)  ; 

                       this.getStorePage(1 ) ; 
                  },e3 =>{
                 
                       console.log(e3) ; 
                     });
                  
                   this.searchService.getCountArticles2 (this.filter, this.query, this.city)
                   .subscribe(
                       d4  => {
                              console.log(d4) ; 
                              this.countarticle = d4['count'];
                             this.maxarticlepage = Math.ceil( this.countarticle/this.articlesize)  ; 

                               this.getArticlePage(1); 
 
                                
                             },e4 =>{
                                  console.log(e4) ; 
                           });
         }
        }
    removeQuery (){
        this.stores = []  ; 
        this.articles = []  ; 
        this.query = ""  ;
         this.searchService.sendSearch({ "query": this.query});
         if (this.filter =="Indefinie" ) {
            //back to main 
             this.router.navigate(["../"], { relativeTo: this.route });

        }else { 
             
            
                this.context = "filter" ; 
                 this.searchService.getCountStores(this.filter, this.city)
                  .subscribe(
                   d3  => {
                       console.log(d3) ; 
                       this.countstore = d3['count'];
                    this.maxstorepage = Math.ceil( this.countstore/this.storesize)  ; 

                       this.getStorePage(1);  
                       },e3 =>{
                       console.log(e3) ; 
                     });
                 
                       this.searchService.getCountArticles (this.filter, this.city)
                         .subscribe(
                           d4  => {
                               console.log(d4) ; 
                               this.countarticle = d4['count'];
                              this.maxarticlepage = Math.ceil( this.countarticle/this.articlesize)  ; 

                               this.getArticlePage(1); 
                                
                             },e4 =>{
                                  console.log(e4) ; 
                           });
                      
                   
        }
        }
    
    
    
      onSelectionChange(i){
         this.stores = []  ; 
          this.articles = [] ; 
        this.orderby = i ; 
        console.log(i ) ; 
         // go through differente use case !!!
         if (this.query !=""){
            this.context = "query";  
             this.searchService.getCountStores2(this.filter, this.query, this.city)
                  .subscribe(
                   d3  => {
                       console.log(d3) ; 
                       this.countstore = d3['count'];
                     this.maxstorepage = Math.ceil( this.countstore/this.storesize)  ; 

                       this.getStorePage(1 ) ; 
                  },e3 =>{
                 
                       console.log(e3) ; 
                     });
                  
                   this.searchService.getCountArticles2 (this.filter, this.query, this.city)
                   .subscribe(
                       d4  => {
                              console.log(d4) ; 
                              this.countarticle = d4['count'];
                             this.maxarticlepage = Math.ceil( this.countarticle/this.articlesize)  ; 

                               this.getArticlePage(1); 
 
                                
                             },e4 =>{
                                  console.log(e4) ; 
                           });
             
          }else{
            if (this.filter !="Indefinie"){
                this.context ='filter' ; 
                  this.searchService.getCountStores(this.filter, this.city)
                  .subscribe(
                   d3  => {
                       console.log(d3) ; 
                       this.countstore = d3['count'];
                      this.maxstorepage = Math.ceil( this.countstore/this.storesize)  ; 

                       this.getStorePage(1);  
                       },e3 =>{
                       console.log(e3) ; 
                     });
                 
                       this.searchService.getCountArticles (this.filter, this.city)
                         .subscribe(
                           d4  => {
                               console.log(d4) ; 
                               this.countarticle = d4['count'];
                               this.maxarticlepage = Math.ceil( this.countarticle/this.articlesize)  ; 
          
                               this.getArticlePage(1); 
                                
                             },e4 =>{
                                  console.log(e4) ; 
                           });
                      
                   
                    
               
            }
            
           }
             
        }
    
      
    @ViewChild(RadSideDrawerComponent, { static: false }) public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

   

   
    public openDrawer() {
        this.drawer.showDrawer();
    }

    public onCloseDrawerTap() {
        this.drawer.closeDrawer();
    }
        display(a) {
         this.disp[a]= !this.disp[a];
         }
     storedisplay(a) {
         this.storedisp[a]= !this.storedisp[a];
         }
       
    
   public onLoadMoreItemsRequestedArticles(args )
    {
     
       console.log('ondemand') ; 
       const listView = args.object;
       this.articlepage+=1;
       if (this.articlepage <=  this.maxarticlepage) {
      
                this.getArticlePage(this.articlepage)  ;
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
    
    
      public onLoadMoreItemsRequestedStores(args ) {
     
       console.log('ondemand') ; 
       const listView = args.object;
       this.storepage+=1;
       if (this.storepage <=  this.maxstorepage) {
      
                this.getStorePage(this.storepage)  ;
                listView.notifyLoadOnDemandFinished();
          
        } else {
            args.returnValue = false;
            listView.notifyLoadOnDemandFinished(true);
        }
  
   
  //  if (this.sizemsg *this.page < this.countmsg ) 
    
    

}
    
}


