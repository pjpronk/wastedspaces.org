export interface LocationDetails {
  address: string | null
  city: string
  type: LocationType
  vacantSince: Date
  latLng: {
    latitude: number
    longitude: number
  }
}

export enum LocationType {
  PRIVAAT,
  PUBLIEK,
  COMERCIEEL,
  ONBEKEND
}
