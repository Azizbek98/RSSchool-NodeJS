import cluster from "cluster";
import http, {
  IncomingMessage,
  RequestListener,
  Server,
  ServerResponse,
} from "http";
import { ErrorsMessages } from "../config/messages.js";
import { ROUTES } from "../config/routes.js";
import { user } from "../controllers/userController.js";
import { serverError } from "../utils/notifications.js";
import { UserCollection } from "../utils/usersList.js";

export class App {
  private _usersDb: UserCollection;
  private _port: number;
  private _server: Server;

  constructor(users: UserCollection, port: number) {
    this._usersDb = users;
    this._port = port;
    this._server = http.createServer(this.requestListener);
  }

  public startServer(): void {
    this._server.listen(this._port, () => {
      if (cluster.isWorker) {
        console.log(`Child server has been started on ${this._port} port`);
      } else console.log(`Server has been started on ${this._port} port`);
    });
  }

  private requestListener: RequestListener = async (
    req: IncomingMessage,
    res: ServerResponse
  ) => {
    const withIdParam: string | undefined = req?.url?.split("/")[3];
    if (req?.url === ROUTES.users && req?.method === "GET") {
      user.getUsers(req, res, this.usersDb);
    } else if (req?.url === ROUTES.users && req?.method === "POST") {
      await user.addUser(req, res, this.usersDb);
    } else if (
      withIdParam &&
      req?.method === "GET" &&
      req?.url?.startsWith(ROUTES.user)
    ) {
      user.getUser(req, res, withIdParam, this.usersDb);
    } else if (
      withIdParam &&
      req?.method === "PUT" &&
      req?.url?.startsWith(ROUTES.user)
    ) {
      user.updateUser(req, res, withIdParam, this.usersDb);
    } else if (
      withIdParam &&
      req?.method === "DELETE" &&
      req?.url?.startsWith(ROUTES.user)
    ) {
      await user.deleteUser(req, res, withIdParam, this.usersDb);
    } else {
      serverError(res, ErrorsMessages.PAGE_NOT_FOUND);
    }

    if (cluster.isWorker) {
      process.send!(this._usersDb.users);
    }
  };

  public get usersDb(): UserCollection {
    return this._usersDb;
  }

  public set usersDb(users: UserCollection) {
    this._usersDb = users;
  }

  public get server(): Server {
    return this._server;
  }
}
