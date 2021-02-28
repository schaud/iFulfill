import { HttpErrorResponse } from '@angular/common/http';
import { CommonService, getCurrentDate } from './../../services/common.service';
import { UsersService } from './../../services/users.service';
import { RemarksService } from './../../services/remarks.service';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  HostListener,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
// import { ApiServiceService} from '../../services/api-service.service';
// import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
// import {SubtaskComponent} from '../dialog/subtask/subtask.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// import {AuthorizationService} from '../../services/authorization.service';
import { Observable, Subscription } from 'rxjs';
// import {DataService} from '../../services/data.service';
// import {SubtaskDetailsComponent} from '../dialog/subtask-details/subtask-details.component';
import { MatSort, Sort } from '@angular/material/sort';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Issue } from '../../models/Issue';
import { Remark } from '../../models/Remark';
import { User } from '../../models/User';
import { EditIssuesComponent } from '../edit-issues/edit-issues.component';
import { enumSelector } from 'src/app/services/common.service';
import { Criticality } from 'src/app/enums/criticality.enum';
import { Status } from 'src/app/enums/status.enum';

// Imported by Jian Qiu on 1.29.2021
import { NewIssuePopupComponent } from '../../components/dialogs/new-issue-popup/new-issue-popup.component';
import { IssueService } from 'src/app/services/issue.service';
import { map } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';
import { Time } from '@angular/common';

const ADD_ICON = `
<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Add Circle</title><path d='M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm80 224h-64v64a16 16 0 01-32 0v-64h-64a16 16 0 010-32h64v-64a16 16 0 0132 0v64h64a16 16 0 010 32z'/></svg>
`;
const EDIT_SELECTED = `<svg viewBox="0 0 64 64">
<g id="list">
  <path
    d="M61,18.34A3.43,3.43,0,0,0,59.76,16l-1.91-1.6a3.48,3.48,0,0,0-4.9.43l-2.4,2.85L47,21.9V11.83a3,3,0,0,0-.88-2.12L39.29,2.88A3,3,0,0,0,37.17,2H6A3,3,0,0,0,3,5V59a3,3,0,0,0,3,3H44a3,3,0,0,0,3-3V37a.93.93,0,0,0-.07-.33L60.19,20.88A3.48,3.48,0,0,0,61,18.34ZM45,59a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V5A1,1,0,0,1,6,4H37v7a1,1,0,0,0,1,1h7V24a1,1,0,0,0,0,.23L32.2,39.54a.93.93,0,0,0-.2.38s0,0,0,0l-1.93,8.1a1,1,0,0,0,.33,1,1,1,0,0,0,.64.24,1.14,1.14,0,0,0,.4-.08l7.64-3.32h0a1,1,0,0,0,.36-.27L45,39ZM38.55,43.56l-4.18-3.5L51.44,19.71l4.18,3.51Z" />
  <path d="M22,14H33a1,1,0,0,0,0-2H22a1,1,0,0,0,0,2Z" />
  <path d="M21,26H39a1,1,0,0,0,0-2H21a1,1,0,0,0,0,2Z" />
  <path d="M31,37a1,1,0,0,0-1-1H21a1,1,0,0,0,0,2h9A1,1,0,0,0,31,37Z" />
  <path d="M17,33H11a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V34A1,1,0,0,0,17,33Zm-1,6H12V35h4Z" />
  <path d="M27,48H21a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Z" />
  <path d="M17,45H11a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V46A1,1,0,0,0,17,45Zm-1,6H12V47h4Z" />
  <path
    d="M13.29,28.71A1,1,0,0,0,14,29h.16a1,1,0,0,0,.73-.54l3-6a1,1,0,1,0-1.78-.9l-2.38,4.76-2-2a1,1,0,0,0-1.42,1.42Z" />
  <path
    d="M13.29,16.71A1,1,0,0,0,14,17h.16a1,1,0,0,0,.73-.54l3-6a1,1,0,1,0-1.78-.9l-2.38,4.76-2-2a1,1,0,0,0-1.42,1.42Z" />
</g>
</svg>
`;
const ADD = `<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Add Circle</title><path d='M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm80 224h-64v64a16 16 0 01-32 0v-64h-64a16 16 0 010-32h64v-64a16 16 0 0132 0v64h64a16 16 0 010 32z'/></svg>`;
const SAVE = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Save</title><path d="M380.44 32H64a32 32 0 00-32 32v384a32 32 0 0032 32h384a32.09 32.09 0 0032-32V131.56zM112 176v-64h192v64zm223.91 179.76a80 80 0 11-83.66-83.67 80.21 80.21 0 0183.66 83.67z"/></svg>`;
const CANCEL = `<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Close Circle</title><path d='M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm86.63 272L320 342.63l-64-64-64 64L169.37 320l64-64-64-64L192 169.37l64 64 64-64L342.63 192l-64 64z'/></svg>`;
const SESRCH = `<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Search Circle</title><path d='M256 80a176 176 0 10176 176A176 176 0 00256 80z' fill='none' stroke='currentColor' stroke-miterlimit='10' stroke-width='32'/><path d='M232 160a72 72 0 1072 72 72 72 0 00-72-72z' fill='none' stroke='currentColor' stroke-miterlimit='10' stroke-width='32'/><path fill='none' stroke='currentColor' stroke-linecap='round' stroke-miterlimit='10' stroke-width='32' d='M283.64 283.64L336 336'/></svg>`;
const COPY = `<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Copy</title><rect x='128' y='128' width='336' height='336' rx='57' ry='57' fill='none' stroke='currentColor' stroke-linejoin='round' stroke-width='32'/><path d='M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/></svg>`;
@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css'],
  // encapsulation: ViewEncapsulation.None,
})
export class IssuesComponent implements OnInit, AfterViewInit, OnDestroy {
  // obs: Observable<any>;
  dataSource: MatTableDataSource<Issue>;
  @ViewChild('issueSort') issueSort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceName: MatTableDataSource<Issue>;

