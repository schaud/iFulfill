import { Issue } from 'src/app/models/Issue';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, pipe, throwError } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonService } from './common.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  constructor(private http: HttpClient) {}
  getIssuesPromise(): Promise<any> {
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

  getIssuesObservable(): Observable<Issue[]> {
    return this.http
      .get(CommonService.IssuesPath)
      .pipe(map((data: any) => data.issues));
   // return this.http.get<Issue[]>(CommonService.IssuesPath);
    //  .pipe(catchError(this.handleHttpError));
  }
  handleHttpError(err: HttpErrorResponse) {
    return throwError(err.message);
  }
  createIssue(issue: Issue): Promise<any> {
    return this.http.post<Issue>(CommonService.IssuesPath, issue).toPromise();
  }
  private _myTasks = new BehaviorSubject<Issue[]>([]);
  fetchMyTasks() {
    // For now, fetch all the task for the userId 0
    // TODO: change API later
    return this.http
      .get<{ [key: string]: Issue }>(CommonService.IssuesPath)
      .pipe(
        map((resData) => {
          const tasks = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              tasks.push(
                new Issue(
                  resData[key].id,
                  resData[key].title,
                  resData[key].description,
                  resData[key].reported_at,
                  resData[key].reported_by,
                  resData[key].criticality,
                  resData[key].verified_by,
                  resData[key].target_date,
                  resData[key].closure_date,
                  resData[key].status,
                  resData[key].pending_with,
                  resData[key].system
                )
              );
            }
          }

          return tasks;
        }),
        tap((tasks) => {
          this._myTasks.next(tasks);
        })
      );
  }
}
