import {Component,ViewChild, OnInit, AfterViewInit,  AfterContentInit, ChangeDetectorRef, ElementRef  } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {CartService, StoreService, SearchService, MyhomeService, AuthenticationService} from '../_services/index'; 
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Carousel } from "nativescript-carousel"; 
//import {TreeviewItem} from 'ngx-treeview'; 
import { RouterExtensions } from "nativescript-angular/router";

import { View } from "ui/core/view";
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label';
import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";
@Component({
  moduleId: module.id,   
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'], 
})
    
export class MainComponent implements OnInit,  AfterViewInit{

  constructor(  private route: ActivatedRoute,
  private router:  RouterExtensions, 
  private myhomeService: MyhomeService, 
  private authService: AuthenticationService,
  private searchService: SearchService, 
  private storeService : StoreService, 
  private cartService: CartService, 
  private _changeDetectionRef: ChangeDetectorRef
  ) { }


  maxcart =30;
  home :any = "" ; 
  exist : boolean ; 
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
 
  articles : any ;  
  countStore = 0 ;  
    stores :any =[]; 
    store0 :any ={};
    banners  =[];
    mainpics:any = []; 
    opened = false ; 
    sizestores = 10; 
    sizearticles =5 ; 
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
   
    selectcat  = [] ; 
    selectcatAr = [] ; 
    articlescats = {} ; 
    fullcartwarning  :boolean ; 
    city :string ; 
  private sub :any ; 
    value=1 ; 

     private _mainContentText: string;
    setScore(e){
        console.log(e.object.get('value')) ; 
           this.value = Number(e.object.get('value'));
       }
    ngOnInit() {
    
      this.loading2 = true ; 
       
       this.loading = true ; 
       this.loading3 = true ; 
        this.searchService.sendcity.subscribe((data00)=>{
            this.loading2 = true ; 
             this.loading3= true ; 
              this.loading = true ; 
         this.city = data00['city'] ; 
        console.log(this.city) ; 
      
    
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
                                            this.loading3=false ;   
                                        }); 
                 }
                                                  this.loading3=false ; 
 
               }, error =>{
                   console.log(error ) ; 
               }) 
           };
               
                        
             },err1 =>{
                    console.log(err1 ) ; 
                  this.loading3=false ; 
             }) ; 
           },e0 => {
               console.log(e0 ) ; 
                this.loading3=false ; 
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
                 
                    this.storeService.getBanner(this.store._id)
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
                                     ); 
                   
                 
                 if ( data['hits']['hits'].length >=2){
                 this.stores = data['hits']['hits'] ; 
                 this.stores.shift() ; 
                
                 this.home =true ; 
                     
                 for (let i = 0 ; i < this.stores.length; i++){
                      this.storeService.getBanner(this.stores[i]._id)
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
                                     ); 
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
             },error =>{
                 console.log(error) ; 
                 this.loading2= false ; 
                 
              });
         
        });
        
           // @ViewChild('stack') scrollView: ElementRef;
          //  const stackView  = this.scrollView.nativeElement;
           //     stackView._nativeView.requestDisallowInterceptTouchEvent(false);
     }
    
     gotoArticle( id:string , storeid : string ) {
     
         this.router.navigate(["../../stores/"+storeid+"/articles/"+id], { relativeTo: this.route });

     }
    
    gotoStore(id){
                 this.router.navigate(["../../stores/"+id+"/store"], { relativeTo: this.route });

       }
    
    
    addToCart(article){
         article.loadingcart = 1  ;

          this.cartService.getCountCart ()
          .subscribe( 
               data0 => {
                   console.log(data0) ; 
               if ( data0['cartcount']>this.maxcart ){
                    
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
   display(a) {
         this.disp[a]= !this.disp[a];
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

    
    selectFilter(e) {
        this.filter= e ;
        this.opened= false ;
        console.log(e) ; 
         if (this.filter != "Indefinie"){
             
            this.searchService.sendFilter({ "filter": this.filter, "orderby": this.orderby});
            //navigate to result 
            this.router.navigate(["/home/"+this.me+"/result"]);
       
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
    
      @ViewChild(RadSideDrawerComponent, { static: false }) public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }


 /*    ngAfterContentInit(): void {
    // a little delay so the spinner has time to show up
                setTimeout(() => {
      this.listLoaded = true;
    }, 500);
  }*/

   
    public openDrawer() {
        this.drawer.showDrawer();
    }

    public onCloseDrawerTap() {
        this.drawer.closeDrawer();
    }
    
   sort(val ) {
       this.orderby=val ; 
       }
    @ViewChild("myCarousel", { static: false }) carouselView: ElementRef<Carousel>;

     myTapPageEvent(args) {
    console.log('Tapped page index: ' + (this.carouselView.nativeElement.selectedPage));
    }

    myChangePageEvent(args) {
    console.log('Page changed to index: ' + args.index);
};
    

/*
 makeSelectable(args ) {
     console.log(args) ; 
                args.object.nativeView.setTextIsSelectable(true);

 }(loaded)="makeSelectable($event)"*/
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
    
    
}


