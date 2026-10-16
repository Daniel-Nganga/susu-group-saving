const express = require("express");
const router = express.Router();
const { addMember } = require("./controllers");

// Endpoint Routes Definition
router.post("/member", addMember);

module.exports = router;
