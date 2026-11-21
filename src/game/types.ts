export type Condition = "Excellent" | "Good" | "Used" | "Damaged" | "Severely damaged";
export type Demand = "Low" | "Normal" | "High";
export type ActivityStatus = "travelling" | "processing";

export interface ItemDefinition {
  id: string;
  name: string;
  category: string;
  weight: number;
  baseValue: number;
  description: string;
}

export interface InventoryLot {
  id: string;
  itemId: string;
  quantity: number;
  condition: Condition;
  origin: string;
}

export interface Activity {
  id: string;
  kind: ActivityStatus;
  startedAt: number;
  completesAt: number;
  description: string;
  seed: number;
}

export interface LedgerEntry {
  id: string;
  time: number;
  kind: "sale" | "expense" | "note";
  amount: number;
  description: string;
}

export interface GameState {
  version: 1;
  day: number;
  minuteOfDay: number;
  speed: 0 | 1 | 2;
  cash: number;
  reputation: number;
  demand: Demand;
  inventory: InventoryLot[];
  activity: Activity | null;
  destinationReadyAt: number;
  vehicleCondition: number;
  ledger: LedgerEntry[];
  notifications: string[];
  nextId: number;
  randomSeed: number;
  tutorialStep: number;
}

export interface ActionResult {
  ok: boolean;
  message: string;
}