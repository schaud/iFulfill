import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Issue from '../models/issue';
import { MatOptionSelectionChange } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor(private http: HttpClient) { }

  path: string = 'https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/issues';

  createIssue(issue: Issue): Promise<any>{



    return this.http.post<Issue>(this.path, issue).toPromise();
  };
}
