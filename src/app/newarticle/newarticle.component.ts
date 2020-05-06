import { Component, OnInit } from '@angular/core';
import {Article} from '../_models/index';
import {PicService, StoreService, DeliveryService, AddressService} from '../_services/index'; 

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { take, finalize } from 'rxjs/operators';

import { NgxPicaService } from 'ngx-pica';

@Component({
  selector: 'app-newarticle',
  templateUrl: './newarticle.component.html',
  styleUrls: ['./newarticle.component.css']
})
export class NewarticleComponent implements OnInit {
  loading : boolean ; 
  model :any={} ;
  storetitle = "" ; 
  mainpic = 0 ; 
  gallery = [];
  galleryNames=[] ; 
  extension=[] ; 
  color = [];
  newaurl = false ;
  store:any= {}; 
  alertimg:boolean; 
  galleryfile=[] ; 
    
  nostore:boolean ; 
  open=""; 
  show :boolean= false  ; 
  articleid = '' ;  
  suspend :boolean ; 
  selectdel= [] ; 
  delivery = []; 
  sizing = {}; 
    
  choosecom = [] ; 
  communes = [] ;


Categories = []; 
selectcats = [] ; 
comconfig = {
            displayKey:"name" ,//if objects array passed which key to be displayed defaults to description,
            search:true, //enables the search plugin to search in the list
            placeholder:'Selectionner', // text to be displayed when no item is selected defaults to Select,
            //customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
            // limitTo: options.length
      
            height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
              };
  
config = {
            displayKey:"title" ,//if objects array passed which key to be displayed defaults to description,
            search:true, //enables the search plugin to search in the list
            placeholder:'Selectionner', // text to be displayed when no item is selected defaults to Select,
        //customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
       // limitTo: options.length
      
            height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
              };
    

deliveryconfig = {
            displayKey:"title",//if objects array passed which key to be displayed defaults to description,
            search:true, //enables the search plugin to search in the list
            placeholder:'...', // text to be displayed when no item is selected defaults to Select,
        //customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
       // limitTo: options.length
             moreText:"+",
            searchPlaceholder:"...",
            height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
              };

//
    
        sizinglist = [ "xs", "s", "l", "xl", "xxl", "3xl","4xl", "5xl", "6xl", 
                   "t34", "t36", "t38", "t40","t42", "t44", "t46", "t48", "t50", "t52", "t54", "t56",
                    "t58", "t60", "t62", 
                   "p16", "p17", "p18" , "p19", "p20", "p21", "p22", "p23", "p24", "p25", "p26", "p27", 
                   "p28" ,"p29" ,"p30", "p31", "p32", "p33" ,"p34", "p35", "p36", 
                   "p37", "p38", "p39", "p40", "p41", "p42", "p43", "p44", "p45", "p46", "p47", "p48"  ,
                    "0-3mois", "3-6mois", "6-9mois", "9-12mois", "12-18mois", "18-24mois", 
                    "T2", "T3", "T4", "T5", "6ans", "7ans", "8ans", "9ans", "10-12ans", "12-14ans", "14-16ans"    
        
                ]; 
        boolsizing : boolean = false  ; 
    
    
constructor(  private route: ActivatedRoute,
               
                private router: Router,
                private storeService:StoreService, 
                private deliveryService:DeliveryService,
                private addressService: AddressService, 
                private picService :PicService, 
                private _ngxPicaService: NgxPicaService) { 
          }



    
  ngOnInit() {

      window.scrollTo(0,0); 
      this.loading = true ; 
    
      
    
      
        let sub = this.route.params.subscribe(params => {
            //this.parentRouteId = +params["id"];
           this.storetitle = params['store'];
           this.storeService.getSuspend (this.storetitle )
            .subscribe(     
             data0 =>{
             this.suspend = data0['suspend']; 
           
             if (!this.suspend) { 
  
            
              this.addressService.getAllCommunes() 
            .subscribe (
                     data=>{
                        this.communes = data["communes"] 
                      }
              )
            
 
          this.storeService.getStoreStatus( this.storetitle  )
            .subscribe(
                data0 =>{
                     console.log(data0 ) ; 
                     this.open = data0['open']; 
                    
                   
                    
            this.storeService.getStoreCategories (this.storetitle)  
            .subscribe(
                data => {
                     this.Categories = data['selectedCat'] ; 
                     console.log(data);
                    
                }
                ,error =>{
                    console.log(error ) ;
                 }); 
                    
                    
                    this.storeService.getStore( this.storetitle)
                     .subscribe(
                         data1=> {
                             this.nostore = false ; 
                             this.store = data1 ; 
                             console.log(this.store) ; 
                             //check if i'm the store admin
                            this.loading = false ;
                             this.show = true ; 
                             //
                                  this.getDeliveryBy (this.store.selectedCat, this.store.geo);
                         }
                         ,error1 =>{
                             console.log(error1) ; 
                                this.show = true ; 
                           });
                
          }, error0 => {
                    console.log(error0 ) ; 
                     
                    });
              
               }else {
             this.loading = false ;    
             this.show = true ;
           }
       },error0=>{
                console.log(error0 ) ;    
                
                }
         ) 
              
    });  
           
  }
   //  urls = [];
   waitimg = false ; 
   onSelectFiles(event) {
       
    if (event.target.files ) {
        this.alertimg=false ;
         
        for (let l of event.target.files) {
             let extension =l['name'].split('.').pop() ; 
             if( extension !="png" && extension !="jpg" &&  extension !="jpeg" ){
              this.alertimg = true 
              break ; 
        }

        }
        if(!this.alertimg){
           this.waitimg = true ; 
               this._ngxPicaService.compressImages( event.target.files, 0.7)
               .pipe(
                   finalize(() => {
                           this.waitimg = false ; 
                    })
                )
               .subscribe((imageResized: File) => {
                  let reader: FileReader = new FileReader();
                
                 reader.addEventListener('load', (event: any) => {
                        this.gallery.push(event.target.result);
                 }, false);
            
                console.log("aaaaaaaaaaaaaaaaaaaa")  ; 
                console.log(imageResized) ; 
                reader.readAsDataURL(imageResized);
                this.galleryfile.push(imageResized) ; 
                this.extension.push(imageResized['name'].split('.').pop());
            
                
            }, (err) => {
                
                this.waitimg = false ; throw err.err;
            }); 
            
        /*for (let l of event.target.files ) {       
                let reader = new FileReader();
    
                reader.onload = (event) => { // called once readAsDataURL is completed
                this.gallery.push(event.target.result) ;
 
                 // console.log(event.target.result) ; 
               }
             reader.readAsDataURL(l); // read file as data url
             this.galleryfile.push(l) ; 
            
         
 
             
       }*/
        
         
            //let files:any = [] ;
                
            
        }
  }

}
     onSelectionChange(i){
          //console.log("xxxxxxxxxxxxxxxxxxxx") ; 
          //console.log(i) ; 
            this.mainpic = i ;    
      }
  
  
     removeObject (url ) {
         var index = this.gallery.indexOf(url, 0);
        if (index > -1) {
            this.gallery.splice(index, 1);
             this.extension.splice(index, 1);
             this.galleryfile.splice(index, 1);
        }
        
     }
    
