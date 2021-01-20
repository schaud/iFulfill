import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-issue',
  templateUrl: './new-issue.component.html',
  styleUrls: ['./new-issue.component.css']
})
export class NewIssueComponent implements OnInit {

  statusOption = ['Open', 'In Progress', 'Under Review', 'Closed'];
  criticalityLevel =['Moderate', 'High', 'Very High'];

  reportedDate = '';
  targetDate = '';
  closureDate = '';

  verifiedBy = '';
  pendingWith = [];

  description = '';
  remark = '';

  constructor() { }

  ngOnInit(): void {
  }

}
