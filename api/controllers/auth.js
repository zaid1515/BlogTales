const User = require("../models/user");
const validator = require("validator");
const asyncWrap = require("../middlewares/asyncWrap");
const { CustomAPIError } = require("../errors/custom-error");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken"); 
const jwt = require("jsonwebtoken");

const register = asyncWrap(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new CustomAPIError("All fields are required", 400);
  }

  if (!validator.isEmail(email)) {
    throw new CustomAPIError("Invalid email format", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomAPIError("User already exists", 409);
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role,
  });

  const verificationToken = await generateToken(newUser);
  const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;
  const subject = `Verify your Email - BlogTales`;
  const emailContent = `
    <p>Hello ${newUser.name},</p>
    <p>Thank you for registering at BlogTales.</p>
    <p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>
    <p>This link will expire in 10 minutes.</p>
  `;

  await sendEmail(
    process.env.SENDER_EMAIL,
    process.env.SENDER_NAME,
    newUser.email,
    newUser.name,
    subject,
    emailContent
  );

  res.status(201).json({
    success: true,
    message: "Registration successful! Please verify your email.",
    data: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

const verifyEmailToken = asyncWrap(async (req, res) => {
  const { token } = req.query;
  if (!token) {
    throw new CustomAPIError("Token does not exist", 400);
  }

  const user = await User.findOne({
    emailToken: token,
    emailTokenExpiry: { $gt: new Date() },
  });
  if (!user) {
    throw new CustomAPIError("Invalid or expired token", 400);
  }

  user.emailToken = undefined;
  user.emailTokenExpiry = undefined;
  user.isVerified = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully!",
  });
});

const login = asyncWrap(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomAPIError("All fields are required", 400);
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new CustomAPIError("Invalid Credentials", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new CustomAPIError("Invalid Credentials", 401);
  }

  if (!user.isVerified) {
    throw new CustomAPIError("Please verify your email before logging in", 403);
  }

  const userToken={ userId: user._id, role: user.role }

  const token = jwt.sign(userToken,process.env.JWT_SECRET,{ expiresIn: '1h' }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    token,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});


module.exports = {
  register,
  verifyEmailToken,
  login,
};
