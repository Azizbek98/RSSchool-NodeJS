import { ServerResponse } from "http";

export const serverError = (res: ServerResponse, message?: string): void => {
  res.statusCode = 404;
  message ? res.end(message) : res.end();
};

export const successResponse = (
  res: ServerResponse,
  statusCode: number,
  data?: any
) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

export const invalidRequest = (res: ServerResponse, message: string): void => {
  res.writeHead(400, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      ok: false,
      message: message,
    })
  );
};
export const internalServerError = (res: ServerResponse): void => {
  res.statusCode = 500;
  res.end("Internal Server Error");
};
