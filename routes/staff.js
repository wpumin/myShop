const express = require("express");
const router = express.Router();

const staffController = require("../controllers/staffController");

/* http://localhost:3000/api/staff/ */
router.get("/", staffController.index);

/* http://localhost:3000/api/staff/create */
router.post("/create", staffController.create);

/* http://localhost:3000/api/staff/delete/:id_staff */
router.delete("/delete/:id", staffController.delete);

module.exports = router;
