import fs from "fs";

const list = async () => {
  const sourcePath = "./files";

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`FS operation failed`);
  }

  fs.readdir(sourcePath, (err, files) => {
    if (err) {
      throw new Error(`FS operation failed`);
    } else {
      files.forEach((file) => console.log(`- ${file}`));
    }
  });
};

await list();
