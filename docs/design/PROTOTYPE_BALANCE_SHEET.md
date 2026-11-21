# Prototype Balance Sheet — Initial Playtest Values

**Status:** Proposed tuning baseline, not final game balance  
**Purpose:** Give the first playable slice internally consistent starting values so implementation and playtesting can begin without inventing numbers ad hoc.  
**Currency:** Credits (CR)  
**Important:** These values should be adjusted from playtest evidence. They are not final economy promises.

## 1. Starting state

| Resource | Starting value | Notes |
|---|---:|---|
| Cash | 1,200 CR | Enough for several decisions, not unlimited buying |
| Reputation | 0 | Neutral starting position |
| Storage capacity | 500 kg | One basic storage area |
| Vehicle | Used Cargo Van | 250 kg cargo capacity |
| Workers | 2 | One driver/scavenger, one sorter |
| Yard facilities | Storage + Sorting Station | Both operational |
| Available destination | Abandoned Warehouse | Low-to-moderate risk |
| Game time | Day 1, 08:00 | Consistent new-game starting point |

## 2. Initial inventory

| Item | Quantity | Condition | Weight each | Reference value each |
|---|---:|---|---:|---:|
| Mixed Scrap Bundle | 2 | Used | 20 kg | 35 CR |
| Iron Scrap | 10 | Used | 2 kg | 8 CR |
| Steel Offcuts | 4 | Used | 3 kg | 15 CR |
| Bearings | 2 | Good | 1 kg | 22 CR |

Starting inventory weight: 66 kg. Keep enough free storage for expedition cargo.

## 3. Item reference values

Reference value is an internal baseline, not a guaranteed buyer offer. Actual offers are calculated from reference value, condition, demand, and buyer preference.

| Item | Weight each | Reference value | Prototype availability |
|---|---:|---:|---|
| Mixed Scrap Bundle | 20 kg | 35 CR | Starting stock / expedition |
| Iron Scrap | 2 kg | 8 CR | Common |
| Steel Offcuts | 3 kg | 15 CR | Common |
| Copper Wire | 1 kg | 32 CR | Uncommon |
| Aluminium Pieces | 2 kg | 11 CR | Common |
| Brass Fittings | 1 kg | 24 CR | Uncommon |
| Bearings | 1 kg | 22 CR | Common |
| Steel Gears | 2 kg | 18 CR | Common |
| Small Electric Motor | 12 kg | 95 CR | Uncommon |
| Circuit Board | 0.2 kg | 45 CR | Uncommon |
| Damaged Power Supply | 3 kg | 28 CR | Uncommon |
| Low-grade Residue | 5 kg | 1 CR | Sorting by-product |

## 4. Condition price modifiers

Apply a simple, visible condition modifier to the reference value:

| Condition | Price modifier |
|---|---:|
| Excellent | 1.15 |
| Good | 1.00 |
| Used | 0.85 |
| Damaged | 0.55 |
| Severely damaged | 0.30 |

These modifiers are starting tuning values. Do not let condition reduce an item's value below zero. Some buyers may reject severely damaged goods later, but that restriction is not needed in the first prototype.

## 5. Market offers

The prototype market should use one general buyer. Start with a buyer offer of 90% of the condition-adjusted reference value, rounded to the nearest whole credit. Display the calculation factors in the item detail panel.

For the first prototype, use only one simple demand state:
- Low demand: 0.85 multiplier.
- Normal demand: 1.00 multiplier.
- High demand: 1.15 multiplier.

The demand multiplier is applied after the condition modifier. Keep market movement slow and bounded; do not add regional markets or complex price forecasting yet.

## 6. Expedition economics

**Destination:** Abandoned Warehouse

| Parameter | Initial value |
|---|---:|
| Dispatch cost | 90 CR |
| Base duration | 2 in-game hours |
| Van capacity | 250 kg |
| Destination risk | Low-to-moderate |
| Crew requirement | Driver/scavenger |
| Salvage recovery | Gradual; prevents immediate repeated farming |

A normal expedition should usually return a mix of common items whose reference value can plausibly exceed its dispatch cost, but it should not guarantee profit. Delays, damaged stock, and variable cargo should create uncertainty without making the trip feel arbitrary.

Suggested outcome composition by number of item lots:
- Common metal: frequent.
- Mechanical parts: frequent.
- Electronics: occasional.
- Reusable machinery: rare.
- Unexpected delay or vehicle wear: occasional.

The report must show gross recovered reference value, estimated buyer value, dispatch cost, and net estimated result. Do not present estimated value as guaranteed profit.

## 7. Sorting operation

**Operation:** Basic Mixed Scrap Sorting

| Parameter | Initial value |
|---|---:|
| Input | 1 Mixed Scrap Bundle |
| Input weight | 20 kg |
| Duration | 30 in-game minutes |
| Facility | Basic Sorting Station |
| Worker | Available sorter |
| Output weight | Must not exceed input weight |
| Expected output | Iron Scrap, Steel Offcuts, Low-grade Residue |

Initial output range per bundle:
- Iron Scrap: 3–5 units.
- Steel Offcuts: 1–3 units.
- Low-grade Residue: 0–1 unit.

Output weights must be physically consistent with the input weight. Any unreturned weight is recorded as processing loss, not silently discarded. Show expected ranges before starting. A seeded random outcome makes results reproducible in tests.

## 8. Operating costs

For the prototype, avoid recurring payroll and facility bills until the time simulation is stable. Charge expedition dispatch cost when the expedition begins. If a vehicle wear/repair cost is introduced, show it clearly in the expedition report and keep it small.

Do not introduce hidden upkeep that can unexpectedly drain the player's starting cash.

## 9. Financial safety and recovery

- Never allow a transaction to spend more cash than the player has unless a future, explicitly designed credit system allows it.
- Keep a low-cost path to recover from a poor expedition: sell remaining stock, wait for a destination to recover, or choose a cheaper market action.
- Do not add loans or debt to the prototype.
- Warn before a purchase or dispatch that would leave the player with very little cash.
- Do not make a single poor random outcome permanently unwinnable.

## 10. Balancing checklist

During playtests, record:
- Average expedition net value.
- Cash remaining after the first expedition.
- Time until the first successful sale.
- Number of actions needed to understand inventory and sorting.
- Whether sorting feels worthwhile compared with direct sale.
- Whether low-demand prices feel understandable.
- Whether the player can recover from a poor expedition.

Change one or two variables at a time and keep a short note of why each balance change was made.
