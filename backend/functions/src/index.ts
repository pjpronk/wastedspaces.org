import * as dotenv from "dotenv";
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

import { randomBytes, createHash } from "crypto";

import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp, GeoPoint } from "firebase-admin/firestore";
import { Request, Response } from "express";

import {
  LocationDetails,
  LocationOwnership,
  LocationType,
  VoteDetails,
  VoteType,
} from "./types";
import { createEmailService } from "./emailService";
import { templateService } from "./templateService";

dotenv.config();
initializeApp();

// Initialize email service
const emailService = createEmailService();

// CORS configuration
const ALLOWED_ORIGINS = [
  "https://wastedspaces.org",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// CORS middleware function
function handleCors(req: Request, res: Response): boolean {
  const origin = req.headers.origin;

  if (ALLOWED_ORIGINS.includes(origin as string)) {
    res.set("Access-Control-Allow-Origin", origin as string);
  }

  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Max-Age", "3600");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return true; // Indicates preflight was handled
  }

  return false; // Continue with normal request processing
}

// Helper function to render HTML templates
function renderTemplate(templateName: string, data: any): string {
  return templateService.render(templateName, data);
}

exports.addLocation = onRequest(async (req: Request, res: Response) => {
  if (handleCors(req, res)) return;

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
      .update(locationData.verificationEmail)
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
      upvotes: 1,
      downvotes: 0,
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
        const emailBody = templateService.render("location-verification", {
          title: "Nieuwe Locatie Toegevoegd aan Wasted Spaces",
          location: {
            address: locationDoc.address,
            city: locationDoc.city,
            type: locationDoc.type,
            ownership: locationDoc.ownership,
            vacatedSince: locationDoc.vacatedSince,
            latitude: locationDoc.latLng.latitude,
            longitude: locationDoc.latLng.longitude,
            verified: locationDoc.verified,
            createdAt: locationDoc.createdAt.toDate(),
          },
          verificationUrl: `${process.env.FUNCTIONS_BASE_URL}/verifyLocation?verificationToken=${verificationToken}&locationId=${writeResult.id}`,
        });

        await emailService.sendEmail({
          to: locationData.verificationEmail,
          subject: `Verzoek tot verificatie: ${locationDoc.address}`,
          body: emailBody,
          isHtml: true,
        });
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
  if (handleCors(req, res)) return;
  res.set("Content-Type", "text/html");

  try {
    const locationId = req.query.locationId as string;
    const verificationToken = req.query.verificationToken as string;

    if (!locationId || !verificationToken) {
      const html = renderTemplate("verification-result", {
        title: "Verificatiefout",
        message:
          "Ontbrekende locatie id of verificatietoken. Je kan altijd proberen om een locatie nogmaals toe te voegen. Mocht het niet lukken om een locatie te verifieren neem dan contact op met team.wastedspaces@gmail.com.",
      });
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
      const html = renderTemplate("verification-result", {
        title: "Verificatiefout",
        message:
          "Locatieverificatie niet gevonden. De verificatielink is mogelijk ongeldig of verlopen.",
      });
      res.status(404).send(html);
      return;
    }

    const verificationData = verificationDoc.data();

    if (verificationData?.verificationToken !== verificationToken) {
      const html = renderTemplate("verification-result", {
        title: "Verificatiefout",
        message:
          "Ongeldig verificatietoken. De verificatielink is mogelijk ongeldig of verlopen.",
      });
      res.status(401).send(html);
      return;
    }

    if (verificationData?.verified) {
      const html = renderTemplate("verification-result", {
        title: "Locatie al geverifieerd...",
        message: "Deze locatie is al geverifieerd. Bedankt voor je bijdrage!",
      });
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

    const html = renderTemplate("verification-result", {
      title: "Verificatie succesvol",
      message:
        "Gefeliciteerd! Je locatie is succesvol geverifieerd en is nu zichtbaar op de kaart.",
    });
    res.status(200).send(html);
  } catch (err) {
    const error = err as Error;
    logger.error("Error verifying location:", error);
    const html = renderTemplate("verification-result", {
      title: "Verificatiefout",
      message: `Locatie verificeren mislukt: ${error.message}`,
    });
    res.status(500).send(html);
  }
});

exports.addVote = onRequest(async (req: Request, res: Response) => {
  if (handleCors(req, res)) return;

  try {
    const voteData = req.body;

    // Validate required fields
    const requiredFields = ["locationId", "voteType", "verificationEmail"];
    const missingFields = requiredFields.filter(field => !voteData[field]);

    if (missingFields.length > 0) {
      res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
      return;
    }

    // Validate vote type
    if (!Object.values(VoteType).includes(voteData.voteType)) {
      res.status(400).json({
        error: `Invalid vote type: ${voteData.voteType}`,
      });
      return;
    }

    const db = getFirestore();

    // Check if location exists
    const locationDoc = await db
      .collection("locations")
      .doc(voteData.locationId)
      .get();
    if (!locationDoc.exists) {
      res.status(404).json({
        error: "Location not found",
      });
      return;
    }

    // Hash the email
    const emailHash = createHash("sha256")
      .update(voteData.verificationEmail)
      .digest("hex");

    // Check if user has already voted for this location
    const existingVoteQuery = await db
      .collection("votes")
      .where("locationId", "==", voteData.locationId)
      .where("emailHash", "==", emailHash)
      .where("verified", "==", true)
      .get();

    if (!existingVoteQuery.empty) {
      res.status(409).json({
        error: "You have already voted for this location",
      });
      return;
    }

    // Check if there's a pending verification for this user and location
    const pendingVoteQuery = await db
      .collection("vote_verifications")
      .where("locationId", "==", voteData.locationId)
      .where("emailHash", "==", emailHash)
      .where("verified", "==", false)
      .get();

    if (!pendingVoteQuery.empty) {
      res.status(409).json({
        error: "You already have a pending vote verification for this location",
      });
      return;
    }

    const now = Timestamp.now();
    const verificationToken = randomBytes(32).toString("hex");

    // Create vote document (unverified)
    const voteDoc: Omit<VoteDetails, "id"> = {
      locationId: voteData.locationId,
      voteType: voteData.voteType,
      emailHash: emailHash,
      verified: false,
      createdAt: now,
      updatedAt: now,
    };

    // Add vote to database
    const writeResult = await db.collection("votes").add(voteDoc);

    // Store verification data
    await db.collection("vote_verifications").doc(writeResult.id).set({
      voteId: writeResult.id,
      locationId: voteData.locationId,
      emailHash: emailHash,
      voteType: voteData.voteType,
      verificationToken: verificationToken,
      verified: false,
      createdAt: now,
    });

    // Send verification email
    if (emailService) {
      try {
        const voteTypeText =
          voteData.voteType === VoteType.UPVOTE
            ? "positieve stem"
            : "negatieve stem";

        // Get location data for the email
        const locationData = locationDoc.data();

        const emailBody = templateService.render("vote-verification", {
          title: "Verificatie van je stem op Wasted Spaces",
          voteTypeText: voteTypeText,
          location: {
            address: locationData?.address,
          },
          verificationUrl: `${process.env.FUNCTIONS_BASE_URL}/verifyVote?verificationToken=${verificationToken}&voteId=${writeResult.id}`,
        });

        await emailService.sendEmail({
          to: voteData.verificationEmail,
          subject: "Verificatie van je stem op Wasted Spaces",
          body: emailBody,
          isHtml: true,
        });
        logger.info(`Vote verification email sent for vote: ${writeResult.id}`);
      } catch (emailError) {
        logger.error("Failed to send vote verification email:", emailError);
        // Continue execution even if email fails
      }
    }

    res.status(201).json({
      result: `Vote created with ID: ${writeResult.id}`,
      id: writeResult.id,
      message: "Please check your email to verify your vote",
    });
  } catch (err) {
    const error = err as Error;
    logger.error("Error adding vote:", error);
    res.status(500).json({
      error: "Failed to add vote",
      details: error.message,
    });
  }
});

exports.verifyVote = onRequest(async (req: Request, res: Response) => {
  if (handleCors(req, res)) return;
  res.set("Content-Type", "text/html");

  try {
    const voteId = req.query.voteId as string;
    const verificationToken = req.query.verificationToken as string;

    if (!voteId || !verificationToken) {
      const html = renderTemplate("verification-result", {
        title: "Verificatiefout",
        message:
          "Ontbrekende stem id of verificatietoken. Probeer nogmaals te stemmen.",
      });
      res.status(400).send(html);
      return;
    }

    const db = getFirestore();

    // Check verification token
    const verificationDoc = await db
      .collection("vote_verifications")
      .doc(voteId)
      .get();

    if (!verificationDoc.exists) {
      const html = renderTemplate("verification-result", {
        title: "Verificatiefout",
        message:
          "Stemverificatie niet gevonden. De verificatielink is mogelijk ongeldig of verlopen.",
      });
      res.status(404).send(html);
      return;
    }

    const verificationData = verificationDoc.data();

    if (verificationData?.verificationToken !== verificationToken) {
      const html = renderTemplate("verification-result", {
        title: "Verificatiefout",
        message:
          "Ongeldig verificatietoken. De verificatielink is mogelijk ongeldig of verlopen.",
      });
      res.status(401).send(html);
      return;
    }

    if (verificationData?.verified) {
      const html = renderTemplate("verification-result", {
        title: "Stem al geverifieerd...",
        message: "Deze stem is al geverifieerd. Bedankt voor je bijdrage!",
      });
      res.status(400).send(html);
      return;
    }

    // Update all collections atomically
    const batch = db.batch();

    // Mark vote as verified in public collection
    const voteRef = db.collection("votes").doc(voteId);
    batch.update(voteRef, {
      verified: true,
      updatedAt: Timestamp.now(),
    });

    // Mark as verified in verification collection
    const verificationRef = db.collection("vote_verifications").doc(voteId);
    batch.update(verificationRef, {
      verified: true,
      verifiedAt: Timestamp.now(),
    });

    // Update location document with vote count
    const locationRef = db
      .collection("locations")
      .doc(verificationData.locationId);
    const locationDoc = await locationRef.get();

    if (locationDoc.exists) {
      const locationData = locationDoc.data();
      const currentUpvotes = locationData?.upvotes || 0;
      const currentDownvotes = locationData?.downvotes || 0;

      if (verificationData.voteType === VoteType.UPVOTE) {
        batch.update(locationRef, {
          upvotes: currentUpvotes + 1,
          updatedAt: Timestamp.now(),
        });
      } else {
        batch.update(locationRef, {
          downvotes: currentDownvotes + 1,
          updatedAt: Timestamp.now(),
        });
      }
    }

    await batch.commit();

    const voteTypeText =
      verificationData.voteType === VoteType.UPVOTE ? "upvote" : "downvote";
    const html = renderTemplate("verification-result", {
      title: "Stem geverifieerd",
      message: `Gefeliciteerd! Je ${voteTypeText} is succesvol geverifieerd en telt nu mee.`,
    });
    res.status(200).send(html);
  } catch (err) {
    const error = err as Error;
    logger.error("Error verifying vote:", error);
    const html = renderTemplate("verification-result", {
      title: "Verificatiefout",
      message: `Stem verificeren mislukt: ${error.message}`,
    });
    res.status(500).send(html);
  }
});
