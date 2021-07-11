const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
const config = require("../config/index");

const Branch = require("../models/branch");
const Staff = require("../models/staff");
const Goods = require("../models/goods");

// get all branch start //
exports.index = async (req, res, next) => {
  try {
    const branches = await Branch.find().sort({ _id: 1 });

    const branchWithPhotoDomain = await branches.map((branch, index) => {
      return {
        _id: branch._id,
        name: branch.name,
        photo: `${config.DOMAIN}/images/${branch.photo}`,
        location: branch.location,
      };
    });

    res.status(200).json({
      branch: branchWithPhotoDomain,
    });
  } catch (error) {
    next(error);
  }
};
// get all branch end //

// get branch with staff start //
exports.getBranchWithStaff = async (req, res, next) => {
  try {
    const { id } = req.params;

    const branchFilterById = await Branch.findById(id).populate(
      "staffs"
      // "-_id"
    );

    res.status(200).json({
      branch: branchFilterById,
    });
  } catch (error) {
    next(error);
  }
};
// get branch with staff end //

// get branch with goods start //
exports.getBranchWithGoods = async (req, res, next) => {
  try {
    const { id } = req.params;

    const branchFilterById = await Branch.findById(id).populate(
      "goods"
      // "-_id"
    );

    res.status(200).json({
      branch: branchFilterById,
    });
  } catch (error) {
    next(error);
  }
};
// get branch with goods end //

// creat branch start //
exports.create = async (req, res, next) => {
  try {
    const { name, location, photo } = req.body;

    let branch = new Branch({
      name: name,
      location: location,
      photo: await saveImageToDisk(photo),
    });

    await branch.save();

    res.status(201).json({
      message: "Insert branch success!",
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

  return filename;
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
// creat branch end //

// delete branch start //
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findByIdAndRemove({ _id: id });

    if (!branch) {
      const error = new Error("Branch ID not found");
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
        success: {
          message: "Deleted branch",
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
// delete branch end //
