// const { dbOperations } = require("../common/dbOperations");

// exports.createBusStation = async (req, res) => {
//   try {
//     const { name, location } = req.body;

//     if (!name || !location || !location.longitude || !location.latitude) {
//       return res.status(400).json({ error: "Name and valid location (longitude & latitude) are required" });
//     }

//     const station = await dbOperations("geom", "bus_stations", {
//       name,
//       location_longitude: location.longitude,
//       location_latitude: location.latitude,
//     });

//     res.status(201).json({
//       message: "Bus station created successfully",
//       station: {
//         id: station.id,
//         name: station.name,
//         created_at: station.created_at,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateBusStation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, location } = req.body;

//     if (!id) {
//       return res.status(400).json({ error: "Station ID is required" });
//     }

//     const updateData = {};
//     if (name) updateData.name = name;
//     if (location && location.longitude && location.latitude) {
//       updateData.location_longitude = location.longitude;
//       updateData.location_latitude = location.latitude;
//     }

//     const updatedStation = await dbOperations("update", "bus_stations", updateData, { id });

//     if (!updatedStation) {
//       return res.status(404).json({ error: "Bus station not found" });
//     }

//     res.status(200).json({
//       message: "Bus station updated successfully",
//       station: updatedStation,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.deleteBusStation = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({ error: "Station ID is required" });
//     }

//     const deletedStation = await dbOperations("delete", "bus_stations", {}, { id });

//     if (!deletedStation) {
//       return res.status(404).json({ error: "Bus station not found" });
//     }

//     res.status(200).json({
//       message: "Bus station deleted successfully",
//       station: deletedStation,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.listBusStations = async (req, res) => {
//   try {
//     const stations = await dbOperations("select", "bus_stations", {});

//     res.status(200).json({
//       message: "Bus stations retrieved successfully",
//       stations,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
