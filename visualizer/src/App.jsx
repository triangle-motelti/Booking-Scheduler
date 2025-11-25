import React, { useState, useRef } from 'react';
import { Trash2, Plus, AlertCircle, Upload } from 'lucide-react';
import defaultRanges from './defaultRanges.json';

export default function RoomRangeVisualizer() {
  const [ranges, setRanges] = useState(defaultRanges);
  const [newRange, setNewRange] = useState({ roomId: '', from: '', to: '' });
  const fileInputRef = useRef(null);

  const colors = {
    normal: '#4ECDC4',
    conflict: '#EF4444'
  };

  const maxX = 1000;
  const cellSize = 60;

  const hasOverlap = (range1, range2) => {
    return range1.from < range2.to && range1.to > range2.from;
  };

  const findConflicts = (roomId) => {
    const roomRanges = ranges.filter(r => r.roomId === roomId);
    const conflicts = new Set();
    
    for (let i = 0; i < roomRanges.length; i++) {
      for (let j = i + 1; j < roomRanges.length; j++) {
        if (hasOverlap(roomRanges[i], roomRanges[j])) {
          conflicts.add(roomRanges[i].id);
          conflicts.add(roomRanges[j].id);
        }
      }
    }
    
    return conflicts;
  };

  const handleAddRange = () => {
    if (!newRange.roomId || !newRange.from || !newRange.to) {
      alert('Please fill all fields');
      return;
    }
    
    const from = parseInt(newRange.from);
    const to = parseInt(newRange.to);
    
    if (from >= to || from < 0 || to > maxX || to < 1) {
      alert(`Invalid range. Must be: 0 ≤ from < to ≤ ${maxX}`);
      return;
    }

    const newId = Math.max(...ranges.map(r => r.id), 0) + 1;
    setRanges([...ranges, { id: newId, roomId: newRange.roomId.toUpperCase(), from, to }]);
    setNewRange({ roomId: '', from: '', to: '' });
  };

  const handleDeleteRange = (id) => {
    setRanges(ranges.filter(r => r.id !== id));
  };

  const handleClear = () => {
    setRanges([]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const uploadedRanges = JSON.parse(e.target.result);
        
        // Validate the uploaded data
        if (!Array.isArray(uploadedRanges)) {
          alert('Invalid file format. Expected an array of ranges.');
          return;
        }

        if (uploadedRanges.length === 0) {
          alert('File contains no ranges.');
          return;
        }

        // Validate ALL ranges first - if any is invalid, reject the entire file
        const errors = [];
        for (let i = 0; i < uploadedRanges.length; i++) {
          const range = uploadedRanges[i];
          
          if (!range.roomId || range.from === undefined || range.to === undefined) {
            errors.push(`Range at index ${i}: Missing required fields (roomId, from, to). Found: ${JSON.stringify(range)}`);
            continue;
          }

          const from = parseInt(range.from);
          const to = parseInt(range.to);

          if (isNaN(from) || isNaN(to)) {
            errors.push(`Range at index ${i}: 'from' and 'to' must be numbers. Found: from=${range.from}, to=${range.to}`);
            continue;
          }

          if (from >= to) {
            errors.push(`Range at index ${i}: 'from' must be less than 'to'. Found: from=${from}, to=${to}`);
            continue;
          }

          if (from < 0) {
            errors.push(`Range at index ${i}: 'from' must be >= 0. Found: ${from}`);
            continue;
          }

          if (to > maxX) {
            errors.push(`Range at index ${i}: 'to' must be <= ${maxX}. Found: ${to}`);
            continue;
          }

          if (to < 1) {
            errors.push(`Range at index ${i}: 'to' must be >= 1. Found: ${to}`);
            continue;
          }
        }

        // If there are ANY errors, reject the entire upload
        if (errors.length > 0) {
          alert(`Validation failed! No ranges were added.\n\nErrors found:\n${errors.join('\n')}`);
          return;
        }

        // All ranges are valid - now add them
        const validRanges = [];
        let maxId = Math.max(...ranges.map(r => r.id), 0);
        
        for (const range of uploadedRanges) {
          maxId++;
          validRanges.push({
            id: maxId,
            roomId: range.roomId.toUpperCase(),
            from: parseInt(range.from),
            to: parseInt(range.to)
          });
        }

        setRanges([...ranges, ...validRanges]);
        alert(`Successfully added ${validRanges.length} range(s)!`);
      } catch (error) {
        alert(`Error parsing JSON file: ${error.message}\n\nPlease ensure it's a valid JSON format.`);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = null;
  };

  const uniqueRooms = [...new Set(ranges.map(r => r.roomId))].sort();

  const renderRoomRow = (roomId) => {
    const roomRanges = ranges.filter(r => r.roomId === roomId);
    const conflicts = findConflicts(roomId);
    const hasConflicts = conflicts.size > 0;

    return (
      <div key={roomId} className="flex relative mb-4">
        <div
          className={`flex items-center justify-center font-bold text-white border-r-2 flex-shrink-0 ${
            hasConflicts ? 'bg-red-500 border-red-600' : 'bg-indigo-500 border-indigo-600'
          }`}
          style={{ width: '100px', minHeight: '80px' }}
        >
          <div className="text-center">
            <div className="text-2xl">Room {roomId}</div>
            {hasConflicts && (
              <div className="text-xs mt-1 flex items-center justify-center gap-1">
                <AlertCircle size={12} /> Conflicts
              </div>
            )}
          </div>
        </div>
        
        <div className="flex relative flex-1 border-2 border-gray-300 bg-gray-50" style={{ minHeight: '80px' }}>
          {/* Grid background */}
          {Array.from({ length: maxX }).map((_, i) => (
            <div
              key={i}
              className="border-r border-gray-300 flex-shrink-0"
              style={{ width: cellSize }}
            />
          ))}
          
          {/* Ranges */}
          {roomRanges.map((range, index) => {
            const isConflict = conflicts.has(range.id);
            const rangeWidth = (range.to - range.from) * cellSize;
            const rangeLeft = range.from * cellSize;
            const topOffset = 10 + (index * 20) % 40;
            
            return (
              <div
                key={range.id}
                className="absolute flex items-center justify-center text-white font-semibold rounded shadow-md"
                style={{
                  left: `${rangeLeft}px`,
                  top: `${topOffset}px`,
                  width: `${rangeWidth}px`,
                  height: '25px',
                  backgroundColor: isConflict ? colors.conflict : colors.normal,
                  zIndex: isConflict ? 10 : 5,
                }}
              >
                <span className="text-sm">[{range.from}, {range.to}]</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const totalConflicts = uniqueRooms.reduce((sum, roomId) => 
    sum + findConflicts(roomId).size, 0
  ) / 2; // Divide by 2 because each conflict is counted twice

  return (
    <>
      {/* Mobile/Small Screen Warning */}
      <div className="block lg:hidden min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center">
          <AlertCircle size={64} className="text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Screen Too Small</h1>
          <p className="text-gray-600 mb-4">
            This application requires a larger screen to function properly.
          </p>
          <p className="text-gray-600 mb-4">
            Please use a desktop or laptop computer, or rotate your tablet to landscape mode.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-left">
            <p className="font-semibold text-gray-700 mb-2">Minimum Requirements:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Screen width: 1024px or larger</li>
              <li>Desktop or laptop recommended</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main App - Hidden on small screens */}
      <div className="hidden lg:block p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Room Range Conflict Visualizer</h1>
        <p className="text-gray-600 mb-6">Visualize time ranges assigned to rooms. Conflicts are shown in red.</p>

      <div className="grid grid-cols-4 gap-6">
        {/* Left Panel - Input and Ranges */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Add Range</h2>
            <div className="space-y-2 mb-2">
              <input
                type="text"
                placeholder="Room ID (e.g., A)"
                value={newRange.roomId}
                onChange={(e) => setNewRange({...newRange, roomId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                min="0"
                max={maxX}
                placeholder="From"
                value={newRange.from}
                onChange={(e) => setNewRange({...newRange, from: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                min="0"
                max={maxX}
                placeholder="To"
                value={newRange.to}
                onChange={(e) => setNewRange({...newRange, to: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <button
              onClick={handleAddRange}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded font-semibold flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Range
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Upload JSON</h2>
            <p className="text-xs text-gray-600 mb-2">Upload a JSON file with an array of ranges to add multiple ranges at once.</p>
            <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3 text-xs">
              <p className="font-semibold text-gray-700 mb-1">Schema:</p>
              <pre className="text-gray-600 overflow-x-auto">{`[
  {
    "roomId": "string",
    "from": number,
    "to": number
  }
]`}</pre>
              <p className="text-gray-600 mt-2"><strong>Rules:</strong></p>
              <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                <li>0 ≤ from &lt; to ≤ 1000</li>
                <li>to ≥ 1</li>
                <li>All ranges must be valid</li>
              </ul>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold flex items-center justify-center gap-2"
            >
              <Upload size={18} /> Upload JSON File
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700">All Ranges ({ranges.length})</h2>
              {ranges.length > 0 && (
                <button
                  onClick={handleClear}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold"
                >
                  Delete All
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {ranges.map(range => {
                const conflicts = findConflicts(range.roomId);
                const isConflict = conflicts.has(range.id);
                
                return (
                  <div
                    key={range.id}
                    className={`p-3 rounded flex justify-between items-center ${
                      isConflict ? 'bg-red-100 border-2 border-red-300' : 'bg-teal-100 border-2 border-teal-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-gray-800">
                        Room {range.roomId}
                      </div>
                      <div className="text-xs text-gray-600">
                        [{range.from}, {range.to}]
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRange(range.id)}
                      className="text-gray-600 hover:bg-gray-200 p-1 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - Grid */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Rooms & Ranges</h2>
              <button
                onClick={handleClear}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="overflow-x-auto max-w-full">
              {/* X-axis labels */}
              <div className="flex mb-2">
                <div style={{ width: '100px' }} className="flex-shrink-0" />
                <div className="flex border-2 border-gray-400 border-b-0">
                  {Array.from({ length: maxX }).map((_, i) => (
                    <div
                      key={i}
                      className="text-center font-semibold text-gray-700 text-sm border-r border-gray-300 bg-gray-100"
                      style={{ width: cellSize }}
                    >
                      {i}
                    </div>
                  ))}
                </div>
              </div>

              {/* Room rows */}
              <div className="space-y-0">
                {uniqueRooms.length > 0 ? (
                  uniqueRooms.map(roomId => renderRoomRow(roomId))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    No ranges added yet. Add a range to get started.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`mt-4 p-4 rounded-lg text-sm ${
            totalConflicts > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {totalConflicts > 0 ? <AlertCircle size={18} /> : null}
              <p className="font-semibold">
                {totalConflicts > 0 
                  ? `⚠️ ${totalConflicts} Conflict${totalConflicts > 1 ? 's' : ''} Detected!`
                  : '✓ No Conflicts - All ranges are valid'}
              </p>
            </div>
            <p><strong>Total Ranges:</strong> {ranges.length}</p>
            <p><strong>Rooms:</strong> {uniqueRooms.length}</p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
            <p className="font-semibold mb-2">Legend:</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-teal-500 rounded"></div>
                <span>Valid Range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-500 rounded"></div>
                <span>Conflicting Range</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
