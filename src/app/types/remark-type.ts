import { User } from './../models/User';
import { Remark } from './../models/Remark';
export type RemarkType = {
  remark: Remark;
  user: User;
};
