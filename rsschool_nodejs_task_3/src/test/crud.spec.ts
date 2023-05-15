import { Server } from "http";
import { resolve } from "path";
import request from "supertest";
import * as dotenv from "dotenv";
import { App } from "../modules/app.js";
import { IUser } from "../config/user.js";
import { UserCollection } from "../utils/usersList.js";
import { mockData } from "./mockData.js";
import { ErrorsMessages } from "../config/messages.js";

const envPath = resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

const usersDb = new UserCollection([]);
const port = +(process.env.TEST_PORT ?? 4000);

describe("CRUD API:", () => {
  let server: Server;
  let userData: IUser;
  let updatedUser: IUser;
  let userId: string;

  beforeAll(() => {
    userData = <IUser>mockData.user;
    updatedUser = <IUser>mockData.updatedUser;
    server = new App(usersDb, port).server;
  });

  it("Receive all users", async () => {
    const res = await request(server).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe("application/json");
    expect(res.body).toEqual([]);
  });

  it("Add a new user", async () => {
    const res = await request(server).post("/api/users").send(userData);
    userId = res.body.id;
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe("application/json");
    expect(res.body).toEqual({
      ...userData,
      id: userId,
    });
  });

  it("Receive a user by id", async () => {
    const res = await request(server).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe("application/json");
    expect(res.body).toEqual({
      ...userData,
      id: userId,
    });
  });

  it("Update users data", async () => {
    const res = await request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser);

    expect(res.statusCode).toBe(200);
    expect(res.type).toEqual("application/json");
    expect(res.body).toEqual({
      ...updatedUser,
      id: userId,
    });
  });

  it("Delete user", async () => {
    const res = await request(server).delete(`/api/users/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual("User was successfuly deleted");
  });

  it("Try to receive deleted/non-existent user", async () => {
    const res = await request(server).get(`/api/users/${userId}`);

    expect(res.statusCode).toBe(404);
    expect(res.text).toEqual(ErrorsMessages.USER_NOT_EXIST);
  });
});
