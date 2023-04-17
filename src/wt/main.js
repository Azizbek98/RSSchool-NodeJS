import os from "os";
import { Worker, isMainThread } from "worker_threads";

const performCalculations = async () => {
  const numCPUs = os.cpus().length;

  if (isMainThread) {
    const results = [];
    let num = 10;

    for (let i = 0; i < numCPUs; i++) {
      const worker = new Worker("./worker.js");

      worker.on("message", (result) => {
        results.push(result);
        if (results.length === numCPUs) {
          console.log(results);
        }
      });

      worker.on("error", (err) => {
        results.push({ status: "error", data: null });
        if (results.length === numCPUs) {
          console.log(results);
        }
      });

      worker.postMessage(num);
      num++;
    }
  }
};

await performCalculations();
