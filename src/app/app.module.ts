import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {SelectModule} from 'ng-select';
import { SharedModule } from './shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SalesAnalysisComponent } from './sales-analysis/sales-analysis.component';
import { PieChartCategoryComponent } from './pie-chart-category/pie-chart-category.component';
import { BarChartCategoryComponent } from './bar-chart-category/bar-chart-category.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SalesAnalysisComponent,
    PieChartCategoryComponent,
    BarChartCategoryComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    NgxDatatableModule,
    SelectModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
