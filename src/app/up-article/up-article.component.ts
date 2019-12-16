import { Component, OnInit } from '@angular/core';
import {StoreService, AddressService, DeliveryService} from '../_services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Subscription} from 'rxjs'
import * as imagepicker from "nativescript-imagepicker"; 
import { ColorPicker } from 'nativescript-color-picker';

import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import { Color } from 'tns-core-modules/color';
import {ImageSource, fromFile, fromResource, fromBase64} from "tns-core-modules/image-source";
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label'

    import * as utils from "utils/utils";
 

@Component({
  selector: 'app-up-article',
  templateUrl: './up-article.component.html',
  styleUrls: ['./up-article.component.css']
})
export class UpArticleComponent implements OnInit {
      
loading0 :boolean ; 
  articletitle =""; 
  model :any = {}; 
    alertimg= false ; 
  mainpic = 0 ; 
    tempmainpic = 0 ; 
  gallery = [];
  color = [];  
    boolsizing =false; 
   loading:boolean ; 

  display:boolean ;
    Categories = [] ;  
    config = {
            displayKey:"description" ,//if objects array passed which key to be displayed defaults to description,
            search:true, //enables the search plugin to search in the list
           placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
        //customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
       // limitTo: options.length
      
            height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
              };

    
    selectdel= [] ; 
    delivery:any = []; 
 
    
 
    comconfig = {
            displayKey:"name" ,//if objects array passed which key to be displayed defaults to description,
            search:true, //enables the search plugin to search in the list
            placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
            //customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
            // limitTo: options.length
      
            height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
              };
  

    
    
    deliveryconfig = {
            displayKey:"title",//if objects array passed which key to be displayed defaults to description,
            search:true, //enables the search plugin to search in the list
            placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
        //customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
       // limitTo: options.length
             moreText:"price",
            
            height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
              };
    
    storetitle :string ; 
    
    editTitle:boolean= false ;
    editDesc: boolean = false; ; 
    editQt : boolean = false ; 
    editPrice: boolean = false ;  tempPrice :any = 0 ; 
    editGallery:boolean = false ; tempGallery :any = [] ; tempPic :any = ""  ; 
    editColor:boolean =false ; tempColor:any = [];
    editDelivery: boolean = false ; tempDelivery:any=[] ; 
    editAvailable :boolean = false ; tempsizing:any={};
    editCat :boolean = false ; 
    store :any ; 
    
    sizinglist = [ "xs", "s", "l", "xl", "xxl", "3xl","4xl", "5xl", "6xl", 
                   "t34", "t36", "t38", "t40","t42", "t44", "t46", "t48", "t50", "t52", "t54", "t56",
                    "t58", "t60", "t62", 
                   "p16", "p17", "p18" , "p19", "p20", "p21", "p22", "p23", "p24", "p25", "p26", "p27", 
                   "p28" ,"p29" ,"p30", "p31", "p32", "p33" ,"p34", "p35", "p36", 
                   "p37", "p38", "p39", "p40", "p41", "p42", "p43", "p44", "p45", "p46", "p47", "p48"  ,
                    "0-3mois", "3-6mois", "6-9mois", "9-12mois", "12-18mois", "18-24mois", 
                    "T2", "T3", "T4", "T5", "6ans", "7ans", "8ans", "9ans", "10-12ans", "12-14ans", "14-16ans"    
        
                ]; 
    
