const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    role: { type: String, default: "member" },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// encrypt password
schema.methods.encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(5);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

// valid password
schema.methods.checkPassword = async function (password) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
};

// delete user start //
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const staff = await Branch.deleteOne({_id: id});
    const user = await Branch.findByIdAndRemove({ _id: id });

    if (!user) {
      const error = new Error("Branch ID not found");
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

const user = mongoose.model("User", schema);

module.exports = user;
