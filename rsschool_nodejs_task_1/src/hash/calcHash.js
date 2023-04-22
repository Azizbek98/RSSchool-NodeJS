import fs from "fs";
import crypto from "crypto";

const calculateHash = async () => {
  const filePath = "./files/fileToCalculateHashFor.txt";
  const hash = crypto.createHash("sha256");
  const input = fs.createReadStream(filePath);

  input.on("readable", () => {
    const data = input.read();
    data
      ? hash.update(data)
      : console.log(`File hash value: ${hash.digest("hex")}`);
  });

  input.on("error", (err) => {
    console.error(`Error reading file: ${err.message}`);
  });
};

await calculateHash();
