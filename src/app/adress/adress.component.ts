import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AddressService} from '../_services/index'; 
import { SelectedIndexChangedEventData } from "nativescript-drop-down";
 

@Component({
  selector: 'app-adress',
  templateUrl: './adress.component.html',
  styleUrls: ['./adress.component.css']
})
    
export class AdressComponent implements OnInit {

  addresses =[]; 
  model :any =  { "title":"", "to":"", "phone":"", 
                                          "city":"", "commune":"", "zipcode":"", "address":""}
                      
                                 
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
  phonemask = ["0",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," "]

  editAddress = {}; 
  showAddress = {};
  cities = []; 
  communes = [] ; 
    dictcommunes = [];
  choosecity = []; 
  choosecom = [] ; 
  show = false; 
  activecom= false ; 
  activezipcode = false ; 
 
  selectedIndex ; 
  selectedIndex1 ; 
  send = false ; 
    form = false ; 
  loading = false ; 
  @Output()getAddress: EventEmitter<any> = new EventEmitter();
 

      cityconfig = {
        "search":true, //true/false for the search functionlity defaults to false,
        "height": "200px", //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      "placeholder":'...',// text to be displayed when no item is selected defaults to Select,
    //    "customComparator": ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
        //"limitTo": options.length // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
        'displayKey':'name'
        };
    
    
  
     comconfig = {
            displayKey:"name" ,//if objects array passed which key to be displayed defaults to description,
            search:true, //enables the search plugin to search in the list
           placeholder:'...', // text to be displayed when no item is selected defaults to Select,
        //customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
       // limitTo: options.length
      
            height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
              }  
    
    
  constructor(private addressService: AddressService) { }
  
          ngOnInit() {
             
          
         this.addressService.getAddresses(this.me)
        .subscribe (
            data => {
                console.log(data); 
                this.addresses = data['hits']['hits'] ; 
                console.log(this.addresses) ;
                for (let a of this.addresses ) {
                this.editAddress[a._id] = false ; 
                 this.showAddress[a._id] = false ; 
                }
                
           }, error => {
               //console.log(error ) ; 
               
           }) ; 

           this.addressService.getCities () 
           .subscribe (
        data => {
            //console.log(data) ; 
            this.cities = 
                       data['cities'].reduce((result, filter) => {
                        
                        result =result.concat([filter.name]) ;
                        return result;
                        },[]);   
        }, error => {
            //console.log(error);   
        
        }

           )
        
  
  }

  


  chooseCity(event, model) {
      //console.log(event)  ; 
      //console.log(this.choosecity) ; 
   
  model._source.city  = this.choosecity[0]['name'];  
  this.addressService.getCommunes (this.choosecity[0]['id'] ) 
  .subscribe (
    data=> {
        //console.log(this.communes) ; 
        this.communes = data['communes'] ; 
        this.activecom  = true ;
        this.choosecom = []; 
    },error =>{
       //console.log(error) ; 
    
    }
  )
  }

 // communes 
 chooseCommune(event, model ) {
    model._source.commune = this.choosecom[0]["name"];
    model._source.zipcode = this.choosecom[0]["zipcode"]
 }

   
  addAddress() {
      this.send = true ; 
      console.log(this.model) ; 
      if (this.model.title.length!=0 || this.model.title.length <50 ||  this.model.to.length!=0 ||  !this.model.phone.includes('_') 
            ||  this.model.city.length!=0 ||  this.model.commune.length!=0 ||
           this.model.codepostal.length !=0 || this.model.address.length !=0 )
            this.form =true ; 
      if (this.form) {
      this.loading = true ; 
     /* if (this.choosecity.length ==0  || this.choosecom.length == 0 ) {
          
          this.loading = false ; 
          
      }else{*/
      this.addressService.addAddress (this.model)
        .subscribe (
            data => {
               //console.log (data ) ; 
                //save to database
                let temp = {"_source": this.model, '_id': data['_id'] }
               //console.log(temp) ; 
               this.addresses.push (temp) ;  
                 this.model = {} ; 
                 this.show = false ;
                 this.choosecom = [] ; 
                 this.choosecity = [] ; 
                 this.loading = false ; 
                this.send = false ; 
                this.form = false ; 
                
            
            }, error =>{
                this.loading = false ; 
               this.send = false ; 
                this.form = false ; 
                 //console.log(error ) ; 
            })  ; 
              }
     }
    cancel() {
        this.model._source = {} ; 
          this.show = false ;
     }
    
    
    removeAddress(model){
        //removefrom db 
   this.addressService.removeAddress(model._id, model._source)
        .subscribe (
            data => {
                 //console.log (data) ; 
                this.addresses  = this.addresses.filter(function( obj ) {
                    return obj._id !== model._id;
                }); 
                 this.editAddress[model._id]=false ; 
                   this.showAddress[model._id]=false ; 
                
                }, error =>{
                    //console.log(error ) ; 
                }
            )
    
    }
    undo(model){
                this.editAddress[model._id]=false ; 
                
       }
    
