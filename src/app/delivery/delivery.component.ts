import { Component, OnInit,ViewChild ,  AfterViewInit , AfterViewChecked, AfterContentInit} from '@angular/core';
import {DeliveryService,UserService, OngoingService, StoreService, UserdetailsService, PicService} from '../_services/index';
import { Router, ActivatedRoute  } from '@angular/router';
import {Subscription} from 'rxjs';
import * as prettyMs from 'pretty-ms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  myDeliveries = [] ; 
  countdel={}
  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
  page ={} ; 
  max = 2 ; 
  loading :boolean 
    
   deliveries = {} ; 
  constructor(  private userService : UserService,
                private deliveryService: DeliveryService) { }

  ngOnInit() {
      
      this.userService.getDelivery(this.me)
      .subscribe(
           data=>{
               this.loading = true ; 
               this.myDeliveries = data["delivery"].split(','); 
               console.log(this.myDeliveries ) ;
               for (let del of this.myDeliveries ){
                   this.page[del]=1;
                   this.deliveries[del]= {} ;
                   
                   this.deliveryService.getOngoingDeliveryCount(del)
                   .subscribe(
                            data0=>{
                                
                                console.log(data0);
                                this.countdel[del] =data0['count'] - data0['countclose']; 
                               console.log(  this.countdel[del]) ; 
                              
                             
                                    this.deliveryService.getDelivery(del) 
                                    .subscribe(
                                      data1=>{
                                          console.log("wwwwwwwwwwwwwwww") ; 
                                          console.log(data1) ;
                                          this.deliveries[del]=data1     ;
                                          if (this.countdel[del] !=0 ) 
                                                this.getPage(del, 1) ; 
                                          
                                          this.loading = false ;
                                       
                                      },error1=>{
                                        console.log(error1 ) ; 
                                        this.loading = false ; 
                                      });
                                   
                                    
                             }, error0=>{ 
                                console.log(error0);    
                             });
                }
               
               
            }, error=>{
                console.log(error) ;
                }
          );
  }
    
    
getPage(deliveryid,page ) {
        this.page[deliveryid] = page ;
        this.deliveryService.getOngoingDelivery(deliveryid, (this.page[deliveryid]-1)*this.max ,this.max)
        .subscribe(
            data=>{
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                console.log(data) ; 
                let data0 =  data['hits']['hits']; 
            for (let i= 0 ; i < data0.length; i++ )  {
                    data0[i]['_source'].start = new Date(data0[i]['_source'].start).toLocaleString("fr-FR").replace("à","-");
                    if( data0[i]['_source'].got!=0)  
                                data0[i]['_source'].got = new Date(parseInt(data0[i]['_source'].got)).toLocaleString("fr-FR").replace("à","-");
                    if( data0[i]['_source'].delivered!=0)  
                                  data0[i]['_source'].delivered = new Date(parseInt(data0[i]['_source'].delivered)).toLocaleString("fr-FR").replace("à","-");
                    if( data0[i]['_source'].refund!=0)  
                                 data0[i]['_source'].refund = new Date(parseInt( data0[i]['_source'].refund)).toLocaleString("fr-FR").replace("à","-");
                    if( data0[i]['_source'].close!=0)  
                                 data0[i]['_source'].close = new Date(parseInt( data0[i]['_source'].close)).toLocaleString("fr-FR").replace("à","-");
               }     
               this.deliveries[deliveryid].ongoing =         data0;      
                
                this.loading = false ; 
            }, error0=>{ 
                        console.log(error0);
                this.loading = false ; 
           })
        
        }
   
    
    putGot(deliveryid,ongoingid , i ){
          let time = new Date().getTime() ;
          this.deliveryService.putDeliveryGot(deliveryid, ongoingid, time)
            .subscribe(
                    data0=>{ 
                        console.log(data0) ; 
                        this.deliveries[deliveryid].ongoing[i]._source.got =  new Date(time).toLocaleString("fr-FR").replace("à","-"); 
                        
                    },error0=>{
                       console.log(error0) ;  
                    });
    }
       
    putDelivered(deliveryid,ongoingid , i ){
          let time = new Date().getTime() ;
          this.deliveryService.putDeliveryDelivered(deliveryid, ongoingid, time)
            .subscribe(
                    data0=>{ 
                        console.log(data0) ; 
                        this.deliveries[deliveryid].ongoing[i]._source.delivered =  new Date(time).toLocaleString("fr-FR").replace("à","-"); 
                        
                    },error0=>{
                       console.log(error0) ;  
                    });
    }
    
    putRefund(deliveryid,ongoingid , i ){
          let time = new Date().getTime() ;
          this.deliveryService.putDeliveryRefund(deliveryid, ongoingid, time)
            .subscribe(
                    data0=>{ 
                        console.log(data0) ; 
                        this.deliveries[deliveryid].ongoing[i]._source.refund =  new Date(time).toLocaleString("fr-FR").replace("à","-"); 
                        
                    },error0=>{
                       console.log(error0) ;  
                    });
    }
    
    putClose(deliveryid,ongoingid , i ){
          let time = new Date().getTime() ;
          this.deliveryService.putDeliveryClose(deliveryid, ongoingid, time)
          .subscribe(
                    data0=>{ 
                        console.log(data0) ; 
                        this.deliveries[deliveryid].ongoing[i]._source.close =  new Date(time).toLocaleString("fr-FR").replace("à","-"); 
                        
                    },error0=>{
                       console.log(error0) ;  
                    });
    }

}
