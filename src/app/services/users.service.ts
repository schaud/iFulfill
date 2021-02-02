import { CommonService } from './common.service';
import { User } from './../models/User';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {
    this.getAllUsers();
  }
  private users: User[] = [];
  private async getUsers(): Promise<Array<User>> {
    return await this.http
      .get<any>(CommonService.UsersPath)
      .toPromise()
      .then((res: Response) => {
        console.log('getAllUsers .res[ users ]', res['users']);
        return res['users'];
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log('getAllUsers X', this.users);
  }

  async getAllUsers() {
    await this.getUsers()
      .then((res) => {
        this.users = res;
      })
      .catch((err) => {
        console.log(err);
      });
    console.log('getAllusers', this.users);
  }
  getUserById(id): User {
    if (this.users) {
      let u = this.users.find((u) => u.id === id);
      console.log('getUserById', u);
      return u;
    } else return null;
  }
}
