import fs from "fs";
import path from "path";

const copy = async () => {
  const sourcePath = "./files";
  const destinationPath = "./files_copy";

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source directory does not exist`);
  }

  if (fs.existsSync(destinationPath)) {
    throw new Error(`Destination directory already exists`);
  }

  fs.mkdirSync(destinationPath);

  const files = fs.readdirSync(sourcePath);

  files.forEach((file) => {
    const sourceFile = path.join(sourcePath, file);
    const destinationFile = path.join(destinationPath, file);

    const fileContent = fs.readFileSync(sourceFile);

    fs.writeFileSync(destinationFile, fileContent);
  });
};

await copy();
