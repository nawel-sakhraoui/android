import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {UserdetailsService, PicService, CartService, StoreService, SearchService, MyhomeService, AuthenticationService} from '../_services/index'; 
import { NgxPermissionsService, NgxRolesService  } from 'ngx-permissions';  


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'], 
})
export class MainComponent implements OnInit {

  constructor(  private route: ActivatedRoute,
  private router: Router, 
  private myhomeService: MyhomeService, 
  private authService: AuthenticationService,
  private searchService: SearchService, 
  private storeService : StoreService, 
  private cartService: CartService, 
  private picService: PicService, 
  private userdetailsService : UserdetailsService, 
  private rolesService: NgxRolesService , 
  private permissionsService : NgxPermissionsService 
  ) { }
  
  home :any = "" ; 
  exist : boolean ; 
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
  maxcart = 30 ; 
  articles : any ;  
  countStore = 0 ;  
    stores :any =[]; 
    store0 :any ={};
    banners  =[];
    mainpics:any = []; 
    opened = false ; 
    sizestores = 5; 
    sizearticles =7 ; 
    store :any = {}
    main2 = false ; 
    loading:boolean = false ; 
    loading2= false ; 
    loading3 = false ; 
    main = false ; 
    disp:boolean[] =[]
    allCategories = [] ; 
    categoriesAr = [] ; 
    selected= [];
    orderby='newest';
    filter = 'Indefinie' ; 
    city= 'Toutes les villes'; 
   cityAr='كل الولايات'
    selectcat  = [] ; 
    selectcatAr = [] ; 
    articlescats = {} ; 
    fullcartwarning  :boolean ;  
  private sub :any ; 

    
    
