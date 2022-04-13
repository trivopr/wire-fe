import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { SalesAnalysisComponent } from './sales-analysis/sales-analysis.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'sales-analysis', component: SalesAnalysisComponent},
  {path: '', component: HomeComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
