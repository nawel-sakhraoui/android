import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldoutComponent } from './soldout.component';

describe('SoldoutComponent', () => {
  let component: SoldoutComponent;
  let fixture: ComponentFixture<SoldoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoldoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoldoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
