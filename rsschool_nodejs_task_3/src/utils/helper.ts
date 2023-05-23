import { IncomingMessage } from "http";
import { IUser } from "../config/user.js";

export const parseBody = (request: IncomingMessage): Promise<IUser | null> => {
  return new Promise((resolve, reject) => {
    request.setEncoding("utf-8");
    let body: string = "";
    request
      .on("data", (chunk) => (body += chunk.toString()))
      .on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(null);
        }
      });
  });
};
