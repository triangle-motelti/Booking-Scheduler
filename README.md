# Booking Scheduler

## Problem Description

You are tasked with building a **room booking scheduler** that assigns booking queries to available rooms within a specified time range.

### Objective

Given:
- A list of booking queries (each with check-in and check-out dates)
- A list of rooms with their existing reservations
- A time window for scheduling

Your solver must:
1. Assign each query to an available room (if possible)
2. Ensure no overlapping reservations for any room
3. Only schedule queries within the specified time range
4. Return results sorted by check-in date (ascending)

### Constraints

- A room cannot have overlapping reservations
- Queries outside the scheduling window should not be assigned
- If a query cannot be scheduled, it remains unassigned

### Input/Output

See [`input-output-spec.md`](./input-output-spec.md) for detailed format specifications.

---

**Note:** Output must be sorted by check-in date.
