import express from "express"
import {
  createLocation,
  readLocation,
  readLocations,
  updateLocation
} from "../controllers/LocationController.js"

const locationApi = express.Router()

/*
  CRUD Functionality
*/

/* Create */
locationApi.post("/api/locations", async (req, res) => {
  try {
    await createLocation(req.body)
    res.status(201).send({ message: "Location created" })
  } catch (error) {
    res.status(500).send({ error: "Failed to create location" })
  }
})

/* Read */
locationApi.get("/api/locations/:id", async (req, res) => {
  try {
    const { id } = req.params
    const location = await readLocation(id)
    if (location) {
      res.json(location)
    } else {
      res.status(404).send({ error: "location not found" })
    }
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch location" })
  }
})

locationApi.get("/api/locations", async (req, res) => {
  try {
    const searchQuery = req.query.query || '';
    const locations = await readLocations(searchQuery);
    res.json(locations);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch locations" });
  }
});


/* Update */
locationApi.put("/api/locations/:id", async (req, res) => {
  try {
    const { id } = req.params
    await updateLocation(id, req.body)
    res.send({ message: "location updated" })
  } catch (error) {
    res.status(500).send({ error: "Failed to update location" + error })
  }
})

export default locationApi