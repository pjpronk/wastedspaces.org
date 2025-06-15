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
  upvotes: number
  downvotes: number
}

export enum LocationOwnership {
  Particulier = "Particulier",
  Organisatie = "Organisatie",
  Overheid = "Overheid",
  Onbekend = "Onbekend"
}

export enum LocationType {
  Woning = "Woning",
  Commercieel = "Commercieel",
  Industrieel = "Industrieel",
  Kantoor = "Kantoor",
  Terrein = "Terrein",
  Anders = "Anders"
}

export enum VoteType {
  UPVOTE = "upvote",
  DOWNVOTE = "downvote"
}


