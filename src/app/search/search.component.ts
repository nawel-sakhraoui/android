import { Component, OnInit } from '@angular/core';
import {SearchService } from '../_services/index' ; 
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
      me= JSON.parse(localStorage.getItem('currentUser')).userid ; 

  constructor(private searchService: SearchService, 
              private route: ActivatedRoute,
              private router: Router) { }
  query : string="" ; 
  ngOnInit() {
  }
    
    getQuery(event){
        
        console.log('search ... ' ) ; 
        console.log (this.query ) ; 
   
        if (this.query !="" ){
                                this.searchService.sendSearch({
                                   "query": this.query});
                               
                                this.router.navigate(["/result"]);
                                 this.query = ""; 
                                event = "" ; 
            
            }
    
    }
    /*enterQuery(event){
      // this.text = event ; 
      console.log(event ) ;
        //if user is connected save user request ! 
            
    }*/

}
