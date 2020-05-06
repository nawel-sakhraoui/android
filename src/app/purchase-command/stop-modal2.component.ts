import {Component, Input, OnInit,Output,EventEmitter  } from '@angular/core';
import {RatingModalService, StoreService, OngoingService, UserdetailsService } from '../_services/index';
import { Subscription }   from 'rxjs';
import { Router, ActivatedRoute  } from '@angular/router';


@Component({
  selector: 'app-stop-modal2',
  template: `
  <div *ngIf="visible" (click)="onContainerClicked($event)" class="modal fade" tabindex="-1" [ngClass]="{'in': visibleAnimate}"
       [ngStyle]="{'display': visible ? 'block' : 'none', 'opacity': visibleAnimate ? 1 : 0}">
    <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-body" i18n="@@confirmationannuler" >

                  <p > êtes vous sûre de vouloir annuler cette commande ? </p>

        </div>
 
     
    <div class="modal-footer">
    
      <a  class="btn btn-danger" (click) ="sendStop() " i18n='@@oui'> Oui  <span *ngIf="waiting" class= "fa fa-refresh fa fa-refresh-animate"></span></a>
      <a  class="btn btn-link " (click)="hide()" i18n='@@non' >Non</a>
    </div>
      </div>
    </div>
  </div>` 
  ,
  styles: [`
    

    .modal {
      background: rgba(0,0,0,0.3);
        
    }
    .modal-body {
         max-height: calc(100vh - 210px);
         overflow-y: auto;
        }
    .crop {

        width: auto;
        height: 60px;
        overflow: hidden;
        position: relative;
        display:inline-block;
        margin-right:10px;
    }
  `]
  
})
    
export class StopModal2Component {
  
  subscription: Subscription;
     
  model:any = {} ; 
  waiting  = false ; 
  public visible = false;
  public visibleAnimate = false;

  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 

 @Output() stop: EventEmitter<any> = new EventEmitter();
 

  constructor( 
              private ratingModalService : RatingModalService, 
              private ongoingService: OngoingService, 
                private route : ActivatedRoute, 
              private router : Router) {}
    

    
   public show(): void {
                
   this.subscription = this.ratingModalService.stop$.subscribe(
      data  => {
            this.model = data ; 
          console.log(data) ; 
            this.visible = true;
         setTimeout(() => this.visibleAnimate = true, 5);
    });
  
  }


  
  


  public hide(): void {
     
            this.visible = false;
            this.visibleAnimate = false;
            setTimeout(() => this.visible = false, 10);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

    sendStop(){
        this.waiting = true ; 
           let time = new Date().getTime() ;
                this.model.time = time ; 
 
         this.stop.emit(this.model) ; 
       
    
        this.waiting = false ; 
         this.hide()  ;  
       }
}