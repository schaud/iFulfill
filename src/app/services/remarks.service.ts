import { UsersService } from './users.service';
import { Remark } from './../models/Remark';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class RemarksService {
  constructor(private http: HttpClient, private userSrv: UsersService) {}
  remarks = [];

  private getIssuesRemarks(): Promise<any> {
    return this.http
      .get<any>(
        `https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/remarks?type=issue`
      )
      .toPromise()
      .then((resonse: Response) => {
        return resonse['remarks'];
      })

      .catch((err) => {
        console.log(err);
      });
  }
  private getRemarksByIssuesIdRequest(id): Promise<any> {
    return this.http
      .get<any>(
        `https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/remarks/issue-id/${id}`
      )
      .toPromise()
      .then((resonse: Response) => {
        return resonse['remarks'];
      })

      .catch((err) => {
        console.log(err);
      });
  }

  async filterRemarksByCaseId(id, reload: boolean = false) {
    let issueRemarks = [];
    if (this.remarks && !reload) {
      issueRemarks = this.remarks.filter((r) => r.case_id === id);
      //  console.log(`the remarks of issue:${id}: ${obj}`);
    } else if (this.remarks && reload) {
      await this.getIssuesRemarks().then((res) => (this.remarks = res));
      issueRemarks = [...this.remarks.filter((r) => r.case_id === id)];
    }
    issueRemarks.map(async (remark) => {
      let user: any;
      await this.userSrv.findUserById(remark.user_id).then((u) => (user = u));
      remark.username = `${user?.username} `;
    });
    //console.log('filterRemarksByCaseId(id) issueRemarks', issueRemarks);

    return issueRemarks.sort(
      (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
    );
  }

  async getRemarksByIssuesId(id) {
    let issueRemarks = [];
    await this.getRemarksByIssuesIdRequest(id).then((res) => {
      issueRemarks = res;
    });
    issueRemarks.map(async (remark) => {
      let user: any;
      await this.userSrv.findUserById(remark.user_id).then((u) => (user = u));
      remark.username = `${user?.username} `;
    });
    //console.log('getRemarksByIssuesId(id) issueRemarks', issueRemarks);

    return issueRemarks.sort(
      (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
    );
  }
  addRemark(remark: Remark): Promise<Remark> {
    let rem: Remark = {};
    return this.http
      .post<any>(CommonService.RemarksPath, remark)
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //  getIssuesRemarks(): Promise<any> {
  //   return this.http
  //     .get<any>(CommonService.RemarksPath)
  //     .toPromise()
  //     .then((resonse: Response) => {
  //       return resonse['remarks'];
  //     })
  //     .then((res) => {
  //       return res.filter((x) => x.remark_type === 'issue');
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }
}
