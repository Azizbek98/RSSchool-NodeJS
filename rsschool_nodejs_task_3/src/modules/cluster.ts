import cluster from "cluster";
import http, { IncomingMessage, RequestListener, ServerResponse } from "http";
import { cpus } from "os";
import { internalServerError } from "../utils/notifications.js";
import { UserCollection } from "../utils/usersList.js";
import { App } from "./app.js";

export class ClusterApp {
  private _usersDb: UserCollection;
  private _curWorker = 1;
  private _primaryPort: number;
  private _numWorkers: number;

  constructor(users: UserCollection, port: number) {
    this._usersDb = users;
    this._primaryPort = port;
    this._numWorkers = cpus().length;
    cluster.isWorker ? this.startChildServer() : this.startPrimaryServer();
  }

  private requestListener: RequestListener = async (
    req: IncomingMessage,
    res: ServerResponse
  ) => {
    cluster.workers![this._curWorker]?.send({ data: this.usersDb });
    const requestForWorker = http.request({
      port: this._primaryPort + this._curWorker,
      path: req.url,
      method: req.method,
    });
    requestForWorker.on("response", (resWorker: ServerResponse) => {
      res.statusCode = resWorker.statusCode!;
      resWorker.pipe(res);
      this._curWorker =
        this._curWorker >= this._numWorkers ? 1 : ++this._curWorker;
    });
    requestForWorker.on("error", (e) => {
      internalServerError(res);
      console.error("Child server is not started yet");
    });
    req.pipe(requestForWorker);
  };

  private startPrimaryServer(): void {
    for (let i = 1; i < this._numWorkers + 1; i++) {
      const worker = cluster.fork({ CHILD_PORT: this._primaryPort + i });
      worker.on("message", (data) => {
        this._usersDb.users = data;
      });
    }
    const server = http.createServer(this.requestListener);
    server.listen(this._primaryPort, () => {
      console.log(`Server has been started on ${this._primaryPort} port`);
    });
  }

  private startChildServer(): void {
    let childServer: App = new App(
      this._usersDb,
      Number(process.env.CHILD_PORT)
    );
    childServer.startServer();
    process.on("message", (usersDb: any) => {
      childServer.usersDb.users = usersDb?.data?._users ?? [];
    });
  }

  public get usersDb(): UserCollection {
    return this._usersDb;
  }

  public set usersDb(users: UserCollection) {
    this._usersDb = users;
  }
}
