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

export enum LocationType {
  WONING = "Woning",
  WINKEL = "Winkel",
  INDUSTRIEEL = "Industrieel",
  KANTOOR = "Kantoor",
  TERREIN = "Terrein",
  ANDERS = "Anders"
}

export enum LocationOwnership {
  PARTICULIER = "Particulier",
  ORGANISATIE = "Organisatie",
  OVERHEID = "Overheid",
  ONBEKEND = "Onbekend"
}

export enum LocationStatus {
  BEVESTIGD = "Bevestigd",
  GEMELD = "Gemeld",
  BETWIJFELD = "Betwijfeld"
}

export enum LocationDuration {
  KORTDURIG = "Kortdurig (<6m)",
  MIDDELLANG = "Middellang (6m-2j)",
  LANGDURIG = "Langdurig (>2j)"
}

export type LocationFilterType = "type" | "ownership" | "status" | "duration"

export interface FilterOption {
  label: string
  value: string
}

export interface LocationFilterState {
  type: Record<string, boolean>
  ownership: Record<string, boolean>
  status: Record<string, boolean>
  duration: Record<string, boolean>
}

export enum VoteType {
  UPVOTE = "upvote",
  DOWNVOTE = "downvote"
}

export interface VoteDetails {
  id?: string
  locationId: string
  voteType: VoteType
  emailHash: string
  verified: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
