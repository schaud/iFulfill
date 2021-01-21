import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import { IssuesComponent } from './components/issues/issues.component';


const routes: Routes = [
  {path: 'home', component : HomeComponent} ,
  {path:'issues' , component:IssuesComponent},

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})

export class AppRoutingModule {}
