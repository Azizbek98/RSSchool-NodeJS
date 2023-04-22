import fs from "fs";

const create = async () => {
  const filePath = "./files/fresh.txt";
  const fileContent = "I am fresh and young";

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      throw new Error(`FS operation failed`);
    }

    console.log("Success");
  });
};

await create();
