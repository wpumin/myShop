const express = require("express");
const router = express.Router();

const branchController = require("../controllers/branchController");

/* http://localhost:3000/api/branch */
router.get("/", branchController.index);

/* http://localhost:3000/api/branch/:id_branch/staff */
router.get("/staff/:id", branchController.getBranchWithStaff);

/* http://localhost:3000/api/branch/:id_branch/goods */
router.get("/goods/:id", branchController.getBranchWithGoods);

/* http://localhost:3000/api/branch/create */
router.post("/create", branchController.create);

/* http://localhost:3000/api/branch/delete/:id_branch */
router.delete("/delete/:id", branchController.delete);

module.exports = router;
