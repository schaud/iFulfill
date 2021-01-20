import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {NewIssueComponent} from './new-issue/new-issue.component';


const routes: Routes = [
  {path: 'home', component : HomeComponent},
  {path: 'new-issue', component: NewIssueComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})

export class AppRoutingModule {}
