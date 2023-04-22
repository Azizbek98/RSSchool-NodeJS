import path from "path";
import { fileURLToPath } from "url";
import { release, version } from "os";
import { createServer as createServerHttp } from "http";
import aJson from "./files/a.json" assert { type: "json" };
import bJson from "./files/b.json" assert { type: "json" };
import "./files/c.js";

const PORT = 3000;
const random = Math.random();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unknownObject = random > 0.5 ? { ...aJson } : { ...bJson };

const myServer = createServerHttp((_, res) => {
  res.end("Request accepted");
});

console.log(`Release ${release()}`);
console.log(`Version ${version()}`);
console.log(`Path segment separator is "${path.sep}"`);

console.log(`Path to current file is ${__filename}`);
console.log(`Path to current directory is ${__dirname}`);

console.log(unknownObject);

myServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log("To terminate it, use Ctrl+C combination");
});

export { unknownObject, myServer };
