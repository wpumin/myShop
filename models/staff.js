const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const SSO_DISCOUNT = 0.05;

const schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: "no_image_staff.png", trim: true },
    age: { type: Number },
    salary: { type: Number, required: true },
    role: { type: String, default: "waiter", trim: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "staffs",
  }
);

// virtual document
schema.virtual("net_salary").get(function () {
  if ((this.salary * SSO_DISCOUNT).toFixed(2) >= 750) {
    return parseFloat((this.salary - 750).toFixed(2));
  } else {
    return parseFloat((this.salary - this.salary * SSO_DISCOUNT).toFixed(2));
  }
});

const staff = mongoose.model("Staff", schema);

module.exports = staff;
