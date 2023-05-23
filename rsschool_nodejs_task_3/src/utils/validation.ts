import { IUser } from "../config/user.js";

export const validateUser = (user: IUser): boolean => {
  if ("username" in user && "age" in user && "hobbies" in user) {
    return (
      typeof user.username === "string" &&
      typeof user.age === "number" &&
      Array.isArray(user.hobbies)
    );
  }
  return false;
};
