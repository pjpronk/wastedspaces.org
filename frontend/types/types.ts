export interface LocationDetails {
  address: string | null
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
