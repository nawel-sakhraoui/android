import { Component, OnInit } from '@angular/core';
import {StoreService, DeliveryService, AddressService} from '../_services/index'; 

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as imagepicker from "nativescript-imagepicker"; 
import { ColorPicker } from 'nativescript-color-picker';

import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import { Color } from 'tns-core-modules/color';

import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label';
import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout"; 


import {ImageSource, fromFile, fromResource, fromBase64} from "tns-core-modules/image-source";
@Component({
  selector: 'app-newarticle',
  templateUrl: './newarticle.component.html',
  styleUrls: ['./newarticle.component.css']
})
export class NewarticleComponent implements OnInit {
  loading : boolean ; 
  model = {'title':"", sizing:{}, 'price':"", 'quantity':'' , 'available':true, "storetitle":"", 
            'delivery':[],"color":[], 'selectedCat':[], 'geo':[], 'created':0 } ;
  storetitle ; 
  mainpic = 0 ; 
  gallery = [];
  color = [];
  newaurl = false ;
  store:any= {}; 
  nostore:boolean ; 
  open=""; 
  show :boolean= false  ; 
  articleid = '' ;  
  suspend :boolean ; 
  selectdel= [] ; 
  delivery = []; 
 
  selectedIndex1 = 1 ; 
  sizing={};
   send = false ; 
  choosecom = [] ; 
  communes = [] ;
  boolsizing : boolean = false  ; 
 sub ; 
Categories = []; 
selectcats = [] ;
    alertimg = false ;  
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
    sizinglist = [ "xs", "s", "l", "xl", "xxl", "3xl","4xl", "5xl", 
                   "34", "36", "38", "40","42", "44", "46", "48", "50", "52", "54", "56", "58", "60", "62", 
                   "16", "17", "18" , "19", "20", "21", "22", "23", "24", "25", "26", "27", "28" ,"29" ,"30", "31", "32", "33" ,"34", "35", "36", 
                   "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"  ,
                    "0-3mois", "3-6mois", "6-9mois", "9-12mois", "12-18mois", "18-24mois", "T2", "T3", "T4", "T5", "6ans", "7ans", "8ans", "9ans", "10-12ans", "12-14ans", "14-16ans"    
        
                ]; 
    
constructor(    private route: ActivatedRoute,
               
                private router: Router,
                private storeService:StoreService, 
                private deliveryService:DeliveryService,
                private addressService: AddressService) { 
          }

 

    
  ngOnInit() {
      this.loading = true ; 
    
      
    
      
       this.sub = this.route.parent.params.subscribe(params => {
           console.log (params) ;
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
  /* onSelectFiles(event) {
    if (event.target.files ) {
        for (let l of event.target.files) {
              var reader = new FileReader();

             reader.readAsDataURL(l); // read file as data url
            
              reader.onload = (event) => { // called once readAsDataURL is completed
                 this.gallery.push(event.target) ;
                  console.log(event.target) ; 
                 }
    }
  }

}*/
     onSelectionChange(i){
          //console.log("xxxxxxxxxxxxxxxxxxxx") ; 
          //console.log(i) ; 
            this.mainpic = i ;    
      }
  
  
     removeObject (url ) {
         var index = this.gallery.indexOf(url, 0);
        if (index > -1) {
            this.gallery.splice(index, 1);
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
        //console.log(v) ; 
        //this.model.color.push (v);
        //console.log(this.color) ;
        }
   
    addDelivery(event) {
        console.log(event) ; 
        console.log(this.selectdel) ; 
         //this.selectdelivery = event ; 
       /*  if (! this.selectdeliveries.includes(event ) && Object.keys(event).length !== 0) 
            this.selectdeliveries.push(event) ; 
         */   
    }

    newarticle () {
        this.send = true ; 
        this.loading = true ;
        if ( this.model.title.length==0 || this.model.price.length==0 || this.model.price=="0" || this.gallery.length==0  || this.selectdel.length==0 || this.selectcats.length==0  ) {
            this.loading = false ; 
         }
        else{
        
            
            for (let i = 0 ; i<this.gallery.length ; i++){
            
                console.log(this.gallery[i]) ;
          //    this.gallery[i] =  android.util.Base64.encodeToString(this.gallery[i]._android, android.util.Base64.DEFAULT);  
                
             }
            
            
       // this.model.pic = this.gallery[this.mainpic]; 
       // this.gallery.splice(this.mainpic, 1);
       // this.model.gallery = this.gallery ; 
        this.model.delivery = [];
        for (let d of this.selectdel) 
           this.model.delivery.push(d._source) ;
        this.model.title = this.model.title.trim() ; 
        this.model.color = this.color ; 
        this.model.selectedCat = this.selectcats
        this.model.storetitle = this.storetitle ; 
        this.model.available = true ; 
        this.model.created = Date.now() ; 
        this.model.geo = this.store.geo ; 
        this.loading = true;
          if (this.boolsizing ) 
              this.model.sizing = this.sizing  ; 
        console.log('new article') ; 
        console.log(this.model) ; 
        //console.log(this.storetitle ) ; 
         this.storeService.postArticle(this.storetitle,  this.model )
         .subscribe(
                data => {
                 console.log(data) ; 
                    console.log(this.gallery[this.mainpic]) ; 
                  this.articleid = data['_id'] ; 
                   this.storeService.postPic(this.articleid , this.gallery[this.mainpic] )
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
                       );
                    
                    
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
    
 
     
     getDeliveryBy (selectedCat, villes){
         console.log(villes)
          let f = []; 
          for (let v of villes ) 
          f.push (v.name) ; 
          this.deliveryService.getDeliveryBy( f, selectedCat ) 
            .subscribe (
                data => {
                    
                    //console.log (data ) ; 
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
    
   /* selectCat (event ) {
         console.log(this.selectcats) ;
         if (this.selectcats.length !=0  ) 
              this.getDeliveryBy( this.selectcats, this.store.geo ) ; 
         else 
             this.delivery = [] ; 
        
        for (let c of this.selectcats) 
                if( c in ["", "", ""] )
                   this.boolsizing = true ; 
                
    }*/
    
    selectCom(event)  {
      
        console.log(this.choosecom) ; 
        if (this.selectcats.length !=0 || this.choosecom.length !=0 ) 
          this.getDeliveryBy( this.selectcats, this.choosecom ) ;  
        else 
            this.delivery = []  ; 
    }
    
    selectDelivery (del ) {
        console.log(del) ; 
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
    
   
  

    public onSelectMultipleTap() {
       // this.isSingleMode = false;

        let context = imagepicker.create({
            mode: "multiple"
        });
        this.startSelection(context);
    }

  

    private startSelection(context) {
        let that = this;

        context
        .authorize()
        .then(() => {
            //that.imageAssets = [];
         //   that.imageSrc = null;
            return context.present();
        })
        .then((selection) => {
           // console.log("Selection done: " + JSON.stringify(selection));
           // that.imageSrc = that.isSingleMode && selection.length > 0 ? selection[0] : null;

            // set the images to be loaded from the assets with optimal sizes (optimize memory usage)
          selection.forEach(function (element) {
                
            let  extension = element._android.split('.').pop() ;
            if( extension =="png" || extension =="jpg" ||  extension =="jpeg" ){
              that.alertimg = false ; 
                //console.log(element) ; 
               let img:ImageSource = <ImageSource> fromFile(element._android);
                console.log(img) ; 
                console.log(extension) ; 
                
                that.gallery.push("data:image/"+extension+";base64,"+img.toBase64String(extension )) ;
              //  console.log(that.gallery ) ;
                
            }else 
                that.alertimg = true ; 
                
            });

           
        }).catch(function (e) {
            console.log(e);
        });
  //  console.log(this.gallery) ; 
    }

    picker = new ColorPicker();
    
    showARGBPicker() {
        
       this.picker.show('#D0D0D0',  'ARGB' ).then((result) => {
       const c :number  =result as number;
          let col = new Color(c).hex  ;  
       //    console.log( c.toString(16) ); 
           
           this.color.push(col ) ; 
      
        //console.log(v) ; 
        //this.model.color.push (v);
        //console.log(this.color) ;
        this.sizing[col] =[] ; 
           
         
       }).catch((err) => {
          console.log(err)
        });

     }
    
     onchange(event: SelectedIndexChangedEventData){
       
         console.log(event) ;
        this.selectcats.push(this.Categories[event.newIndex]) ;  
         /*     if (this.selectcats.length !=0  ) 
              this.getDeliveryBy( this.selectcats, this.store.geo ) ; 
         else 
             this.delivery = [] ; 
        */
            for (let c of this.selectcats) {
                c= c.trim() ; 
                if( c == "Habillements-Femmes"||c=="Habillements-Hommes"|| c=="Habillements-Enfants" ){
                   this.boolsizing = true ; 
                                console.log(c) ; 
                    }
              }
                    

       }
    
     removeCat ( index) {
        this.selectcats.splice(index, 1);
                  for (let c of this.selectcats) {
                c= c.trim() ; 
                if( c == "Habillements-Femmes"||c=="Habillements-Hommes"|| c=="Habillements-Enfants" ){
                   this.boolsizing = true ; 
                                console.log(c) ; 
                    }else {
                    
                    this.boolsizing = false ; 
                    }
                    
              }
    }
    
     addSizing(event, color , c) {
        console.log(event ) ; 
        
        if(!this.sizing[color].includes(c) ) 
            this.sizing[color].push(c) ;  
         else 
            this.sizing[color].splice( this.sizing[color].indexOf(c) , 1); 
        
        console.log(this.sizing) ; 
        
        
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
    
    