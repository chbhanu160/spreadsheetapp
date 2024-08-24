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
    const cell = cells[id] || { value: "", alignment, fontSize, isNumeric, isHighlighted: false };
  
    if (cell.isNumeric && isNaN(Number(value))) {
      return;
    }
  
    setCell(id, {
      ...cell,
      value,
      isHighlighted: !!searchQuery && value.includes(searchQuery),
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

    Object.entries(cells).forEach(([id, cell]) => {
      setCell(id, { ...cell, isHighlighted: !!query && cell.value.includes(query) });
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage * rowsPerPage < 1000) {
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
          backgroundColor: cell.isHighlighted ? 'yellow' : 'white',
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
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between mb-2">
          <div className="flex mb-2 md:mb-0 md:mr-2">
            <button onClick={undo} className="px-4 py-2 bg-blue-500 text-white rounded mr-2 text-sm sm:text-base">Undo</button>
            <button onClick={redo} className="px-4 py-2 bg-green-500 text-white rounded text-sm sm:text-base">Redo</button>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
            <div className="flex items-center">
              <label htmlFor="alignment" className="mr-2 text-sm sm:text-base">Alignment:</label>
              <select
                id="alignment"
                value={alignment}
                onChange={(e) => setAlignment(e.target.value as "left" | "center" | "right")}
                className="border p-1 rounded text-sm sm:text-base"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="fontSize" className="ml-4 mr-2 text-sm sm:text-base">Font Size:</label>
              <input
                id="fontSize"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                className="border p-1 rounded w-20 text-sm sm:text-base"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="isNumeric" className="ml-4 mr-2 text-sm sm:text-base">Numeric:</label>
              <input
                id="isNumeric"
                type="checkbox"
                checked={isNumeric}
                onChange={() => setIsNumeric(!isNumeric)}
                className="mr-2"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="border p-2 rounded w-full sm:w-64 text-sm sm:text-base"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-1">
          {renderGrid()}
        </div>
      </div>
      <div className="p-4 bg-gray-200 border-t flex flex-col md:flex-row items-center justify-between">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded mb-2 md:mb-0 text-sm sm:text-base"
        >
          Previous
        </button>
        <span className="text-sm sm:text-base">Page {page + 1} of {Math.ceil(1000 / rowsPerPage)}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={(page + 1) * rowsPerPage >= 1000}
          className="px-4 py-2 bg-blue-500 text-white rounded text-sm sm:text-base"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Spreadsheet;
