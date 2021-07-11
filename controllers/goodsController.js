const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
const config = require("../config/index");

const Goods = require("../models/goods");

// get all goods start //
exports.index = async (req, res, next) => {
  try {
    const goods = await Goods.find().sort({ _id: 1 });

    const goodsWithPhotoDomain = await goods.map((branch, index) => {
      return {
        _id: branch._id,
        name: branch.name,
        photo: branch.photo,
        price: branch.price,
        net_price: branch.net_price,
        stock: branch.stock,
        unit: branch.unit,
        branch: branch.branch,
      };
    });

    res.status(200).json({
      goods: goodsWithPhotoDomain,
    });
  } catch (error) {
    next(error);
  }
};
// get all goods end //

// creat goods start //
exports.create = async (req, res, next) => {
  try {
    const { name, photo, price, stock, unit, branch } = req.body;

    let goods = new Goods({
      name: name,
      photo: await saveImageToDisk(photo),
      price: price,
      stock: stock,
      unit: unit,
      branch: branch,
    });

    await goods.save();

    res.status(201).json({
      message: "Insert goods success!",
    });
  } catch (error) {
    next(error);
  }
};

async function saveImageToDisk(baseImage) {
  const projectPath = path.resolve("./");
  const uploadPath = `${projectPath}/public/images/`;
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );

  let filename = "";
  if (ext === "svg+xml") {
    filename = `${uuidv4.v4()}.svg`;
  } else {
    filename = `${uuidv4.v4()}.${ext}`;
  }

  let image = decodeBase64Image(baseImage);
  await writeFileAsync(uploadPath + filename, image.data, "base64");

  return config.DOMAIN + "images/" + filename;
}

function decodeBase64Image(base64Str) {
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var image = {};
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  image.type = matches[1];
  image.data = matches[2];

  return image;
}
// creat goods end //

// delete goods start //
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const goods = await Goods.findByIdAndRemove({ _id: id });

    if (!goods) {
      const error = new Error("Goods ID not found");
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
        success: {
          message: "Deleted goods",
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
// delete goods end //
