import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Issue from '../models/Issue';
import { MatOptionSelectionChange } from '@angular/material/core';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  constructor(private http: HttpClient) {}

  // path: string =
  //   'https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/issues';

  getAllIssues(): Promise<any> {
    return this.http
      .get<any>(CommonService.IssuesPath)
      .toPromise()
      .then((resonse: Response) => {
        return resonse['issues'];
      })
      .catch((err) => {
        console.log(err);
      });
  }
  createIssue(issue: Issue): Promise<any> {
    return this.http.post<Issue>(CommonService.IssuesPath, issue).toPromise();
  }
}
