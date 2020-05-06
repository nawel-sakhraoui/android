

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Article , Store } from '../_models/index';
import {ConfigService} from './api-config.service'; 


//import * as EmailValidator from 'email-validator';

 
@Injectable()
export class CartService {

    host :string ; 
    
    constructor(private http: HttpClient) { 
    
         this.host = ConfigService.storeServer; 
    }

// post to cart 

// delete from cart +++title storetitle price and pic 
 postToCart ( article ){
     console.log(article);
        return this.http.post(this.host+'/api/useraccount/cart',  {'articleid': article}  ); 
    }
    
  deleteCart ( article ){
        return this.http.post(this.host+'/api/useraccount/cart/delete', {'articleid': article} ); 
    }
    
 getCart (){
     console.log('useraccount get cart') ; 
        return this.http.get(this.host+'/api/useraccount/cart/articles') ;   
        
    }
    
     getCountCart (){
     console.log('useraccount get count cart') ; 
        return this.http.get(this.host+'/api/useraccount/cart/articles/count') ;   
        
    }
    
    
    }