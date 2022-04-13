import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesAnalysisComponent } from './sales-analysis.component';

describe('SalesAnalysisComponent', () => {
  let component: SalesAnalysisComponent;
  let fixture: ComponentFixture<SalesAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
