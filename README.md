# Booking Scheduler

## Problem Description

You are tasked with building a **room booking scheduler** that assigns booking queries to available rooms within a specified time range.

### Objective

Given:
- A list of booking queries (each with check-in and check-out dates)
- A list of rooms with their existing reservations
- A time window for scheduling

Your solver must:
1. Respect pre-assigned queries (queries with `assigned: true` and a valid `roomId` must remain unchanged)
2. Assign unassigned queries to available rooms (if possible)
3. Ensure no overlapping reservations for any room
4. Only schedule queries within the specified time range
5. Return results sorted by check-in date (ascending)

### Constraints

- Pre-assigned queries (with `assigned: true` and valid `roomId`) must not be modified and must be considered when scheduling other queries
- A room cannot have overlapping reservations
- Queries outside the scheduling window should not be assigned
- If a query cannot be scheduled, it remains unassigned

### Input/Output

See [`input-output-spec.md`](./input-output-spec.md) for detailed format specifications.

---

**Note:** Output must be sorted by check-in date.
