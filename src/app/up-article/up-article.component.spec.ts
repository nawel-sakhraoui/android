import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpArticleComponent } from './up-article.component';

describe('UpArticleComponent', () => {
  let component: UpArticleComponent;
  let fixture: ComponentFixture<UpArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
