import type { GeoPoint, Timestamp } from "firebase/firestore"

export interface LocationDetails {
  id: string
  address: string
  city: string
  type: LocationType
  ownership: LocationOwnership
  vacatedSince: Date
  latLng: GeoPoint
  verified: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export enum LocationOwnership {
  PRIVATE = "Particulier",
  ORGANIZATION = "Organisatie",
  GOVERNMENT = "Overheid",
  UNKNOWN = "Onbekend"
}

export enum LocationType {
  RESIDENTIAL = "Woning",
  COMMERCIAL = "Commercieel",
  INDUSTRIAL = "Industrieel",
  OFFICE = "Kantoor",
  PLOT = "Terrein",
  OTHER = "Anders"
}

export const typeToIcon = (type: string) => {
  switch (type) {
    case "COMERCIEEL":
      return "office"
    case "PRIVAAT":
      return "house"
    case "PUBLIEK":
      return "farm"
    default:
      return "other"
  }
}
