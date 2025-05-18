import type { GeoPoint, Timestamp } from 'firebase/firestore';

export interface LocationDetails {
  id: string
  address: string
  city: string
  type: LocationType
  vacatedSince: Date
  latLng: GeoPoint
  createdAt: Timestamp
  updatedAt: Timestamp
}


export enum LocationType {
  PRIVAAT = 'Privaat',
  PUBLIEK = 'Publiek',
  COMMERCIEEL = 'Commercieel',
  ONBEKEND = 'Onbekend'
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
