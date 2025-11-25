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

## Actionable Task List for Contributors

### Task 1: Enhance Test Coverage
Create comprehensive unit tests covering the following edge cases:

- [ ] **Adjacent bookings** - Test cases where one booking's checkout time equals another's check-in time
- [ ] **Nested intervals** - Bookings completely contained within other bookings
- [ ] **Overlapping intervals** - Partial overlaps between bookings
- [ ] **Single room, high demand** - More queries than available time slots
- [ ] **Multiple rooms, low demand** - Fewer queries than total capacity
- [ ] **Pre-assigned query preservation** - Verify fixed assignments remain unchanged
- [ ] **Invalid pre-assignments** - Queries with `assigned: true` but invalid/missing `roomId`
- [ ] **Queries outside time range** - Bookings that fall outside the scheduling window
- [ ] **Empty input** - No queries or no rooms
- [ ] **Same check-in/check-out times** - Multiple queries with identical time slots

### Task 2: Build Result Validator
Implement a standalone validation function that verifies:

- [ ] **No time collisions** - Ensure no overlapping reservations exist in any room
- [ ] **Pre-assignment respect** - Verify all pre-assigned queries remain unchanged
- [ ] **Room order priority** - Confirm rooms are filled in the order specified in the input
- [ ] **Maximized assignments** - Validate the solution assigns the maximum possible number of queries
- [ ] **Correct sorting** - Output queries are sorted by check-in date (ascending)
- [ ] **Valid assignments** - All assigned queries have valid `roomId` from the rooms list
- [ ] **Time range compliance** - All scheduled queries fall within the specified range

### Task 3: Performance Optimization
Benchmark and optimize the solution for:

- [ ] **Large datasets** - Test with 10,000+ queries and 1,000+ rooms
- [ ] **Time complexity analysis** - Document and optimize the algorithm's Big O notation
- [ ] **Memory efficiency** - Reduce memory footprint for large-scale operations
- [ ] **Parallel processing** - Explore concurrent scheduling opportunities

### Task 4: Additional Features
Enhance the scheduler with:

- [ ] **Priority levels** - Support query prioritization (VIP, regular, etc.)
- [ ] **Room preferences** - Allow queries to specify preferred rooms
- [ ] **Partial booking support** - Handle queries that can be split across multiple rooms
- [ ] **Conflict resolution strategies** - Implement different allocation algorithms (FIFO, shortest-first, etc.)
- [ ] **Visualization tool** - Create a web-based UI to visualize room occupancy (see `visualizer/` folder)