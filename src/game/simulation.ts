import { CONDITIONS, CONDITION_MULTIPLIER, ITEMS, itemById } from "./content";
import { createNewGame } from "./state";
import type { ActionResult, Condition, GameState, InventoryLot } from "./types";

export const STORAGE_CAPACITY = 500;
export const VAN_CAPACITY = 250;
export const EXPEDITION_COST = 90;
export const EXPEDITION_DURATION = 120;
export const SORT_DURATION = 30;

export function cloneState(state: GameState): GameState {
  return structuredClone(state);
}

function result(ok: boolean, message: string): ActionResult {
  return { ok, message };
}

function nextId(state: GameState, prefix: string): string {
  return `${prefix}-${state.nextId++}`;
}

function notify(state: GameState, message: string): void {
  state.notifications.unshift(message);
  state.notifications = state.notifications.slice(0, 12);
}

function ledger(state: GameState, kind: "sale" | "expense" | "note", amount: number, description: string): void {
  state.ledger.unshift({ id: nextId(state, "ledger"), time: absoluteMinutes(state), kind, amount, description });
}

export function absoluteMinutes(state: GameState): number {
  return (state.day - 1) * 1440 + state.minuteOfDay;
}

export function formatGameTime(state: GameState): string {
  const hours = Math.floor(state.minuteOfDay / 60).toString().padStart(2, "0");
  const minutes = (state.minuteOfDay % 60).toString().padStart(2, "0");
  return `Day ${state.day} · ${hours}:${minutes}`;
}

export function inventoryWeight(state: GameState): number {
  return state.inventory.reduce((sum, lot) => sum + lot.quantity * itemById(lot.itemId).weight, 0);
}

export function inventoryValue(state: GameState): number {
  return state.inventory.reduce((sum, lot) => sum + lot.quantity * itemById(lot.itemId).baseValue * CONDITION_MULTIPLIER[lot.condition], 0);
}

export function buyerPrice(state: GameState, lot: InventoryLot): number {
  const demand = state.demand === "Low" ? 0.85 : state.demand === "High" ? 1.15 : 1;
  return Math.max(0, Math.round(itemById(lot.itemId).baseValue * CONDITION_MULTIPLIER[lot.condition] * 0.9 * demand));
}

export function addInventory(state: GameState, itemId: string, quantity: number, condition: Condition, origin: string): void {
  if (quantity <= 0) return;
  const existing = state.inventory.find((lot) => lot.itemId === itemId && lot.condition === condition && lot.origin === origin);
  if (existing) existing.quantity += quantity;
  else state.inventory.push({ id: nextId(state, "lot"), itemId, quantity, condition, origin });
}

export function startExpedition(state: GameState): ActionResult {
  if (state.activity) return result(false, "The crew is already busy.");
  if (absoluteMinutes(state) < state.destinationReadyAt) return result(false, "The warehouse is still being picked over. Let it recover first.");
  if (state.cash < EXPEDITION_COST) return result(false, "Not enough cash. The expedition costs 90 CR.");
  if (state.vehicleCondition < 20) return result(false, "The van needs attention before another expedition.");
  state.cash -= EXPEDITION_COST;
  ledger(state, "expense", -EXPEDITION_COST, "Warehouse expedition dispatch");
  state.activity = {
    id: nextId(state, "expedition"), kind: "travelling", startedAt: absoluteMinutes(state),
    completesAt: absoluteMinutes(state) + EXPEDITION_DURATION, description: "Abandoned Warehouse expedition", seed: state.randomSeed
  };
  state.randomSeed = (state.randomSeed * 48271) % 2147483647;
  state.destinationReadyAt = absoluteMinutes(state) + 240;
  notify(state, "Expedition dispatched. The van is heading to the abandoned warehouse.");
  return result(true, "Expedition dispatched. Expected return in 2 in-game hours.");
}

function random(seed: number): number {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  value = (value * 16807) % 2147483647;
  return value / 2147483647;
}

