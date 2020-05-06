import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleCommandComponent } from './sale-command.component';

describe('SaleCommandComponent', () => {
  let component: SaleCommandComponent;
  let fixture: ComponentFixture<SaleCommandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleCommandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
