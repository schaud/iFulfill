import {
  ChangeDetectorRef,
  Component,
  OnInit,
  HostListener,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
// import { ApiServiceService} from '../../services/api-service.service';
// import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
// import {SubtaskComponent} from '../dialog/subtask/subtask.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// import {AuthorizationService} from '../../services/authorization.service';
import { Observable } from 'rxjs';
// import {DataService} from '../../services/data.service';
// import {SubtaskDetailsComponent} from '../dialog/subtask-details/subtask-details.component';
import { MatSort, Sort } from '@angular/material/sort';

import { Issue } from '../../models/Issue';
import { Remark } from '../../models/Remark';
import { User } from '../../models/User';
import { EditIssuesComponent } from '../edit-issues/edit-issues.component';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css'],
})
export class IssuesComponent implements OnInit, AfterViewInit {
  obs: Observable<any>;
  dataSource: MatTableDataSource<Issue>;
  @ViewChild('issueSort') issueSort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  obsName: Observable<any>;
  dataSourceName: MatTableDataSource<Issue>;
  @ViewChild('nameSort') nameSort: MatSort;
  @ViewChild('paginatorName') paginatorName: MatPaginator;

  @ViewChild('nameSortAdmin') nameSortAdmin: MatSort;
  @ViewChild('paginatorNameAdmin') paginatorNameAdmin: MatPaginator;

  obsDate: Observable<any>;
  dataSourceDate: MatTableDataSource<Issue>;
  @ViewChild('dateSort') dateSort: MatSort;
  @ViewChild('paginatorDate') paginatorDate: MatPaginator;

  currentItemsToShow = [];
  currentItemsToShowName = [];
  currentItemsToShowDate = [];
  pageSize = 4; // number of Issues per page

  // Stoday: boolean;
  // Screate: boolean;
  // Sdate: boolean;
  // Sname: boolean;

  scrHeight: any;
  scrWidth: any;

  sortedData: Issue[];
  //   constructor(private apiservice: ApiServiceService, public dialog: MatDialog,
  //     private auth: AuthorizationService, private data: DataService, private cdr: ChangeDetectorRef) {
  // this.getScreenSize();

  // }
  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.getScreenSize();

    // this.sortedData = this.Issues.slice();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.getCurrentDate();
    this.getIssues();
    this.getRemarks();
    // this.data.sharedToday.subscribe((Stoday) => (this.Stoday = Stoday));
    // this.data.sharedCreate.subscribe((Screate) => (this.Screate = Screate));
    // this.data.sharedDate.subscribe((Sdate) => (this.Sdate = Sdate));
    // this.data.sharedName.subscribe((Sname) => (this.Sname = Sname));

    this.dataSource = new MatTableDataSource<Issue>(this.issues);
    // this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();

