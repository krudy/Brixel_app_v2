const express = require("express");
const router = new express.Router();
const upload = require("../middleware/upload");
const { analyzeImage } = require("../controllers/analyze-Controller");

router.post("/analyze", upload.single("image"), analyzeImage);

module.exports = router;
