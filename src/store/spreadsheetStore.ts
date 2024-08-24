import { create } from 'zustand';

interface SpreadsheetState {
  cells: Record<string, string>;
  updateCell: (id: string, value: string) => void;
}

export const useSpreadsheetStore = create<SpreadsheetState>((set) => ({
  cells: {},
  updateCell: (id, value) =>
    set((state) => ({
      cells: { ...state.cells, [id]: value },
    })),
}));
