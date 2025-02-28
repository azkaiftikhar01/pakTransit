const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth/account");
const {
  createBusStation,
  updateBusStation,
  deleteBusStation,
  listBusStations,
} = require("../controller/auth/adminOperations");

router.post("/operations/stations", authMiddleware, createBusStation);
router.put("/operations/stations/:id", authMiddleware, updateBusStation);
router.delete("/operations/stations/:id", authMiddleware, deleteBusStation);
router.get("/operations/stations", authMiddleware, listBusStations);

module.exports = router;
