
import { Component, OnInit } from '@angular/core';
import {PicService, CartService , StoreService,BuynowService} from '../_services/index';
import {Subscription} from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions'; 
 
 import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label';
import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";
import * as util from "utils/utils";




@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private cartService:CartService,
              private  storeService: StoreService,
              private router : Router, 
              private  route : ActivatedRoute , 
              private  buynowService: BuynowService , 
              private picService : PicService
            ) { }
    
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
  
  
  page =1; 
  maxpage =1; 
  size =1; 
    
  loading = false ; 
  model :any ; 
  choosenAddressTitle = {} ;//= "select My Address " ; 
  cart=false ;
  empty = false ; 
  show ={} ; 
  detailshow = false ;   
  titlestoreDel = [] ;
   storeshow = []; 
    stores = [] ; 
   deliveryconfig = {
        "search":false, //true/false for the search functionlity defaults to false,
       "height": "auto",  //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      "placeholder":'...',// text to be displayed when no item is selected defaults to Select,
        //    "customComparator": ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
        //"limitTo": options.length // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
        'displayKey':'title'
   };
   totalprices ={}; 
   totaldelivery = {}
   storedelivery = [] ;
    tempstoredelivery = {}
   choosestoredelivery = [];
   buyall= {} ; 
    send = [] ; 
    displaystores= [] ;
    reload:boolean = false ;  
   ngOnInit( ) {
    
     this.init() ; 
      
       

                
  }
    
    
    
    init(){
        
          this.loading = true ; 
       console.log('cart ') ; 
        this.cartService.getCart( )
         .subscribe(
                 
                data => {
                     console.log(data ) ;  
                    this.cart =  data['articlecart'].reverse();
              
                    this.reload = false ; 
                    
                    this.storeService.getArticlesForCart(this.cart)
                    .subscribe(
                        data2=>{ 
                        
                           this.model = data2; 
                          for ( let i = 0 ; i < this.model.length ; i++ ) 
                               this.model[i]._source._id = i ; 
                            
                            
                             this.stores = this.model.map((x)=>x._source.storetitle); 
                          console.log(this.stores) ; 
                         //  this.stores= [...new Set(this.stores)]; 
                       this.stores = this.stores.filter((value, index, self)=>{
                          return self.indexOf(value) == index ; 
                         });
   
                           // console.log("icii");
                           //console.log(this.stores) ;
                            
                           this.maxpage = Math.ceil( this.stores.length/this.size)  ; 

                           this.model =this.groupBy ( this.model,"_source", "storetitle") ; 
                           
                           /* var items = Object.keys(this.model).map(function(key) {
                                 return [key, this.model[key]];
                            });
                            this.model= this.model.sort(function(first, second) {
                                return second._source._id - first.source_id;
                                });
                            */
                            //console.log(this.model) ; 
                         
                          //  console.log(this.model) ; 
                            if (this.stores.length !==0) {
                                 this.cart = true ; this.empty = false ; 
                                 this.getPage(1);
                            }else { 
                                 this.cart =false ; this.empty = true ; 
                            }
                         
                            
                  
                         
                     },
                     error2=>{
                            this.cart =false ; this.empty = true ;
                            this.loading = false ; 
                         
                         
                           // console.log(error2) ; 
                     })
                
                }, 
                error =>{
                 console.log(error) ;     
                 this.loading = false ;
                 this.reload = true ;    
                    
                }) ; 
        
        
        }

       getPage(page) {
           
                            this.loading = true ; 
           
                            this.page = page ; 
                            console.log("lalalalal" ) ; 
                             let max = this.size+((this.page-1)*this.size)  ; 
                                if (max > this.stores.length) 
                                        max= this.stores.length ; 
                                 
                            for( let index = (this.page-1)*this.size; index < max ; index++) {
                                this.displaystores.push(this.stores[index]) ; 
                                let i = this.stores[index];
                                this.show[i] = false ; 
                                let del =[];
                                this.buyall[i] = true ;
                                 this.model[i].selectedAddress =""; 
                                for (let j= 0; j <this.model[i].length; j++ ) {
                                  
                                    this.model[i][j].selectedAddress =""; 
                                            
                                    if (!this.model[i][j]._source.available ) {
                                      this.buyall[i]=false ; 
                                   }
                                    
                                     this.model[i][j].pic = this.picService.getPicLink( this.model[i][j]._source.picname);
                                 /* this.storeService.getPic(this.model[i][j]._id )
                                  .subscribe(
                                     data4=> {
                                         // console.log( this.model[i][j] ) ; 
                                         this.model[i][j].pic = data4['pic'];
    
                                     }, error4 =>{
                                          console.log(error4) ; 
                                    }) ; */
                                  this.model[i][j].show = false; 
                                    this.model[i][j]._source.tempdelivery = this.model[i][j]._source.delivery.filter(x=>x) ;
                              //  if (this.model[i][j]._source.delivery.length!=0 )   
                               //     this.model[i][j].choosedelivery=[this.model[i][j]._source.delivery[0]]; 
                              //  else     
                                     this.model[i][j].choosedelivery = [] ; 
                                      this.model[i][j]._source.titleDel = this.model[i][j]._source.tempdelivery.reduce((result, filter) => {
                                             result =result.concat([filter.title]) ;
                                                         return result;
                                         },[]);
                                     this.model[i][j]._source.selectedIndex=0;
                                    
                                 this.model[i][j].choosecolor = this.model[i][j]._source.color[0];
                                 this.model[i][j].choosequantity = 1;
                                 this.model[i][j].loading=  false;
                                 this.model[i][j].boolsize = false ; 
                                 this.model[i][j].details = false ; 
                                  this.model[i][j].send = false ; 

                              if( this.model[i][j]._source.selectedCat == "Habillements-Femmes"||
                                  this.model[i][j]._source.selectedCat=="Habillements-Hommes"|| 
                                  this.model[i][j]._source.selectedCat=="Habillements-Enfants" ){
                                      if('sizing' in this.model[i][j]._source) {
                                          this.model[i][j].boolsize =true ; 
                                          this.model[i][j].choosesize= this.model[i][j]._source.sizing[ this.model[i][j].choosecolor][0] ; 

                                       //  this.model[i][j].size =new Set([].concat.apply([], Object.values(this.model[i][j]._source.sizing ))); 
                                         this.model[i][j].size = [].concat.apply([], Object.values(this.model[i][j]._source['sizing'] )).filter((v, i, a) => a.indexOf(v) === i); ; 

                                      
                                      }
                                }
 
                                console.log("wwwwwwwwwwwwwwwwwwwwwwwwww") ; 
                                console.log(del) ;
                                for (let  d of this.model[i][j]._source.delivery ) {
                                    let flag = false ; 
                                    for (let del0 of del) 
                                    if ( d.title == del0.title ){
                                    flag = true ; break ;  
                                     } 
                                    if (!flag ) 
                                     del.push(d) ; 
                                }
                                }
                                    this.storedelivery[i] =del.filter(n=> n ) ;
                                   // console.log(this.storedelivery[i]); 
                                    this.tempstoredelivery[i] = this.storedelivery[i].filter(n=>n) ;
                                if (this.storedelivery[i].length>  0   ) 
                                      this.choosestoredelivery[i] =[ this.storedelivery[i][0]];
                                this.titlestoreDel[i] = this.storedelivery[i].reduce((result, filter) => {
                                result =result.concat([filter.title]) ;
                                   return result;
                              },[]);
                              //  else
                                this.send [i] = false ;
                                this.choosestoredelivery[i] = [] ;  
                                this.storeshow [i] = false ;
                                    //console.log(this.choosestoredelivery[i]) ; 
                                    // console.log( this.totalprices[i]) ; 
                                    //  this.totaldelivery[i] = this.totalprices[i]+ this.choosestoredelivery[i].price ; 

                              }
                         
                           for( let index = (this.page-1)*this.size; index < max ; index++) {

                                   let i= this.stores[index] ; 
                             
                                    const sum = this.model[i].reduce(this.add, 0);// => a['_source']['price']+ b['_source']['price'], 0) ; 
                                  
                                    this.totalprices[i]=sum 
                                  if (this.choosestoredelivery[i].length !=0 )
                                    this.totaldelivery[i] = this.totalprices[i]+ this.choosestoredelivery[i][0].price ; 
                                  else 
                                       this.totaldelivery[i] = this.totalprices[i] ; 
                              }
                        
                           this.loading = false 
           
                   
           
           
           
           }
          
  groupBy (xs,s, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[s][key]] = rv[x[s][key]] || []).push(x);
    return rv;
  }, {});
};

        
    add(a, b) {
    return a + b["_source"]["price"]* b['choosequantity'];
}
    
    
    getPic(articleid ) {
          //console.log(i ) ;
        
    
    };
    
    
    gotoStore (storeid ) {
         this.router.navigate(["../stores/"+storeid+"/store"], { relativeTo: this.route });

        }
    
    gotoArticle (articleid , storeid) {
        console.log(storeid) ; 
       this.router.navigate(["../stores/"+storeid+"/articles/"+articleid], { relativeTo: this.route });

        }
    deleteArticle (  storeid, article) {
       

  // 
       var index = this.model[storeid].indexOf(article, 0);
           this.totalprices[storeid] = this.totalprices[storeid]-this.model[storeid][index]['_source']['price'] ; 
        if (this.choosestoredelivery[storeid].length !=0 )
          this.totaldelivery[storeid] = this.totalprices[storeid]+ this.choosestoredelivery[storeid][0].price ; 
        else 
             this.totaldelivery[storeid] = this.totalprices[storeid] ; 
        
        if (index > -1) {
           this.model[storeid].splice(index, 1);

       }
      // console.log(this.model) ; 
        if (  this.model[storeid].length == 0) {
          //console.log( this.model[storeid]);
            delete this.model[storeid] ; 
        }
        
        this.cartService.deleteCart( article._id)
        .subscribe(
            data => {console.log(data) ;}, 
            error => {console.log(error) ; }    
            );
     
           for (let a of this.model[storeid]) {
                let flag = true 
             if (! a._source.available ) 
                    flag = false ; 
             if (flag) 
                this.buyall[storeid ] = true ; 
               
           }
        }
      
    
    getQuantity (q, storeid , article) {
               
            var index = this.model[storeid].indexOf(article, 0);

         const sum = this.model[storeid].reduce(this.add, 0);// => a['_source']['price']+ b['_source']['price'], 0) ; 
                             console.log(sum)  ; 
        
                             this.totalprices[storeid]=sum 
        if (this.choosestoredelivery[storeid].length !=0 )
            this.totaldelivery[storeid] = this.totalprices[storeid]+ this.choosestoredelivery[storeid][0].price ; 
        else 
             this.totaldelivery[storeid] = this.totalprices[storeid] ; 
    }
    getColor(c,storeid, article){
      
        var index = this.model[storeid].indexOf(article, 0);

         this.model[storeid][index].choosecolor = c; 
        
        if (this.model[storeid][index].boolsize) 
         this.model[storeid][index].choosesize = this.model[storeid][index]._source.sizing[c][0] ; 
 
     
        }
    getDeliveryMethod(event,storeid, article){
        
        console.log(event ) ;  
     //   this.totalprices = (this.model.price *this.quantity )   +this.choosedelivery[0]['price'] ; 
    }
    
    checkSizing(s, storeid, article) {
        var index = this.model[storeid].indexOf(article, 0);

        let c =  this.model[storeid][index].choosecolor ; 
        if ( this.model[storeid][index]['_source']['sizing'][c].includes(s) ) {
          
            return true ; 
        }else {
            return false ; 
        }
        
        }
    chooseSizing(event, s, storeid, article){
         var index = this.model[storeid].indexOf(article, 0); 
        
                this.model[storeid][index].choosesize = s; 

      }
    
    
    
    getStoreDeliveryMethod(event,storeid ){
      if (this.choosestoredelivery[storeid].length !=0 )
        this.totaldelivery[storeid] = this.totalprices[storeid]+ this.choosestoredelivery[storeid][0].price ; 
       else 
             this.totaldelivery[storeid] = this.totalprices[storeid] ;  
        console.log(event ) ;  
     // this.storedelivery[storeid] = (this.model.price *this.quantity )   +this.choosedelivery[0]['price'] ; 
    }
    
    
    
    buynow(storeid, article) {
             var index = this.model[storeid].indexOf(article, 0);
        this.model[storeid][index].send = true; 
        if (article.selectedAddress!="" &&  article.choosedelivery.length!=0){
      

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
                          "size":article.choosesize , 
                          "picname": article._source.picname
                          
                          
                }
            
            buynow['articles']=[A];
            buynow['totalprice']= (article._source.price* article.choosequantity)+article.choosedelivery[0].price;
            buynow['delivery']=  article.choosedelivery[0];
            buynow['storetitle']= storeid;
            buynow['back']=this.route;
            buynow['choosenAddress'] = article.selectedAddress; 
           
        
             this.buynowService.upArticle(buynow);
             this.router.navigate(["../stores/"+storeid+"/articles/buynow/article"], { relativeTo: this.route });

          this.model[storeid][index].loading =false; 
          }//else {
             //   article.selectedAddress.warning = true ; 
          //  }
        }
    
    
    multiplebuynow(storeid){
          
        this.send[storeid] = true ; 
         
        if (this.model[storeid].selectedAddress!="" && this.choosestoredelivery[storeid].length!=0  ) { 
        let buynow = {}; 
         buynow['articles']=[];
        for (let article of this.model[storeid] ) 
        {
            let A = {
                         'price': article._source.price, 
                          'articletitle': article._id,
                          'pic':article.pic ,
                          'title':article._source.title, 
                          'quantity':article.choosequantity, 
                          'color': article.choosecolor,
                          'size': article.choosesize, 
                          "picname": article._source.picname


                }
            buynow['articles'].push(A) ; 
        }
            buynow['totalprice'] =     this.totaldelivery[storeid] ; 
            buynow['delivery'] = this.choosestoredelivery[storeid][0];
            buynow['storetitle']= storeid;
            buynow['back']=this.route;
             buynow['choosenAddress'] = this.model[storeid].selectedAddress; 
 
           console.log(buynow) ;
        this.buynowService.upArticle(buynow);
             this.router.navigate(["../stores/"+storeid+"/articles/buynow/article"], { relativeTo: this.route });
      }
    }
        
    
    getAddress(event, k, i ) {
        let geolist = [] ; 
        this.storeService.getGeo(k)
        .subscribe(
            data=> {
                geolist = data['geo'] ; 
            
         this.model[k][i]._source.delivery  =  this.model[k][i]._source.tempdelivery.filter(n=>n) ;   ; 
        console.log(event) ;
        console.log(geolist ) ; 
 
      // if(event) 
     //   window.scroll(0,300 )  ; 
          //console.log(this.model[k][i] ) ; 
            this.model[k][i].show = false ; 
        
            this.model[k][i].selectedAddress   = event._source; 
 
          let  ad = [] ; 
        for (let geo of geolist) 
        if (geo.name == this.model[k][i].selectedAddress['city'] ) {
           
        for (let del of this.model[k][i]._source.delivery ) {
      
            console.log(del) ; 
            for (let v of del.villes ) {
            
            if ( v.name==  event._source['city']  ) {
                ad.push (del )
                console.log(del) ; 
                }
            }break ; 
        }
                }
        this.model[k][i]._source.delivery = ad ; 
       if(  this.model[k][i]._source.delivery.length !=0 )
               this.model[k][i].choosedelivery = [this.model[k][i]._source.delivery[0]]  ;
        else  
        this.model[k][i].choosedelivery = [] ; 
        
        if(  this.model[k][i]._source.delivery.length ==0  )
                this.model[k][i]._source.titleDel = [] ; 
         else 
        this.model[k][i]._source.titleDel = this.model[k][i]._source.delivery.reduce((result, filter) => {
                                             result =result.concat([filter.title]) ;
                                                         return result;
                                         },[])
        },error=>{
                 console.log(error ) ; 
                 }
            )
            
       } 
   
    
    getAddress2(event , k ) {
        console.log(event._source['city']  ) ;
         
        
        let geolist = [] ; 
        this.storeService.getGeo(k)
        .subscribe(
            data=> {
                geolist = data['geo'] ; 
            
        //console.log(this.storedelivery[k]) ; 
        this.storedelivery[k] = this.tempstoredelivery[k].filter(n=>n) ; ; 
        console.log(this.storedelivery[k]) ; 
            this.storeshow[k] = false ; 
            this.model[k].selectedAddress = event._source ;  
            let  ad = [] ;
        for (let geo of geolist) 
        if (geo.name == this.model[k].selectedAddress['city'] ) {
            
        for (let del of this.storedelivery[k]) {
      
            console.log(del ) ; 
           for (let v of del['villes'] )
            if ( v.name==this.model[k].selectedAddress['city'] ) {
                  ad.push(del) ; 
                console.log(del ) ; 
                 break ;
                }
        }
        }
        this.storedelivery[k] = ad  ; 
       // console.log(this.storedelivery[k]  ) ; 
        if(  this.storedelivery[k].length >0 )
              this.choosestoredelivery[k] = [this.storedelivery[k][0] ] ;
        else  
         this.choosestoredelivery[k] = [] ; 
         const sum = this.model[k].reduce(this.add, 0);// => a['_source']['price']+ b['_source']['price'], 0) ; 
         this.totalprices[k]=sum ;
         this.titlestoreDel[k] = this.storedelivery[k].reduce((result, filter) => {
                         result =result.concat([filter.title]) ;
                        return result;
                        },[]);
      
                
        },error=>{
                 console.log(error ) ; 
                 }
            )
                
        }
    
    templateSelector(item: any, index: number, items: any): string {
      return item.expanded ? "expanded" : "default";
    }
    
        onItemTap(event) {
      const listView = event.object,
          rowIndex = event.index,
          dataItem = event.view.bindingContext;

      dataItem.expanded = !dataItem.expanded;
     
          listView.androidListView.getAdapter().notifyItemChanged(rowIndex);
      
    }
    tapdetailsshow () {
        this.detailshow = !this.detailshow ; 
    }
     public onchange(event: SelectedIndexChangedEventData, k,i ){
       //console.log(event) ;
        this.model[k][i].choosedelivery = [this.model[k][i]._source.delivery[event.newIndex]] ;  
        
          
         /* if ( this.model[k][i]._source.choosedelivery.length!=0 ) 
                      this.model[k][i]._source.total = (this.model.price *this.model[k][i]._source.quantity )   +this.model[k][i]._source.choosedelivery[0]['price']; 
                    else 
                       this.model[k][i]._source.total = (this.model.price *this.model[k][i]._source.quantity );
    */
       } 

      public onchange2(event: SelectedIndexChangedEventData, k){
       //console.log(event) ;
         this.choosestoredelivery[k] = [this.storedelivery[k][event.newIndex]] ;  
        
                  const sum = this.model[k].reduce(this.add, 0);// => a['_source']['price']+ b['_source']['price'], 0) ; 
                   this.totalprices[k]=sum 
                if (this.choosestoredelivery[k].length !=0 )
            this.totaldelivery[k] = this.totalprices[k]+ this.choosestoredelivery[k][0].price ; 
       
          
         /* if ( this.model[k][i]._source.choosedelivery.length!=0 ) 
                      this.model[k][i]._source.total = (this.model.price *this.model[k][i]._source.quantity )   +this.model[k][i]._source.choosedelivery[0]['price']; 
                    else 
                       this.model[k][i]._source.total = (this.model.price *this.model[k][i]._source.quantity );
    */
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
     hide(){
          util.ad.dismissSoftInput() ;  
        }
    
    reloading(){   
        console.log('reloading') ; 
        this.init() ; 
  
     }
}
