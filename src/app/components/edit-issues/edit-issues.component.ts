import { UsersService } from './../../services/users.service';
import { RemarksService } from './../../services/remarks.service';
import { CommonService } from './../../services/common.service';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DomSanitizer } from '@angular/platform-browser';
import { Criticality } from 'src/app/enums/criticality.enum';
import { Status } from 'src/app/enums/status.enum';
import { Issue } from 'src/app/models/Issue';
import { enumSelector, getCurrentDate } from 'src/app/services/common.service';
import { IssuesComponent } from '../issues/issues.component';
import { Remark } from 'src/app/models/Remark';
const SAVE_ALL = `<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Save</title><path d='M380.93 57.37A32 32 0 00358.3 48H94.22A46.21 46.21 0 0048 94.22v323.56A46.21 46.21 0 0094.22 464h323.56A46.36 46.36 0 00464 417.78V153.7a32 32 0 00-9.37-22.63zM256 416a64 64 0 1164-64 63.92 63.92 0 01-64 64zm48-224H112a16 16 0 01-16-16v-64a16 16 0 0116-16h192a16 16 0 0116 16v64a16 16 0 01-16 16z' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/></svg>`;
const CANCEL = `<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Close Circle</title><path d='M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm86.63 272L320 342.63l-64-64-64 64L169.37 320l64-64-64-64L192 169.37l64 64 64-64L342.63 192l-64 64z'/></svg>`;
const SVAE_CLOSE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
<path style="line-height:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid; text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal" d="M 2.5917969 1 C 1.7147969 1 1 1.7147969 1 2.5917969 L 1 12.408203 C 1 13.285203 1.7147969 14 2.5917969 14 L 7.7617188 14 C 8.5704696 15.204592 9.94479 16 11.5 16 C 13.979359 16 16 13.979359 16 11.5 C 16 9.94479 15.204592 8.5704696 14 7.7617188 L 14 3.4746094 L 11.525391 1 L 2.5917969 1 z M 2.5917969 2 L 3 2 L 3 4.125 C 3 5.113249 3.7046225 6 4.6679688 6 L 9.3320312 6 C 10.295378 6 11 5.113249 11 4.125 L 11 2 L 11.111328 2 L 13 3.8886719 L 13 7.2753906 C 12.528582 7.1071101 12.028145 7 11.5 7 C 9.94479 7 8.5704696 7.795408 7.7617188 9 L 5.5 9 C 4.673 9 4 9.673 4 10.5 L 4 13 L 2.5917969 13 C 2.2657969 13 2 12.734203 2 12.408203 L 2 2.5917969 C 2 2.2657969 2.2657969 2 2.5917969 2 z M 4 2 L 7 2 L 7 4 L 9 4 L 9 2 L 10 2 L 10 4.125 C 10 4.654751 9.658685 5 9.3320312 5 L 4.6679688 5 C 4.341315 5 4 4.654751 4 4.125 L 4 2 z M 11.5 8 C 13.438919 8 15 9.5610811 15 11.5 C 15 13.438919 13.438919 15 11.5 15 C 9.5610811 15 8 13.438919 8 11.5 C 8 9.5610811 9.5610811 8 11.5 8 z M 13.001953 9.8613281 L 11.160156 11.703125 L 10.013672 10.556641 L 9.3066406 11.263672 L 11.160156 13.117188 L 13.708984 10.568359 L 13.001953 9.8613281 z M 5.5 10 L 7.2753906 10 C 7.1071101 10.471418 7 10.971855 7 11.5 C 7 12.028145 7.1071101 12.528582 7.2753906 13 L 5 13 L 5 10.5 C 5 10.224 5.225 10 5.5 10 z"   font-weight="400" font-family="sans-serif" white-space="normal" overflow="visible"/>
</svg>`;
const ADD = `<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Add Circle</title><path d='M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm80 224h-64v64a16 16 0 01-32 0v-64h-64a16 16 0 010-32h64v-64a16 16 0 0132 0v64h64a16 16 0 010 32z'/></svg>`;
const SAVE = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Save</title><path d="M380.44 32H64a32 32 0 00-32 32v384a32 32 0 0032 32h384a32.09 32.09 0 0032-32V131.56zM112 176v-64h192v64zm223.91 179.76a80 80 0 11-83.66-83.67 80.21 80.21 0 0183.66 83.67z"/></svg>`;
@Component({
  selector: 'app-edit-issues',
  templateUrl: './edit-issues.component.html',
  styleUrls: ['./edit-issues.component.css'],
})
export class EditIssuesComponent implements OnInit, AfterViewInit {
  public local_data = [];
  private origin = [];
  //selectedIssues: any = [];
  remarks: any = [];
  users: any = [];
  showSpinner: boolean = false;
  sortedData: Issue[];
  pageSize: number = 3;
  dataSource: MatTableDataSource<Issue>;
  @ViewChild('txtremark') txtremark: ElementRef;
  @ViewChild('issueSort') issueSort: MatSort;
  @ViewChild(MatSort) sort: MatSort;
  public criticality: any[] = enumSelector(Criticality);
  public status: any[] = enumSelector(Status);
  isSingleRemark: boolean = true;
  indexExpanded: number = -1;
  isNewMode = false;
  remarkTxt = '';
  formSaved: boolean = false;
  currentDate: string = '';
  userService: UsersService;
  remarkService: RemarksService;
  multiRemarkText: string = '';
  ////////////////////////////////////////////////////////
  constructor(
    public dialogRef: MatDialogRef<IssuesComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private cdr: ChangeDetectorRef,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private msgSnakBar: MatSnackBar,
    private commonService: CommonService
  ) {
    this.local_data = [...data.selectedIssues];
    this.userService = data.userService;
    this.remarkService = data.remarkService;
    this.origin = JSON.parse(JSON.stringify(data.selectedIssues));
    console.log('this.local_data', this.local_data);
    iconRegistry.addSvgIconLiteral(
      'save_all',
      sanitizer.bypassSecurityTrustHtml(SAVE_ALL)
    );
    iconRegistry.addSvgIconLiteral(
      'cancel',
      sanitizer.bypassSecurityTrustHtml(CANCEL)
    );
    iconRegistry.addSvgIconLiteral(
      'save_close',
      sanitizer.bypassSecurityTrustHtml(SVAE_CLOSE)
    );
    iconRegistry.addSvgIconLiteral(
      'add',
      sanitizer.bypassSecurityTrustHtml(ADD)
    );
    iconRegistry.addSvgIconLiteral(
      'save',
      sanitizer.bypassSecurityTrustHtml(SAVE)
    );

    this.currentDate = getCurrentDate();
  }
  /////////////////////////////////////////////////////////////
  ngOnInit(): void {
    console.log('EditIssuesComponent ngOnInit', this.data);
    //this.selectedIssues = this.local_data;
    this.formSaved = false;
    this.dataSource = new MatTableDataSource<Issue>(this.local_data);
    this.dataSource.sort = this.sort;

    this.cdr.detectChanges();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ///////////////////////////////////////////////////////////////

  async save() {
    this.formSaved = true;
    if (
      this.local_data?.length > 0 &&
      this.multiRemarkText &&
      String(this.multiRemarkText).length > 0
    ) {
      await this.addMultieRemark(this.multiRemarkText)
        .then(() => {
          this.multiRemarkText = '';
        })
        .then(() => {
          this.isSingleRemark = true;
          this.isNewMode = false;
        });
    } else if (
      !this.isSingleRemark &&
      !this.multiRemarkText &&
      String(this.multiRemarkText).length < 1
    ) {
      this.isSingleRemark = false;
      this.txtremark.nativeElement.focus();
      this.commonService.showMessage(
        'Please Enter the Remark Description',
        'error'
      );
    }
  }
  async saveAndClose() {
    this.formSaved = true;
    if (
      this.local_data?.length > 0 &&
      this.multiRemarkText &&
      String(this.multiRemarkText).length > 0
    ) {
      await this.addMultieRemark(this.multiRemarkText).then(() => {
        this.dialogRef.close(this.local_data);
      });
    } else if (
      !this.isSingleRemark &&
      !this.multiRemarkText &&
      String(this.multiRemarkText).length < 1
    ) {
      this.isSingleRemark = false;
      this.txtremark.nativeElement.focus();
      this.commonService.showMessage(
        'Please Enter the Remark Description',
        'error'
      );
    } else if (
      this.isSingleRemark &&
      !this.multiRemarkText &&
      String(this.multiRemarkText).length < 1
    ) {
      this.dialogRef.close(this.local_data);
    }
  }
  //////////////////////////////////////////////////////////////
  // close(isSaved: boolean) {
  //   if (!isSaved) this.dialogRef.close(null);
  //   else this.dialogRef.close();
  // }
  close() {
    // this.dialogRef.beforeClosed().subscribe((result) => {
    // console.log("beforeClosed",result)
    // });
    if (this.formSaved) {
      console.log('Close this.local_data', this.local_data);
      this.dialogRef.close(this.local_data);
    } else {
      console.log('Close this.origin', this.origin);
      this.dialogRef.close(this.origin);
    }
  }

  sortIssues(sort: Sort, taskArray: Issue[]) {
    const dt = taskArray.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = dt;
      return;
    }

    this.sortedData = dt.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'sr':
          return compare(a.id, b.id, isAsc);
        case 'title':
          return compare(a.title, b.title, isAsc);
        case 'reported_at':
          return compare(a.reported_at, b.reported_at, isAsc);
        case ' reporter_id':
          return compare(a.reported_by, b.reported_by, isAsc);
        case 'status':
          return compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
  }
  async addMultieRemark(remark) {
    // await this.updateIssueRemarks(issue);
    let counter: number = 0;
    this.local_data.forEach(async (issue) => {
      let obj = new Remark();
      obj.case_id = issue.id;
      obj.remark_type = 'issue';
      obj.remark = remark;
      let usr;
      await this.userService
        .getCurrentUser()
        .then((res) => {
          usr = res;
        })
        .catch(() => (obj.user_id = ''));
      obj.user_id = usr.id;
      obj.created_at = getCurrentDate();
      //  console.log('addRemark', issue, remark, String(remark).length, obj);

      await this.remarkService
        .addRemark(obj)
        .then((res) => {
          if (res.id) {
            ++counter;
            let r = { ...res, username: usr.username };
            issue.remarks.unshift(r);
          }
        })
        .then(() => {
          if (counter === this.local_data.length) {
            this.commonService.showMessage(
              'Remark Added Successfully ..',
              'success'
            );
          }
        })
        .catch((err) => {
          this.commonService.showMessage(err, 'error');
        });

      issue.remarks = await this.remarkService.filterRemarksByCaseId(
        issue.id,
        true
      );
    });
  }
  async addRemark(issue, remark) {
    // await this.updateIssueRemarks(issue);
    if (issue && remark && String(remark).length > 0) {
      let obj = new Remark();
      obj.case_id = issue.id;
      obj.remark_type = 'issue';
      obj.remark = remark;
      let usr;
      await this.userService
        .getCurrentUser()
        .then((res) => {
          usr = res;
        })
        .catch(() => (obj.user_id = ''));
      obj.user_id = usr.id;
      obj.created_at = getCurrentDate();
      //  console.log('addRemark', issue, remark, String(remark).length, obj);

      await this.remarkService
        .addRemark(obj)
        .then((res) => {
          if (res.id) {
            this.formSaved = true;
            this.local_data.map((issu) => {
              if (issu.id === res.case_id) {
                let r = { ...res, username: usr.username };
                issu.remarks.unshift(r);
              }
            });
          }
        })
        .then(() => {
          if (this.isSingleRemark) {
            this.commonService.showMessage(
              'Remark Added Successfully ..',
              'success'
            );
          }
        })
        .catch((err) => {
          this.commonService.showMessage(err, 'error');
        });

      issue.remarks = await this.remarkService.filterRemarksByCaseId(
        issue.id,
        true
      );

      this.remarkTxt = '';
      this.isNewMode = false;
    } else {
      if (this.isSingleRemark) {
        this.commonService.showMessage(
          'Please Enter the Remark Description',
          'error'
        );
      }
    }
  }
  showAddRemark(id) {
    // this.local_data.map((i) => {
    //   i.id === id ? (i.expanded = true) : (i.expanded = false);
    // });
    this.isNewMode = true;
    this.remarkTxt = '';
    console.log(`showAddRemark this.local_data ${id}`, this.local_data);
  }
  cancelAddRemark(id) {
    // this.local_data.find((i) => {
    //   return i.id === id;
    // }).expanded = false;
    this.remarkTxt = '';
    this.isNewMode = false;
    console.log(`cancelAddRemark this.local_data ${id}`, this.local_data);
  }
  selectItem(e, i) {
    this.local_data[i].checked = e.checked;
  }
  activateMultiRemark(e) {
    this.isSingleRemark = !e.checked;
    this.multiRemarkText = '';
    // if (e.checked) {    this.multiRemarkText = '';
    //   this.txtremark.nativeElement.focus();
    // }
  }

  afterExpand(issue) {
    issue.expanded = true;
    this.remarkTxt = '';
    this.isNewMode = false;
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