    editingAddress(model ) {
     
        
        this.editAddress[model._id]=!this.editAddress[model._id]; 
        this.showAddress[model._id ] = false ; 
        
        
        }
     showingAddress(model ) {
        this.editAddress[model._id]=false ; 
        this.showAddress[model._id ] = !this.showAddress[model._id ]
        
        
        }
   updateAddress (model, id ) {
            this.send = true ; 
      if (model.title.length!=0 || model.title.length <50 ||  model.to.length!=0 ||  !model.phone.includes('_') 
            ||  model.city.length!=0 ||   model.commune.length!=0 ||
           model.codepostal.length !=0 ||  model.address.length !=0 )
            this.form =true ; 
      if (this.form) {
           this.addressService.updateAddress(id, model) 
            .subscribe(
                data => {
                    //console.log(data ) ; 
                 this.editAddress[id]= false    ; 
                     this.show = false ;  
                     this.send = false ; 
                     this.form = false ; 
 
                 }, error =>{
                     //console.log(error ) ; 
                        this.show = false ;  
                        this.send = false ; 
                         this.form = false ; 
                  }
                ) 
            
            }
       }
 
   onSelectionChange(model) {
       this.getAddress.emit(model) ; 
 
       //console.log(model) ; 
       }
    
    
    
    
   public onchange1(event: SelectedIndexChangedEventData ){
             //  console.log(`Drop Down selected index changed from ${args.oldIndex} to ${args.newIndex}`);; 
        this.model.commune =this.communes[event.newIndex];
       for (let e of this.dictcommunes ) 
            if (e.name == this.model.commune ) {
                this.model.zipcode = e.zipcode ; 
                break ; 
                }
         //  model._source.zipcode = this.choosecom[0]["zipcode"]

       
       };
 
    
    public onchange(event: SelectedIndexChangedEventData){
       
        this.model.city  = this.cities[event.newIndex]; 
        this.addressService.getCommunes ((event.newIndex+1 ).toString()) 
        .subscribe (
             data=> {
                 //console.log(this.communes) 
                 this.dictcommunes= data['communes'] 
                 this.communes = data['communes'].reduce((result, filter) => {
                        
                        result =result.concat([filter.name]) ;
                        return result;
                        },[]);  
                 console.log(data) ; 
                    this.activecom  = true ;
                        this.choosecom = []; 
                },error =>{
                //console.log(error) ; 
    
                }
        )
    }  
    
       public onchanges1(event: SelectedIndexChangedEventData, i  ){
             //  console.log(`Drop Down selected index changed from ${args.oldIndex} to ${args.newIndex}`);; 
        this.addresses[i]._source.commune =this.communes[event.newIndex];
       for (let e of this.dictcommunes ) 
            if (e.name == this.addresses[i]._source.commune ) {
                this.addresses[i]._source.zipcode = e.zipcode ; 
                break ; 
                }
         //  model._source.zipcode = this.choosecom[0]["zipcode"]

       
       };
 
    
    public onchanges(event: SelectedIndexChangedEventData,i){
       
        this.addresses[i]._source.city  = this.cities[event.newIndex]; 
        this.addressService.getCommunes ((event.newIndex+1 ).toString()) 
        .subscribe (
             data=> {
                 //console.log(this.communes) 
                 this.dictcommunes= data['communes'] 
                 this.communes = data['communes'].reduce((result, filter) => {
                        
                        result =result.concat([filter.name]) ;
                        return result;
                        },[]);  
                 console.log(data) ; 
                    this.activecom  = true ;
                        this.choosecom = []; 
                },error =>{
                //console.log(error) ; 
    
                }
        )
    }
}

