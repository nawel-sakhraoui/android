import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAccountKitComponent } from './login-account-kit.component';

describe('LoginAccountKitComponent', () => {
  let component: LoginAccountKitComponent;
  let fixture: ComponentFixture<LoginAccountKitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginAccountKitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAccountKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
