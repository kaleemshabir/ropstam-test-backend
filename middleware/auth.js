const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/User");
const apiError = require("../utils/apiError");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let authToken = "";
  if (req.headers?.Authorization) {
    authToken = req.headers?.Authorization?.split(" ")[1];
  } else {
    authToken = req.headers?.authorization?.split(" ")[1];
  }
  if (!authToken) {
    console.log("&&&&&&&&&&&&&&&&&&&&")
    return res
      .status(403)
      .json({ error: true, message: "Unauthorized attempt!" });
  }

  //verify token which is in cookie value
  jwt.verify(
    authToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ error: true, message: "Unauthorized attempt!!" });
      } else if (decoded) {
        try {
          req.user = await User.findById(decoded.id).lean();
          next();
        } catch (error) {
          throw new apiError(500, "Something went wrong!");
        }
      }
    }
  );
});
