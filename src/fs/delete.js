import fs from "fs";

const remove = async () => {
  const filePath = "./files/fileToRemove.txt";

  fs.unlink(filePath, (err) => {
    if (err) throw new Error("FS operation failed");
  });
};

await remove();
