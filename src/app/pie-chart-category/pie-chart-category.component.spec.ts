import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartCategoryComponent } from './pie-chart-category.component';

describe('PieChartCategoryComponent', () => {
  let component: PieChartCategoryComponent;
  let fixture: ComponentFixture<PieChartCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
