export interface LocationDetails {
  id: string
  address: string
  city: string
  type: LocationType
  vacantSince: Date
  latitude: number
  longitude: number
}

export interface MarkerDetails {}

export enum LocationType {
  PRIVAAT,
  PUBLIEK,
  COMERCIEEL,
  ONBEKEND
}
