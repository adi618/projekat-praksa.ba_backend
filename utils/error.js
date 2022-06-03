import mongoose from "mongoose";

export const isValidObjectId = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    if ((String)(new mongoose.Types.ObjectId(id)) === id) { return true; }
    return false;
  }
  return false;
};

export const catchError = (error) => {
  const status = error.status || 500;
  const message = status == 500 ? "Something went wrong" : error.message;
  return { message, status };
};

export const throwError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};
