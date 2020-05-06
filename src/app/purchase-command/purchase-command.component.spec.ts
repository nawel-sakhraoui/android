import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCommandComponent } from './purchase-command.component';

describe('PurchaseCommandComponent', () => {
  let component: PurchaseCommandComponent;
  let fixture: ComponentFixture<PurchaseCommandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseCommandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
