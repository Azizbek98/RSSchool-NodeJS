import fs from "fs";

const rename = async () => {
  const wrongFile = "./files/wrongFilename.txt";
  const properFile = "./files/properFilename";

  if (!fs.existsSync(wrongFile)) {
    throw new Error("FS operation failed: File does not exist");
  }

  if (fs.existsSync(properFile)) {
    throw new Error("FS operation failed: New file already exists");
  }

  fs.readFile(wrongFile, "utf8", (err, data) => {
    if (err) {
      throw new Error("FS operation failed");
    }

    fs.writeFile(`${properFile}.md`, data, (err) => {
      if (err) {
        throw new Error("FS operation failed");
      }

      fs.unlink(wrongFile, (err) => {
        if (err) {
          throw new Error("FS operation failed");
        }

        console.log(`${wrongFile} successfully renamed to ${properFile}.md`);
      });
    });
  });
};

await rename();