    this.dataSourceName = new MatTableDataSource<Issue>(this.tasksByName);
    this.dataSourceName.paginator = this.paginatorNameAdmin;
    // if (this.isAdmin) {
    //   this.dataSourceName.paginator = this.paginatorNameAdmin;
    // }
    // if (!this.isAdmin) {
    //   this.dataSourceName.paginator = this.paginatorName;
    // }
    this.obsName = this.dataSourceName.connect();
    this.cdr.detectChanges();
  }

  //Objects
  usernames: User[] = Object.create(User);
  task: Issue = Object.create(Issue);
  newTaskReport: Issue = Object.create(Issue);
  issues: Issue[] = new Array<Issue>();
  tasksByDate: Issue[] = new Array<Issue>();
  tasksByName: Issue[] = new Array<Issue>();
  remark: Remark = Object.create(Remark);
  remarks: Remark[] = new Array<Remark>();
  issueRemarks: Remark[] = new Array<Remark>();
  //Variables: General and Application State
  currentUser = localStorage.getItem('UserEmail');
  selectedTask: Issue = Object.create(Issue);
  // momentDate = moment.utc().utcOffset(-5).format('YYYY-MM-DD');
  name: string;
  date: any;

  id: number;
  subTaskName: string;
  subTaskDetails: string;
  subTaskProgress: string;
  subTaskUserId: string;

  //Variables : Boolean flags

  isAllSelected: boolean = false;
  indeterminate = false;
  showSpinner: boolean = false;
  complete: boolean = false;
  checked: boolean = false;

  //Utility functions
  selectAll(e) {
    this.isAllSelected = e.checked;
    console.log('selectAll', this.isAllSelected, e.checked);
  }
  selectItem(e) {
    if (e.value) this.checked = !this.checked;
  }
  sortData(array) {
    return array.sort((a, b) => {
      return <any>new Date(b.taskdate) - <any>new Date(a.taskdate);
    });
  }

  validatePercent(percentage) {
    // return percentage.match(/^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?%)$/) != null;
    // return percentage.match(/^[0-9][0-9]?$|^100$/) != null;
    return percentage.match(/^(100|[1-9]?[0-9])$/) != null;
  }

  convertDate(str) {
    let date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }

  //   console.log(convert("Thu Jun 09 2011 00:00:00 GMT+0530 (India Standard Time)"))
  // //-> "2011-06-08"

  getIssues() {
    this.showSpinner = true;
    let obj = new Issue();
    obj.id = '11';
    obj.title = 'RM/ RPM approver name not reflecting correctly';
    obj.reported_at = '8/24/2020';
    obj.criticality = 'Moderate';
    obj.description = `RM/ RPM approver name not reflecting correctly for RPB associates
      (list contains names of central RMG team), selected approver from the list and
      communicated the same—mail communication attached. (Request for RPM approval)`;
    obj.pending_with = 'Satyen, Bala(Spire)';
    obj.status = 'Open';
    obj.closure_date = '';
    obj.reporter_id = 'Yuvasree ';
    obj.created_at = ' ';
    obj.verified_by = ' ';
    obj.target_date = ' ';
    obj.system = 'ifulfill';
    this.issues.push(obj);
    obj = new Issue();
    obj.id = '12';
    obj.title = 'ifulfill Session issues';
    obj.reported_at = '8/20/2020';
    obj.criticality = 'very High';
    obj.description = `ifulfill Session issues`;
    obj.pending_with = 'Yuvasree';
    obj.status = 'Testing Completed Except 1 scenario';
    obj.closure_date = '';
    obj.reporter_id = 'Wael';
    obj.created_at = ' ';
    obj.verified_by = ' ';
    obj.target_date = `9/11/2020
    9/25/2020
    TBD `;
    obj.system = 'ifulfill';
    this.issues.push(obj);

    obj = new Issue();
    obj.id = '24';
    obj.title = 'Resource is in A3 yet not able to fulfill RR';
    obj.reported_at = '8/22/2020';
    obj.criticality = 'Low';
    obj.description = `Resource is in A3 yet not able to fulfill RR`;
    obj.pending_with = 'Kiran,Satish';
    obj.status = '4th Sept : Discussion in prg';
    obj.closure_date = '';
    obj.reporter_id = 'Sharjeel ';
    obj.created_at = ' ';
    obj.verified_by = ' ';
    obj.target_date = ' ';
    obj.system = 'ifulfill';
    this.issues.push(obj);
    this.dataSource = new MatTableDataSource<Issue>(this.issues);
    this.dataSource.paginator = this.paginator;
    this.currentItemsToShow = this.issues.slice(0, this.pageSize);
    // this.sortIssues(this.sort, this.issues);
    this.complete = true;

    this.showSpinner = false;
    return this.issues;
  }
  getIssueby(id) {
    let obj = this.issues.find((i) => i.id === id);
    console.log(obj);
    return obj;
  }
  getIssueRemarks(id): Remark[] {
    let obj: Remark[] = this.remarks.filter((r) => r.issue_id === id);

    // let obj = this.remarks.filter((el) => {
    //   el.user_id === id;
    //
    // });

    console.log(`the remarks of issue:${id}: ${obj}`);
    return obj;
  }
  getRemarks() {
    let obj = new Remark();
    obj.id = '1';
    obj.created_at = '8/24/2020';
    obj.remark = `Need to discuss with Amit Chandak, and Ghanshaym for priority in spire,
    The data shared by Amit chandak is already maintained in our DB,
     in case of any issues support will be done from backend till that time.
      Pooja suggested to remove the irrelevant names from the drop down`;
    obj.remark_type = 'issue';
    obj.user_id = 'Satyen';
    obj.issue_id = '11';
    this.remarks.push(obj);

    obj = new Remark();
    obj.id = '2';
    obj.created_at = '8/24/2020';
    obj.remark = `Temporarily the session has been disbaled, dev completed for permanent fix, testing to be started`;
    obj.remark_type = 'issue';
    obj.user_id = 'Yuvasree';
    obj.issue_id = '12';
    this.remarks.push(obj);

    obj = new Remark();
    obj.id = '3';
    obj.created_at = '8/24/2020';
    obj.remark = ` Testing Completed for all scenarios except 1. Possible sln needs to be identified.`;
    obj.remark_type = 'issue';
    obj.user_id = 'Yuvasree';
    obj.issue_id = '12';
    this.remarks.push(obj);

    obj = new Remark();
    obj.id = '4';
    obj.created_at = '8/24/2020';
    obj.remark = `Data sync up between ifulfill and imanage has one day delay, due to this issue has raised. As per the current design`;
    obj.remark_type = 'issue';
    obj.user_id = 'Kiran';
    obj.issue_id = '24';
    this.remarks.push(obj);

    obj = new Remark();
    obj.id = '5';
    obj.created_at = '8/24/2020';
    obj.remark = `To be discussed with imanage for sync up to be real time. Narendra to Discuss with Gayatri on priortisation`;
    obj.remark_type = 'issue';
    obj.user_id = 'Satish';
    obj.issue_id = '24';
    this.remarks.push(obj);
    // this.showSpinner = true;
    // this.complete = false;

    // console.log('Subtasks');
    // console.log(this.remarks)

    return this.remarks;
  }

  // Angular Material Function: Used for creating Subtasks

  async onPageChange($event) {
    this.currentItemsToShow = this.issues;
    this.currentItemsToShow = this.issues.slice(
      $event.pageIndex * $event.pageSize,
      $event.pageIndex * $event.pageSize + $event.pageSize
    );
  }

  async onPageChangeName($event) {
    this.currentItemsToShowName = this.tasksByName;
    this.currentItemsToShowName = this.tasksByName.slice(
      $event.pageIndex * $event.pageSize,
      $event.pageIndex * $event.pageSize + $event.pageSize
    );
  }

  async onPageChangeDate($event) {
    this.currentItemsToShowDate = this.tasksByDate;
    this.currentItemsToShowDate = this.tasksByDate.slice(
      $event.pageIndex * $event.pageSize,
      $event.pageIndex * $event.pageSize + $event.pageSize
    );
  }

  sortIssues(sort: Sort, taskArray: Issue[]) {
    const data = taskArray.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'title':
          return compare(a.title, b.title, isAsc);
        case 'reported_at':
          return compare(a.reported_at, b.reported_at, isAsc);
        case ' reporter_id':
          return compare(a.reporter_id, b.reporter_id, isAsc);
        case 'status':
          return compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
    this.currentItemsToShow = this.sortedData.slice(0, this.pageSize);
  }
  hover() {
    console.log('hover');
    return;
  }

  openDialog() {
    let dialogVals: any = {
      subtask: 'holder',
      progress: 'holder',
      details: 'holder',
    };
    let close: boolean;
    let dialogRef = this.dialog.open(EditIssuesComponent, {
      data: {
        name: this.selectedTask.id,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      // console.log(`Dialog result: ${result.data}`);
      dialogVals = result.data;
      close = result.data == true;
      // console.log('dialog vals')
      // console.log(dialogVals)
      this.subTaskProgress = dialogVals.progress;
      this.subTaskDetails = dialogVals.details;
      this.subTaskName = dialogVals.subtask;
      // this.subTaskUserId = await this.getIdFromEmail(this.currentUser);
    });

    if (close) {
      this.subTaskProgress = undefined;
      this.subTaskName = undefined;
      this.subTaskDetails = undefined;
    }

    dialogRef.afterClosed().subscribe(() => {
      //  this.createSubTask();
    });

    dialogRef.afterClosed().subscribe(() => {
      // this.updateTask();
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getIssues();
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getIssueRemarks(this.selectedTask.id);
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getIssueRemarks(this.selectedTask.id);
    });
  }

  async openTasksDialog() {
    let taskDetails;
    let dialogRef = this.dialog.open(EditIssuesComponent, {
      data: { task: this.selectedTask },
      height: '700px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog Tasks: ${result.data}`);
      taskDetails = result.data;
    });
    return taskDetails;
  }
  getCurrentDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let month2 = month.toString();
    let day2 = day.toString();
    if (day < 10) {
      day2 = '0' + day;
    }
    if (month < 10) {
      month2 = '0' + month;
    }
    let fullDate = `${year}-${month2}-${day2}`;
    return fullDate;
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
