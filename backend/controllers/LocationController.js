import db from "../models/index.js"
import { Op } from "sequelize"
import {v4 as uuidv4} from "uuid"

const Location = db.Location

/*
  CRUD Functionality
*/

/* Create */
export async function createLocation(locationDetails) {
  try {
    // Destructure and validate required fields
    const {
      vacatedSince,
      address,
      city,
      latitude,
      longitude
    } = locationDetails;

    // Check if all required fields are present
    if (!address || !city || typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new Error('Missing or invalid required fields');
    }

    // Create the new location record
    const location = await Location.create({
      id: () => uuidv4(),      
      vacatedSince: vacatedSince || null,  
      address,           
      city,             
      latitude,          
      longitude          
    });

    console.log("Location created with id: " + location.id);
    return location;
  } catch (error) {
    console.error("Error creating location: ", error);
    throw error;
  }
}

/* Read */
export async function readLocation(locationId) {
  try {
    return await Location.findByPk(locationId)
  } catch (error) {
    console.error("Error fetching location:", error)
    throw error
  }
}

export async function readLocations(search = '') {
  try {
    const whereClause = search
      ? {
        address: {
            [Op.iLike]: `%${search}%` // Case-insensitive search for PostgreSQL
          }
        }
      : {}; // Empty object means no filtering

    return await Location.findAll({ where: whereClause });
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
}


/* Update */
export async function updateLocation(id, locationUpdates) {
  try {
    // Validate the input
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid or missing ID');
    }

    const {
      vacatedSince,
      address,
      city,
      latitude,
      longitude
    } = locationUpdates;

    // Validate update fields
    if (address && typeof address !== 'string') {
      throw new Error('Address must be a string');
    }
    if (city && typeof city !== 'string') {
      throw new Error('City must be a string');
    }
    if (latitude !== undefined && typeof latitude !== 'number') {
      throw new Error('Latitude must be a number');
    }
    if (longitude !== undefined && typeof longitude !== 'number') {
      throw new Error('Longitude must be a number');
    }

    // Find the existing location by ID
    const location = await Location.findByPk(id);

    if (!location) {
      throw new Error('Location not found');
    }

    // Update the location record
    await location.update({
      vacatedSince: vacatedSince || location.vacatedSince,
      address: address || location.address,
      city: city || location.city,
      latitude: latitude !== undefined ? latitude : location.latitude,
      longitude: longitude !== undefined ? longitude : location.longitude
    });

    console.log("Location updated with id: " + location.id);
    return location;
  } catch (error) {
    console.error("Error updating location: ", error);
    throw error;
  }
}

/* Delete */
export async function deleteLocation(mac_address) {
  try {
    const location = await readLocation(mac_address)
    if (location) {
      await location.destroy()
      console.log("Location deleted with mac address " + mac_address)
    } else {
      console.log("Location not found with mac address " + mac_address)
    }
  } catch (error) {
    console.error("Error deleting location:", error)
    throw error
  }
}