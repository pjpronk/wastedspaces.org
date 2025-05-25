import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp, GeoPoint } from "firebase-admin/firestore";
import { Request, Response } from "express";

import { LocationDetails, LocationOwnership, LocationType } from "./types";

initializeApp();

exports.addLocation = onRequest(async (req: Request, res: Response) => {
  try {
    // Get location data from request body
    const locationData = req.body;

    // Validate required fields
    const requiredFields = [
      "address",
      "city",
      "type",
      "ownership",
      "vacatedSince",
      "latLng",
    ];

    const missingFields = requiredFields.filter(field => !locationData[field]);

    if (missingFields.length > 0) {
      res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
      return;
    }

    // Validate latLng has latitude and longitude
    if (!locationData.latLng.latitude || !locationData.latLng.longitude) {
      res.status(400).json({
        error: "latLng must include both latitude and longitude",
      });
      return;
    }

    // Validate enum types
    if (!Object.values(LocationType).includes(locationData.type)) {
      res.status(400).json({
        error: `Invalid location type: ${locationData.type}`,
      });
      return;
    }

    if (!Object.values(LocationOwnership).includes(locationData.ownership)) {
      res.status(400).json({
        error: `Invalid ownership type: ${locationData.ownership}`,
      });
      return;
    }

    // Create timestamps
    const now = Timestamp.now();

    // Create GeoPoint from latitude and longitude
    const geoPoint = new GeoPoint(
      locationData.latLng.latitude,
      locationData.latLng.longitude
    );

    // Prepare location document
    const locationDoc: Omit<LocationDetails, "id"> = {
      address: locationData.address,
      city: locationData.city,
      type: locationData.type,
      ownership: locationData.ownership,
      vacatedSince: new Date(locationData.vacatedSince),
      latLng: geoPoint,
      verified: false,
      createdAt: now,
      updatedAt: now,
    };

    const writeResult = await getFirestore()
      .collection("locations")
      .add(locationDoc);
    res.status(201).json({
      result: `Location created with ID: ${writeResult.id}`,
      id: writeResult.id,
    });
  } catch (err) {
    const error = err as Error;
    logger.error("Error adding location:", error);
    res.status(500).json({
      error: "Failed to add location",
      details: error.message,
    });
  }
});
