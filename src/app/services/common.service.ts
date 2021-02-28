import { User } from './../models/User';
import { UsersService } from './users.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  static IssuesPath = `https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/issues`;
  static RemarksPath = `https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/remarks`;
  static FeaturesPath = `https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/features`;
  static UsersPath = `https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/users`;

  constructor(private msgSnakBar: MatSnackBar) {
    // this.CurrentUser = userService.getUserById(
    //   '35d8d84f-f8f6-40e1-9a61-37ec8446d65f'
    // );
    //   console.log('  CommonService.CurrentUser ', this.CurrentUser);
  }

  showMessage(msg, action) {
    //message The message to show in the snackbar.
    //action The label for the snackbar action.
    //MatSnackBarHorizontalPosition = 'start' | 'center' | 'end' | 'left' | 'right';
    // MatSnackBarVerticalPosition = 'top' | 'bottom';
    this.msgSnakBar.open(msg, 'X', {
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
export function getCurrentDate() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  // let month2 = month.toString();
 // let day2 = day.toString();

  let hh = date.getHours();
  let ampm = hh >= 12 ? 'pm' : 'am';
  let mm = date.getMinutes();
 // let ss = date.getSeconds();
  hh = hh % 12;
  hh = hh ? hh : 12; // the hour '0' should be '12'
  // if (day < 10) {
  //   day2 = '0' + day;
  // }
  // if (month < 10) {
  //   month2 = '0' + month;
  // }
  let fullDate = `${year}/${month < 10 ? '0' + month : month}/${
    day < 10 ? '0' + day : day
  } ${hh < 10 ? '0' + hh : hh}:${mm < 10 ? '0' + mm : mm} ${ampm}`;
  console.log('getCurrentDate', fullDate);
  return fullDate;
}
export function validatePercent(percentage) {
  return percentage.match(/^(100|[1-9]?[0-9])$/) != null;
}
export function convertDate(str) {
  let date = new Date(str),
    mnth = ('0' + (date.getMonth() + 1)).slice(-2),
    day = ('0' + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join('-');
}
