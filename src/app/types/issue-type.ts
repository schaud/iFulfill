import { RemarkType } from './remark-type';
import { Issue } from './../models/issue';
import { IssueUsersType } from './issue-users-type';

export type IssueType = {
  issue: Issue;
  remarks: RemarkType[];
  users: IssueUsersType;
  checked: boolean;
  expanded: boolean;
  sr: number;

};
