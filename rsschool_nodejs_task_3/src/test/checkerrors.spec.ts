import { Server } from "http";
import { resolve } from "path";
import { v4 as uuidv4 } from "uuid";
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

describe("CRUD API errors:", () => {
  let server: Server;
  let invalidUserData: Pick<IUser, "username" | "hobbies">;
  let nonExistentId: string = "nonExistentId";
  let uuidId: string;

  beforeAll(() => {
    invalidUserData = <Pick<IUser, "username" | "hobbies">>(
      mockData.invalidUserData
    );
    uuidId = uuidv4();
    server = new App(usersDb, port).server;
  });

  it("404 error", async () => {
    const res = await request(server).get("/api/feature/not/found");
    expect(res.statusCode).toBe(404);
  });

  it("Body does not contain required fields", async () => {
    const res = await request(server).post("/api/users").send(invalidUserData);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      message: ErrorsMessages.REQUIRED_FIELDS,
      ok: false,
    });
  });

  it("Types for required fields are not correct", async () => {
    const res = await request(server)
      .post("/api/users")
      .send({
        age: {},
        ...invalidUserData,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      message: ErrorsMessages.REQUIRED_FIELDS,
      ok: false,
    });
  });

  it("User id is not valid", async () => {
    const res = await request(server)
      .put(`/api/users/${nonExistentId}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      message: ErrorsMessages.USER_NOT_VALID,
      ok: false,
    });
  });

  it(`There is no such user`, async () => {
    const res = await request(server).delete(`/api/users/${uuidId}`);

    expect(res.statusCode).toBe(404);
    expect(res.text).toEqual(ErrorsMessages.USER_NOT_EXIST);
  });
});
