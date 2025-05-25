# API Usage Guide

This document explains how to use the API functionality to interact with Google Cloud Functions.

## Setup

The API client is automatically configured as a Nuxt plugin and is available throughout the application via the `$api` global property.

### Configuration

Make sure your environment variables are set in your `.env` file:

```env
BACKEND_URL=https://your-cloud-function-url
# or for local development:
BACKEND_URL=http://localhost:5050/api
```

## Adding Locations

### Using the Composable (Recommended)

The easiest way to add locations is using the `useLocationApi` composable:

```vue
<script setup>
import { LocationType, LocationOwnership } from '~/types/types'

const { addLocation, isLoading, error, clearError } = useLocationApi()

const handleAddLocation = async () => {
  const result = await addLocation({
    address: '123 Main St',
    city: 'Amsterdam',
    type: LocationType.RESIDENTIAL,
    ownership: LocationOwnership.PRIVATE,
    vacatedSince: new Date('2023-01-01'),
    latLng: {
      latitude: 52.3676,
      longitude: 4.9041
    }
  })
  
  if (result) {
    console.log('Location added with ID:', result.id)
  } else {
    console.error('Failed to add location:', error.value)
  }
}
</script>
```

### Using the API Client Directly

You can also use the API client directly:

```vue
<script setup>
const { $api } = useNuxtApp()

const addLocationDirect = async () => {
  try {
    const result = await $api.location.addLocation({
      address: '123 Main St',
      city: 'Amsterdam',
      type: 'Woning',
      ownership: 'Particulier',
      vacatedSince: '2023-01-01T00:00:00.000Z',
      latLng: {
        latitude: 52.3676,
        longitude: 4.9041
      }
    })
    console.log('Success:', result)
  } catch (error) {
    console.error('Error:', error.message)
  }
}
</script>
```

## API Reference

### `useLocationApi()`

Returns an object with the following properties and methods:

- `addLocation(locationData)` - Adds a new location
- `isLoading` - Reactive boolean indicating if a request is in progress
- `error` - Reactive string containing the last error message (null if no error)
- `clearError()` - Clears the current error

### Location Data Types

#### `AddLocationRequest`
```typescript
interface AddLocationRequest {
  address: string
  city: string
  type: string // LocationType enum value
  ownership: string // LocationOwnership enum value
  vacatedSince: string // ISO date string
  latLng: {
    latitude: number
    longitude: number
  }
}
```

#### `AddLocationResponse`
```typescript
interface AddLocationResponse {
  result: string
  id: string
}
```

#### `LocationType` Enum
- `RESIDENTIAL` = 'Woning'
- `COMMERCIAL` = 'Commercieel'
- `INDUSTRIAL` = 'Industrieel'
- `OFFICE` = 'Kantoor'
- `PLOT` = 'Terrein'
- `OTHER` = 'Anders'

#### `LocationOwnership` Enum
- `PRIVATE` = 'Particulier'
- `ORGANIZATION` = 'Organisatie'
- `GOVERNMENT` = 'Overheid'
- `UNKNOWN` = 'Onbekend'

## Example Component

See `components/AddLocationForm.vue` for a complete example of how to create a form that uses the API to add locations.

## Error Handling

The API client automatically handles HTTP errors and provides meaningful error messages. Always check for errors when using the API:

```vue
<script setup>
const { addLocation, error } = useLocationApi()

const result = await addLocation(locationData)

if (!result && error.value) {
  // Handle error
  console.error('Failed to add location:', error.value)
}
</script>
```

## Development

For local development, make sure your Google Cloud Functions are running locally or update the `BACKEND_URL` to point to your deployed functions. 