import fs from "fs";

const read = async () => {
  const filePath = "./files/fileToRead.txt";
  const readStream = fs.createReadStream(filePath);

  readStream.pipe(process.stdout);
};

await read();
