const express = require("express");
const router = express.Router();
const { addMember, recordPayment } = require("./controllers");

// Endpoint Routes Definition
router.post("/member", addMember);
router.post("/payments", recordPayment);

module.exports = router;
