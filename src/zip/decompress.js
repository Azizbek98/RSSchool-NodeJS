import fs from "fs";
import zlib from "zlib";

const decompress = async () => {
  try {
    const inputStream = fs.createReadStream("archive.gz");
    const unzip = zlib.createGunzip();
    const outputStream = fs.createWriteStream("fileToCompress.txt");

    await new Promise((resolve, reject) => {
      inputStream
        .pipe(unzip)
        .pipe(outputStream)
        .on("finish", resolve)
        .on("error", reject);
    });

    console.log("File decompressed successfully");
  } catch (err) {
    console.error(`Error during decompression: ${err.message}`);
  }
};

await decompress();