     removeColor (c ) {
         var index = this.color.indexOf(c, 0);
        if (index > -1) {
            this.color.splice(index, 1);
            delete this.sizing[c]
        }
        
     }
       
     removeDelivery (d) {
         var index = this.selectdel.indexOf(d, 0);
        if (index > -1) {
            this.selectdel.splice(index, 1);
        }
        
     }
    
    
    addColor(event) {
        this.color.push( document.getElementById("color")['value']); 
        let c= document.getElementById("color")['value'] ; 
        //console.log(v) ; 
        //this.model.color.push (v);
        //console.log(this.color) ;
        this.sizing[c] =[] ; 
        }
   
    addDelivery(event) {
        console.log(event) ; 
        console.log(this.selectdel) ; 
         //this.selectdelivery = event ; 
       /*  if (! this.selectdeliveries.includes(event ) && Object.keys(event).length !== 0) 
            this.selectdeliveries.push(event) ; 
         */   
    }

    addSizing(event, color , c) {
        console.log(event ) ; 
        
        if(event.target.checked ) 
            this.sizing[color].push(c) ;  
         else 
            this.sizing[color].splice( this.sizing[color].indexOf(c) , 1); 
        
        console.log(this.sizing) ; 
        
        
        }
    newarticle () {
               this.loading = true ;
        if ( this.alertimg || this.gallery.length==0  || this.selectdel.length==0 || this.selectcats.length==0  ) {
            this.loading = false ; 
         }
        else{
        
            
       // this.model.pic = this.gallery[this.mainpic]; 
       // this.gallery.splice(this.mainpic, 1);
       // this.model.gallery = this.gallery ; 
        this.model.delivery = [];
        for (let d of this.selectdel){ 
            d._source['id']=d._id ;
           this.model.delivery.push(d._source) ;
            }
        this.model.title = this.model.title.trim() ; 
        this.model.color = this.color ; 
        this.model.selectedCat = this.selectcats
        this.model.storetitle = this.storetitle ; 
        this.model.available = true ; 
        this.model.created = Date.now() ; 
        this.model.geo = this.store.geo ; 
        this.model.gallerynames=[] ; 
        this.model.picname = '' ; 
        if (!this.isEmpty(this.sizing)) 
              this.model.sizing = this.sizing  ; 
        this.loading = true;
        
        console.log('new article') ; 
        console.log(this.model) ; 
      
      
         this.storeService.postArticle(this.storetitle,  this.model )
         .subscribe(
                data => {
                 console.log(data) ; 
                  this.articleid = data['_id'] ; 
                  this.picService.putPic(this.articleid+'.'+this.extension[this.mainpic] ,  this.galleryfile[this.mainpic], this.extension[this.mainpic] )
                     .subscribe(
                        data2=>{
                           this.storeService.putPicName( this.storetitle,this.articleid,  this.articleid+'.'+this.extension[this.mainpic] )
                            .subscribe( data =>{ console.log('done');} 
                                        ,error=>{  console.log(error) ; });
         
                                   
                            if ( this.galleryfile.length==1 )
                                 this.router.navigate(["../articles/"+this.articleid], { relativeTo: this.route });
 
                            else{ 
                                 this.galleryfile.splice(this.mainpic, 1) ;   
                                this.extension.splice(this.mainpic,1)  ; 
                                for (let i=0 ; i< this.galleryfile.length; i++) 
                                    this.galleryNames.push(this.articleid+i+'.'+this.extension[i])
                                console.log(this.galleryNames) ; 
                                this.picService.putGallery( this.galleryNames,  this.galleryfile, this.extension )
                                .subscribe(
                                    data3=>{
                                     
                                           console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz") ; 
                                            console.log(data3) ;    
                                            this.loading = false ; 
                                            this.storeService.putGalleryName( this.storetitle, this.articleid,this.galleryNames )
                                            .subscribe( 
                                                data =>{ 
                                                   console.log('done');
                                                   
                                                   this.router.navigate(["../articles/"+this.articleid], { relativeTo: this.route });
                             
                                             } 
                                             ,error=>{ });
                                           
                                          
                                    
                                     }
                                     ,error3=>{
                                         console.log(error3) ; 
                                     }
                               ); 
                          }          
                         
                        },error2=>{
                             console.log(error2) ;    
                        });
                    
                    
                    
                  /* this.storeService.postPic(this.articleid , this.gallery[this.mainpic] )
                     .subscribe(
                        data2=>{
                           console.log(data2) ;  
                           let temp = this.gallery.splice(this.mainpic, 1) ;   
                            console.log(this.gallery.length) ; 
                           this.storeService.postGallery( this.articleid, this.gallery )
                            .subscribe(
                             data3=>{
                               console.log(data3) ;    
                               this.loading = false ; 
                               this.router.navigate(["../articles/"+this.articleid], { relativeTo: this.route });
                    
                              }
                              ,error3=>{
                                 console.log(error3) ; 
                              }
                             );  
                          }
                          ,error2=>{
                             console.log(error2) ;    
                          }
                       );*/
                    
                    
                     }, 
                      error =>{
                         console.log(error) ;     
                     } 
                     );
          }
     }
    
