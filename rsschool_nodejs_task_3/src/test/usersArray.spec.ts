import { Server } from "http";
import { resolve } from "path";
import request from "supertest";
import * as dotenv from "dotenv";
import { App } from "../modules/app.js";
import { IUser } from "../config/user.js";
import { UserCollection } from "../utils/usersList.js";
import { mockData } from "./mockData.js";

const envPath = resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

const usersDb = new UserCollection([]);
const port = +(process.env.TEST_PORT ?? 4000);

describe('CRUD API MULTI:', () => {
    let server: Server;
    let userData: IUser;
    let updatedUser: IUser;
    let userId1: string;
    let userId2: string;
  
    beforeAll(() => {
      userData = <IUser>mockData.user;
      updatedUser = <IUser>mockData.user;
      server = new App(usersDb, port).server;
    });
  
    it('Add a new user', async () => {
      const res = await request(server).post('/api/users').send(userData);
      userId1 = res.body.id;
      expect(res.statusCode).toBe(200);
      expect(res.type).toBe("application/json");
      expect(res.body).toEqual({
        ...userData,
        id: userId1,
      });
    });
  
    it('Add one nore new user', async () => {
      const res = await request(server).post('/api/users').send(userData);
      userId2 = res.body.id;
      expect(res.statusCode).toBe(200);
      expect(res.type).toBe("application/json");
      expect(res.body).toEqual({
        ...userData,
        id: userId2,
      });
    });
  
    it('Receive all users', async () => {
      const res = await request(server).get('/api/users');
      expect(res.statusCode).toBe(200);
      expect(res.type).toBe("application/json");
      expect(res.body).toEqual([
        {
          ...userData,
          id: userId1,
        },
        {
          ...userData,
          id: userId2,
        },
      ]);
    }); 

  
    it('Delete all users', async () => {
      const resByUser1 = await request(server).delete(`/api/users/${userId1}`);
      const resByUser2 = await request(server).delete(`/api/users/${userId2}`);
  
      expect(resByUser1.statusCode === resByUser2.statusCode).toBeTruthy();
    });
  
    it('Get all users', async () => {
      const res = await request(server).get('/api/users');
      expect(res.statusCode).toBe(200);
      expect(res.type).toBe("application/json");
      expect(res.body).toEqual([]);
    });
  });