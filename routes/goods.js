const express = require("express");
const router = express.Router();

const goodsController = require("../controllers/goodsController");

/* http://localhost:3000/api/goods/ */
router.get("/", goodsController.index);

/* http://localhost:3000/api/goods/create */
router.post("/create", goodsController.create);

/* http://localhost:3000/api/goods/delete/:id_goods */
router.delete("/delete/:id", goodsController.delete);

module.exports = router;
