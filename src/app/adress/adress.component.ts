import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AddressService} from '../_services/index'; 
 
@Component({
  selector: 'app-adress',
  templateUrl: './adress.component.html',
  styleUrls: ['./adress.component.css']
})
    
export class AdressComponent implements OnInit {

  addresses =[]; 
  model :any = {};
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
  phonemask = ["0",/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/]

  editAddress = {}; 

  cities = []; 
  communes = [] ; 
  choosecity = []; 
  choosecom = [] ; 
  show = false; 
  activecom= false ; 
  activezipcode = false ; 

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
          this.model._source = {};
         this.addressService.getAddresses(this.me)
        .subscribe (
            data => {
                //console.log(data); 
                this.addresses = data['hits']['hits'] ; 
                //console.log(this.addresses) ;
                for (let a of this.addresses ) 
                this.editAddress[a._id] = false ; 
                
                
           }, error => {
               //console.log(error ) ; 
               
	       }) ; 

	       this.addressService.getCities () 
	       .subscribe (
		data => {
			//console.log(data) ; 
			this.cities = data['cities']; 	
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

   
  addAddress(model) {
      this.loading = true ; 
      if (this.choosecity.length ==0  || this.choosecom.length == 0 ) {
          
          this.loading = false ; 
          
      }else{
      this.addressService.addAddress (model)
        .subscribe (
            data => {
               //console.log (data ) ; 
                //save to database
                let temp = {"_source": model, '_id': data['_id'] }
               //console.log(temp) ; 
               this.addresses.push (temp) ;  
                 this.model._source = {} ; 
                 this.show = false ;
                 this.choosecom = [] ; 
                 this.choosecity = [] ; 
                 this.loading = false ; 
          
                
                
            
            }, error =>{
                this.loading = false ; 
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
               
                
                }, error =>{
                    //console.log(error ) ; 
                }
            )
    
    }
    undo(model){
                this.editAddress[model._id]=false ; 

       }
    
    editingAddress(model ) {
        this.editAddress[model._id]=true ; 
        
        }
   updateAddress (model ) {
           this.addressService.updateAddress(model._id, model._source) 
            .subscribe(
                data => {
                    //console.log(data ) ; 
                 this.editAddress[model._id]= false    ; 
                     this.show = false ;  
 
                 }, error =>{
                     //console.log(error ) ; 
                  }
                ) 
            
            }
 
   onSelectionChange(model) {
       this.getAddress.emit(model) ; 
 
       //console.log(model) ; 
       }
}
