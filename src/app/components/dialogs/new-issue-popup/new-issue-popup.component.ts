import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Issue from '../../../models/Issue';
import { FormBuilder, Validators } from '@angular/forms';
import { IssueService } from '../../../services/issue.service';

@Component({
  selector: 'app-new-issue-popup',
  templateUrl: './new-issue-popup.component.html',
  styleUrls: ['./new-issue-popup.component.css']
})
export class NewIssuePopupComponent implements OnInit {

  action: string;
  local_data: any;

  issueFormGroup = this.issueFrom.group({
    title: ['', Validators.required],
    status: ['', Validators.required],
    criticality: ['', Validators.required],
    description: ['', Validators.required],
    target_date: [{}, Validators.required]
  });

  dummyIssue = Object.create(Issue);

  constructor(
    public dialogRef: MatDialogRef<NewIssuePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private issueFrom: FormBuilder,
    private issueService: IssueService) {
      this.local_data = {...data};
      this.action = this.local_data.action;
   }

  ngOnInit(): void {
  }

  async createIssue(){
    let issue = new Issue();
    issue.id = "DummyFromAngular"
    issue.title = this.issueFormGroup.value.title;
    issue.status = this.issueFormGroup.value.status;
    issue.criticality = this.issueFormGroup.value.criticality;
    issue.reported_by = this.issueFormGroup.value.report_by;
    issue.description = this.issueFormGroup.value.description;

    let today = new Date();
    issue.reported_at = today.toDateString();

    issue.reported_by = "Testing User";

    issue.target_date = this.issueFormGroup.value.target_date.toDateString();

    issue.closure_date = today.toDateString();
    issue.verified_by = "AngularDummy";
    issue.system = "WINDOWS";
    issue.pending_with = ["Dummy1", "Dummy2"];



    console.log(issue);

    console.log(this.issueService.createIssue(issue));

    this.close();
  }

  dummyMethod(): void {
    let obj = new Issue();
    obj.id = '11';
    obj.title = 'RM/ RPM approver name not reflecting correctly';
    obj.reported_at = '8/24/2020';
    obj.criticality = 'Moderate';
    obj.description = `RM/ RPM approver name not reflecting correctly for RPB associates
      (list contains names of central RMG team), selected approver from the list and
      communicated the same—mail communication attached. (Request for RPM approval)`;
    obj.pending_with = ['Satyen, Bala(Spire)'];
    obj.status = 'Open';
    obj.closure_date = '';
    obj.reported_by = 'Yuvasree ';
    obj.verified_by = ' ';
    obj.target_date = ' ';
    obj.system = 'ifulfill';

    this.issueService.createIssue(obj);
  }

  close(): void {
    this.dialogRef.close()
  }

}