    ngOnInit() {
 
       console.log("main") ; 
       this.me= JSON.parse(localStorage.getItem('currentUser')).userid.toString() ; 

       console.log(this.me) ; 
       this.loading2 = true ; 
       
       this.loading = true ; 
       this.loading3 = true ;
            
       /*   this.permissionsService.addPermission('readUser', () => {
                return true;
         });
          
                         
         if (this.me  != "annonym") {
            console.log('annnoooo') ; 
            // this.rolesService.flushRoles();
             this.rolesService.addRole('USER', [ 'readUser' ]);
         };            
          */
                         
                  
      //  this.searchService.sendcity.subscribe(
      //  (data00)=>{
        console.log(this.me) ; 
        this.userdetailsService.getLocation(this.me)
       .subscribe(
            data=>{
                  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa") ; 
                  console.log(data) ; 
                  if (Object.keys(data).length !== 0) 
                      this.city = data['location'];   
                  else 
                       this.city ='Toutes les villes';
                        
                  this.main0() ; 
                         
    
        
           // @ViewChild('stack') scrollView: ElementRef;
          //  const stackView  = this.scrollView.nativeElement;
           //     stackView._nativeView.requestDisallowInterceptTouchEvent(false);
  
    
            
                 },error=>{
                     console.log(error) ; 
                     this.city ='Toutes les villes';
                        
                     this.main0() ; 
                 });   
    
    
        this.searchService.sendcity.subscribe(
       (data00)=>{
           
           console.log(this.city) ; 
           this.city = data00['city'] ; 
           
           if(this.city) 
            this.main0() ; 
       }) ; 
    
    
    
     }
    
    
    
    
    main0(){
        
       this.loading2 = true ;  
       this.loading = true ; 
    
       this.storeService.getCategories()
       .subscribe (
           d0 => {
               this.allCategories = d0['categories'] ; 
               
                  this.storeService.getCategoriesAr()
                    .subscribe (
                         d1 => {
                             console.log(d1) ; 
                                 this.categoriesAr = d1['categories']; 
                                  console.log(this.categoriesAr) ; 
                                 let  tempcat = [...this.allCategories];
                                 let tempcatAr = [...this.categoriesAr] ; 
                                 for (let i = 0 ;i < 5 ; i++){
                                    
                                      let index = Math.floor(Math.random() * tempcat.length);
                                                        
                                        this.selectcat.push (tempcat[index]) ; 
                                        this.selectcatAr.push ( tempcatAr[index]) ; 
                                    tempcat.splice(index, 1);
                                    tempcatAr.splice(index,1) ; 
                                  }
                             
                                 
              
           
                     
               for (let cat of this.selectcat  ){ 
                                  
                   
                    
                                 this.myhomeService.getArticlesByCat(this.sizearticles, cat, this.city )
                               .subscribe (
                                   data => {
                                       this.articlescats[cat] = data['hits']['hits']; 
                                       console.log(this.articlescats[cat]) ;  
                                       for (let s of  this.articlescats[cat]){
                                           this.disp[s._id ] = false ; 
                                           this.mainpics[s._id ]=  this.picService.getPicLink(s._source.picname) ;

                                           
                                           /*this.storeService.getPic(s._id)
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
               }, error =>{
                   console.log(error ) ; 
               }) 
           };
               
           
                        
             },err1 =>{
                    console.log(err1 ) ; 
             }) ; 
           },e0 => {
               console.log(e0 ) ; 
              }
           )
           ;
   /*   this.myhomeService.getCountStores(this.filter)
         .subscribe (
         
             data => {
                  console.log(data) ; 
                 this.countStore = data['count']  ; 
                 }
             ,error =>{
                 console.log(error) ; 
                 console.log(data0) 
               }
         ) ;*/
          
          this.myhomeService.getStores(this.sizestores, this.city)
         .subscribe (
         
             data => {
                 this.loading = false ; 
                 this.main = true ; 
                if (data['hits']['hits'].length !=0 ) {
                 this.store = data['hits']['hits'][0] ;
               
                     console.log(this.store) ;
                    
                         this.store['banner'] = '' ;   
                  if (this.store._source.hasOwnProperty("bannername"))
                        this.store['banner'] = this.picService.getBannerLink(this.store._source.bannername); 
                  
                    
                    
                 /*   this.storeService.getBanner(this.store._id)
                                 .subscribe (
                                        data1=>{
                                            try {
                                                 this.store['banner'] = data1['banner'];  
                                                // console.log( this.stores[i]['banner']  )  ; 
                                            }catch(error) {
                                                 this.store['banner'] = "";  

                                            }   
                                        }
                                        ,error=>{

                                            this.store['banner'] = "";  
                                           console.log(error) ;     
                                        }
                                     ); */
                   
                 
                 if ( data['hits']['hits'].length >=2){
                 this.stores = data['hits']['hits'] ; 
                 this.stores.shift() ; 
                
                 this.home =true ; 
                     
                 for (let i = 0 ; i < this.stores.length; i++){
                     
                      if (this.stores[i]._source.hasOwnProperty("bannername"))
                        this.stores[i]['banner'] = this.picService.getBannerLink(this.stores[i]._source.bannername); 
                     else 
                         this.stores[i]['banner'] = '' ; 
                      /*this.storeService.getBanner(this.stores[i]._id)
                                 .subscribe (
                                        data1=>{
                                            try {
                                                 this.stores[i]['banner'] = data1['banner'];  
                                                // console.log( this.stores[i]['banner']  )  ; 
                                            }catch(error) {
                                                 this.stores[i]['banner'] = "";  

                                            }   
                                        }
                                        ,error=>{

                                            this.stores[i]['banner'] = "";  
                                         //  console.log(error) ;     
                                        }
                                     ); */
                  }
                     
                  } } else {
                     this.store= {'_source' : {}} ;
                      
                    }
                     
             },error =>{
                     this.loading =false ; 
                 console.log(error) ; 
                 
             }
         ) ;

         this.myhomeService.getArticlesByNewest(this.sizearticles, this.city)
         .subscribe (
         
             data => {
                 console.log(data) ; 
             //     this.countStore = data ; 
                 this.articles = data['hits']['hits'] ; 
                 this.loading2 = false ; 
                 this.main2 = true ; 
                 for (let s of this.articles){
                        this.disp[s._id ] = false ; 
                          this.mainpics[s._id ]=  this.picService.getPicLink(s._source.picname) ;
                    /*  this.storeService.getPic(s._id)
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
             },error =>{
                 console.log(error) ; 
                 this.loading2= false ; 
                 
              });    
        
        
        
    }
    
     gotoArticle( id:string , storeid : string ) {
     
         this.router.navigate(["/stores/"+storeid+"/articles/"+id]);

     }
    
    gotoStore(id){
                 this.router.navigate(["/stores/"+id+"/store"]);

       }
    
    
    addToCart(article){
         article.loadingcart = 1  ;

          this.cartService.getCountCart ()
          .subscribe( 
               data0 => {
                   console.log(data0) ; 
               if ( data0['cartcount']> this.maxcart ){
                    
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
      this.router.navigate(["/stores/"+storeid+"articles/"+id+"/update"], { relativeTo: this.route });

  } 
    
      mouseEnter(a){
   // console.log(a ); 
      this.disp[a] = true ; 
   }

   mouseLeave(a){
     //   console.log(a );  
          this.disp[a] =false ; 

   }
    checkedCat(e, c) {
        console.log(e) ; 
        
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
    
     onSelectionChange(i){
            
        this.orderby = i ; 
            console.log(i ) ; 
        }

    
    selectFilter(e, i) {
        this.filter= e ;
        this.opened= false ;
        console.log(e) ; 
         if (this.filter != "Indefinie"){
             
            this.searchService.sendFilter({ "filter": this.filter, "orderby": this.orderby, 'pos':i });
            //navigate to result 
            this.router.navigate(["/result"]);
         }
    }
    
   getRandom(arr, n) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        let x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  } 
}




