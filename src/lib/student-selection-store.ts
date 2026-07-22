import { create } from 'zustand';

interface StudentSelectionState {
  selectedId: string | null;
  select: (id: string | null) => void;
}

/** Which research paper is selected (null = overview). Lives in a store rather
 *  than component state so the server-rendered paper cards can select a paper
 *  directly, without threading a callback prop across the server/client
 *  boundary. Mirrors garage-selection-store.ts. */
export const useStudentSelection = create<StudentSelectionState>((set) => ({
  selectedId: null,
  select: (id) => set({ selectedId: id }),
}));
