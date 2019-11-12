    import { Injectable } from '@angular/core';
    import { Subject }    from 'rxjs';
     
    @Injectable()
    export class RatingModalService {
     
      // Observable string sources
      private ratingSource = new Subject<string>();
     
      // Observable string streams
      rating$ = this.ratingSource.asObservable();
     
      // Service message commands
       rating(rating: any) {
        this.ratingSource.next(rating);
      }
 
        // Observable string sources
      private stopSource = new Subject<string>();
     
      // Observable string streams
      stop$ = this.stopSource.asObservable();
     
      // Service message commands
       stop(stop: any) {
        this.stopSource.next(stop);
      }
        
    }