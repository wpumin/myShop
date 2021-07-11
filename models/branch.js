const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: "no_image.png", trim: true },
    location: { lat: Number, long: Number },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "branches",
  }
);

schema.virtual("goods", {
  ref: "Goods", // link to Goods model
  localField: "_id", // field for Goods model
  foreignField: "branch", // foreign field to map Branch model
});

// virtual document
schema.virtual("staffs", {
  ref: "Staff", // link to Staff model
  localField: "_id", // field for Staff model
  foreignField: "branch", // foreign field to map Branch model
});

const branch = mongoose.model("Branch", schema);

module.exports = branch;
