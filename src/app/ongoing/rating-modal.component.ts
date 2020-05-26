import {Component, Input, OnInit } from '@angular/core';
import { RatingModalService, StoreService, OngoingService, UserdetailsService } from '../_services/index';
import { Subscription }   from 'rxjs';
import { Router, ActivatedRoute  } from '@angular/router';
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";


@Component({
  selector: 'app-rating-modal',
  template: `
     <GridLayout margin='10,10,10,10' rows='auto,*,auto'>
       <TextView editable ="false" class="text" row="0" text="Merci pour vos achats noter ces articles svp !" ></TextView>

        <RadListView row="1"  [items]='model._source.articles'>
            <ng-template let-a='item'>
             <StackLayout>  
                    <Image [src]="a.pic"    class="pic"  stretch="aspectFill" ></Image>

                    <StackLayout   >
            
                        <StarRating (valueChange)="setScore($event,a.articleid)"   android:scaleX=".4" android:scaleY=".4"
                                horizontalAlignment="center" verticalAlignment="center"  [value]="rating[a.articleid]" ></StarRating>
                           
                    </StackLayout>
                  
                    <TextView fontSize="12" row='0' hint="votre évaluation" class="input" [(ngModel)]="feedback[a.articleid]"    returnKeyType="done" 
                 returnPress="onReturnPress" maxLength="300"></TextView>
            </StackLayout>
            </ng-template>
        </RadListView>
        <GridLayout row="2" columns='*,auto,auto,auto'>
            <Button [isEnabled]='!loading' class="btn btn-active" color="#fff"  backgroundColor="#00BFFF" col="1"  (tap) ="sendRating()" text="Envoyer"></Button>
            <ActivityIndicator col="2" *ngIf="loading" color='#FFA500' rowSpan="2" [busy]="loading"></ActivityIndicator>
            <Button [isEnabled]='!loading'  class="btn btn-active" color="#333333"  backgroundColor="#fff" col="3" (tap)="hide()" text='Annuler'></Button>
        </GridLayout>
</GridLayout>
  `,
   styles: [`
        .pic{ width:60; height:60 ; 
        }
        .text{
            border-bottom-width:1 ; 
            border-bottom-color:#D0D0D0;
            font-size:12; 
        }

 `]
})
    
export class RatingModalComponent {
  
  subscription: Subscription;
  loading :boolean ;    
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
              private router : Router, 
              private params: ModalDialogParams
            ) {
      
      this.model = this.params.context ; 
   
     
  }

  
    
 


  public hide(): void {
     if (!this.ratingDone) {
          let time = new Date().getTime() ; 
          this.userdetailsService.putNotification(this.me, this.model._id, 'rating', time  , this.model._source.storetitle) 
        .subscribe (
                data => { 
                console.log("hide") ; 
                        console.log(data)  ; 
                       this.router.navigate(["./done"], { relativeTo: this.route });
                                                this.params.closeCallback('done');

                 }
                ,error=>{
                    console.log(error) ; 
                    });
         }else {
         
               this.router.navigate(["./done"], { relativeTo: this.route });
                          this.params.closeCallback('not done ');

         }
         
  }

setScore(e,a){
        console.log(e.object.get('value')) ; 
           this.rating[a] = Number(e.object.get('value'));
       }

  waiting = false ; 
 /* onClick(event, id ) {
      console.log(event) ; 
      this.rating[id ] = event.rating ; 
       //console.log(id ) ;
      this.alert[id] = false ;  
      }*/
  sendRating () {
          this.loading = true ; 
      this.waiting = true ;  
         let bool = true ; 
         for (let m of this.model._source.articles ){
             
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
            for (let m of this.model._source.articles ){
                this.ratingDone = false ;
                 //send to data base !! the rating then close the command then put in archieve 
                 this.storeService.putRating(m.articleid,this.rating[m.articleid],  
                                             this.me, this.feedback[m.articleid] ) 
                 .subscribe(
                     data => {
                         console.log(data) ; 
                         this.storeService.putRatingStore ( this.model._source.storetitle, this.rating[m.articleid])
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
               this.loading =false  ;    //put userid rating 
                                 this.ongoingService.putAllRatingArticle(this.model._id  , this.rating, this.feedback )
                                 .subscribe (
                                     data3=> {
                                        console.log(data3) ;  
                                           //navigate to done 

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