    cancel () {
        console.log(this.newaurl) ; 
        this.router.navigate(["../store"],  { relativeTo: this.route });
                 
       
    
 }
    

 isEmpty(obj) {
  return Object.keys(obj).length === 0;
}


 
     
     getDeliveryBy (selectedCat, villes){
         console.log(villes)
          let f = []; 
          for (let v of villes ) 
          f.push (v.name) ; 
          this.deliveryService.getDeliveryBy( f, selectedCat ) 
            .subscribe (
                data => {
                    console.log (data ) ; 
                    this.delivery = data['hits']['hits']   ; 
                    for (let d of this.delivery) 
                        d.checked= false ; 
                    /*for (let x of data['hits']['hits'] ) {
                       // console.log(x['_source'])  ;
                       this.delivery.push({'title': x._source.title, 'price': x._source.price, 
                                            "categories": x._source.categories, "communes":x._source.communes } );
                        }*/
                   // console.log(this.delivery ) ; 
                  //  
                    
                    }, 
                error =>{
                    console.log(error ) ; 
                    
                    
                    }
                
                )
            
    }
    
    selectCat (event ) {
         console.log(this.selectcats) ;
         if (this.selectcats.length !=0  ) 
              this.getDeliveryBy( this.selectcats, this.store.geo ) ; 
         else 
             this.delivery = [] ;
        
          for (let c of this.selectcats) {
                c= c.trim() ; 
                if( c == "Habillements-Femmes"||c=="Habillements-Hommes"|| c=="Habillements-Enfants" ){
                   this.boolsizing = true ; 
                                console.log(c) ; 
                    }
              }  
    }
    
    selectCom(event)  {
      
        console.log(this.choosecom) ; 
        if (this.selectcats.length !=0 || this.choosecom.length !=0 ) 
          this.getDeliveryBy( this.selectcats, this.choosecom ) ;  
        else 
            this.delivery = []  ; 
    }
    
    selectDelivery (del ) {
      
        if (del.checked ==true ) {
            
            this.selectdel.splice( this.selectdel.indexOf(del) ) ; 
            del.checked =  !del.checked  ; 
        }else{
            del.checked =  !del.checked  ;
            this.selectdel.push(del ); 
            
 
        }         
        console.log(del) ; 
        console.log(this.selectdel) ; 
        
    }
    
    
    
    }
