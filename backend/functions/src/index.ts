import * as dotenv from "dotenv";
import { randomBytes, createHash } from "crypto";

import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp, GeoPoint } from "firebase-admin/firestore";
import { Request, Response } from "express";

import { LocationDetails, LocationOwnership, LocationType } from "./types";
import { createEmailService } from "./emailService";

dotenv.config();
initializeApp();

// Initialize email service
const emailService = createEmailService();

// Helper function to create HTML template
function createHtmlTemplate(message: string, title = "Wasted Spaces"): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Helvetica;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            background-color: white;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .message {
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .link {
            display: inline-block;
            background-color: #CC0000;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            margin-top: 20px;
        }
        .link:hover {
            background-color: #D11919;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <div class="message">${message}</div>
        <a href="https://wastedspaces.org" class="link">Terug naar Wastes Spaces</a>
        <div class="footer">
            <p>Bedankt voor je bijdrage! Zonder jouw bijdrage zou dit project niet bestaan en niet bruikbaar zijn!</p>
        </div>
    </div>
</body>
</html>`;
}

exports.addLocation = onRequest(async (req: Request, res: Response) => {
  // Set CORS headers
  const allowedOrigins = [
    "https://wastedspaces.org",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin as string)) {
    res.set("Access-Control-Allow-Origin", origin as string);
  }

  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

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
      "verificationEmail",
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

    // Generate secure verification token
    const verificationToken = randomBytes(32).toString("hex");

    // Hash the email to avoid storing sensitive user data
    const emailHash = createHash("sha256")
      .update(
        locationData.verificationEmail + process.env.OPENSSL_SALT ||
          "default-salt"
      )
      .digest("hex");

    // Prepare public location document (no sensitive verification data)
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

    const db = getFirestore();

    // Add public location document
    const writeResult = await db.collection("locations").add(locationDoc);

    // Store verification data in separate, admin-only collection
    await db.collection("location_verifications").doc(writeResult.id).set({
      locationId: writeResult.id,
      emailHash: emailHash, // Store hashed email instead of plain email
      verificationToken: verificationToken,
      verified: false,
      createdAt: now,
    });

    // Send email notification if email service is available
    if (emailService) {
      try {
        await emailService.sendLocationNotification(
          locationDoc,
          writeResult.id,
          verificationToken,
          locationData.verificationEmail
        );
        logger.info(`Email notification sent for location: ${writeResult.id}`);
      } catch (emailError) {
        logger.error("Failed to send email notification:", emailError);
        // Continue execution even if email fails
      }
    } else {
      logger.info("Email service not configured, skipping notification");
    }

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

exports.verifyLocation = onRequest(async (req: Request, res: Response) => {
  // Set CORS headers
  const allowedOrigins = [
    "https://wastedspaces.org",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin as string)) {
    res.set("Access-Control-Allow-Origin", origin as string);
  }

  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");
  res.set("Content-Type", "text/html");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const locationId = req.query.locationId as string;
    const verificationToken = req.query.verificationToken as string;

    if (!locationId || !verificationToken) {
      const html = createHtmlTemplate(
        "Ontbrekende locatie id of verificatietoken. Controleer je verificatielink. Mocht het niet lukken om een locatie te verifieren neem dan contact op met team.wastedspaces@gmail.com.",
        "Verificatiefout"
      );
      res.status(400).send(html);
      return;
    }

    const db = getFirestore();

    // Check verification token
    const verificationDoc = await db
      .collection("location_verifications")
      .doc(locationId)
      .get();

    if (!verificationDoc.exists) {
      const html = createHtmlTemplate(
        "Locatieverificatie niet gevonden. De verificatielink is mogelijk ongeldig of verlopen.",
        "Verificatiefout"
      );
      res.status(404).send(html);
      return;
    }

    const verificationData = verificationDoc.data();

    if (verificationData?.verificationToken !== verificationToken) {
      const html = createHtmlTemplate(
        "Ongeldig verificatietoken. De verificatielink is mogelijk ongeldig of verlopen.",
        "Verificatiefout"
      );
      res.status(401).send(html);
      return;
    }

    if (verificationData?.verified) {
      const html = createHtmlTemplate(
        "Deze locatie is al geverifieerd. Bedankt voor je bijdrage!",
        "Al Geverifieerd"
      );
      res.status(400).send(html);
      return;
    }

    // Update both collections
    const batch = db.batch();

    // Mark as verified in public collection
    const locationRef = db.collection("locations").doc(locationId);
    batch.update(locationRef, {
      verified: true,
      updatedAt: Timestamp.now(),
    });

    // Mark as verified in verification collection
    const verificationRef = db
      .collection("location_verifications")
      .doc(locationId);
    batch.update(verificationRef, {
      verified: true,
      verifiedAt: Timestamp.now(),
    });

    await batch.commit();

    const html = createHtmlTemplate(
      "Gefeliciteerd! Je locatie is succesvol geverifieerd en is nu zichtbaar op de kaart.",
      "Verificatie Succesvol"
    );
    res.status(200).send(html);
  } catch (err) {
    const error = err as Error;
    logger.error("Error verifying location:", error);
    const html = createHtmlTemplate(
      `Locatie verificeren mislukt: ${error.message}`,
      "Verificatiefout"
    );
    res.status(500).send(html);
  }
});
