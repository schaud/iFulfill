import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  static IssuesPath = `https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/issues`;
  static RemarksPath = `https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/remarks`;
  static FeaturesPath = `https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/features`;
  static UsersPath = `https://34a2a1pxbl.execute-api.us-east-2.amazonaws.com/dev/users`;
  constructor(public http: HttpClient) {}
}
export function enumSelector(enumObj) {
  return Object.keys(enumObj).map((key) => ({
    value: enumObj[key],
    title: key,
  }));
}
