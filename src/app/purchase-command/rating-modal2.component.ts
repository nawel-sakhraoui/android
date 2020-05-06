import {Component, Input, OnInit} from '@angular/core';
import {RatingModalService, StoreService, OngoingService, UserdetailsService } from '../_services/index';
import { Subscription }   from 'rxjs';
import { Router, ActivatedRoute  } from '@angular/router';


@Component({
  selector: 'app-rating-modal2',
  template: `
  <div *ngIf="visible" (click)="onContainerClicked($event)" class="modal fade" tabindex="-1" [ngClass]="{'in': visibleAnimate}"
       [ngStyle]="{'display': visible ? 'block' : 'none', 'opacity': visibleAnimate ? 1 : 0}">
    <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">

                 

        </div>
 
     <div class="modal-body">
     <p i18n="@@ratingmmrc" > Merci pour vos achats noter ces article s'il vous plait </p> 
      <ul class="list-group">

       <li  class="list-group-item" *ngFor='let m of model.articles '> 
  
         <img alt=""  src="{{m.pic}}" class="img-responsive crop"  >
         <star-rating id= " m.articleid" [starType]="'svg'"   size='large' [showHalfStars]="true" labelText="{{m.title}}" (starClickChange)="onClick($event, m.articleid)" ></star-rating>
         <div i18n="@@ratingalert" *ngIf="alert[m.articleid]" class="alert alert-danger" role="alert">s'il vous plait notez cet article </div>
            <textarea rows="5" class="message" name="message" [(ngModel)]="feedback[m.articleid]" #message="ngModel"   maxlength=400></textarea>
          <!--div *ngIf="alert2[m.articleid]" class="alert alert-danger" role="alert"> please add a feedback to help us improuve our service </div-->

      </li>
      </ul>
    <div class="modal-footer">
    
      <button  class="btn btn-info" (click) ="sendRating();"[disabled]="waiting"   > <i i18n="@@envoyer" >Envoyer</i>   <span *ngIf="waiting" class= "fa fa-spin"></span></button>
      <a  class="btn btn-link" (click)="hide()" i18n="@@annuler" >Annuler</a>
    </div>
      </div>
    </div>
  </div>` 
  ,
  styles: [`
    .message {
          overflow-y: scroll;
          height: 100px;
          width:100%;
          resize: none;
     }

    .modal {
      background: rgba(0,0,0,0.3);
        Ae41c8rx
    }
    .modal-body {
         max-height: calc(100vh - 210px);
         overflow-y: auto;
        }
    .crop {
    
        background-color:#eeeeee; 
        width: auto;
        height: 60px;
        overflow: hidden;
        position: relative;
        display:inline-block;
        margin-right:10px;
    }
  `]
  
})
    
export class RatingModal2Component  {
  subscription: Subscription;
     
  model:any = {} ; 
  rating :any={};
  feedback: any ={};
  alert : any = {};
  alert2:any={};   
  public visible = false;
  public visibleAnimate = false;

  me= JSON.parse(localStorage.getItem('currentUser')).userid ; 

    ratingDone = false ; 
 

  constructor(private ratingModalService: RatingModalService, 
              private storeService : StoreService, 
              private userdetailsService: UserdetailsService, 
              private ongoingService: OngoingService, 
                private route : ActivatedRoute, 
              private router : Router) {

  }


    
   public show(): void {

   this.subscription = this.ratingModalService.rating$.subscribe(
      data  => {
            this.model = data ; 
          console.log(data) ; 
            this.visible = true;
         setTimeout(() => this.visibleAnimate = true, 5);
    });
  
  }


  public hide(): void {
      if (!this.ratingDone) {
          let time = new Date().getTime() ; 
          this.userdetailsService.putNotification(this.me, this.model._id, 'rating', time  , this.model.storetitle) 
        .subscribe (
                data => { 
                        console.log(data)  ; 
                 }
                ,error=>{
                    console.log(error) ; 
                    });
         }
            this.visible = false;
            this.visibleAnimate = false;
            setTimeout(() => this.visible = false, 10);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

  waiting = false ; 
  onClick(event, id ) {
      console.log(event) ; 
      this.rating[id ] = event.rating ; 
       //console.log(id ) ;
      this.alert[id] = false ;  
      }
  sendRating () {
      this.waiting = true ;  
         let bool = true ; 
         for (let m of this.model.articles ){
             
             if (!this.rating[m.articleid] )
             {    
                 this.alert[m.articleid] = true ; 
                 bool = false ; 
                       this.waiting = false ;  
             }
             else 
                 this.alert[m.articleid] = false ; 
             
             /*if(!this.feedback[m.articleid]) {
                 this.alert2[m.articleid] = true ;
                 bool=false ; 
                 }
             else
                 this.alert2[m.articleid] = false ;  */
           }
      if (bool) { 
            for (let m of this.model.articles ){
                this.ratingDone = false ;
                 //send to data base !! the rating then close the command then put in archieve 
                 this.storeService.putRating(m.articleid,this.rating[m.articleid],  
                                             this.me, this.feedback[m.articleid] ) 
                 .subscribe(
                     data => {
                         console.log(data) ; 
                         this.storeService.putRatingStore ( this.model.storetitle, this.rating[m.articleid])
                         .subscribe (
                             data2 =>{
                                 console.log(data2) ;
                              
                                 }
                             ,error2 =>{
                                 
                                 console.log(error2 ) ; 
                                 })
                      }
                     ,error =>{
                         console.log(error) 
                      })
             this.ratingDone = true
            }
                   //put userid rating 
                                 this.ongoingService.putAllRatingArticle(this.model._id  , this.rating, this.feedback )
                                 .subscribe (
                                     data3=> {
                                        console.log(data3) ; 
                                          
                                               this.userdetailsService.removeNotifByCommandId(this.me, this.model._id , "rating" )
                                             .subscribe(
                                                  datas =>{
                                                    console.log(datas) ;
                                                this.router.navigate(["../../done"], { relativeTo: this.route });
 
                                                    }
                                                 ,errors =>{
                                                   console.log(errors);
                                                    }
                                             ); 
                                     },
                                     error3=> {
                                        console.log(error3) ; 
                                     }
                                     )
                                 ; 
                   
                   
             
           this.waiting = false ; 
           this.hide(); 
    }

}
}