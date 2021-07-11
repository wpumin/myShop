const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
const config = require("../config/index");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const Staff = require("../models/staff");

// get all staff start //
exports.index = async (req, res, next) => {
  try {
    const staff = await Staff.find()
      .sort({ salary: 1 })
      .select("name photo age salary net_salary role");

    res.status(200).json({
      staff: staff,
    });
  } catch (error) {
    next(error);
  }
};
// get all staff end //

// creat staff start //
exports.create = async (req, res, next) => {
  try {
    const { name, photo, age, salary, role, branch } = req.body;

    let staff = new Staff({
      name: name,
      photo: await saveImageToDisk(photo),
      age: age,
      salary: salary,
      role: role,
      branch: branch,
    });

    await staff.save();

    res.status(201).json({
      message: "Insert staff success!",
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
// creat staff end //

// delete staff start //
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByIdAndRemove({ _id: id });

    if (!staff) {
      const error = new Error("Staff ID not found");
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
        success: {
          message: "Deleted staff",
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
// delete staff end //
