import { CommonService } from './../../../services/common.service';
import { RemarksService } from './../../../services/remarks.service';
import { UsersService } from './../../../services/users.service';
import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Issue } from '../../../models/Issue';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { IssueService } from '../../../services/issue.service';
import { enumSelector, getCurrentDate } from 'src/app/services/common.service';
import { Status } from 'src/app/enums/status.enum';
import { Criticality } from 'src/app/enums/criticality.enum';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Remark } from 'src/app/models/Remark';
import { IssuesComponent } from '../../issues/issues.component';

@Component({
  selector: 'app-new-issue-popup',
  templateUrl: './new-issue-popup.component.html',
  styleUrls: ['./new-issue-popup.component.css'],
})
export class NewIssuePopupComponent implements OnInit {
  action: string;
  local_data: any;
  CurrentUser;
  private origin = [];
  users = [];
  public criticality: any[] = enumSelector(Criticality);
  public status: any[] = enumSelector(Status);
  issueFormGroup = this.issueFrom.group({
    system: ['iFullfill'],
    title: ['', Validators.required],
    status: ['', Validators.required],
    criticality: ['', Validators.required],
    description: ['', Validators.required],
    target_date: [null],
    pending_with: [['']],
    remark: [''],
  });

  dummyIssue = Object.create(Issue);

  constructor(
    public dialogRef: MatDialogRef<IssuesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private issueFrom: FormBuilder,
    private issueService: IssueService,
    private userSrv: UsersService,
    private remarkService: RemarksService,
    private commonService: CommonService
  ) {
    this.local_data = { ...data };
    // this.local_data = [...data.selectedIssues];
    // this.userService = data.userService;

    // this.origin = JSON.parse(JSON.stringify(data.selectedIssues));

    this.action = this.local_data.action;
    this.fillUsersAutoComplete();
    this.fillUsers();
  }

  ngOnInit(): void {}

  async createIssue() {
    let issue = new Issue();
    issue.id = '';
    issue.title = this.issueFormGroup.value.title;
    issue.status = this.issueFormGroup.value.status;
    issue.criticality = this.issueFormGroup.value.criticality;
    issue.reported_by = this.issueFormGroup.value.report_by;
    issue.description = this.issueFormGroup.value.description;
    issue.reported_at = getCurrentDate();
    issue.target_date = this.issueFormGroup.value.target_date;

    // issue.closure_date = today.toDateString();

    issue.reported_by = this.data.currentUser.username;
    issue.pending_with = this.issueFormGroup.value.pending_with;
    issue.verified_by = '';
    issue.system = 'iFullfill';

    console.log('createIssue', issue, this.issueFormGroup.value.remark);

    this.issueService
      .createIssue(issue)
      .then(async (i) => {
        if (i?.id) {
          // Case1 : add issues with Remark
          if (this.issueFormGroup.value.remark?.length > 0) {
            let r = new Remark();

            r.remark_type = 'issue';
            r.case_id = i.id;
            r.created_at = getCurrentDate();
            r.user_id = this.data.currentUser.id;
            r.remark = this.issueFormGroup.value.remark;

            await this.remarkService
              .addRemark(r)
              .then((res) => {
                if (res?.id) {
                  this.commonService.showMessage(
                    'Issue With Remark Added Successfully ..',
                    'success'
                  );
                }
              })
              .catch((err) => {
                this.commonService.showMessage(
                  'Something went wrong and could not add the remark..',
                  'error'
                );
              });
          } // Case2 : add issues without Remark
          else {
            this.commonService.showMessage(
              'The New Issue has been Added Successfully ..',
              'success'
            );
          }
        }
      })
      .then(() => {
        this.data.changed = true;
        this.close();
      })
      .catch((err) => {
        this.commonService.showMessage(
          `Oops,Something went wrong:  ${err.message} ! `,
          'error'
        );
      });

    //
  }

  // dummyMethod(): void {
  //   let obj = new Issue();
  //   obj.id = '11';
  //   obj.title = 'RM/ RPM approver name not reflecting correctly';
  //   obj.reported_at = '8/24/2020';
  //   obj.criticality = 'Moderate';
  //   obj.description = `RM/ RPM approver name not reflecting correctly for RPB associates
  //     (list contains names of central RMG team), selected approver from the list and
  //     communicated the same—mail communication attached. (Request for RPM approval)`;
  //   obj.pending_with = ['Satyen, Bala(Spire)'];
  //   obj.status = 'Open';
  //   obj.closure_date = '';
  //   obj.reported_by = 'Yuvasree ';
  //   obj.verified_by = ' ';
  //   obj.target_date = ' ';
  //   obj.system = 'ifulfill';

  //   this.issueService.createIssue(obj);
  // }

  close(): void {
    this.dialogRef.close(this.data);
  }
  ////////////////////////Mutli Select

  usersControl = new FormControl();
  async fillUsers() {
    await this.userSrv.getAllUsers(true).then((res) => (this.users = [...res]));
    console.log('fillUsers', this.users);
  }
  setSelectedUsers(val) {
    let ids = [...val.value].map((i) => {
      return i.username;
    });
    this.issueFormGroup.get('pending_with').setValue(ids);
  }

  /////////////////////////MatChip Users////////
  visible = true;
  selectable = true;
  removable = true;
  // separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  userList: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  // this method is to fill the autocomlete dropdown , *not in use
  fillUsersAutoComplete() {
    this.userList = this.userCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allFruits.slice()
      )
    );
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.userCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) === 0
    );
  }

  //////////////////////////////////////////////
}
