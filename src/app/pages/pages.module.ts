import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router' //esta es lo mismo para utilizar los modulos de rutas


// Modulos
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';
// import { AppRoutingModule } from '../app-routing.module'; //esta es lo mismo para utilizar los modulos de rutas declaradas


// Compnentes
import { PagesComponent } from './pages/pages.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { DashboardComponent } from './dashboard/dashboard.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent
  ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    // AppRoutingModule    
    RouterModule,
    SharedModule,
    ComponentsModule
  ]
})
export class PagesModule { }