function resolveExpedition(state: GameState, seed: number): void {
  const roll = random(seed);
  const eventRoll = random(seed + 97);
  let delay = 0;
  let event = "The crew found the warehouse accessible and recovered ordinary salvage.";
  let condition: Condition = "Used";
  if (eventRoll < 0.14) {
    delay = 30;
    event = "Blocked access slowed the crew. They found less than expected.";
  } else if (eventRoll < 0.27) {
    condition = "Damaged";
    event = "Some fragile stock was damaged during loading.";
  } else if (eventRoll < 0.38) {
    event = "A useful find: the crew uncovered a small cache of reusable components.";
  } else if (eventRoll < 0.48) {
    state.vehicleCondition = Math.max(20, state.vehicleCondition - 8);
    event = "The van had trouble on the return road. Vehicle condition decreased by 8%.";
  }

  const loot: Array<[string, number]> = [
    ["iron", 3 + Math.floor(roll * 4)],
    ["steel", 1 + Math.floor(random(seed + 1) * 3)],
    ["bearings", Math.floor(random(seed + 2) * 3)],
    ["aluminium", Math.floor(random(seed + 3) * 3)],
    ["copper", random(seed + 4) > 0.72 ? 1 + Math.floor(random(seed + 5) * 2) : 0],
    ["circuit", random(seed + 6) > 0.83 ? 1 + Math.floor(random(seed + 7) * 3) : 0],
    ["motor", random(seed + 8) > 0.9 ? 1 : 0]
  ];
  if (eventRoll < 0.14) for (const entry of loot) entry[1] = Math.floor(entry[1] * 0.6);
  if (eventRoll >= 0.38 && eventRoll < 0.48) for (const entry of loot) entry[1] = Math.floor(entry[1] * 0.75);
  if (eventRoll >= 0.27 && eventRoll < 0.38) loot.push(["brass", 1 + Math.floor(random(seed + 9) * 2)]);

  const total = loot.reduce((sum, [id, qty]) => sum + itemById(id).weight * qty, 0);
  const factor = total > VAN_CAPACITY ? VAN_CAPACITY / total : 1;
  for (const [id, qty] of loot) addInventory(state, id, Math.floor(qty * factor), condition, "Warehouse expedition");
  state.vehicleCondition = Math.max(0, state.vehicleCondition - 2);
  const recovered = loot.reduce((sum, [id, qty]) => sum + itemById(id).weight * Math.floor(qty * factor), 0);
  notify(state, `${event} Cargo recovered: ${recovered.toFixed(1)} kg.`);
  ledger(state, "note", 0, `Expedition report: ${event}`);
  if (delay > 0) state.activity = { id: nextId(state, "return"), kind: "travelling", startedAt: absoluteMinutes(state), completesAt: absoluteMinutes(state) + delay, description: "Delayed return to yard", seed: 0 };
  else state.activity = null;
}

function resolveSorting(state: GameState, seed: number): void {
  const roll = random(seed);
  let iron = 2 + Math.floor(roll * 3);
  let steel = 1 + Math.floor(random(seed + 1) * 2);
  let residue = random(seed + 2) > 0.5 ? 1 : 0;
  while (iron * 2 + steel * 3 + residue * 5 > 20) {
    if (residue) residue = 0;
    else if (steel > 1) steel--;
    else iron--;
  }
  addInventory(state, "iron", iron, "Used", "Sorted mixed scrap");
  addInventory(state, "steel", steel, "Used", "Sorted mixed scrap");
  addInventory(state, "residue", residue, "Used", "Sorting by-product");
  const outputWeight = iron * 2 + steel * 3 + residue * 5;
  notify(state, `Sorting complete: ${iron} Iron Scrap, ${steel} Steel Offcuts, ${residue} Residue. ${(20 - outputWeight).toFixed(1)} kg recorded as process loss.`);
  ledger(state, "note", 0, `Sorted 1 Mixed Scrap Bundle; process loss ${(20 - outputWeight).toFixed(1)} kg`);
  state.activity = null;
}

