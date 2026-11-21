import type { GameState, InventoryLot } from "./types";

export function createNewGame(): GameState {
  return {
    version: 1,
    day: 1,
    minuteOfDay: 8 * 60,
    minuteRemainder: 0,
    speed: 1,
    cash: 1200,
    reputation: 0,
    demand: "Normal",
    inventory: [
      lot("mixed-scrap", 2, "Used", "Starting stock"),
      lot("iron", 10, "Used", "Starting stock"),
      lot("steel", 4, "Used", "Starting stock"),
      lot("bearings", 2, "Good", "Starting stock")
    ],
    activity: null,
    destinationReadyAt: 0,
    vehicleCondition: 100,
    ledger: [{ id: "entry-0", time: 480, kind: "note", amount: 0, description: "The Roadside Yard opened for business." }],
    notifications: ["Welcome to the yard. Inspect your stock, then decide whether to sort, sell, or send an expedition."],
    nextId: 1,
    randomSeed: 872341,
    tutorialStep: 0
  };
}

function lot(itemId: string, quantity: number, condition: InventoryLot["condition"], origin: string): InventoryLot {
  return { id: `lot-${itemId}-${origin.replaceAll(" ", "-")}`, itemId, quantity, condition, origin };
}

export function totalWeight(state: GameState): number {
  return state.inventory.reduce((sum, lotEntry) => sum + lotEntry.quantity * itemWeight(lotEntry.itemId), 0);
}

function itemWeight(itemId: string): number {
  const weights: Record<string, number> = {
    "mixed-scrap": 20, iron: 2, steel: 3, copper: 1, aluminium: 2, brass: 1,
    bearings: 1, gears: 2, motor: 12, circuit: 0.2, "power-supply": 3, residue: 5
  };
  return weights[itemId] ?? 0;
}
