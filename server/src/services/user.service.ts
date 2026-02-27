import User from "../models/user.model";

export const createUser = async (data: any) => {
  return await User.create(data);
};

export const getAllUsers = async () => {
  return await User.find();
};