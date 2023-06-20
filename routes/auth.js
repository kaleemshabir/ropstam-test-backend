const express = require("express");
const {
  login,
  signup,
  handleRefreshToken,
  logout,
} = require("../controllers/auth");
const authValidation = require("../validations/auth.validation");

const router = express.Router();
const validate = require("../middleware/validate");

router.post("/login", validate(authValidation.login), login);
router.post("/signup", validate(authValidation.signup), signup);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);

module.exports = router;
