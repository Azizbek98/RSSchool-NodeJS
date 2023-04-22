import fs from "fs";

const write = async () => {
  const filePath = "./files/fileToWrite.txt";
  const writeStream = fs.createWriteStream(filePath);

  process.stdin.pipe(writeStream);

  writeStream.on("finish", () => {
    console.log("Data has been written to file");
  });
};

await write();
