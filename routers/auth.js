const express = require("express");
const { body } = require("express-validator");
const {
  loginForm,
  signForm,
  signUser,
  confirmAcc,
  loginUser,
  closeSesion,
} = require("../controllers/authController");

const router = express.Router();

// Has--------------------------------------------------------------------------------------------
router.get("/signin", signForm);
router.post("/signin",
  [
    body("userName", "El nombre no es valido")
      .trim()
      .notEmpty()
      .escape(),
    body("email", "El email no es valido")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "El password debe ser de al menos 6 caracteres")
      .trim()
      .isLength({ min: 6 })
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.repassword) {
          throw new Error("Los passwords no coinciden");
        } else {
          return value;
        }
      }),
  ],
  signUser
);
router.get("/confirmAcc/:token", confirmAcc);
router.get("/login", loginForm);
router.post("/login",
  [
    body("email", "El email no es valido").trim().isEmail().normalizeEmail(),
    body("password", "El password debe ser de al menos 6 caracteres")
      .trim()
      .isLength({ min: 6 })
      .escape()
  ],
  loginUser
);
router.get("/logout", closeSesion);

module.exports = router;