    boolsize = false ; 
    size :any ; 
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private storeService: StoreService, 
        private addressService : AddressService,
        private deliveryService : DeliveryService) { }
      
    ngOnInit() {
       this.loading0 = true ; 
        let s = this.route.parent.params.subscribe(params =>
        {
          
            this.storetitle = params.store ; 
            });
        let sub = this.route.params.subscribe(params => {
          
            this.articletitle = params.article ; 
          
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
                          //   this.nostore = false ; 
                             this.store = data1 ; 
                            // console.log(this.store) ; 
                             //check if i'm the store admin
                          //  this.loading = false ;
                              this.getDeliveryBy (this.store.selectedCat, this.store.geo);

                         }
                         ,error1 =>{
                             console.log(error1) ; 
                                
                           })
     
         console.log(this.articletitle) ; 
       this.storeService.getArticle(this.articletitle )
             .subscribe(
                data => {
                 console.log(data) ; 
                 this.model = data ;
                     this.loading0 = false ; 
                
                       this.display = true ; 
                 this.storeService.getGallery(this.articletitle )
                     .subscribe(
                          data3=> {
                    
                              this.model['gallery'] = data3['gallery'] ; 
                               
                                 this.storeService.getPic(this.articletitle )
                                    .subscribe(
                                      data4=> {
                    
                                          
                                              this.model['pic']= data4['pic'] ; 
                                            this.model['gallery'].unshift(data4['pic']); 
                                          //console.log(data4.pic) ;
                                         
                                           
                                      },
                                    error4 =>{
                                      console.log(error4) ; 
                                       
                          
                                      }) ;
                              
                           },
                          error3 =>{
                             console.log(error3) ; 
                     ; 
                          }) ; 
                    
                    
                             if('sizing' in this.model) {
                                         this.boolsize =true ; 

                                         this.size =new Set([].concat.apply([], Object.values(this.model.sizing ))); 
                             }else 
                                         this.boolsize = false ; 
                               
                 
                 }, 
                 error =>{
                 console.log(error) ;  
                     this.loading0 = false ; 
                     this.display = false ;    
                }) ; 
             
          });
  }
    
     //  urls = [];
   onSelectFiles(event) {

     if (event.target.files ) {
        for (let l of event.target.files) {
              var reader = new FileReader();

             reader.readAsDataURL(l); // read file as data url
            
              reader.onload = (event) => { // called once readAsDataURL is completed
              //    this.model.gallery.push(event.target.result) ;
                 // console.log(event.target.result) ; 
                 }
         }
     }
  }
     
    onSelectionChange(i){
          //console.log("xxxxxxxxxxxxxxxxxxxx") ; 
          //console.log(i) ; 

        this.mainpic = i;    
        this.model.pic = this.model.gallery[i] ; 
        
      }
  
  
     removeObject (url ) {
         var index = this.model.gallery.indexOf(url, 0);
        if (index > -1) {
            this.model.gallery.splice(index, 1);
        }
        
     }
    
     removeColor (c ) {
         var index = this.model.color.indexOf(c, 0);
        if (index > -1) {
            this.model.color.splice(index, 1);
            if(this.boolsize)
             delete this.model.sizing[c]
       }
        
     }
       
     removeDelivery (d) {
         var index = this.model.delivery.indexOf(d, 0);
        if (index > -1) {
            this.model.delivery.splice(index, 1);
        }
        
     }
    
    
    addColor(event) {
        let c = document.getElementById("color")['value'];
        this.model.color.push( c); 
        //console.log(v) ; 
        //this.model.color.push (v);
        //console.log(this.color) ;
          if(this.boolsize)  
        this.model.sizing[c] =[] ; 
        }
    
     addSizing(event, color , c) {
        console.log(event ) ; 
        
        if(event.target.checked ) 
            this.model.sizing[color].push(c) ;  
         else 
            this.model.sizing[color].splice( this.model.sizing[color].indexOf(c) , 1); 
        
        ; 
        
        
        }
   
     addDelivery(event) {
        console.log(event) ; 
         //this.selectdelivery = event ; 
         if (! this.model.delivery.includes(event ) && Object.keys(event).length !== 0) 
            this.model.delivery.push(event) ; 
            
    }
     getDeliveryMethod(event){
        console.log(event ) ;  
     //  this.total = (this.model.price *this.quantity )   +this.choosedelivery[0]['price'] ; 
    }
    
 editingTitle (){
        this.editTitle= true; 
        this.model.tempTitle =  this.model.title;
      }
    removeTitle(){
        this.editTitle = false ; 
            this.model.title =      this.model.tempTitle ;
      }
    loadingtitle = false ; 
    saveTitle(){
        //save to database ! 
       if (this.model.title !="") {
         this.loadingtitle = true ; 
         this.storeService.updateArticleTitle(this.storetitle,  this.articletitle, this.model.title )
        .subscribe(
            data => {
                 this.loadingtitle = false ; 
                      this.editTitle = false 
                     console.log(data ) ; 
                }
            ,error =>{
                this.loadingtitle = false ; 
                     console.log(error) ; 
                
                }
            )
            
          }else{
                    this.model.title =      this.model.tempTitle ; 
                     this.editTitle = false ;

           }
      }
    
    
     editingGallery (){
        this.editGallery= true; 
        this.tempGallery=  this.model.gallery.map(x => x); 
        this.tempPic = this.model.pic;
         this.tempmainpic = this.mainpic   ; 
      }
    removingGallery(){
        this.editGallery = false ;
        this.mainpic = this.tempmainpic ; 
            this.model.gallery =      this.tempGallery.map(x => x); ;
           this.model.pic = this.tempPic ; 
      }
    
    loadinggallery = false ;
    saveGallery(){
        //save to database ! 
     //if (this.model.gallery.length !=0 ) {
           this.loadinggallery =  true ; 
              this.storeService.postPic(this.articletitle , this.model.gallery[this.mainpic] )
                     .subscribe(
                        data2=>{
                           console.log(data2) ;  
                            this.tempGallery = this.model.gallery.map(x=>x) ; 
                           //let temp = this.model.gallery.splice(this.mainpic, 1) ;   
                            console.log(this.model.gallery.length) ; 
                           this.storeService.postGallery( this.articletitle, this.tempGallery.splice(this.mainpic, 1)  )
                            .subscribe(
                             data3=>{
                               console.log(data3) ;    
                               this.editGallery = false 
                                  this.loadinggallery = false;  
                              }
                              ,error3=>{
                                 console.log(error3) ; 
                                   this.loadinggallery =  false ;
                              }
                             );  
                          }
                          ,error2=>{
                             console.log(error2) ;    
                               this.loadinggallery =  false ; 
                          }
                       );
                  
        /* this.editGallery = false ;
        this.mainpic = this.tempmainpic ; 
            this.model.gallery =      this.tempGallery.map(x => x); ;
            this.model.pic = this.tempPic ; 

        
        }*/
      }  

      editingPrice (){
        this.editPrice= true; 
        this.model.tempPrice =  this.model.price;
      }
    removePrice(){
        this.editPrice = false ; 
            this.model.price =      this.model.tempPrice ;
      }
    
    loadingprice = false ; 
    savePrice(){
        //save to database 
        this.loadingprice = true ; 
         this.storeService.updateArticlePrice( this.storetitle, this.articletitle, this.model.price )
        .subscribe(
            data => {
                      this.editPrice = false 
                     console.log(data ) ; 
                     this.loadingprice = false; 
                }
            ,error =>{
                     console.log(error) ; 
                         this.loadingprice = false ; 
                }
            ) 
      }
    
     editingQt (){
        this.editQt= true; 
        this.model.tempQt =  this.model.numbers;
      }
    removeQt(){
        this.editQt = false ; 
            this.model.numbers =      this.model.tempQt ;
      }
    
    loadingqt = false ; 
    saveQt(){
        //save to database ! 
        this.loadingqt = true ; 
         this.storeService.updateArticleNumbers( this.storetitle, this.articletitle, this.model.numbers )
        .subscribe(
            data => {
                this.loadingqt = false ; 
                      this.editQt = false 
                     console.log(data ) ; 
                }
            ,error =>{
                     console.log(error) ; 
                this.loadingqt = false ; 
                
                }
            ) 
      }
    
     editingColor (){
        this.editColor= true; 
        this.tempColor =  this.model.color.map(x => x);
        if(this.boolsize) 
         
         this.tempsizing = this.model.sizing;
         
      }
    removingColor(){
            this.editColor = false ; 
            this.model.color =      this.tempColor.map(x=>x)  ;
            if(this.boolsize) 
              this.model.sizing = this.tempsizing;
      }
    loadingcolor =false ; 
    saveColor(){
        this.loadingcolor = true ; 
        //save to database ! olor
         this.storeService.updateArticleColor( this.storetitle, this.articletitle, this.model.color )
        .subscribe(
            data => {
               
                console.log(data ) ; 
                this.storeService.updateArticleSizing(this.storetitle, this.articletitle, this.model.sizing)
                .subscribe(
                    data3=> {
                         this.loadingcolor = false ;  
                            console.log(data3) ; 
                            this.editColor= false 
                          this.size =new Set([].concat.apply([], Object.values(this.model.sizing ))); 

                    }
                    ,error3=>{
                         this.loadingcolor = false ; 
                         console.log(error3) ; 
                        
                    }) ; 
                }
            ,error =>{
                     console.log(error) ; 
                 this.loadingcolor = false ;  
                }
            )
      }
    
    
      editingDelivery (){
        this.editDelivery= true; 
        this.model.tempDelivery =  this.model.delivery.map(x => x);
      }
    removingDelivery(){
        this.editDelivery = false ; 
            this.model.delivery = this.model.tempDelivery.map(x => x);;
      }
    
    loadingdelivery = false ; 
    saveDelivery(){
        //save to database ! 
      console.log(this.model.delivery ) ; 
      if (this.model.delivery.length !=0 ) {
          this.loadingdelivery = true ; 
         this.storeService.updateArticleDelivery( this.storetitle, this.articletitle, this.model.delivery )
        .subscribe(
            data => {
                      this.editDelivery = false 
                     console.log(data ) ; 
                 this.loadingdelivery = false ; 
                }
            ,error =>{
                     console.log(error) ; 
                 this.loadingdelivery = false ; 
                }
            )
            }else {
                this.editDelivery = false ;  
              this.model.delivery = this.model.tempDelivery.map(x => x) ; 
            }
      }
    
    editingDesc (){
        this.editDesc= true; 
        this.model.tempDesc =  this.model.description;
      }
    removeDesc(){
        this.editDesc = false ; 
            this.model.description =      this.model.tempDesc;
      }
    loadingdesc = false  ;
    saveDesc(){
        this.loadingdesc = true  ;
        //save to database ! 
         this.storeService.updateArticleDescription( this.storetitle, this.articletitle, this.model.description )
        .subscribe(
            data => {
                  this.loadingdesc = false ; 
                      this.editDesc = false 
                     console.log(data ) ; 
                }
            ,error =>{
                     console.log(error) ; 
                      this.loadingdesc = false ;  
                }
            )
      }
    
       editingAvailable (){
        this.editAvailable= true; 
        this.model.tempAvailable =  this.model.available;
      }
    removeAvailable(){
        this.editAvailable = false ; 
            this.model.available =      this.model.tempAvailable;
      }
    loadingavailable = false ; 
    saveAvailable(){
        //save to database ! 
        this.loadingavailable = true ; 
         this.storeService.updateArticleAvailable(this.storetitle,  this.articletitle, this.model.available )
        .subscribe(
            data => {
                this.loadingavailable = false ; 
                      this.editAvailable = false 
                     console.log(data ) ; 
                }
            ,error =>{
                     console.log(error) ; 
                this.loadingavailable = false ;   
                }
            )
      }
    
    editingCat (){
        this.editCat = true; 
        this.model['tempSelectedCat'] =  this.model['selectedCat'].map(x => x)  ;
    }
    
    removeCat(){
        this.editCat = false ; 
            this.model['selectedCat'] =  this.model['tempSelectedCat'].map(x => x)   ;
    }
    selectedIndex1 = 1 ;
    
    loadingcat = false ; 
    saveCat(){
        
        //save to database ! 
        if ( this.model['selectedCat'].length !=0 ) {
            this.loadingcat = true ; 
        this.storeService.updateArticleCategories( this.storetitle, this.articletitle, this.model['selectedCat'] )
        .subscribe(
            data => {
                    this.editCat = false  
                     console.log(data ) ; 
                this.loadingcat= false ;     
            }
            ,error =>{   
                this.loadingcat= false ;   
                     console.log(error) ; 
                
                }
            )
    
         }else{
            
                 this.model['selectedCat'] =  this.model['tempSelectedCat'].map(x => x)  ;
                 this.editCat = false ; 

            }
      } 
    
    
       getDeliveryBy (selectedCat, villes){
               
            let f = []; 
          for (let v of villes ) 
          f.push (v.name) ; 
    
          this.deliveryService.getDeliveryBy( f, selectedCat ) 
            .subscribe (
                data => {
                    console.log (data ) ; 
                    this.delivery = [] ; 
                    for (let x of data['hits']['hits'] ) {
                       // console.log(x['_source'])  ;
                        if(!( x._source in this.delivery ))
                       this.delivery.push(x._source );
                        }
                   // console.log(this.delivery ) ; 
                  //  
                    
                    }, 
                error =>{
                    console.log(error ) ; 
                    
                    
                    }
                
                )
            
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
                
                that.model.gallery.push("data:image/"+extension+";base64,"+img.toBase64String(extension )) ;
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
           
           this.model.color.push(col ) ; 
      
        //console.log(v) ; 
        //this.model.color.push (v);
        //console.log(this.color) ;
  
           if (this.boolsize) 
           if (!(col in this.model.sizing) ) 
           this.model.sizing[col] =[] ; 
           
         
       }).catch((err) => {
          console.log(err)
        });

     }
    
     onchange(event: SelectedIndexChangedEventData){
       
         console.log(event) ;
        this.model.selectedCat.push(this.Categories[event.newIndex]) ;  
         /*     if (this.selectcats.length !=0  ) 
              this.getDeliveryBy( this.selectcats, this.store.geo ) ; 
         else 
             this.delivery = [] ; 
        */
            for (let c of this.model.selectedCat) {
                c= c.trim() ; 
                if( c == "Habillements-Femmes"||c=="Habillements-Hommes"|| c=="Habillements-Enfants" ){
                   this.boolsize= true ; 
                                console.log(c) ; 
                    }
              }
                    

       }
    
     removeC ( index) {
        this.model.selectedCat.splice(index, 1);
                  for (let c of this.model.selectedCat) {
                c= c.trim() ; 
                if( c == "Habillements-Femmes"||c=="Habillements-Hommes"|| c=="Habillements-Enfants" ){
                   this.boolsize = true ; 
                                console.log(c) ; 
                    }else {
                    
                    this.boolsize = false ; 
                    }
                    
              }
    }
    
    addSize(color , c) {
      
        
        if(!this.model.sizing[color].includes(c) ) 
            this.model.sizing[color].push(c) ;  
         else 
            this.model.sizing[color].splice( this.model.sizing[color].indexOf(c) , 1); 
        
       
        
        
        }
    
        selectDelivery (del ) {
        console.log(del) ; 
        if (del.checked ==true ) {
            
            this.model.delivery.splice( this.model.delivery.indexOf(del) ) ; 
            del.checked =  !del.checked  ; 
         
        }else{
            del.checked =  !del.checked  ;
            this.model.delivery.push(del ); 
            
 
        }         
        console.log(del) ; 
//        console.log(this.selectdel) ; 
        
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
 
    hide(){
                     utils.ad.dismissSoftInput() ; 

   }

    
}
