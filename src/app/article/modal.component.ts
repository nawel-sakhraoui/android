import {Component, Input} from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";Component
import { Router, ActivatedRoute, ParamMap, NavigationEnd  } from '@angular/router';
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";


@Component({
  selector: 'app-modal',
  template: `
 <StackLayout>

 <GridLayout [visibility]=" !warning? 'visible' : 'collapsed'"  rows="auto,auto">

   <TextView fontSize='12' row='0' editable ='false' text="Article sauvgardé dans le panier fermer pour continuer vos achats "></TextView>
   <GridLayout row='1' columns ="*,auto,auto" >

    <Button  fontSize='12' text="Panier &#xf07a;"  class="fas" col="1" backgroundColor="#FFA500" color="white"   (tap)='gotocart()' ></Button>
    <Button fontSize="12" text="Fermer" col="2" backgroundColor="transparent" color="#444444" (tap)='hide()'></Button>
 
   </GridLayout>
</GridLayout> 

 <GridLayout [visibility]=" warning? 'visible' : 'collapsed'"  rows="auto,auto">

   <TextView fontSize='12' row='0' editable ='false' text="Le panier est rempli vous pouvez supprimer quelques articles avant l'ajout"></TextView>
   <GridLayout row='1' columns ="*,auto,auto" >

    <Button  fontSize='12' text="Panier &#xf07a;"  class="fas" col="1" backgroundColor="#FFA500" color="white"   (tap)='gotocart()' ></Button>
    <Button fontSize="12" text="Fermer" col="2" backgroundColor="transparent" color="#444444" (tap)='hide()'></Button>
 
   </GridLayout>
</GridLayout> 
</StackLayout>
` ,
  styles: [`

.fas {
    font-family: Font Awesome 5 Free, fa-solid-900;
    font-weight: 900; 
}
    .modal {
      background: rgba(0,0,0,0.6);
    }
  `]
  
})
    
export class ModalComponent {
 
    warning = false ; 
    constructor( private route : ActivatedRoute, 
              private router : RouterExtensions, 
              private params: ModalDialogParams ){
        
      
      this.warning  = this.params.context.fullcart ; 
    }
    
        me= JSON.parse(localStorage.getItem('currentUser')).userid ; 
 
  public hide(): void {
     
    //        this.visible = false;
            //this.visibleAnimate = false;
      
            this.params.closeCallback();
            //setTimeout(() => this.visible = false, 10);
  }
    public gotocart (){
     
         this.router.navigateByUrl("//home/"+this.me+'/cart');

     this.params.closeCallback();
 
        
       }


        
}