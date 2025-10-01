const express = require("express");
const router = new express.Router();
const upload = require("../middleware/upload");
const { generatePixelPDF } = require("../controllers/pdf-controller");

router.post("/pixel-pdf", upload.single("image"), generatePixelPDF);

module.exports = router;
