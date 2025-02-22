export interface LocationDetails {
  id: string
  address: string
  city: string
  type: LocationType
  vacantSince: Date
  latitude: number
  longitude: number
}

export enum LocationType {
  PRIVAAT,
  PUBLIEK,
  COMERCIEEL,
  ONBEKEND
}
