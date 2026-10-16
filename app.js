const express = require("express");
const app = express();
const routes = require("./routers");

// Standard body parser middleware configuration inputs
app.use(express.json());

// Bind the Susu router routes context
app.use("/api/susu", routes);

// Explicit root status check fallbacks
app.get("/", (req, res) => {
  res.send("Susu Management API Server Running Fine.");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Susu management runnung on http://localhost:${PORT}`);
});
