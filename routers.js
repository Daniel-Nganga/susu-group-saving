const express = require("express");
const router = express.Router();
const {
  addMember,
  recordPayment,
  closeWeek,
  getReport,
} = require("./controllers");

// Endpoint Routes Definition
router.post("/member", addMember);
router.post("/payments", recordPayment);
router.post("/weeks/close", closeWeek);
router.get("/report", getReport);

module.exports = router;
