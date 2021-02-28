import { CommonService } from './common.service';
import { User } from './../models/User';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}
  // private _currentUserName: string;
  // public get currentUserName(): string {
  //   this.getCurrentUser()
  //     .then((res) => {
  //       this.currentUserName = res.username;
  //       console.log('UsersService getCurrentUser', res);
  //     })
  //     .catch(() => (this._currentUserName = ''));

  //   return this._currentUserName;
  // }
  // public set currentUserName(value: string) {
  //   console.log('UsersService set currentUserName', value);
  //   this._currentUserName = value;
  // }

  users: any[] = null;
  private async getUsersRequest(): Promise<User[]> {
    return await this.http
      .get<User[]>(CommonService.UsersPath)
      .toPromise()
      .then((res) => {
        //console.log('getUsersRequest request : ', res['users']);
        return res['users'];
      });
  }
  private async getUserByIdRequest(id): Promise<User> {
    // console.log('getUserById request : ');
    return await this.http
      .get<User>(`${CommonService.UsersPath}/${id}`)
      .toPromise();
  }

  async getAllUsers(reload: boolean = false) {
    // let obj: User[] = [];
    if (reload) {
      await this.getUsersRequest().then((res) => {
        this.users = res;
      });
      this.users.map((user) => {
        user.username = `${user?.fname} ${user?.lname}`;
      });
    }
    // console.log('getAllUsers', this.users);
    return this.users;
  }
  async getCurrentUser(): Promise<any> {
    return await this.findUserById('c09a4f26-41ca-4de8-986b-795956cfcc59');
  }
  async findUserById(id: string) {
    let obj: any;
    if (!this.users) {
      await this.getAllUsers(true);

      obj = this.users.find((u) => {
        return u.id == id;
      });
    } else if (this.users) {
      obj = this.users.find((u) => {
        return u.id == id;
      });
    }
    //   console.log('findUserById(id) obj', obj);
    return obj;
  }
}
