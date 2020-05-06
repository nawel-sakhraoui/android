import { Component, OnInit } from '@angular/core';
import {DeliveryService,UserService, OngoingService, StoreService, UserdetailsService, PicService} from '../_services/index';
 

@Component({
  selector: 'weekly-income',
  templateUrl: './weekly-income.component.html',
  styleUrls: ['./weekly-income.component.css']
})
export class WeeklyIncomeComponent implements OnInit {
    
    me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
    delivery=[] ;
    deliveries ={};
    selectDel = ""; 
    weeklyincome:boolean;
    weekongoing ={} ; 
    currentMonth :any;
   loading:boolean;
    current:any ;
    currentDisplay :any={"first":"","last":""}; 
    
    next :any ;  
    nextDisplay:any ={"first":"","last":""}; 
     
   
    previous :any ;  
    previousDisplay:any ={"first":"","last":""}; 
    interval = 86400000 ;
    
  constructor(private userService: UserService,private deliveryService:DeliveryService) { }

  ngOnInit() {
      this.loading = true ; 
     this.userService.getDelivery(this.me)
     .subscribe(
           data0 =>{
               
              this.delivery= data0['delivery'].split(',');      
               console.log(this.delivery ) ; 
               
               this.selectDel = this.delivery[0];
               this.deliveries[this.selectDel]={'title':''} ;
               
               for (let del of this.delivery) {
                    this.deliveries[del]= {'title':''} ;
                    this.deliveryService.getDelivery(del) 
                 .subscribe(
                    data =>{
                            this.deliveries[del] = data ; 
                        },error=>{
                            console.log(error) ; 
                    })
               }
               
                  let curr = new Date ;
                  let  first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
                  let temp = first +1 
                let intervall = curr.setDate(temp) - curr.setDate(first) ; 
               console.log(intervall) ;  
                  let  last = first + 6; // last day is the first day + 6
                  first = curr.setDate(first);
                  last = curr.setDate(last) ; 
               
                  this.init(first, last) ; 
  
               
           },error0 =>{
               console.log(error0 ) ; 
                this.loading = false ; 
           }
         )
      
      
    
  
  
  
  }
    
    selectDelivery(del ){
        
        this.selectDel = del ;  
        
          let curr = new Date ;
                  let  first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
             
                  let  last = first + 6; // last day is the first day + 6
                  last = curr.setDate(last) ; 
                       first = curr.setDate(first);  
                  this.init(first, last) ; 
        
     }
    
    init(first,last) {
        
     this.loading = true ; 

        
      this.current = {"first":first, "last":last};
      console.log(this.current ) ; 
      this.currentMonth =  new Date(first).toLocaleDateString("fr-FR", {year:'numeric', month: 'long'} );
      
      this.currentDisplay ={"first": new Date(first).toLocaleDateString("fr-FR", { day: "numeric", weekday: "long"}),
                            "last": new Date(last).toLocaleDateString("fr-FR", { day: "numeric", weekday: "long"})}

      this.previous = {'first':first-(this.interval*7), 'last':first-(this.interval*1)};
      
      this.previousDisplay ={"first": new Date(this.previous.first).toLocaleDateString("fr-FR", { day: "numeric", weekday: "long"}),
                              "last": new Date(this.previous.last).toLocaleDateString("fr-FR", { day: "numeric", weekday: "long"})}

      this.next = {"first":last+(this.interval*1), 'last': last+(this.interval*7)};
      
      this.nextDisplay={"first": new Date(this.next.first).toLocaleDateString("fr-FR", { day: "numeric", weekday: "long"}),
                              "last": new Date(this.next.last).toLocaleDateString("fr-FR", { day: "numeric", weekday: "long"})}
  
        
    this.deliveryService.getWeeklyIncome(this.selectDel ,  first , last )
         .subscribe(
           data0 =>{
                    console.log(data0);
                    if (data0['hits']['hits'].length==0)
                        this.weeklyincome= false ;
                    else{
                        this.weeklyincome = true ; 
                        
                        
                        let temp = data0['hits']['hits'][0]['inner_hits']['ongoing']['hits']['hits'];
                        console.log(temp) ;
                        this.weekongoing  =this.groupBy ( temp,"_source", "storeid") ;
                        console.log(this.weekongoing) ;  

                        for (let k of Object.keys(this.weekongoing)){
                              this.weekongoing[k]['total']= 0 ;  
                              this.weekongoing[k]['refund']= 0 
                              for (let w of this.weekongoing[k])
                                    if (w._source.refund==0 ) 
                                      this.weekongoing[k]['total'] += w._source.price ;  
                        
                                    else 
                                          this.weekongoing[k]['refund']+= 1 
                        }
                        
                        console.log(this.weekongoing);
                        }
               
                    this.loading = false ;     
           },error0=>{
               
                   console.log(error0);
                   this.loading = false ; 
           })
             
    
    
    }

    
 
    getPreviousWeek(){
        
        this.init(  this.previous.first, this.previous.last ) 
        
       }
    
    getNextWeek(){
       
        this.init(  this.next.first, this.next.last ) 
        }
  
   groupBy (xs,s, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[s][key]] = rv[x[s][key]] || []).push(x);
    return rv;
  }, {});
       
      
  }
     remis(){
           
           }
}