import { UsersService } from './services/users.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'iFulfill';
  constructor(private userSrv: UsersService) {

  }
}
