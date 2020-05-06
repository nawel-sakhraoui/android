import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {PicService, CartService, StoreService, SearchService, MyhomeService, AuthenticationService} from '../_services/index'; 
import {Article } from '../_models/index';
 import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})


export class ResultComponent implements OnInit {


  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
    maxcart =30 ; 
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
 
    fullcartwarning:boolean ; 
    articlesize = 12 ; 
    storesize =6;
    
    countarticle = 0  ; 
    countstore = 0 ;
    
    orderby = "newest"; 
    filter = "Indefinie" ; 
    filterAr="غير محدد"; 
    storepage = 1 ; 
    articlepage = 1 ; 
    context = ""; //"filter"; //"query"
   city : string ; 
      constructor(  private route: ActivatedRoute,
  private router: Router, 
  private myhomeService: MyhomeService, 
  private authService: AuthenticationService,
  private searchService: SearchService, 
  private storeService : StoreService, 
  private cartService: CartService, 
  private picService : PicService, 
  private rolesService:  NgxRolesService, 
  private permissionsService : NgxPermissionsService
  ) {  this.filterAr="غير محدد"; }
  
 
    ngOnInit() {
        
        /*    this.permissionsService.addPermission('readUserAccount', () => {
                return true;
         });
          
                         
         if (this.me  != "annonym") {
            console.log('annnoooo') ; 
             this.rolesService.flushRoles();
             this.rolesService.addRole('USER', [ 'readUserAccount' ]);
         };            
          
          */               
               
        
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
        if (!this.city )
         this.city ="Toutes les villes" ;  
        console.log(this.city) ; 
     
             
     this.searchService.sendFilters.subscribe((data1)=> {
                       window.scroll(0,0);

                 console.log(data1)  ; 
          if (Object.keys(data1).length === 0 ) 
            this.nothing1 = true ; 
             if ( 'filter' in data1 && "orderby" in data1 ) {
                 this.filter = data1['filter']; 
                 this.orderby = data1['orderby']; 
               
                 this.filterAr = this.categoriesAr[data1['pos']];
                    console.log(this.filterAr) ;
                 this.context = "filter"; 
            
          
                 this.searchService.getCountStores(this.filter, this.city)
                  .subscribe(
                   d3  => {
                       console.log(d3) ; 
                       this.countstore = d3['count'];
                       this.getStorePage(1);  
                       },e3 =>{
                       console.log(e3) ; 
                     });
                 
                       this.searchService.getCountArticles (this.filter, this.city)
                         .subscribe(
                           d4  => {
                               console.log(d4) ; 
                               this.countarticle = d4['count'];
                               
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
         
              window.scroll(0,0);
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
                       this.getStorePage(1 ) ; 
                  },e3 =>{
                 
                       console.log(e3) ; 
                     });
                  
                   this.searchService.getCountArticles2 (this.filter, this.query, this.city)
                   .subscribe(
                       d4  => {
                              console.log(d4) ; 
                              this.countarticle = d4['count'];
                               
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
     
         this.router.navigate(["../stores/"+storeid+"/articles/"+id], { relativeTo: this.route });

     }
    
    gotoStore(id){
                 this.router.navigate(["../stores/"+id+"/store"], { relativeTo: this.route });

       }
    
    
    
    addToCart(article){
         article.loadingcart = 1  ;

          this.cartService.getCountCart ()
          .subscribe( 
               data0 => {
                   console.log(data0) ; 
               if ( data0['cartcount']> this.maxcart){
                   
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
      this.router.navigate(["../stores/"+storeid+"articles/"+id+"/update"], { relativeTo: this.route });

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
          this.filter= e ;
          this.filterAr = this.categoriesAr[i];
          
          
          window.scroll(0,0);

          if (this.query =="") {
              //change filter 
           if (this.filter != "Indefinie" ) {
               this.context = "filter"; 
                  this.searchService.getCountStores(this.filter, this.city)
                  .subscribe(
                   d3  => {
                       console.log(d3) ; 
                       this.countstore = d3['count'];
                       this.getStorePage(1);  
                       },e3 =>{
                       console.log(e3) ; 
                     });
                 
                       this.searchService.getCountArticles (this.filter, this.city)
                         .subscribe(
                           d4  => {
                               console.log(d4) ; 
                               this.countarticle = d4['count'];
                               
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
                       this.getStorePage(1 ) ; 
                  },e3 =>{
                 
                       console.log(e3) ; 
                     });
                  
                   this.searchService.getCountArticles2 (this.filter, this.query, this.city)
                   .subscribe(
                       d4  => {
                              console.log(d4) ; 
                              this.countarticle = d4['count'];
                               
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
                console.log(data2 ) ; 
                this.articles = data2['hits']['hits'] ; 
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
                console.log(data2 ) ; 
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
                    
                                  if (this.stores[i]._source.hasOwnProperty("bannername"))
                           this.stores[i]['banner'] = this.picService.getBannerLink(this.stores[i]._source.bannername); 
                         else 
                           this.stores[i]['banner'] = '' ; 
                        /*this.storeService.getBanner(this.stores[i]._id)
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
                                     ); */
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
                          
                            this.mainpics[s._id ]=  this.picService.getPicLink(s._source.picname) ;

                          /* this.storeService.getPic(s._id)
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
                               }); */
                        }
                      
      
                 
                      
                   } 
        
        
        }
        
    removeFilter () {
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
                       this.getStorePage(1 ) ; 
                  },e3 =>{
                 
                       console.log(e3) ; 
                     });
                  
                   this.searchService.getCountArticles2 (this.filter, this.query, this.city)
                   .subscribe(
                       d4  => {
                              console.log(d4) ; 
                              this.countarticle = d4['count'];
                               
                               this.getArticlePage(1); 
 
                                
                             },e4 =>{
                                  console.log(e4) ; 
                           });
         }
        }
    removeQuery (){
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
                       this.getStorePage(1);  
                       },e3 =>{
                       console.log(e3) ; 
                     });
                 
                       this.searchService.getCountArticles (this.filter, this.city)
                         .subscribe(
                           d4  => {
                               console.log(d4) ; 
                               this.countarticle = d4['count'];
                               
                               this.getArticlePage(1); 
                                
                             },e4 =>{
                                  console.log(e4) ; 
                           });
                      
                   
        }
        }
    
    
    
      onSelectionChange(i){
            
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
                       this.getStorePage(1 ) ; 
                  },e3 =>{
                 
                       console.log(e3) ; 
                     });
                  
                   this.searchService.getCountArticles2 (this.filter, this.query, this.city)
                   .subscribe(
                       d4  => {
                              console.log(d4) ; 
                              this.countarticle = d4['count'];
                               
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
                       this.getStorePage(1);  
                       },e3 =>{
                       console.log(e3) ; 
                     });
                 
                       this.searchService.getCountArticles (this.filter, this.city)
                         .subscribe(
                           d4  => {
                               console.log(d4) ; 
                               this.countarticle = d4['count'];
                               
                               this.getArticlePage(1); 
                                
                             },e4 =>{
                                  console.log(e4) ; 
                           });
                      
                   
                    
               
            }
            
           }
             
        }
}

