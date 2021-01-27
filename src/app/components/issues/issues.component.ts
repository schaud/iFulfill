import {
  ChangeDetectorRef,
  Component,
  OnInit,
  HostListener,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
  OnDestroy,
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
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Issue } from '../../models/Issue';
import { Remark } from '../../models/Remark';
import { User } from '../../models/User';
import { EditIssuesComponent } from '../edit-issues/edit-issues.component';
import { enumSelector } from 'src/app/services/common.service';
import { Criticality } from 'src/app/enums/criticality.enum';
import { Status } from 'src/app/enums/status.enum';
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

  pageSize = 2; // number of Issues per page

  scrHeight: any;
  scrWidth: any;
  @HostListener('window:resize', ['$event'])
  sortedData: Issue[];
  //Objects
  usernames: User[] = Object.create(User);
  task: Issue = Object.create(Issue);
  newTaskReport: Issue = Object.create(Issue);
  issues = [];
  tasksByDate: Issue[] = new Array<Issue>();
  tasksByName: Issue[] = new Array<Issue>();
  remark: Remark = Object.create(Remark);
  remarks: Remark[] = new Array<Remark>();
  issueRemarks: Remark[] = new Array<Remark>();
  //Variables: General and Application State
  currentUser = localStorage.getItem('UserEmail');
  selectedIssue: Issue = Object.create(Issue);
  selectedIssues = [];

  date: any;

  //Variables : Boolean flags
  isChecked: boolean = false;
  indeterminate = false;
  totalSelected: number = 0;
  showSpinner: boolean = false;
  criticality: any[] = enumSelector(Criticality);
  status: any[] = enumSelector(Status);
  indexExpanded: number = -1;
  isNewMode = false;
  constructor(
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
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
    );  iconRegistry.addSvgIconLiteral(
      'add',
      sanitizer.bypassSecurityTrustHtml(ADD)
    );
    // this.sortedData = this.Issues.slice();
    this.getCurrentDate();
    this.getIssues();
    this.getRemarks();
  }
  ngOnDestroy(): void {}
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }

  ngOnInit(): void {
    if (this.issues) {
      this.currentItemsToShow.map((item) => {
        item.checked = false;
        item.expanded = false;
        item.remarks = this.getIssueRemarks(item.id);
      });
    }
    this.dataSource = new MatTableDataSource<Issue>(this.issues);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }

  //Utility functions
  selectAll(e) {
    if (this.issues) {
      this.currentItemsToShow.map((item) => {
        item.checked = e.checked;
      });
    }
    console.log('selectAll', this.currentItemsToShow, e.checked);
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
    } else if (this.totalSelected === this.currentItemsToShow.length) {
      this.indeterminate = false;
      this.isChecked = true;
    } else this.indeterminate = true;
  }

  validatePercent(percentage) {
    return percentage.match(/^(100|[1-9]?[0-9])$/) != null;
  }
  convertDate(str) {
    let date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }
  getIssues() {
    this.showSpinner = true;
    let obj = new Issue();
    obj.id = '11';
    obj.title = 'RM/ RPM approver name not reflecting correctly';
    obj.reported_at = '8/24/2020';
    obj.criticality = '2';
    obj.description = `RM/ RPM approver name not reflecting correctly for RPB associates
      (list contains names of central RMG team), selected approver from the list and
      communicated the same—mail communication attached. (Request for RPM approval)`;
    obj.pending_with = 'Satyen, Bala(Spire)';
    obj.status = '1';
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
    obj.criticality = '4';
    obj.description = `ifulfill Session issues`;
    obj.pending_with = 'Yuvasree';
    obj.status = '6';
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
    obj.criticality = '1';
    obj.description = `Resource is in A3 yet not able to fulfill RR`;
    obj.pending_with = 'Kiran,Satish';
    obj.status = '3';
    obj.closure_date = '';
    obj.reporter_id = 'Sharjeel ';
    obj.created_at = ' ';
    obj.verified_by = ' ';
    obj.target_date = ' ';
    obj.system = 'ifulfill';
    this.issues.push(obj);

    this.issues.map((item) => {
      //Add isExpanded property to the subtask object
      item.checked = false;
      item.expanded = false;
    });
    this.dataSource = new MatTableDataSource<Issue>(this.issues);
    this.dataSource.paginator = this.paginator;
    this.currentItemsToShow = this.issues.slice(0, this.pageSize);
    this.showSpinner = false;
    return this.issues;
  }
  getIssueby(id): any {
    let obj = this.issues.find((i) => i.id === id);
    console.log(obj);
    return obj;
  }
  getIssueRemarks(id): any[] {
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

    obj = new Remark();
    obj.id = '56';
    obj.created_at = '10/04/2020';
    obj.remark = `Testing Completed Except 1 scenario`;
    obj.remark_type = 'issue';
    obj.user_id = 'Satish';
    obj.issue_id = '12';
    this.remarks.push(obj);
    obj = new Remark();
    obj.id = '57';
    obj.created_at = '9/21/2020';
    obj.remark = `4th Sept : Discussion in prg`;
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
  showAddRemark(id) {
    this.issues.map((i) => {
      i.id === id ? (i.expanded = true) : (i.expanded = false);
    });
    this.isNewMode = true;
    console.log(`showAddRemark this.local_data ${id}`, this.issues);
  }
  cancelAddRemark(id) {
    this.issues.find((i) => {
      return i.id === id;
    }).expanded = false;
    this.isNewMode = false;
    console.log(`cancelAddRemark this.local_data ${id}`, this.issues);
  }
  async onPageChange($event) {
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
    this.handleSelectAllCheckbox();
  }
  getSelecetdIssues(): any[] {
    return Array.from(this.issues.filter((x) => x.checked == true));
  }
  async openEditDialog() {
    //  let selected = JSON.parse(JSON.stringify(this.getSelecetdIssues()));
    const dialogRef = this.dialog.open(EditIssuesComponent, {
      data: {
        selectedIssues: this.getSelecetdIssues(),
      },
      height: '100%',
      width: '100%',
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
    let taskDetails;

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
