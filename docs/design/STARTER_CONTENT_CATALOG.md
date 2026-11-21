# Starter Content Catalogue — Prototype

**Status:** Initial content proposal for balancing and implementation  
**Scope:** One yard, one region, one destination, one vehicle, two workers, and a compact item set.  
**Note:** Values are initial tuning placeholders. Final values require playtesting.

## 1. Item design rules

Every item definition should specify:
- Stable ID and display name.
- Category.
- Base reference value.
- Weight per unit.
- Condition behavior.
- Storage requirements.
- Allowed operations.
- Whether it can be sold, sorted, dismantled, repaired, or used in production.

The prototype should use a small set of meaningful items rather than hundreds of shallow entries.

## 2. Starter item catalogue

| Item | Category | Prototype role | Main use |
|---|---|---|---|
| Mixed Scrap Bundle | Mixed salvage | Expedition input | Sorting |
| Iron Scrap | Metal | Common recovery | Sell / later processing |
| Steel Offcuts | Metal | Common recovery | Sell / later processing |
| Copper Wire | Metal/electrical | Valuable recovery | Sell / future recipes |
| Aluminium Pieces | Metal | Common recovery | Sell / later processing |
| Brass Fittings | Metal | Less common recovery | Sell / future recipes |
| Bearings | Mechanical | Useful component | Sell / future recipes |
| Steel Gears | Mechanical | Useful component | Sell / future recipes |
| Small Electric Motor | Machinery | Inspectable salvage object | Sell / future dismantling |
| Circuit Board | Electronics | Uncommon recovery | Sell / future recipes |
| Damaged Power Supply | Electronics | Condition-sensitive item | Sell / future repair |
| Low-grade Residue | Waste/by-product | Sorting output | Low-value sale or disposal rule to be defined |

Keep item names and categories consistent across inventory, market, expedition reports, and sorting output.

## 3. Condition model

Use the GDD's five conditions:
- Excellent
- Good
- Used
- Damaged
- Severely damaged

Condition affects the offer price. It should not automatically make an item worthless. For the prototype, condition can be represented as a small, clearly explained price modifier. Do not add a complex degradation simulation yet.

## 4. Starter destination

**Abandoned Warehouse**

- Type: Warehouse
- Region: Roadside District
- Access: Available from the start
- Risk: Low-to-moderate, explained as access delays and damaged stock rather than combat
- Common finds: Iron Scrap, Steel Offcuts, Bearings
- Less common finds: Copper Wire, Circuit Board, Small Electric Motor
- Possible event: blocked aisle, fragile stock, useful find, vehicle delay
- Salvage: Finite stock that gradually recovers

The destination screen should show likely categories, not guarantee exact loot.

## 5. Starter vehicle

**Used Cargo Van**
- Role: General-purpose small expedition vehicle.
- Capacity: Initial tuning target of 250 kg.
- Strength: Low operating cost and flexible access.
- Limitation: Cannot carry bulky machinery in large quantities.
- Condition: Used.
- Maintenance: Keep simple in the prototype; expedition wear is a small cost/risk indicator, not a maintenance minigame.

## 6. Starter workers

### Samir — Driver / Scavenger
- Role: Driver and expedition worker.
- Strength: Better expedition reliability.
- Weakness: Limited sorting efficiency.
- Prototype use: Enables the first warehouse expedition.

### Nia — General Sorter
- Role: Sorting and yard work.
- Strength: Reliable basic sorting.
- Weakness: No specialist repair/manufacturing expertise yet.
- Prototype use: Enables the first sorting process.

Names are placeholders and may be changed. Worker attributes should be data-driven; do not add personal life simulation.

## 7. Starter facility set

| Facility | Starting state | Function |
|---|---|---|
| Small Storage Area | Owned | Holds incoming inventory |
| Basic Sorting Station | Owned | Sorts mixed salvage |
| Yard Office | Represented by main UI | Business overview and administration |
| Vehicle Parking Spot | Owned | Stores the cargo van |

Only storage and sorting need functional building interactions in the first prototype. Other facilities can be added later.

## 8. Initial processing operation

**Basic Mixed Scrap Sorting**
- Input: Mixed Scrap Bundle.
- Outputs: A variable but bounded mix of common metal, mechanical parts, and low-grade residue.
- Requirements: Basic Sorting Station and an available sorter.
- Duration: Initial target 30 in-game minutes.
- Rule: Show an expected output range before starting. Consume/reserve input exactly once. Record outputs and by-products explicitly.

## 9. Content expansion order

After the prototype passes its acceptance tests, expand in this order:
1. More common metal and mechanical items.
2. Additional warehouse/factory/vehicle-yard destinations.
3. More vehicle classes and capacity trade-offs.
4. Dismantling outputs for selected machinery.
5. Repairable goods and replacement components.
6. Recipe discovery and simple manufacturing.
7. Regional supply/demand differences.
8. Specialized items, rare discoveries, and advanced industrial chains.

Do not expand catalogue size before the current items have clear uses and balanced prices.
