
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable}  from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { ConfigService}    from './api-config.service'; 


@Injectable({
  providedIn: 'root'
})
export class SearchService {

    

  private myMethodSubject =new  BehaviorSubject({});
 sendSearchs=  this.myMethodSubject.asObservable(); 
    
    private myMethodSubject2 =new  BehaviorSubject({});
 sendFilters=  this.myMethodSubject2.asObservable(); 
    
      private myMethodSubject3 =new  BehaviorSubject({});
 sendcity=  this.myMethodSubject3.asObservable(); 
    
    
  private host :string ; 
    
  constructor(private http: HttpClient) { 
   
         this.host = ConfigService.storeServer; 
    
 }
    
   sendSearch(data) {
        console.log(data); // I have data! Let's return it so subscribers can use it!
        // we can do stuff with data if we want
        
       try {
              this.myMethodSubject.next(data);
       
       }catch (error){
               this.myMethodSubject.next({});
          }
  }
    
   sendFilter(data) {
       console.log('ici') ; 
          console.log(data); // I have data! Let's return it so subscribers can use it!
        // we can do stuff with data if we want
        
       try {
              this.myMethodSubject2.next(data);
       
       }catch (error){
               this.myMethodSubject2.next({});
          }
  }
    
     sendCity(data) {
   //     console.log(data); // I have data! Let's return it so subscribers can use it!
        // we can do stuff with data if we want
        
       try {
              this.myMethodSubject3.next(data);
       
       }catch (error){
               this.myMethodSubject3.next({});
          }
  }
    
    // create a new storage 
    search(query: string) {
  
        return this.http.get(this.host+'/api/stores/search/'+query );
    }
  
    searchStores (query : string ) {
        
        return this.http.get( this.host+'/api/stores/stores/search/'+query) ; 
        
    }
    searchArticlesStore(store : string , query: string, available :boolean) {
  
        return this.http.get(this.host+'/api/stores/search/store/'+store+'/'+query +"/available/"+available);
    }
    
    
       getCountStores (filter, city){
          if (filter !="Indefinie") 
          return this.http.get (this.host+ '/api/myhome/count/stores/filter/'+filter+'/city/'+city) ; 
 
 
       }
    
       getCountArticles(filter, city){
            if (filter !="Indefinie") 
          return this.http.get (this.host+ '/api/myhome/count/articles/filter/'+filter+'/city/'+city) ; 
          
       } 
    
    
        
    
       getCountStores2 (filter, query, city){
          if (filter !="Indefinie") 
               return this.http.get (this.host+ '/api/myhome/count/stores/filter/'+filter+"/query/"+query+'/city/'+city) ; 
           else 
               return this.http.get (this.host+ '/api/myhome/count/stores/query/'+query+'/city/'+city) ; 

       }
    
       getCountArticles2(filter, query, city){
            if (filter !="Indefinie") 
                return this.http.get (this.host+ '/api/myhome/count/articles/filter/'+filter+"/query/"+query+'/city/'+city) ; 
            else 
                return this.http.get (this.host+ '/api/myhome/count/articles/query/'+query+'/city/'+city) ; 

       } 
        
    
    
          getCountAllStores (){
          
          return this.http.get (this.host+ '/api/myhome/count/allstores') ; 
        } 
    
         getCountAllArticles (){
          
          return this.http.get (this.host+ '/api/myhome/count/allarticles') ; 
        }
    
              
         getArticles (size ,froms,  filter, orderby, city) {
               return this.http.get (this.host+'/api/myhome/articles/filter/'+filter+"/orderby/"+orderby+"/from/"+froms+"/size/"+size+'/city/'+city); 

           
           } 
    
         getStores (size, froms, filter, orderby,city){
                if (orderby=="price") 
                   orderby ="newest"; 
             
              return this.http.get (this.host+'/api/myhome/stores/filter/'+filter+"/orderby/"+orderby+"/from/"+froms+"/size/"+size+'/city/'+city); 
          }
    
    
          getQueryArticles (size ,froms,  filter, orderby, query, city) {
              if (filter !='Indefinie')
               return this.http.get (this.host+'/api/myhome/articles/filter/'+filter+"/orderby/"+orderby+"/from/"+froms+"/size/"+size+"/query/"+query+'/city/'+city); 
              else
               return this.http.get (this.host+'/api/myhome/articles/query/'+query+"/orderby/"+orderby+"/from/"+froms+"/size/"+size+'/city/'+city); 

           } 
    
         getQueryStores (size, froms, filter, orderby, query, city){
              if (orderby=="price") 
                   orderby ="newest";  
             
             if (filter !="Indefinie")
              return this.http.get (this.host+'/api/myhome/stores/filter/'+filter+"/orderby/"+orderby+"/from/"+froms+"/size/"+size+"/query/"+query+'/city/'+city); 
             else 
              return this.http.get (this.host+'/api/myhome/stores/query/'+query+"/orderby/"+orderby+"/from/"+froms+"/size/"+size+'/city/'+city); 
 
         }
    
    
}