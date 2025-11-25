# Room Range Conflict Visualizer

A visual tool for managing and detecting conflicts in room booking time ranges. This application helps you visualize time slots assigned to different rooms and automatically highlights any overlapping bookings.

## Features

- **Visual Grid Display**: See all room bookings on an interactive timeline grid (0-1000 time units)
- **Conflict Detection**: Automatically identifies and highlights overlapping ranges in red
- **Interactive Management**: Add, delete individual ranges, or clear all at once
- **Real-time Validation**: Ensures all ranges are valid before adding
- **Scrollable View**: Horizontally scrollable grid to navigate the full 1000-unit timeline
- **Statistics Dashboard**: View total ranges, rooms, and conflict count

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - The app will be available at `http://localhost:5173/`
   - The terminal will display the URL after starting

## How to Use

### Adding Ranges

#### Option 1: Add Single Range

1. In the left panel under "Add Range":
   - Enter a **Room ID** (e.g., A, B, C)
   - Enter a **From** value (0-999)
   - Enter a **To** value (1-1000)
   - Click **Add Range** button

2. **Validation Rules:**
   - From must be less than To
   - From must be ≥ 0
   - To must be ≤ 1000
   - To must be ≥ 1

#### Option 2: Upload JSON File

1. Prepare a JSON file with the following schema:
   ```json
   [
     {
       "roomId": "A",
       "from": 1,
       "to": 5
     },
     {
       "roomId": "B",
       "from": 10,
       "to": 20
     }
   ]
   ```

2. Click **Upload JSON File** button in the "Upload JSON" section
3. Select your JSON file

**Important:** 
- All ranges in the file must be valid
- If even one range is invalid, no ranges will be added
- The app will show detailed error messages for any validation failures

### Viewing Ranges

- **Left Panel**: Lists all ranges with their room IDs and time slots
  - Green background: No conflicts
  - Red background: Has conflicts with other ranges in the same room

- **Right Panel**: Visual grid showing:
  - Room labels on the left
  - Time units (0-999) across the top
  - Colored bars representing each range
  - Teal bars: Valid ranges
  - Red bars: Conflicting ranges

### Managing Ranges

- **Delete Individual Range**: Click the trash icon on any range in the list
- **Delete All Ranges**: Click "Delete All" button at the top of the ranges list
- **Clear All**: Click "Clear All" button in the grid panel

### Understanding Conflicts

A conflict occurs when two or more ranges for the **same room** overlap in time. For example:
- Room A: [1, 5] and [3, 7] → **CONFLICT** (overlap at 3-5)
- Room A: [1, 3] and [3, 5] → **NO CONFLICT** (no overlap)
- Room A: [1, 5] and Room B: [2, 6] → **NO CONFLICT** (different rooms)

## Project Structure

```
visualizer/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## JSON File Schema

When uploading ranges via JSON file, use the following format:

```json
[
  {
    "roomId": "string",
    "from": number,
    "to": number
  }
]
```

**Field Descriptions:**
- `roomId` (string, required): Identifier for the room (e.g., "A", "B", "Room1")
- `from` (number, required): Start of the time range (0-999)
- `to` (number, required): End of the time range (1-1000)

**Validation Rules:**
- `from` must be less than `to`
- `0 ≤ from < to ≤ 1000`
- `to ≥ 1`
- All ranges in the file must be valid (all-or-nothing validation)

**Example:**
```json
[
  { "roomId": "A", "from": 0, "to": 5 },
  { "roomId": "A", "from": 10, "to": 15 },
  { "roomId": "B", "from": 3, "to": 8 },
  { "roomId": "C", "from": 100, "to": 200 }
]
```

See `src/defaultRanges.json` for a reference example.

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **PostCSS**: CSS processing

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Troubleshooting

- **Port already in use**: Stop the existing process or Vite will automatically use the next available port
- **Styles not loading**: Make sure Tailwind CSS is properly configured and PostCSS is running
- **Module errors**: Delete `node_modules/` and `package-lock.json`, then run `npm install` again
