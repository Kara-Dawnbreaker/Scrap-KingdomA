import type { Condition, ItemDefinition } from "./types";

export const ITEMS: ItemDefinition[] = [
  { id: "mixed-scrap", name: "Mixed Scrap Bundle", category: "Mixed", weight: 20, baseValue: 35, description: "Unsorted material. Sorting may reveal more valuable stock." },
  { id: "iron", name: "Iron Scrap", category: "Metal", weight: 2, baseValue: 8, description: "Common iron pieces sold by weight." },
  { id: "steel", name: "Steel Offcuts", category: "Metal", weight: 3, baseValue: 15, description: "Useful steel pieces from industrial work." },
  { id: "copper", name: "Copper Wire", category: "Metal", weight: 1, baseValue: 32, description: "Valuable insulated and bare copper wire." },
  { id: "aluminium", name: "Aluminium Pieces", category: "Metal", weight: 2, baseValue: 11, description: "Lightweight non-ferrous scrap." },
  { id: "brass", name: "Brass Fittings", category: "Metal", weight: 1, baseValue: 24, description: "Small reusable fittings." },
  { id: "bearings", name: "Bearings", category: "Mechanical", weight: 1, baseValue: 22, description: "Reusable machine components." },
  { id: "gears", name: "Steel Gears", category: "Mechanical", weight: 2, baseValue: 18, description: "Worn gears with resale value." },
  { id: "motor", name: "Small Electric Motor", category: "Machinery", weight: 12, baseValue: 95, description: "A compact motor recovered from equipment." },
  { id: "circuit", name: "Circuit Board", category: "Electronics", weight: 0.2, baseValue: 45, description: "Recoverable electronic components." },
  { id: "power-supply", name: "Damaged Power Supply", category: "Electronics", weight: 3, baseValue: 28, description: "Damaged electrical equipment." },
  { id: "residue", name: "Low-grade Residue", category: "Residue", weight: 5, baseValue: 1, description: "Low-value leftovers from sorting." }
];

export const CONDITIONS: Condition[] = ["Excellent", "Good", "Used", "Damaged", "Severely damaged"];
export const CONDITION_MULTIPLIER: Record<Condition, number> = {
  Excellent: 1.15, Good: 1, Used: 0.85, Damaged: 0.55, "Severely damaged": 0.3
};
export const itemById = (id: string): ItemDefinition => {
  const item = ITEMS.find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown item: ${id}`);
  return item;
};
