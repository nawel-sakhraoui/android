import {Component, Input, OnInit,Output,EventEmitter  } from '@angular/core';
import {RatingModalService, StoreService, OngoingService, UserdetailsService } from '../_services/index';
import { Subscription }   from 'rxjs';
import { Router, ActivatedRoute  } from '@angular/router';
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";


@Component({
  selector: 'app-stop-modal',
  template: `
<GridLayout rows="*,auto"> 
<TextView editable='false' font-size='12' row="0" col="0" text='êtes vous sure de vouloir Annuler cette  transaction ? {{model.id}} ' ></TextView>
<GridLayout  row="1" columns='*,* '>
<Button  col='0' text="Oui"  color="#ffffff"  backgroundColor='#d9534f'  (tap)="sendStop()" ></Button> 
<Button  col='1' text='Non'    backgroundColor='transparent'  (tap)="hide()" ></Button>
</GridLayout>
</GridLayout>
    ` 
  ,
  styles: [`
    

    .modal {
      background: rgba(0,0,0,0.6);
        
    }
    .modal-body {
         max-height: calc(100vh - 210px);
         overflow-y: scroll;
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
    
export class StopModalComponent  {
  
  subscription: Subscription;
     
  model:any = {} ; 
  waiting  = false ; 
  public visible = false;
  public visibleAnimate = false;

  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 

 //@Output() stop: EventEmitter<any> = new EventEmitter();
 

  constructor( 
              private ratingModalService : RatingModalService, 
              private ongoingService: OngoingService, 
              private route : ActivatedRoute, 
              private router : Router, 
              private params: ModalDialogParams) {
    
      
  
}
  
    

  
  


  public hide(): void {
     
    //        this.visible = false;
            //this.visibleAnimate = false;
      
            this.params.closeCallback();
            //setTimeout(() => this.visible = false, 10);
  }



    sendStop(){
        
        
        this.waiting = true ; 
          console.log(this.model ) ; 
           let time = new Date().getTime() ;
           this.model['time'] = time ; 
        
            console.log(this.model) ; 
      //   this.stop.emit(this.model) ; 
       
    
       // this.waiting = false ; 
        // this.hide()  ;
        this.params.closeCallback(this.model);

       }
}