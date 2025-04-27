const crypto = require("crypto");
const asyncWrap = require("../middlewares/asyncWrap");

async function generateToken(user) {
  const token = crypto.randomBytes(16).toString("hex");
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  user.emailToken = token;
  user.emailTokenExpiry = expiry;
  await user.save();

  return token;
}

module.exports=generateToken