import { Component, OnInit } from '@angular/core';
import {DeliveryService,UserService} from '../_services/index';
@Component({
  selector: 'delivery-income',
  templateUrl: './delivery-income.component.html',
  styleUrls: ['./delivery-income.component.css']
})
export class DeliveryIncomeComponent implements OnInit {

    deliveries ={}; 
    myDeliveries =[] ;
    loading : boolean ;  
    me= JSON.parse(localStorage.getItem('currentUser')).userid ; 

    constructor(private userService : UserService, private deliveryService : DeliveryService) { }

  ngOnInit() {
      
           this.userService.getDelivery(this.me)
           .subscribe(
           data=>{
               this.loading = true ; 
               this.myDeliveries = data["delivery"].split(','); 
               console.log(this.myDeliveries ) ;
               for (let del of this.myDeliveries ){
                   this.deliveries[del]= {} ;
                    
                 
                                    this.deliveryService.getDelivery(del) 
                                    .subscribe(
                                      data1=>{
                                          console.log("wwwwwwwwwwwwwwww") ; 
                                          console.log(data1) ;
                                          this.deliveries[del]=data1     ;
                                           this.loading = false ; 
                                          this.deliveries[del].price = parseInt(this.deliveries[del].price) ; 
                                          this.deliveryService.getMonthIncome(del) 
                                           .subscribe(
                                            data2=>{
                                               // console.log("icicicicicicicicici") ;
                                                console.log(data2) ;
                                                //if (data2['aggregations']["ongoing"]["ongoing"]["buckets"].length ==0 ) 
                                                //else 
                                                 this.deliveries[del]['income']=data2['aggregations']["ongoing"]["ongoing"]["buckets"]
                                            },error2=>{
                                             //   console.log("icicicicicicicicici") ;
                                                console.log(error2) ; 
                                                }) ; 
                                               
                                      },error1=>{
                                        console.log(error1 ) ; 
                                        this.loading = false ; 
                                      });
                                   
                                    
                  
                }
               
               
            }, error=>{
                console.log(error) ;
                }
          );
      
      
  }

}
