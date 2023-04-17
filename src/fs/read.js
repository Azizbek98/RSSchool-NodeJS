import fs from "fs";
import path from "path";

const read = async () => {
  const sourcePath = "./files";
  const fileName = "fileToRead.txt";
  const filePath = path.join(sourcePath, fileName);

  fs.readdir(sourcePath, (err, files) => {
    if (err) {
      throw new Error(`FS operation failed`);
    }

    if (!files.includes(fileName)) {
      throw new Error(`FS operation failed: ${fileName} does not exist`);
    }

    fs.readFile(filePath, "utf-8", (err, contents) => {
      if (err) {
        throw new Error(`FS operation failed`);
      }

      console.log(`> Content of file: \n${contents}`);
    });
  });
};

await read();
