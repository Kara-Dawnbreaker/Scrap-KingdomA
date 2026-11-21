import { describe, expect, it } from "vitest";
import { createGame } from "../src/game/simulation";
import { inventoryWeight, sellLot, startExpedition, startSorting, advanceTime, STORAGE_CAPACITY } from "../src/game/simulation";

describe("Scrap Kingdom first prototype", () => {
  it("starts with the documented 74 kg of stock and 1,200 credits", () => {
    const state = createGame();
    expect(state.cash).toBe(1200);
    expect(inventoryWeight(state)).toBe(74);
  });

  it("sells stock once and records the transaction", () => {
    const state = createGame();
    const iron = state.inventory.find((lot) => lot.itemId === "iron")!;
    const before = state.cash;
    const result = sellLot(state, iron.id, 1);
    expect(result.ok).toBe(true);
    expect(state.cash).toBeGreaterThan(before);
    expect(state.inventory.find((lot) => lot.id === iron.id)?.quantity).toBe(9);
    expect(state.ledger[0].kind).toBe("sale");
  });

  it("consumes a mixed bundle and completes a weight-safe sorting job", () => {
    const state = createGame();
    const mixed = state.inventory.find((lot) => lot.itemId === "mixed-scrap")!;
    expect(startSorting(state, mixed.id).ok).toBe(true);
    expect(state.activity?.kind).toBe("processing");
    advanceTime(state, 30);
    expect(state.activity).toBeNull();
    expect(state.inventory.find((lot) => lot.itemId === "mixed-scrap")?.quantity).toBe(1);
    expect(inventoryWeight(state)).toBeLessThanOrEqual(STORAGE_CAPACITY);
    expect(state.inventory.some((lot) => lot.origin === "Sorted mixed scrap")).toBe(true);
  });

  it("accumulates fractional time steps without losing clock progress", () => {
    const state = createGame();
    advanceTime(state, 0.25);
    advanceTime(state, 0.25);
    advanceTime(state, 0.25);
    advanceTime(state, 0.25);
    expect(state.minuteOfDay).toBe(481);
    state.speed = 0;
    advanceTime(state, 10);
    expect(state.minuteOfDay).toBe(481);
  });

  it("charges the dispatch cost and resolves an expedition after its travel time", () => {
    const state = createGame();
    expect(startExpedition(state).ok).toBe(true);
    expect(state.cash).toBe(1110);
    advanceTime(state, 120);
    if (state.activity) advanceTime(state, 30);
    expect(state.activity).toBeNull();
    expect(state.inventory.some((lot) => lot.origin === "Warehouse expedition")).toBe(true);
    expect(inventoryWeight(state)).toBeLessThanOrEqual(STORAGE_CAPACITY);
  });
});
