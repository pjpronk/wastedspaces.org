# WastedSpaces Firebase Functions

This directory contains the Firebase Cloud Functions for the WastedSpaces project.

## Testing Firebase Functions

The project uses Jest for testing Firebase Cloud Functions.

### Prerequisites

- Node.js (version 22 as specified in package.json)
- Yarn

### Running Tests

1. Install dependencies:
   ```bash
   cd backend/functions
   yarn install
   ```

2. Run the tests:
   ```bash
   yarn test
   ```

3. Run tests in watch mode (for development):
   ```bash
   yarn test:watch
   ```

### Test Structure

Tests are located in the `src/__tests__` directory, with each test file named after the function it tests (e.g., `addLocation.test.ts`).

The tests use:
- `firebase-functions-test` to wrap and test Cloud Functions
- Jest mocks to mock Firebase services (Firestore, etc.)

### Test Coverage

The test configuration includes coverage reporting. After running tests, a coverage report is generated in the `coverage` directory.

## Function Overview

- `addLocation`: HTTP endpoint for adding a new vacant location to the database
  - Validates required fields
  - Checks for valid enums (location type, ownership)
  - Creates Firestore GeoPoint from latitude/longitude
  - Adds timestamps
  - Stores the location in Firestore

## Troubleshooting

If you encounter any issues with tests:

1. Make sure all dependencies are installed:
   ```bash
   yarn install
   ```

2. Check for TypeScript errors:
   ```bash
   yarn build
   ```

3. Check for linting errors:
   ```bash
   yarn lint
   ``` 