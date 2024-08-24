"use client";

import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { create } from "zustand";

interface Cell {
  value: string;
  alignment: "left" | "center" | "right";
  fontSize: number;
  isNumeric: boolean;
  isHighlighted: boolean;
}

interface SpreadsheetState {
  cells: Record<string, Cell>;
  setCell: (id: string, cell: Cell) => void;
  undo: () => void;
  redo: () => void;
  addToHistory: () => void;
  history: Record<string, Cell>[];
  historyIndex: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const useSpreadsheetStore = create<SpreadsheetState>((set, get) => ({
  cells: {},
  setCell: (id, cell) => {
    const { cells } = get();
    set({ cells: { ...cells, [id]: cell } });
    get().addToHistory();
  },
  history: [],
  historyIndex: -1,
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      set({
        cells: history[historyIndex - 1],
        historyIndex: historyIndex - 1,
      });
    }
  },
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({
        cells: history[historyIndex + 1],
        historyIndex: historyIndex + 1,
      });
    }
  },
  addToHistory: () => {
    const { cells, history, historyIndex } = get();
    set({
      history: [...history.slice(0, historyIndex + 1), { ...cells }],
      historyIndex: historyIndex + 1,
    });
  },
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

const Spreadsheet: React.FC = () => {
  const {
    cells,
    setCell,
    undo,
    redo,
    searchQuery,
    setSearchQuery,
  } = useSpreadsheetStore();
  const [fontSize, setFontSize] = useState<number>(16);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left");
  const [isNumeric, setIsNumeric] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage] = useState<number>(100);  // Adjust this as needed for the number of rows per "sheet"
  const [search, setSearch] = useState<string>("");

  const handleInputChange = (id: string, value: string) => {
    // Retrieve the current cell state or initialize a new one if it doesn't exist
    const cell = cells[id] || { value: "", alignment, fontSize, isNumeric, isHighlighted: false };
  
    // Check if the cell is supposed to be numeric and if the input value is not a number
    if (cell.isNumeric && isNaN(Number(value))) {
      return; // Exit the function without updating if the input is not a valid number
    }
  
    // Update the cell with the new value and compute if it should be highlighted
    setCell(id, {
      ...cell,
      value,
      isHighlighted: !!searchQuery && value.includes(searchQuery), // Ensure isHighlighted is always boolean
    });
  };
  

  const handleFormatChange = (id: string) => {
    const cell = cells[id] || { value: "", alignment, fontSize, isNumeric, isHighlighted: false };
    setCell(id, { ...cell, alignment, fontSize });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    setSearchQuery(query);

    // Highlight matching cells
    Object.entries(cells).forEach(([id, cell]) => {
        setCell(id, { ...cell, isHighlighted: !!query && cell.value.includes(query) });
    });
};


  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage * rowsPerPage < 1000) { // Assuming a grid of 1000 cells, adjust if needed
      setPage(newPage);
    }
  };

  const renderCell = (id: string) => {
    const cell = cells[id] || { value: "", alignment: "left", fontSize: 16, isNumeric: false, isHighlighted: false };
    return (
      <textarea
        key={id}
        value={cell.value}
        onChange={(e) => handleInputChange(id, e.target.value)}
        onFocus={() => handleFormatChange(id)}
        style={{
          textAlign: cell.alignment,
          fontSize: `${cell.fontSize}px`,
          border: '1px solid #ddd',
          padding: '8px',
          boxSizing: 'border-box',
          minHeight: '40px',
          backgroundColor: cell.isHighlighted ? 'yellow' : 'white',  // Highlight cell if matches search
        }}
        className="resize-none"
        onKeyPress={(e: KeyboardEvent) => {
          if (cell.isNumeric && !/[\d]/.test(e.key)) {
            e.preventDefault();
          }
        }}
      />
    );
  };

  const renderGrid = () => {
    const startIdx = page * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    const cellsArray = Array.from({ length: 1000 }, (_, i) => `cell-${i}`);
    return cellsArray.slice(startIdx, endIdx).map((id) => (
      <div className="p-1" key={id}>
        {renderCell(id)}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-gray-200 border-b flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <button onClick={undo} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">Undo</button>
            <button onClick={redo} className="px-4 py-2 bg-green-500 text-white rounded">Redo</button>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="alignment" className="mr-2">Alignment:</label>
            <select
              id="alignment"
              value={alignment}
              onChange={(e) => setAlignment(e.target.value as "left" | "center" | "right")}
              className="border p-1 rounded"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            <label htmlFor="fontSize" className="ml-4 mr-2">Font Size:</label>
            <input
              id="fontSize"
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              className="border p-1 rounded w-20"
            />
            <label htmlFor="isNumeric" className="ml-4 mr-2">Numeric:</label>
            <input
              id="isNumeric"
              type="checkbox"
              checked={isNumeric}
              onChange={() => setIsNumeric(!isNumeric)}
              className="mr-2"
            />
          </div>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="border p-2 rounded w-64"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-10 gap-1">
          {renderGrid()}
        </div>
      </div>
      <div className="p-4 bg-gray-200 border-t flex items-center justify-between">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Previous
        </button>
        <span>Page {page + 1} of {Math.ceil(1000 / rowsPerPage)}</span>  {/* Adjust as needed */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={(page + 1) * rowsPerPage >= 1000}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Spreadsheet;
