import { Component, OnInit } from '@angular/core';
import {Store} from '../_models/store'
import {PicService, StoreService, AddressService, DeliveryService} from '../_services/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Subscription} from 'rxjs'

import { take, finalize } from 'rxjs/operators';

import { NgxPicaService } from 'ngx-pica'; 


@Component({
  selector: 'app-up-article',
  templateUrl: './up-article.component.html',
  styleUrls: ['./up-article.component.css']
})
export class UpArticleComponent implements OnInit {
      
loading0 :boolean ; 
  articletitle =""; 
  model :any = {}; 
    
  mainpic = 0 ; 
  tempmainpic = 0 ; 
  gallery = [];
  color = [];  
  busy : Subscription ; 
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
delivery = []; 
 
    
 
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
    editAvailable :boolean = false ; 
    editCat :boolean = false ; 
    extension=[] ; 
    tempextension = [] ;
    galleryNames= [] ;
    galleryfile = [];
    tempgallerynames =[] ;
    loadinggallery=false ;
     temppicname:any  ; 
    tempgalleryname :any; 
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
  private deliveryService : DeliveryService, 
  private picService :PicService, 
    private _ngxPicaService :NgxPicaService) { }
      
  ngOnInit() {
       this.loading0 = true ; 
        let s = this.route.params.subscribe(params =>
        {
          
            this.storetitle = params.store ; 
            });
        this.route.params.subscribe(params => {
          
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
     
        // console.log(this.articletitle) ; 
         this.storeService.getArticle(this.articletitle )
             .subscribe(
                data => {
                 console.log(data) ; 
                      
            //     this.waitimg= true ;
                 this.model = data ;
                 this.loading0 = false ; 
                
                 this.display = true ; 
               
                 this.model.pic = this.picService.getPicLink(this.model.picname); 
                 this.mainpic = 0 ; 
                 this.model['gallery'] = [this.model.pic] ; 
            
                 this.galleryfile =[] ;
                    this.picService.getPic(this.model.picname)
                    .subscribe(
                        data=> {
                            console.log("cccccccccccc");
                            console.log(data ); 
                            let blob = new Blob([data], { type: "image/"+this.model.picname.split('.').pop()});
                            console.log(blob) ;  
                            
                            this.galleryfile.push(blob) ; 
                            this.extension.push(this.model.picname.split('.').pop());
                             this.model.pic =  blob ;
                        },error=> {
                           console.log(error) ;     
                        }
                        )
                  
                 if (this.model.hasOwnProperty('gallerynames') ) 
                        for (let g of this.model.gallerynames) {
                             this.model['gallery'].push(this.picService.getGalleryLink(g))  ;
                          
                               this.picService.getGallery(g)
                                .subscribe(
                                data=> {
                                    console.log("cccccccccccc");
                                    console.log(data ); 
                                    let blob = new Blob([data], { type: "image/"+g.split('.').pop()});
                                    console.log(blob) ;  
                            
                                    this.galleryfile.push(blob) ; 
                                    this.extension.push(g.split('.').pop()); 
                        },error=> {
                           console.log(error) ;     
                        }
                        )
                   
                        }   else 
                          this.model['gallerynames']=[] ; 
                    console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww");
                      console.log(this.galleryfile ) ; 
                    console.log(this.extension) ; 
                    
                //     if (this.galleryfile.length== this.model.gallery.length )  
                  //   this.waitimg = false ; 
                    
                   /*  this.storeService.getGallery(this.articletitle )
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
                          }) ; */
                    
                    
                               if(this.model.hasOwnProperty('sizing'))  
                                         this.boolsize =true ; 

                          else  
                            for (let c of this.model.selectedCat) 
                                  if( c == "Habillements-Femmes"||c=="Habillements-Hommes"|| c=="Habillements-Enfants" ){
                                          this.boolsize= true ; 
                                       
                                         this.model.sizing= {};  
                                   }else 
                                      this.boolsize = false ; 
                                     
                            if (this.boolsize) 
                                  this.size =new Set([].concat.apply([], Object.values(this.model.sizing ))); 

                     
                 
                 }, 
                 error =>{
                 console.log(error) ;  
                     this.loading0 = false ; 
                     this.display = false ;    
                }) ; 
             
          });
  }
    
    
    /*readUrl(event:any) {
    console.log("yyyyyy") ; 
      console.log(event ) ; 
              let reader = new FileReader();
              
              reader.readAsDataURL(event.target);
        console.log(event.target ) ; 
            return event.target.files[0] ; 
    }*/
    
     //  urls = [];
    waitimg = false ; 
    alertimg=false ;
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
                        this.model.gallery.push(event.target.result);
                 }, false);
            
                console.log("aaaaaaaaaaaaaaaaaaaa")  ; 
                console.log(imageResized) ; 
                reader.readAsDataURL(imageResized);
                this.galleryfile.push(imageResized) ; 
                this.extension.push(imageResized['name'].split('.').pop());
            
                
            }, (err) => {
                
                this.waitimg = false ; throw err.err;
            }); 
        
                
            
        }
  }

}
     
    onSelectionChange(i){
          //console.log("xxxxxxxxxxxxxxxxxxxx") ; 
          //console.log(i) ; 

            this.mainpic = i;    
      }
  
  
     removeObject (url ) {
    
             var index = this.model.gallery.indexOf(url, 0);
        if (index > -1) {
            this.extension.splice(index,1) ; 
            this.model.gallery.splice(index, 1);
            this.galleryfile.splice(index,1) ; 
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
        this.model.color.unshift( c); 
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
    saveTitle(){
        //save to database ! 
       if (this.model.title !="") {
        
         this.storeService.updateArticleTitle(this.storetitle,  this.articletitle, this.model.title )
        .subscribe(
            data => {
                      this.editTitle = false 
                     console.log(data ) ; 
                }
            ,error =>{
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
        
         this.tempextension =  this.extension.map(x => x);  
         this.tempPic = this.model.pic;
         this.temppicname = this.model.picname ; 
         this.tempgallerynames = this.model.gallerynames.map(x => x);; 
         this.tempmainpic = this.mainpic   ; 
      }
    
    
    removingGallery(){
        this.editGallery = false ;
        this.mainpic = this.tempmainpic ; 
        this.model.gallery = this.tempGallery.map(x => x); ;
        this.model.pic = this.tempPic ; 
        this.model.picname = this.temppicname; 
        this.model.gallerynames = this.tempgallerynames; 
         this.extension = this.tempextension.map(x => x);
      }
    
    
    saveGallery(){

        this.waitimg = true ;
        if (this.model.gallery.length !=0 ) {
          
           this.picService.deletePic(this.temppicname) 
           .subscribe (
              data => {
              this.picService.putPic(this.articletitle+'.'+this.extension[this.mainpic] , this.galleryfile[this.mainpic], this.extension[this.mainpic] )
                     .subscribe(
                        data2=>{
                            
                         //this.images.push(path.replace(/^.*[\\\/]/, ''));
                         
                          this.storeService.putPicName( this.storetitle,this.articletitle,  this.articletitle+'.'+this.extension[this.mainpic] )
                            .subscribe( 
                                
                            data =>{ 
                                    console.log('done save pic name ')
                                    if (this.galleryfile.length>1 ){
                              
                                        //this.model.gallery.splice(this.mainpic, 1) ;   
                                        this.galleryfile.splice(this.mainpic, 1) ;   
                                        this.extension.splice(this.mainpic,1)  ;
                                   
                                        
                                        if(this.tempgallerynames.length!=0 ) 
                                        this.picService.deleteGallery(this.tempgallerynames) 
                                        .subscribe(
                                        data=>{
                                       
                                            this.galleryNames = [] ;  
                                            for (let i=0 ; i<this.galleryfile.length; i++) 
                                                this.galleryNames.push(this.articletitle+i+'.'+this.extension[i])
                               
                                                this.picService.putGallery( this.galleryNames, this.galleryfile, this.extension )
                                                .subscribe(
                                                    data3=>{
                                                           
                                                                 this.storeService.putGalleryName( this.storetitle, this.articletitle,this.galleryNames )
                                                                 .subscribe( 
                                                                     data =>{ 
                                                                            console.log('done');  
                                                                            this.loadinggallery = false; 
                                                                            this.editGallery = false ;
                                                                            this.waitimg = false ;  
                                                                     },error=>{ 
                                                                              this.loadinggallery = false; 
                                                                              this.editGallery = false   ; 
                                                                              this.waitimg = false ;   
                                                                     });
                                           
                             
                                          
                                                                
                                                    }
                                                    ,error3=>{
                                                             console.log(error3) ; 
                                                             this.loadinggallery = false;  
                                                              this.editGallery = false ;
                                                         this.waitimg = false ;  
                                                   }); 
                                    
                                       
                              
                                    },err=>{ 
                                      console.log(err) ; 
                                      this.loadinggallery = false; 
                                      this.editGallery = false ; 
                                      this.waitimg = false ;  
                                    });
                                  else {
                                        
                                            this.galleryNames = [] ;  
                                            for (let i=0 ; i<this.galleryfile.length; i++) 
                                                this.galleryNames.push(this.articletitle+i+'.'+this.extension[i])
                               
                                                this.picService.putGallery( this.galleryNames, this.galleryfile, this.extension )
                                                .subscribe(
                                                    data3=>{
                                                           
                                                                 this.storeService.putGalleryName( this.storetitle, this.articletitle,this.galleryNames )
                                                                 .subscribe( 
                                                                     data =>{ 
                                                                            console.log('done');  
                                                                            this.loadinggallery = false; 
                                                                            this.editGallery = false ;
                                                                            this.waitimg = false ;  
                                                                     },error=>{ 
                                                                              this.loadinggallery = false; 
                                                                              this.editGallery = false   ; 
                                                                              this.waitimg = false ;   
                                                                     });
                                           
                             
                                          
                                                                
                                                    }
                                                    ,error3=>{
                                                             console.log(error3) ; 
                                                             this.loadinggallery = false;  
                                                              this.editGallery = false ;
                                                         this.waitimg = false ;  
                                                   });           
                                            
                                  }
                                            
                                
                                      }else{
                                        
                                                  this.loadinggallery = false; 
                                                  this.waitimg = false ;  
                                                  this.editGallery = false 
                                            /*    this.storeService.putGalleryName( this.storetitle, this.articletitle,[] )
                                                .subscribe( 
                                                        data =>{ 
                                                                console.log('done');  
                                                                 this.loadinggallery = false;
                                                                  this.editGallery = false   
                                                        } ,error=>{ 
                                                                 this.loadinggallery = false;  
                                                                  this.editGallery = false 
                                                        });
                              
                                            */}
                                        
                                        
                                        
                            },error=>{  
                                console.log(error) ; 
                                  this.loadinggallery = false;  
                                  this.editGallery = false 
                                  this.waitimg = false ; 
                            });    
                                
                       
                        
                      },error2=>{
                            console.log(error2) ;   
                            this.loadinggallery = false;   
                            this.editGallery = false ; 
                            this.waitimg = false ;  
                       });
        
                },err=>{
                        console.log(err) ; 
                        this.loadinggallery = false;   
                        this.editGallery = false     ; 
                     this.waitimg = false ;   
                });
            
        }
        
        
        
        
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
    savePrice(){
        //save to database ! 
         this.storeService.updateArticlePrice( this.storetitle, this.articletitle, this.model.price )
        .subscribe(
            data => {
                      this.editPrice = false 
                     console.log(data ) ; 
                }
            ,error =>{
                     console.log(error) ; 
                
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
    saveQt(){
        //save to database ! 
         this.storeService.updateArticleNumbers( this.storetitle, this.articletitle, this.model.numbers )
        .subscribe(
            data => {
                      this.editQt = false 
                     console.log(data ) ; 
                }
            ,error =>{
                     console.log(error) ; 
                
                }
            ) 
      }
    
     editingColor (){
        this.editColor= true; 
        this.model.tempColor =  this.model.color.map(x => x);
         this.model.tempSizing = this.model.sizing.map(x=>x) ; 
         
      }
    removingColor(){
        this.editColor = false ; 
            this.model.color =      this.model.tempColor ;
        this.model.sizing = this.model.tempsizing ; 
      }
    saveColor(){
        //save to database ! olor
         this.storeService.updateArticleColor( this.storetitle, this.articletitle, this.model.color )
        .subscribe(
            data => {
                console.log(data ) ; 
                this.storeService.updateArticleSizing(this.storetitle, this.articletitle, this.model.sizing)
                .subscribe(
                    data3=> {
                            console.log(data3) ; 
                            this.editColor= false 
                          this.size =new Set([].concat.apply([], Object.values(this.model.sizing ))); 

                    }
                    ,error3=>{
                         console.log(error3) ; 
                        
                    }) ; 
                }
            ,error =>{
                     console.log(error) ; 
                
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
    saveDelivery(){
        //save to database ! 
      console.log(this.model.delivery ) ; 
      if (this.model.delivery.length !=0 ) {
              
          
         this.storeService.updateArticleDelivery( this.storetitle, this.articletitle, this.model.delivery )
        .subscribe(
            data => {
                      this.editDelivery = false 
                     console.log(data ) ; 
                }
            ,error =>{
                     console.log(error) ; 
                
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
    saveDesc(){
        //save to database ! 
         this.storeService.updateArticleDescription( this.storetitle, this.articletitle, this.model.description )
        .subscribe(
            data => {
                      this.editDesc = false 
                     console.log(data ) ; 
                }
            ,error =>{
                     console.log(error) ; 
                
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
    saveAvailable(){
        //save to database ! 
         this.storeService.updateArticleAvailable(this.storetitle,  this.articletitle, this.model.available )
        .subscribe(
            data => {
                      this.editAvailable = false 
                     console.log(data ) ; 
                }
            ,error =>{
                     console.log(error) ; 
                
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
    
    saveCat(){
        //save to database ! 
        if ( this.model['selectedCat'].length !=0 ) {
        this.storeService.updateArticleCategories( this.storetitle, this.articletitle, this.model['selectedCat'] )
        .subscribe(
            data => {
                    this.editCat = false  
                     console.log(data ) ; 
                }
            ,error =>{   
                 
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
                        
                        x._source['id']=x._id ;
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
    
   
    

}
