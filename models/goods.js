const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VAT_PERCENT = 1.07;

const schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: "no_image_goods.png", trim: true },
    price: { type: Number },
    stock: { type: Number, default: 0 },
    unit: { type: String, required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "goods",
  }
);

schema.virtual("net_price").get(function () {
  return parseFloat((this.price * VAT_PERCENT).toFixed(2));
});

const goods = mongoose.model("Goods", schema);

module.exports = goods;
