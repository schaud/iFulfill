import { Remark } from './../models/Remark';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class RemarksService {
  constructor(private http: HttpClient) {}
  getIssuesRemarks(): Promise<any> {
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
  getRemarksByIssuesId(id): Promise<any> {
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
  addRemark(remark: Remark):Promise<Remark>  {
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
