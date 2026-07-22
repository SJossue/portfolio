import { create } from 'zustand';

interface GarageSelectionState {
  selectedId: string | null;
  select: (id: string | null) => void;
}

/** Which garage project is selected (null = overview). Lives in a store rather than
 *  component state so the server-rendered card/nav triggers can select a project
 *  directly, without threading a callback prop across the server/client boundary. */
export const useGarageSelection = create<GarageSelectionState>((set) => ({
  selectedId: null,
  select: (id) => set({ selectedId: id }),
}));
