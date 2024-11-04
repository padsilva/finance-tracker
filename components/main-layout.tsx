"use client";

import { useBearStore } from "@/stores/useBearStore";
import { useStore } from "zustand";

export const MainLayout: React.FC = () => {
  const { addABear, bears } = useStore(useBearStore, (state) => state);

  return (
    <main>
      <h1>BEARS: {bears}</h1>
      <button onClick={addABear}>one up</button>
    </main>
  );
};
