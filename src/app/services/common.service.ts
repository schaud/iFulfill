import { User } from './../models/User';
import { UsersService } from './users.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  static IssuesPath = `https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/issues`;
  static RemarksPath = `https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/remarks`;
  static FeaturesPath = `https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/features`;
  static UsersPath = `https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/users`;
  CurrentUser: User;
  constructor(
    public http: HttpClient,
    private msgSnakBar: MatSnackBar,
    private userService: UsersService
  ) {
    this.CurrentUser = userService.getUserById(
      '35d8d84f-f8f6-40e1-9a61-37ec8446d65f'
    );
    console.log('  CommonService.CurrentUser ', this.CurrentUser);
  }

  showMessage(msg, action) {
    //message The message to show in the snackbar.
    //action The label for the snackbar action.
    //MatSnackBarHorizontalPosition = 'start' | 'center' | 'end' | 'left' | 'right';
    // MatSnackBarVerticalPosition = 'top' | 'bottom';
    this.msgSnakBar.open(msg, action, {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass:
        action === 'success'
          ? ['green-snackbar']
          : action === 'error'
          ? ['red-snackbar']
          : action === 'info'
          ? ['blue-snackbar']
          : action === 'warn'
          ? ['yellow-snackbar']
          : '',
    });
  }
}
export function enumSelector(enumObj) {
  return Object.keys(enumObj).map((key) => ({
    value: enumObj[key],
    title: key,
  }));
}
