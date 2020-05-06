import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoresMenuComponent } from './stores-menu.component';

describe('StoresMenuComponent', () => {
  let component: StoresMenuComponent;
  let fixture: ComponentFixture<StoresMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoresMenuComponent ]
    })
    .compileComponents();
  })) ;

  beforeEach(() => {
    fixture = TestBed.createComponent(StoresMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
