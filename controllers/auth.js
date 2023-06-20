const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
const apiError = require("../utils/apiError");
const { sendEmail } = require("../utils/sendMail");
const jwt = require("jsonwebtoken");

exports.signup = asyncHandler(async (req, res) => {
  const { email, name } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    throw new apiError(400, "email already in use");
  }
  let password = "";
  const str = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (let a = 0; a < 8; a++) {
    //this block of for loop will create a 6-digit code
    password += str[Math.floor(Math.random() * str.length)];
  }

  console.log("password:", password);

  // Create user
  await User.create({
    email,
    name,
    password,
  });
  const msg = {
    email: email,
    //field and custom name in name field
    subject: "Ropstam App Password",
    message: "Your Password",
    html: `Your password to login : ${password}`,
  };
  sendEmail(msg);
  return res.status(201).json("Account registered successfully");
});
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }, { password: 0 }).exec();
  if (!user) {
    throw new apiError(400, "Invalid credentials");
  }
  const isPasswordMatched = user.matchPassword(password);
  if (!isPasswordMatched) {
    throw new apiError(400, "Invalid credentials");
  }
  const { accessToken, refreshToken } = user.getSignedJwtToken();
  user.refreshToken = refreshToken;
  await user.save();
  const options = {
    httpOnly: true,
    // sameSite: "None",
    maxAge: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.cookie("jwt", refreshToken, options);
  return res.status(200).json({ user, accessToken });
});

exports.handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(401); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser._id.toString() !== decoded.id) {
      // console.log("found user", process.env.REFRESH_TOKEN_SECRET)
      return res.sendStatus(401);
    }
    // const roles = Object.values(foundUser.roles);

    // console.log("found user", process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign(
      { id: foundUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
      }
    );
    // console.log("found user", process.env.REFRESH_TOKEN_SECRET)
    res.status(200).json({ user: foundUser, accessToken });
  });
};
exports.logout = asyncHandler(async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (foundUser) {
    // Delete refreshToken in db
    foundUser.refreshToken = "";
    await foundUser.save();
  }
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
});
