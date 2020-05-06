import { Component, OnInit } from '@angular/core';
import {ContactusService} from '../_services/index'; 



@Component({
  selector: 'contact-us-manager',
  templateUrl: './contact-us-manager.component.html',
  styleUrls: ['./contact-us-manager.component.css']
})
export class ContactUsManagerComponent {/*implements OnInit {
/*
  constructor(private contactusService : ContactusService) { }

   page = 1; 
   count = 0; 
   size = 3; 
   contactus = [] ; 
    notdisplay ={} ; 
      me= JSON.parse(localStorage.getItem('currentUser')).userid ; 

   ngOnInit() {
      
      this.contactusService.getNotCloseCount()
      .subscribe(
          data=>{ 
                this.count = data['count']; 
                if (this.count !=0 ){
                   this.getPage(1) ;   
                 }
              
          },error=>{
           
          })
      
      
    }
    
    getPage(page ){
         
            this.contactusService.getNotClose( (page-1)*this.size , this.size)
            .subscribe (

                data=>{
                    console.log(data) ; 
                    this.contactus  = data; 
                    for (let i=0 ; i < this.contactus.length ; i++ )  {
                        this.contactus[i]._source.date  = new Date ( this.contactus[i]._source.date ).toLocaleString("fr-FR").replace("à","-"); 
                        this.notdisplay[this.contactus[i]._id]=false ; 
                    }
                    this.page = page    ;
                
                },error=>{
                    console.log(error) ; 
    
                });
        
     }
    closes(id){
    let time = new Date() ; 
           this.contactusService.putClose(id, time )
            .subscribe (

                data=>{
                    console.log(data) ; 
                    this.notdisplay[id] = true ; 
                
                },error=>{
                    console.log(error) ; 
    
                });

        
        }

      gotouser(userid){
        
      }*/
}
