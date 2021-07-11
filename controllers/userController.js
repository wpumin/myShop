const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../config/index");

// get all users start //
exports.index = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    users: users,
  });
};
// get all users end //

// register user start //
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("You data is invalid");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    // check dup email
    const existEmail = await User.findOne({ email: email });
    if (existEmail) {
      const error = new Error("This email has been register");
      error.statusCode = 400;
      throw error;
    }
    // add user
    let user = new User();
    user.name = name;
    user.email = email;
    user.password = await user.encryptPassword(password);
    await user.save();

    res.status(200).json({
      success: {
        message: "Register success",
      },
    });
  } catch (error) {
    next(error);
  }
};
// register user end //

// login user start //
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check email in database
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("Not found user in system");
      error.statusCode = 401;
      throw error;
    }

    // valid password
    const isValid = await user.checkPassword(password);
    if (!isValid) {
      const error = new Error("Unauthorized access, password is incorrect");
      error.statusCode = 401;
      throw error;
    }

    // create token
    const token = await jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: "5 days" }
    );

    // decode expried
    const expried_in = jwt.decode(token);

    res.status(200).json({
      access_token: token,
      expried_in: new Date(expried_in.exp * 1000).toUTCString(),
      token_type: "Bearer",
    });
  } catch (error) {
    next(error);
  }
};
// login user end //

// delete user start //
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndRemove({ _id: id });

    if (!user) {
      const error = new Error("User ID not found");
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
        success: {
          message: "Deleted user",
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
// delete user end //
