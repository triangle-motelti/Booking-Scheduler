# Booking Scheduler - Input/Output Specification

This document describes the input and output format for the booking scheduler solver.

The solver must assign booking queries to available rooms within a specified time range.

---

## Input Format

```json
{
  // Array of booking queries that need to be scheduled
  "queries": [
    {
      "id": "string | number",              // Unique identifier for the query
      "checkIn": "ISO 8601 date string",    // Check-in date (e.g., "2025-11-24T14:00:00Z")
      "checkOut": "ISO 8601 date string",   // Check-out date (e.g., "2025-11-26T10:00:00Z")
      "assigned": false,                    // Boolean: whether query has been assigned to a room
      "roomId": null                        // Room ID if assigned, null otherwise
    }
  ],
  
  // Array of available room IDs
  "rooms": [
    "room101",                              // Room ID (string or number)
    "room102",
    "room103"
  ],
  
  // Time window for scheduling (queries outside this range should not be scheduled)
  "range": {
    "from": "ISO 8601 date string",         // Start of scheduling window
    "to": "ISO 8601 date string"            // End of scheduling window
  }
}
```

### Input Field Descriptions

**`queries`** (array): List of booking requests that need to be scheduled
- **`id`**: Unique identifier for the query (string or number)
- **`checkIn`**: Check-in date in ISO 8601 format (e.g., `"2025-11-24T14:00:00Z"`)
- **`checkOut`**: Check-out date in ISO 8601 format (e.g., `"2025-11-26T10:00:00Z"`)
- **`assigned`**: Boolean indicating if the query has been assigned to a room (initially `false`)
- **`roomId`**: ID of assigned room, or `null` if not assigned

**`rooms`** (array): List of available room IDs (string or number). The reserved slots for each room will be constructed from the queries that have been assigned to that room.

**`range`** (object): Time window for scheduling
- **`from`**: Start of scheduling window (ISO 8601 format)
- **`to`**: End of scheduling window (ISO 8601 format)

---

## Output Format

The output has the same structure as the input with the following changes:

### Requirements

1. **Queries Assignment**: Each query in the `queries` array should have:
   - `assigned`: Set to `true` if successfully scheduled
   - `roomId`: Set to the ID of the assigned room (if successfully scheduled)

2. **Sorting**: The `queries` array **MUST** be sorted by `checkIn` date in ascending order

### Example Output

```json
{
  "queries": [
    {
      "id": "q1",
      "checkIn": "2025-11-24T14:00:00Z",
      "checkOut": "2025-11-26T10:00:00Z",
      "assigned": true,                     // Changed to true
      "roomId": "room101"                   // Assigned room ID
    },
    {
      "id": "q2",
      "checkIn": "2025-11-27T14:00:00Z",
      "checkOut": "2025-11-29T10:00:00Z",
      "assigned": false,                    // Could not be scheduled
      "roomId": null                        // Remains null
    }
  ],
  "rooms": [
    "room101",
    "room102",
    "room103"
  ],
  "range": {
    "from": "2025-11-24T00:00:00Z",
    "to": "2025-12-31T23:59:59Z"
  }
}
```

---

## Notes

- Queries outside the `range` window should not be scheduled
- A room can only have one reservation at a time (no overlapping reservations)
- If a query cannot be scheduled, it should remain with `assigned: false` and `roomId: null`
- All dates must be in ISO 8601 format for consistency
