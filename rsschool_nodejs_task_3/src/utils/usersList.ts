import { v4 as uuidv4 } from "uuid";
import { IUser } from "../config/user.js";

export class UserCollection {
  private _users: Array<IUser>;

  constructor(users: Array<IUser>) {
    this._users = users;
  }

  public getUserById(id: string): IUser {
    return this._users.filter((user) => user.id === id)[0];
  }

  public create(data: IUser): IUser {
    const user = { ...data, id: uuidv4() };
    this._users.push(user);
    return user;
  }

  public update(id: string, data: IUser): IUser {
    const { username, age, hobbies } = data;

    const currentUserId = this._users.findIndex((user) => user.id === id);
    const currentUser = this._users[currentUserId];

    this._users[currentUserId] = { ...currentUser, username, age, hobbies };

    return this._users[currentUserId];
  }

  public delete(id: string): void {
    const currentUserId = this._users.findIndex((user) => user.id === id);
    this._users.splice(currentUserId, 1);
  }

  public get users(): Array<IUser> {
    return this._users;
  }
  public set users(data: Array<IUser>) {
    this._users = data;
  }
}
