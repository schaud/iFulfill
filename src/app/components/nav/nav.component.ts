import { UsersService } from './../../services/users.service';
import { CommonService } from './../../services/common.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  CurrentUser: any;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public userServ: UsersService
  ) {}

  ngOnInit() {
    this.userServ
      .getCurrentUser()
      .then((res) => (this.CurrentUser = res.username))
      .catch(() => (this.CurrentUser = ''));

  }
}
