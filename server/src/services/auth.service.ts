import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

// Password policy enforced before hashing
const validatePasswordStrength = (password: string): void => {
  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    throw new Error("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    throw new Error("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    throw new Error("Password must contain at least one special character");
  }
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {

  // Input Validation
  if (!data.name || !data.email || !data.password) {
    throw new Error("Name, email, and password are required");
  }

  if (!validator.isEmail(data.email)) {
    throw new Error("Invalid email address");
  }

  // Normalize email before storing
  const normalizedEmail = data.email.toLowerCase().trim();
  // Validate password strength before hashing
  validatePasswordStrength(data.password);

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new Error("User already exists");
  }
  // Use strong hashing with cost factor 12
  const hashedPassword = await bcrypt.hash(data.password, 12);

  if(data.name.length < 3){
    throw new Error("Name must be atleast 3 characters");
  }


  const user = await User.create({
    name: validator.escape(data.name.trim()), // sanitize name
    email: normalizedEmail,
    password: hashedPassword
  });

  const userObject = user.toObject() as unknown as Record<string, unknown>;
  delete userObject.password;

  return userObject;
};



export const loginUser = async (email: string, password: string) => {
  //Input Validation
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (!validator.isEmail(email)) {
    //Generic error to prevent user enumeration
    throw new Error("Invalid credentials");
  }
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  // Use generic message to prevent user enumeration
  if (!user) {
    throw new Error("Invalid credentials");
  }
  // Use bcrypt.compare (timing-safe)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  //Short-lived token with minimal payload
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
      algorithm: "HS256"
    }
  );
  //Never return password in response
  const userObject = user.toObject() as unknown as Record<string, unknown>;
  delete userObject.password;
  return { user: userObject, token };
};