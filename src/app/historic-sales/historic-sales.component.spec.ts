import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricSalesComponent } from './historic-sales.component';

describe('HistoricSalesComponent', () => {
  let component: HistoricSalesComponent;
  let fixture: ComponentFixture<HistoricSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
