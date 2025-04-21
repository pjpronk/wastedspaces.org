import type { GeoPoint } from 'firebase/firestore';

export interface LocationDetails {
  id: string
  address: string
  city: string
  type: LocationType
  vacatedSince: Date
  latLng: GeoPoint
  createdAt: Date
  updatedAt: Date
}

export interface MarkerDetails {}

export enum LocationType {
  PRIVAAT,
  PUBLIEK,
  COMERCIEEL,
  ONBEKEND
}


export const typeToIcon = (type: string) => {
  switch (type) {
    case "COMERCIEEL":
      return 'office'
    case "PRIVAAT":
      return 'house'
    case "PUBLIEK":
      return 'farm'
    default:
      return 'other'
  }
}
