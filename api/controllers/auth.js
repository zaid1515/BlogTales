const User = require("../models/user");
const validator = require("validator");
const asyncWrap = require("../middlewares/asyncWrap");
const { CustomAPIError } = require("../errors/custom-error");
const generateToken = require("../utils/generateToken"); 
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/sendToken");

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
  await sendToken(verificationToken,newUser)

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
  const loginUrl = `${process.env.REACT_URL}/login`;
  return res.redirect(loginUrl);
});

const resendEmailToken=asyncWrap(async(req,res)=>{
  const email=req.query.email;
  if(!email){
    throw new CustomAPIError("Email required",400)
  }
  
  const user=await User.findOne({email})
  if(!user){
    throw new CustomAPIError("User not found",404)
  }

  const verificationToken = await generateToken(user);
  await sendToken(verificationToken,user)

  res.status(200).json({
    success: true,
    message: "Email resend successful!",
    data:[]
  });
})

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
  resendEmailToken
};
