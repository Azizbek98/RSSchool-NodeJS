import fs from "fs";
import zlib from "zlib";

const compress = async () => {
  const filePath = "./files/fileToCompress.txt";
  const input = fs.createReadStream(filePath);
  const output = fs.createWriteStream("archive.gz");
  const gzip = zlib.createGzip();

  input.pipe(gzip).pipe(output);

  output.on("finish", () => {
    console.log(`File compressed to archive.gz`);
  });

  output.on("error", (err) => {
    throw new Error(`Error occurred while compressing file: ${err.message}`);
  });
};

await compress();
