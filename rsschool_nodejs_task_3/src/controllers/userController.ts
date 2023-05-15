import { IncomingMessage, ServerResponse } from "http";
import { validate } from "uuid";
import {
  internalServerError,
  invalidRequest,
  serverError,
  successResponse,
} from "../utils/notifications.js";
import { parseBody } from "../utils/helper.js";
import { ErrorsMessages } from "../config/messages.js";
import { validateUser } from "../utils/validation.js";
import { IUser } from "../config/user.js";
import { UserCollection } from "../utils/usersList.js";

const addUser = async (
  request: IncomingMessage,
  response: ServerResponse,
  usersDb: UserCollection
): Promise<void> => {
  try {
    const requestBody: IUser | null = await parseBody(request);
    if (requestBody && validateUser(requestBody)) {
      const user = usersDb.create(requestBody);
      successResponse(response, 200, user);
    } else invalidRequest(response, ErrorsMessages.REQUIRED_FIELDS);
  } catch (err) {
    console.log(err);
    internalServerError(response);
  }
};

const getUsers = (
  request: IncomingMessage,
  response: ServerResponse,
  usersDb: UserCollection
): void => {
  try {
    const users: Array<IUser> = usersDb.users;
    successResponse(response, 200, users);
  } catch (err) {
    console.log(err);
    internalServerError(response);
  }
};

const getUser = (
  request: IncomingMessage,
  response: ServerResponse,
  userId: string,
  usersDb: UserCollection
): void => {
  try {
    if (validate(userId)) {
      const user: IUser | undefined = usersDb.getUserById(userId);
      user
        ? successResponse(response, 200, user)
        : serverError(response, ErrorsMessages.USER_NOT_EXIST);
    } else {
      invalidRequest(response, ErrorsMessages.USER_NOT_VALID);
    }
  } catch (err) {
    console.log(err);
    internalServerError(response);
  }
};

const updateUser = async (
  request: IncomingMessage,
  response: ServerResponse,
  userId: string,
  usersDb: UserCollection
): Promise<void> => {
  try {
    if (validate(userId)) {
      const user: IUser | undefined = usersDb.getUserById(userId);
      const requestBody: IUser | null = await parseBody(request);
      if (user && requestBody && validateUser(requestBody)) {
        const updatedUser = usersDb.update(userId, requestBody);
        successResponse(response, 200, updatedUser);
      } else
        user
          ? invalidRequest(response, ErrorsMessages.REQUIRED_FIELDS)
          : serverError(response, ErrorsMessages.USER_NOT_EXIST);
    } else {
      invalidRequest(response, ErrorsMessages.USER_NOT_VALID);
    }
  } catch (err) {
    console.log(err);
    internalServerError(response);
  }
};

const deleteUser = async (
  request: IncomingMessage,
  response: ServerResponse,
  userId: string,
  usersDb: UserCollection
): Promise<void> => {
  try {
    if (validate(userId)) {
      const user: IUser | undefined = usersDb.getUserById(userId);

      if (user) {
        usersDb.delete(userId);
        successResponse(response, 200, "User was successfuly deleted");
      } else serverError(response, ErrorsMessages.USER_NOT_EXIST);
    } else {
      invalidRequest(response, ErrorsMessages.USER_NOT_VALID);
    }
  } catch (err) {
    console.log(err);
    internalServerError(response);
  }
};

export const user = {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
