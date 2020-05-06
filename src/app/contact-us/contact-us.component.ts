import { Component, OnInit } from '@angular/core';
import {UserdetailsService, ContactusService } from '../_services/index'; 

@Component({
  selector: 'contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  constructor(private userdetailsService : UserdetailsService, 
              private contactusService : ContactusService ) { }

    model  ={"fullname":'', "phone":"",'sujet': [], 'text':'', "email":""} ;
    config = {
             //enables the search plugin to search in the list
            placeholder:'Selectionner', // text to be displayed when no item is selected defaults to Select,
        //customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
       // limitTo: options.length
            
            height: '200px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
              };
    
    sujets = [] ; 
        phonemask = ["0",/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," ",/[0-9]/,/[0-9]/," "]

    me= JSON.parse(localStorage.getItem('currentUser')).userid.toString() ; 

    send=false ; 
    loading = false ; 
    loading0 = false  ;
    lengthphone:boolean ; 
    ngOnInit() {
       this.loading0 =true ; 
        this.model['userid']= this.me ; 
        if(this.me !="annonym") {
        
        this.sujets = ["Demande de renseignement","Partenaire livraison", "Ouvrir des  Magasins", "Compte bloqué", "Magasin bloqué" ]; 
        this.userdetailsService.getUserAccount(this.me)
         .subscribe (
              data=>{
                  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
               
                  this.model["phone"]= data['phone'];
                  this.model["fullname"]= data['fullname'];
                  
                  this.loading0 = false ; 
              },error=>{
                   this.loading0 = false ;  
             }); 
    }else {
        
     this.sujets =    ["Demande de renseignement","Partenaire livraison", "Ouvrir des Magasins"];
      
    }     
         
  }

    sends(){
        
           if(!this.model.phone.includes("_") && this.model.phone.length!=0){
                 this.lengthphone =false ;  
        
        this.loading = true ; 
        let time = new Date().getTime() ;
        this.model['date']= time ; 
        this.contactusService.postContactUs(this.model) 
        .subscribe(
                     data=>{
                         console.log(data) ;
                         this.loading = false ; 
                         this.send = true ;   
                     },error=>{
                         console.log(error) ;
                         this.loading = false ;  
                         }
            )
            } else 
               this.lengthphone = true ;  
         
        }
    select(event){
        
        }
}
