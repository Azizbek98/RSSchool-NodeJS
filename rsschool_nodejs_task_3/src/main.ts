import { resolve } from "path";
import * as dotenv from "dotenv";
import { UserCollection } from "./utils/usersList.js";
import { App } from "./modules/app.js";
import { ClusterApp } from "./modules/cluster.js";

const envPath = resolve(process.cwd(), ".env");

dotenv.config({ path: envPath });

const usersDb = new UserCollection([]);

if (process.argv.includes("--multi")) {
  new ClusterApp(usersDb, +(process.env.PORT ?? 3000));
} else {
  new App(usersDb, +(process.env.PORT ?? 3000)).startServer();
}

process.on("SIGINT", () => {
  process.exit();
});