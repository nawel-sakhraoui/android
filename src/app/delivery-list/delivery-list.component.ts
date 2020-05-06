//all delivery listed 
import { Component, OnInit } from '@angular/core';
import {DeliveryService, AddressService, StoreService} from '../_services/index'; 


@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent implements OnInit {

deliveries =   [];
newDelivery = {'phone':[]}; 
page  =   1; 
size  =   5;
total =   0 ;
loading = false ; 
loading2 = false ; 
add = false ; 
choosecom = [] ; 
villes = [] ;  
tempDel={};
phones ="" ; 
editDelivery={} ; 
editAvailable= {};
phonemask = ["0",/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," "]
 
villeconfig = {
            displayKey:"name" ,//if objects array passed which key to be displayed defaults to description,
            search:true, //enables the search plugin to search in the list
            placeholder:'Selectionner les villes', // text to be displayed when no item is selected defaults to Select,
            //customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
            // limitTo: options.length
      
            height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
              }   
     
              
selectCat = [] ;
 categories = [];  
 config = {
            displayKey:"description" ,//if objects array passed which key to be displayed defaults to description,
            search:true, //enables the search plugin to search in the list
            placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
            //customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
            // limitTo: options.length
      
            height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
 }
constructor(
        private deliveryService: DeliveryService, 
        private addressService : AddressService , 
        private storeService : StoreService
    ) { 


}


ngOnInit() {

     this.addressService.getCities()
               .subscribe(
                   data=>{
                       console.log(data) ; 
                       this.villes = data['cities'] ; 
                        
                   /*    this.villes.unshift({'id':"101","name":"Centre"}) ; 
                       this.villes.unshift({'id':"102","name":"Est"}) ; 
                        this.villes.unshift({'id':"103","name":"Ouest"}) ; 
                        this.villes.unshift({'id':"104","name":"Sud Est"}) ;
                        this.villes.unshift({'id':"105","name":"Sud Ouest"}) ;  
                       this.villes.unshift({'id':"100","name":"48 Willaya"}) ; 
                       */
                   }, error=>{
                     console.log(error ) ;     
                   }
                   ) 
    
    
    this.deliveryService.getCountDelivery  ()
	.subscribe(
	data=>{
		console.log(data); 
		this.total = data["count"];
		this.getPage(1); 

	},error =>{	

		console.log(error) ; 

	}); 
     this.storeService.getCategories()
            .subscribe(
                data => {
                    console.log(data) ; 
                     this.categories = data['categories'] ; 
               
                    
                }
                ,error =>{
                    console.log(error ) ;
                 }); 

  
  }

  
  
  
  

  getPage(page) {

  	this.deliveryService.getAllDelivery( (page-1)*this.size , this.size)
  	.subscribe (

  		data=>{
			console.log(data) ; 
			this.deliveries  = data['hits']['hits'] ; 
                this.page = page ;
                
                for (let del of this.deliveries ) {
                    
                    this.editDelivery[del._id] =false;
                      this.editAvailable[del._id] =false;
                    }
		},error=>{
			console.log(error) ; 
	
		});

  
  }

   
    addDelivery() {
    this.loading = true ; 
        console.log(this.newDelivery) ;
        /*let temp = []; 
        for (let v of this.newDelivery.villes )
          temp.push(v['name'] ) ; 
        this.newDelivery.villes = temp ; 
        
     */ 
        this.newDelivery.phone = this.phones.split(',') ;  
        this.deliveryService.addDelivery(this.newDelivery)
        .subscribe (
            data => {
                this.newDelivery['available'] = true ; 
                    this.deliveries.unshift ({'_id': data['_id'],  '_source': this.newDelivery }) ; 
                     //console.log(data ) ; 
                     this.add = false ; 
                    // console.log(this.newDelivery) ;  
                     this.newDelivery =  {'phone':[]};  
                     this.loading = false;  
               
            }, error =>{
                console.log(error)  ; 
                this.loading = false ; 
            }
            ) 
    }

    
      editingDel(id,i ){
          this.tempDel = this.deliveries[i]._source.phone ; 
          this.editDelivery[id] = true ; 
          
          }
      removingDel (id,i) {
         this.deliveries[i]._source.phone=    this.tempDel  ; 
          this.editDelivery[id] = false; 
          
          }
      savingDel(id, data){
           let phone = data.split(',') ;
            this.deliveryService.updatePhone(id, phone)
          .subscribe(
              data => {
                   this.editDelivery[id]=false ; 
                  }
              , error => {
                  console.log(error) ; 
                  }) 
          }
    
    
       temp:boolean ; 
       editingAvailable(id , i ){
          this.temp = this.deliveries[i]._source.available;
          this.editAvailable[id] = true ; 
          
          }
      removingAvailable (id,i) {
          
         this.deliveries[i]._source.available  =    this.temp  ; 
          this.editAvailable[id] = false; 
          
          }
    
      savingAvailable(id, data){
          this.deliveryService.updateAvailable(id, data)
          .subscribe(
              data => {
                   this.editAvailable[id]=false ; 
                  }
              , error => {
                  console.log(error) ; 
                  })
          }


}


