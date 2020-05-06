import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Article} from '../_models/index';

@Injectable({
  providedIn: 'root'
})
export class BuynowService {

  private articleSource = new BehaviorSubject({});
  currentArticle = this.articleSource.asObservable();

  constructor() { }

  upArticle(article: any) {
    //  console.log(article) ; 
      try {
         this.articleSource.next(article);
       }catch (error){
              this.articleSource.next({});
          }
  }

  
}