export function startSorting(state: GameState, lotId: string): ActionResult {
  if (state.activity) return result(false, "Finish the current activity first.");
  const lot = state.inventory.find((entry) => entry.id === lotId && entry.itemId === "mixed-scrap" && entry.quantity > 0);
  if (!lot) return result(false, "No available mixed scrap bundle to sort.");
  if (inventoryWeight(state) > STORAGE_CAPACITY) return result(false, "Storage is over capacity.");
  lot.quantity--;
  if (lot.quantity === 0) state.inventory = state.inventory.filter((entry) => entry.id !== lotId);
  state.activity = {
    id: nextId(state, "sorting"), kind: "processing", startedAt: absoluteMinutes(state),
    completesAt: absoluteMinutes(state) + SORT_DURATION, description: "Basic mixed scrap sorting", seed: state.randomSeed
  };
  state.randomSeed = (state.randomSeed * 48271) % 2147483647;
  notify(state, "Sorting started. One mixed bundle has been committed to the station.");
  return result(true, "Sorting started. It will finish in 30 in-game minutes.");
}

export function sellLot(state: GameState, lotId: string, quantity: number): ActionResult {
  const lot = state.inventory.find((entry) => entry.id === lotId);
  if (!lot || !Number.isInteger(quantity) || quantity <= 0 || quantity > lot.quantity) return result(false, "That quantity is not available.");
  const unitPrice = buyerPrice(state, lot);
  const total = unitPrice * quantity;
  lot.quantity -= quantity;
  if (lot.quantity === 0) state.inventory = state.inventory.filter((entry) => entry.id !== lotId);
  state.cash += total;
  state.reputation = Math.min(100, state.reputation + Math.max(1, Math.floor(total / 100)));
  ledger(state, "sale", total, `Sold ${quantity} × ${itemById(lot.itemId).name}`);
  notify(state, `Sale completed: +${total} CR.`);
  return result(true, `Sold ${quantity} unit(s) for ${total} CR.`);
}

export function advanceTime(state: GameState, realSeconds: number): void {
  if (state.speed === 0 || !state.activity || realSeconds <= 0) return;
  const previous = absoluteMinutes(state);
  const minutesToAdvance = realSeconds * state.speed;
  const next = previous + minutesToAdvance;
  state.day = Math.floor(next / 1440) + 1;
  state.minuteOfDay = Math.floor(next % 1440);
  const activity = state.activity;
  if (activity && absoluteMinutes(state) >= activity.completesAt) {
    if (activity.kind === "processing") resolveSorting(state, activity.seed);
    else if (activity.description === "Delayed return to yard") {
      state.activity = null;
      notify(state, "The van returned to the yard after the delay.");
    } else resolveExpedition(state, activity.seed);
  }
}

export function setSpeed(state: GameState, speed: 0 | 1 | 2): void {
  state.speed = speed;
}

export function changeDemand(state: GameState): void {
  const sequence = ["Low", "Normal", "High"] as const;
  state.demand = sequence[(sequence.indexOf(state.demand) + 1) % sequence.length];
  notify(state, `Buyer demand is now ${state.demand.toLowerCase()}.`);
}

export function createGame(): GameState {
  return createNewGame();
}

export function resetGame(state: GameState): GameState {
  return createNewGame();
}

export function exportSave(state: GameState): string {
  return JSON.stringify({ app: "scrap-kingdom", version: 1, savedAt: new Date().toISOString(), state }, null, 2);
}

export function importSave(raw: string): GameState {
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || !("state" in parsed)) throw new Error("This file is not a Scrap Kingdom save.");
  const state = (parsed as { state: GameState }).state;
  if (state.version !== 1 || !Array.isArray(state.inventory) || typeof state.cash !== "number" || !Number.isFinite(state.cash) || !Array.isArray(state.ledger)) {
    throw new Error("The save file is incomplete or uses an unsupported version.");
  }
  for (const lot of state.inventory) {
    if (!ITEMS.some((item) => item.id === lot.itemId) || !Number.isInteger(lot.quantity) || lot.quantity < 1 || !CONDITIONS.includes(lot.condition)) {
      throw new Error("The save contains invalid inventory data.");
    }
  }
  return structuredClone(state);
}
