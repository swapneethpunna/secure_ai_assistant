import User from "../models/user.model";

export const getAllUsers = async () => {
  return await User.find().select("-password");;
};