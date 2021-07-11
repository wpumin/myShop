const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const userController = require("../controllers/userController");
const passportJWT = require("../middleware/passportJWT");
const checkAdmin = require("../middleware/checkAdmin");

/* http://localhost:3000/api/user */
router.get(
  "/",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  userController.index
);

/* http://localhost:3000/api/user/login */
router.post("/login", userController.login);

/* http://localhost:3000/api/user/register */
router.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("Please enter name and surname"),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Please enter your email")
      .isEmail()
      .withMessage("Pattern of email is invalide"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Please exnter your password")
      .isLength({ min: 3 })
      .withMessage("Password is minimum of 3 characters"),
  ],
  userController.register
);

/* http://localhost:3000/api/user/delete/:id_user */
router.delete("/delete/:id", userController.delete);

module.exports = router;
