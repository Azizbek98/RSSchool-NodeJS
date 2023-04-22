import { spawn } from "child_process";

const spawnChildProcess = async (args) => {
  const child = spawn("node", ["./files/script.js"], {
    stdio: ["pipe", "pipe", "inherit", "ipc"],
  });

  process.stdin.pipe(child.stdin);
  child.stdout.pipe(process.stdout);

  return child;
};

spawnChildProcess(["argument1", "argument2", "argument3"]);
