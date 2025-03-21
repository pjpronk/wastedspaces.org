import type { GeoPoint } from 'firebase/firestore';

export interface LocationDetails {
  id: string
  address: string
  city: string
  type: 'PRIVAAT' | 'PUBLIEK' | 'COMMERCIEEL' | 'ONBEKEND'
  vacatedSince: Date
  location: GeoPoint
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
