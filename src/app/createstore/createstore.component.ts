
import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ListPicker } from 'tns-core-modules/ui/list-picker/list-picker';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';
import { Label } from 'tns-core-modules/ui/label';
import {StoreService, UserService, AddressService} from '../_services/index';
import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import * as util from "utils/utils";

@Component({
  selector: 'app-createstore',
  templateUrl: './createstore.component.html',
  styleUrls: ['./createstore.component.css'],
  //  host: {
    //    '(document:click)': 'handleClick($event)',
    //},
})
    
export class CreatestoreComponent implements OnInit {

    myhome =""; 
    form = false ;
    send = false ;
    model: any = {};
    geo:any= [] ; 
    sub: any ;
    keywords : any;     
    error = "" ;
    exist: boolean ;  
    loading = false  ; 
    selectedIndex1 = 1 ; 
    selectedIndex2 = 1; 
    index=0 ; 
    dictcities =[] ; 
 
    config = {
            displayKey:"description", //if objects array passed which key to be displayed defaults to description,
            search:true ,//enables the search plugin to search in the list
            height: '200px' ,
            placeholder:'...',// text to be displayed when no item is selected defaults to Select,
            moreText: '+', 
            searchPlaceholder:'...'     
            };

    ////selectCat = [] ;
  
    Categories = []; 
    categoriesAr=[]; 
    cities = []; 
    
      config2= {
            displayKey:"name" ,//if objects array passed which key to be displayed defaults to description,
            search:true, //enables the search plugin to search in the list
            placeholder:'...', // text to be displayed when no item is selected defaults to Select,
            height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
            searchPlaceholder:'...', 
            moreText: '+'
            };


    constructor(
        private router: Router,
        private route : ActivatedRoute,
        private storeService: StoreService,
        private userService : UserService,
        private addressService : AddressService,   
        private myElement: ElementRef) {
            
           
    };
       ngOnInit() {
              
           
        
           
           
           
            this.model.geo = [] ; 
            this.model.selectedCat = [] ; 
            this.model.title =""; 
            this.model.description =""; 
           
            this.sub = this.route.params.subscribe(params => {
                 this.myhome = JSON.parse(localStorage.getItem('currentUser')).userid ;
                console.log(this.myhome);
    
               
            this.storeService.getCategories()
            .subscribe(
                data => {
                     this.Categories = data['categories'] ; 
                     console.log(data);
                    
                }
                ,error =>{
                    console.log(error ) ;
                 });
                
                this.storeService.getCategoriesAr()
                    .subscribe (
                         d1 => {
                             console.log(d1) ; 
                                 this.categoriesAr = d1['categories']; 
                                  console.log(this.categoriesAr) ; 
                         },e1=>{
                              console.log(e1) ; 
                             }) ; 
                
       
                
               this.addressService.getCities()
               .subscribe(
                   data=>{
                       this.dictcities = data['cities'] ; 
                      this.cities= 
                   data['cities'].reduce((result, filter) => {
                         
                          
                        result =result.concat([filter.name]) ;
                        return result;
                        },[]);
                       //dd1.item = this.cities; 
                       //dd1.selectedIndex = this.cities.getIndex("name");
                
                   /*    this.cities.unshift({'id':"101","name":"Centre"}) ; 
                       this.cities.unshift({'id':"102","name":"Est"}) ; 
                        this.cities.unshift({'id':"103","name":"Ouest"}) ; 
                        this.cities.unshift({'id':"104","name":"Sud Est"}) ;
                        this.cities.unshift({'id':"105","name":"Sud Ouest"}) ;  
                       this.cities.unshift({'id':"100","name":"48 Willaya"}) ; */
                       
                   }, error=>{
                     console.log(error ) ;     
                   }
                   ) 
        
    });

}
    
existStore () {
    if (this.model.title.length >=5 ) {
        this.model.title = this.model.title.trim() ;  
       this.storeService.existStore (this.model.title )
        .subscribe (
            data =>{
                    console.log(data ) ; 
                  if (data['count'] >0 ) {
                      this.exist= true ; 
                      
                      }else{
                       this.exist = false ; 
                      }
                },error =>{
                    console.log(error) ; 
                }
            )
        
     }   
    }
    
newstore (){
    this.existStore () ;
    this.send = true ; 
    
    if ( this.model.title.length >5 && this.model.title.length <30 &&!this.exist &&
            this.model.selectedCat.length!=0 && this.geo.length!=0 &&
        this.model.description.length < 300 && this.model.description.length !=0  ) 
      this.form = true ; 
    
    if (this.form ) {
        //check max stores created then create store 
        this.model.open =true ; 
    
    this.model.title = this.model.title.trim(); 

        this.loading = true ; 
     if ( this.model.selectedCat.length==0 || this.geo.length==0) {
         this.loading = false ; 
     }else {
    
         this.model.geo = [] ; 
          for (let i = 0 ;i < this.geo.length ; i++ ) {
             for (let k of this.dictcities ) {
                 if (this.geo[i]  == k.name ) {
                    this.model.geo.push( k) ;   break ;   
                 } 
            }
          }
         this.model.selectedCatAr= [] ; 
         for (let i =0 ; i< this.Categories.length ; i++ ) {
             if( this.Categories[i] in this.model.selectedCat )  
                 this.model.selectedCatAr.push (this.categoriesAr[i]);
             
           }
       console.log(this.model) ; 
        this.storeService.create(this.model)
        .subscribe(
               data => {
                   
                   
                   this.userService.addStore(this.myhome, data["_id"])
                   .subscribe(
                       data0=> {
                           console.log(data0);
                           this.loading = false ; 
                            this.router.navigate(["../../../stores/"+data["_id"]], { relativeTo: this.route });
                      console.log("done") ;
                   
                           
                       },error0 =>{
                           console.log(error0) ;
                       }) ;
                   
                   
                     },   
                 error => {
            
                       console.log(error) ; 
                     this.error = error ; 
                      });
        
};
    }
     }
    

   public onchange1(event: SelectedIndexChangedEventData ){
             //  console.log(`Drop Down selected index changed from ${args.oldIndex} to ${args.newIndex}`);; 
        this.geo.push(this.cities[event.newIndex])
       
       };
 
    
    public onchange(event: SelectedIndexChangedEventData){
       //console.log(event) ;
        this.model.selectedCat.push(this.Categories[event.newIndex]) ;  
                console.log(this.model.selectedCat) ; 

       }
   onopen1(){
       }
   onclose1(){
   }
    
    removeCat ( index) {
        this.model.selectedCat.splice(index, 1);
    }
    
    removeGeo(index){
         this.geo.splice(index, 1);

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
    hide(){
          util.ad.dismissSoftInput() ;  
        }
    
}
