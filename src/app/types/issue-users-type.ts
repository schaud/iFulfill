import { User } from '../models/User';
export type IssueUsersType ={
  cretedBy: User;
  verfiedBy: User;
  bendingWith: User[];
}
