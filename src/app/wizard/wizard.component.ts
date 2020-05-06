import { Component, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { WizardStepComponent } from './wizard-step.component';

@Component({
  selector: 'form-wizard',
  template:
  `<div class="card">
    <div class="card-header">
      <ul class="nav nav-justified">
        <li class="nav-item" *ngFor="let step of steps" [ngClass]="{'active': step.isActive, 'enabled': !step.isDisabled, 'disabled': step.isDisabled, 'completed': isCompleted}">
       
            <img class="resize" *ngIf='step.title==1' src="./assets/images/trolley.svg" >

            <img class="resize" *ngIf='step.title==1.5' src="./assets/images/times-circle-regular.svg" >
 
            <img class="resize" *ngIf='step.title==2' src="./assets/images/delivery.svg" >
            <img class="resize" *ngIf='step.title==3' src="./assets/images/package.svg" >
            <img class="resize"  *ngIf="step.title==4" src="./assets/images/check-mark.svg">
            <img class="resize"  *ngIf="step.title==4.5" src="./assets/images/handshake.svg">
      
</li>
      </ul>
    </div>
    <div class="card-block">
      <ng-content></ng-content>
    </div>
    <div class="card-footer" [hidden]="isCompleted">
        <button type="button" class="btn btn-secondary float-left" (click)="previous()" [hidden]="!hasPrevStep || !activeStep.showPrev">Previous</button>
        <button type="button" class="btn btn-secondary float-right" (click)="next()" [disabled]="!activeStep.isValid" [hidden]="!hasNextStep || !activeStep.showNext">Next</button>
        <!--button type="button" class="btn btn-secondary float-right" (click)="complete()" [disabled]="!activeStep.isValid" [hidden]="hasNextStep">Done</button -->
    </div>
  </div>`
  ,
  styles: [
    'img.resize{  object-fit: cover;'+
     'height:40px;'+
     'width :40px;'+
     '}',
      'img.resize2{  object-fit: cover;'+
     'height:40px;'+
     'width :40px;'+
     '}',
    '.card { height: 100%; }',
    '.card-header { background-color: #fff; padding: 0; font-size: 1.25rem; }',
    '.card-block { overflow-y: auto; }',
    '.card-footer { background-color: #fff; border-top: 0 none; }',
    '.nav-item { padding: 1rem 0rem; border-bottom: 0.5rem solid #ccc; }',
    '.active { font-weight: bold; color: black; border-bottom-color: #660000 !important; }',
    '.enabled { cursor: pointer; border-bottom-color:   #D3D3D3; }',
    '.disabled { color: #ccc; }',
    '.completed { cursor: default; }'
  ]
})
export class WizardComponent implements AfterContentInit {
  @ContentChildren(WizardStepComponent)
  wizardSteps: QueryList<WizardStepComponent>;

  private _steps: Array<WizardStepComponent> = [];
  private _isCompleted: boolean = false;
  
  @Output()
  onStepChanged: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();

  constructor() { }

  ngAfterContentInit() {
    this.wizardSteps.forEach(step => this._steps.push(step));
    this.steps[0].isActive = true;
  }

  get steps(): Array<WizardStepComponent> {
    return this._steps.filter(step => !step.hidden);
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  get activeStep(): WizardStepComponent {
    return this.steps.find(step => step.isActive);
  }

  set activeStep(step: WizardStepComponent) {
    if (step !== this.activeStep && !step.isDisabled) {
      this.activeStep.isActive = false;
      step.isActive = true;
      this.onStepChanged.emit(step);
    }
  }

  public get activeStepIndex(): number {
    return this.steps.indexOf(this.activeStep);
  }

  get hasNextStep(): boolean {
    return this.activeStepIndex < this.steps.length - 1;
  }

  get hasPrevStep(): boolean {
    return this.activeStepIndex > 0;
  }

  public goToStep(step: WizardStepComponent): void {
    if (!this.isCompleted) {
      this.activeStep = step;
    }
  }

  public next(): void {
    if (this.hasNextStep) {
      let nextStep: WizardStepComponent = this.steps[this.activeStepIndex + 1];
      this.activeStep.onNext.emit();
      nextStep.isDisabled = false;
      this.activeStep = nextStep;
    }
  }

  public previous(): void {
    if (this.hasPrevStep) {
      let prevStep: WizardStepComponent = this.steps[this.activeStepIndex - 1];
      this.activeStep.onPrev.emit();
      prevStep.isDisabled = false;
      this.activeStep = prevStep;
    }
  }

  public complete(): void {
    this.activeStep.onComplete.emit();
    this._isCompleted = true;
  }

}