  currentItemsToShow = [];

  pageSize = 10; // number of Issues per page

  scrHeight: any;
  scrWidth: any;
  @HostListener('window:resize', ['$event'])
  sortedData: Issue[];
  //Objects
  usernames: User[] = Object.create(User);
  task: Issue = Object.create(Issue);
  newTaskReport: Issue = Object.create(Issue);
  public issues = [];

  tasksByDate: Issue[] = new Array<Issue>();
  tasksByName: Issue[] = new Array<Issue>();
  remark: Remark = Object.create(Remark);
  remarks: Remark[] = new Array<Remark>();
  issueRemarks: Remark[] = new Array<Remark>();
  //Variables: General and Application State
  //currentUser = localStorage.getItem('UserEmail');
  selectedIssue: any = {};
  subs: Subscription;
  selectedIssues = [];
  hasSelected: boolean = false;
  date: any;
  count: number = 0;
  //Variables : Boolean flags
  isChecked: boolean = false;
  indeterminate = false;
  totalSelected: number = 0;
  showSpinner: boolean = false;
  criticality: any[] = enumSelector(Criticality);
  status: any[] = enumSelector(Status);
  indexExpanded: number = -1;
  users: User[] = [];
  isNewMode = false;
  remarkTxt: string = '';
  currentDate: string = '';
  currentUser: any;
  constructor(
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private issueService: IssueService,
    private remarkService: RemarksService,
    private userService: UsersService,
    public commonService: CommonService
  ) {
    this.getScreenSize();
    iconRegistry.addSvgIconLiteral(
      'add_icon',
      sanitizer.bypassSecurityTrustHtml(ADD_ICON)
    );
    iconRegistry.addSvgIconLiteral(
      'edit_selected',
      sanitizer.bypassSecurityTrustHtml(EDIT_SELECTED)
    );
    iconRegistry.addSvgIconLiteral(
      'save',
      sanitizer.bypassSecurityTrustHtml(SAVE)
    );
    iconRegistry.addSvgIconLiteral(
      'cancel',
      sanitizer.bypassSecurityTrustHtml(CANCEL)
    );
    iconRegistry.addSvgIconLiteral(
      'add',
      sanitizer.bypassSecurityTrustHtml(ADD)
    );
    iconRegistry.addSvgIconLiteral(
      'search',
      sanitizer.bypassSecurityTrustHtml(SESRCH)
    );
    iconRegistry.addSvgIconLiteral(
      'copy_selected',
      sanitizer.bypassSecurityTrustHtml(COPY)
    );
    // this.sortedData = this.Issues.slice();
    this.currentDate = getCurrentDate();
    // this.issue$.subscribe();
    //this.getIssues();
    //this.getAllusers();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
    console.log('ngOnDestroy');
    // this.issue$.unsubscribe();
  }
  ngAfterViewInit() {}

  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.getIssues();
    this.cdr.detectChanges();
    this.userService
      .getCurrentUser()
      .then((res) => (this.currentUser = res))
      .catch(() => (this.currentUser = null));
  }
  setIsuses(response: Issue[]) {
    this.issues = response;
    console.log('IssuesComponent.getAllIssues this.issues', this.issues);
    this.issues.sort(
      (a, b) => Date.parse(b.reported_at) - Date.parse(a.reported_at)
    );

    this.setIssueRemarks();

    this.dataSource = new MatTableDataSource<Issue>(this.issues);
    this.dataSource.paginator = this.paginator;
    this.currentItemsToShow = this.issues.slice(0, this.pageSize);
    this.dataSource.sort = this.sort;

  }
  public getIssues(): void {
    this.subs = this.issueService.getIssuesObservable().subscribe(
      (response: Issue[]) => {
        this.setIsuses(response);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }
  setIssueRemarks() {
    this.issues.map((item, index) => {
      //Add isExpanded property to the subtask object
      item.checked = false;
      item.expanded = false;
      item.sr = index + 1;
      this.remarkService
        .filterRemarksByCaseId(item.id, true)
        .then((res) => (item.remarks = [...res]));
    });
  }
  getIssueby(id): any {
    let obj = this.issues.find((i) => i.id === id);
    console.log(obj);
    return obj;
  }

  async addRemark(issue, remark) {
    // await this.updateIssueRemarks(issue);
    if (issue && remark && String(remark).length > 0) {
      let obj = new Remark();
      obj.case_id = issue.id;
      obj.remark_type = 'issue';
      obj.remark = remark;
      // await this.userService
      //   .getCurrentUser()
      //   .then((res) => (obj.user_id = res.id))
      //   .catch(() => (obj.user_id = ''));
      obj.user_id = this.currentUser.id;
      obj.created_at = getCurrentDate();
      //  console.log('addRemark', issue, remark, String(remark).length, obj);

      await this.remarkService.addRemark(obj);

      issue.remarks = await this.remarkService.filterRemarksByCaseId(
        issue.id,
        true
      );

      this.remarkTxt = '';
      this.isNewMode = false;
    } else {
      this.commonService.showMessage(
        'Please Enter the Remark Description',
        'error'
      );
    }
  }
  showAddRemark(issue) {
    this.issues.map((i) => {
      i.id === issue.id ? (i.expanded = true) : (i.expanded = false);
      if (!issue.remarks || issue.remarks.length < 1) {
        issue.remarks = new Array<Remark>();
        let x = new Remark();
        issue.remarks.push(x);
      }
    });
    this.isNewMode = true;

    //  console.log(`showAddRemark  ${issue.id}`, this.issues);
  }
  cancelAddRemark(id) {
    // if (id) {
    //   this.issues.find((i) => {
    //     return i.id === id;
    //   }).expanded = false;
    // }
    this.remarkTxt = '';
    this.isNewMode = false;
    //   console.log(`cancelAddRemark t  ${id}`, this.issues);
  }
  // async getAllusers() {
  //  await this.userService
  //     .getAllUsers()
  //     .then((res) => {
  //       this.users = res;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   console.log('getAllusers', this.users);
  // }

  // async getRemarks() {
  //   await this.remarkService
  //     .getIssuesRemarks()
  //     .then((res) => {
  //       this.remarks = res;
  //       // console.log('getIssuesRemarks', res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //   return this.remarks;
  // }

  selectAll(e) {
    if (this.issues) {
      this.currentItemsToShow.map((item) => {
        item.checked = e.checked;
        this.hasSelected = e.checked;
      });
    }
    console.log('selectAll', this.currentItemsToShow, e.checked);
  }
  afterExpand(issue) {
    this.selectedIssue = issue;
    issue.expanded = true;
    this.remarkTxt = '';
    this.isNewMode = false;
    console.log(' afterExpand(issue)', this.selectedIssue);
  }
  afterCollapse(issue) {
    issue.expanded = false;
    this.remarkTxt = '';
    this.isNewMode = false;
    this.selectedIssue = {};

    console.log(' afterCollapse(issue)', this.selectedIssue);
  }
  selectItem(e, i) {
    this.currentItemsToShow[i].checked = e.checked;
    this.handleSelectAllCheckbox();
  }
  handleSelectAllCheckbox() {
    this.totalSelected = this.currentItemsToShow.filter(
      (d) => d.checked
    ).length;

    if (this.totalSelected <= 0) {
      this.indeterminate = false;
      this.isChecked = false;
      this.hasSelected = false;
    } else if (this.totalSelected === this.currentItemsToShow.length) {
      this.indeterminate = false;
      this.isChecked = true;
    } else {
      this.indeterminate = true;
      this.hasSelected = true;
    }
  }

  resolveCriticality(val): string {
    let obj = this.criticality.find((e) => e.value === val);
    //  console.log('resolveCriticality obj ', obj);
    return obj.title;
  }
  resolveStatus(val): string {
    let obj = this.status.find((e) => e.value === val);
    // console.log('resolveStatus obj ', obj);
    return obj.title;
  }
  // Angular Material Function: Used for creating Subtasks

  async onPageChange($event) {
    this.pageSize = $event.pageSize;
    this.currentItemsToShow = this.issues;
    this.currentItemsToShow = this.issues.slice(
      $event.pageIndex * $event.pageSize,
      $event.pageIndex * $event.pageSize + $event.pageSize
    );
    this.handleSelectAllCheckbox();
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
        case 'sr':
          return compare(a.id, b.id, isAsc);
        case 'title':
          return compare(a.title, b.title, isAsc);
        case 'reported_at':
          return  compare(Date.parse(a.reported_at).valueOf(), Date.parse(b.reported_at).valueOf(), isAsc);
        case ' reporter_id':
          return compare(a.reported_by, b.reported_by, isAsc);
        case 'status':
          return compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
    this.currentItemsToShow = this.sortedData.slice(0, this.pageSize);
    this.handleSelectAllCheckbox();
  }
  getSelecetdIssues(): any[] {
    let d = Array.from(this.issues.filter((x) => x.checked == true));
    console.log('getSelecetdIssues', d);
    return d;
  }
  async openEditDialog() {
    //  let selected = JSON.parse(JSON.stringify(this.getSelecetdIssues()));
    const dialogRef = this.dialog.open(EditIssuesComponent, {
      data: {
        selectedIssues: this.getSelecetdIssues(),
        userService: this.userService,
        remarkService: this.remarkService,
      },
      height: '100%',
      width: '100%',
      panelClass: ['mat-dialog-container'],
      disableClose: true,
      position: { bottom: '50px' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      //This code is to update the items in issue  array from the result array
      this.issues = this.issues.map((item) => {
        let item2 = result.find((i2) => i2.id === item.id);

        return item2 ? { ...item, ...item2 } : item;
      });
      this.currentItemsToShow = this.issues.slice(0, this.pageSize);

      console.log(`Dialog Tasks result`, result);
    });
  }
  async openNewDialog() {
    //  let selected = JSON.parse(JSON.stringify(this.getSelecetdIssues()));

    const dialogRef = this.dialog.open(NewIssuePopupComponent, {
      data: {
        // selectedIssues: this.getSelecetdIssues(),
        currentUser: this.currentUser,
        changed: false,
      },
      height: '100%',
      width: '100%',
      panelClass: ['mat-dialog-container'],
      disableClose: true,
      position: { bottom: '50px' },
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then((res) => {
        console.log('dialogRef', res);
        if (res?.changed) this.getIssues();
      });
  }
  // openNewDialog(): void {
  //   let dialogRef = this.dialog.open(NewIssuePopupComponent, {
  //     data: {},
  //   });
  // }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.currentItemsToShow = this.dataSource.filteredData;
  }
}

function compare(
  a: Date | number | string,
  b: Date | number | string,
  isAsc: boolean
) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
function compareDate(
  a: Date | number | string,
  b: Date | number | string,
  isAsc: boolean
) {
  this.dataSource.sort(function(a,b): any{
    return (b.date.getTime() - a.date.getTime());
});
}
