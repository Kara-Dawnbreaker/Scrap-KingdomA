# First Playable Prototype — Design Specification

**Status:** Pre-production specification  
**Purpose:** Define the smallest version that proves Scrap Kingdom is enjoyable and technically sound.  
**Authority:** Based on the original GDD and confirmed project decisions. Proposed numbers are initial playtest values, not final balance.

## 1. Player experience

The player inherits a tiny scrapyard with a little cash, a basic storage area, a sorting station, and access to one nearby salvage destination. The player inspects incoming materials, sends a small expedition, sorts recovered scrap, sells useful stock, and reinvests in the business.

The prototype must communicate the central fantasy: turning discarded materials into a growing business.

## 2. Prototype boundaries

### Included
- One playable yard screen, top-down orthogonal pixel-art presentation.
- One compact starter region and one scavenging destination.
- One starter vehicle and a small crew.
- One storage area and one sorting station.
- Approximately 12 starter item definitions.
- Inventory inspection, search/filter, and capacity display.
- Basic buy/sell market with transparent prices.
- One expedition preparation and resolution flow.
- One sorting process that converts mixed scrap into categorized materials.
- Pause, 1x, and 2x time controls.
- Starter business metrics: cash, reputation, tier, storage use, current time.
- Save/load foundation and backup export/import.
- Clear notifications, confirmation for costly actions, and useful error messages.

### Not included yet
- Multiple regions, large map, or free-roaming scavenging.
- Combat, survival mechanics, or weapon systems.
- Complex worker schedules, needs, or personal stories.
- Advanced crafting, deep recipe discovery, or multiple production facilities.
- Full customer relationship simulation, contracts, or negotiation.
- Loans, interest, taxes, and complicated financial instruments.
- Mobile-specific control redesign.
- Endgame progression or industrial empire-scale content.

## 3. Starting scenario

**Working scenario name:** The Roadside Yard

The player starts with:
- A small fenced plot beside a damaged road.
- One basic storage area.
- One sorting station.
- One used cargo van.
- Two available workers: one general sorter and one driver/scavenger.
- A small quantity of mixed salvage.
- A modest amount of starting cash.
- Access to the nearby abandoned warehouse.

The starting yard should look improvised but usable. It should not begin as a fully equipped industrial facility.

### Suggested first-playtest values

These values are tuning placeholders to make the first build testable:
- Starting cash: 1,200 credits.
- Starting reputation: 0 (neutral).
- Starting storage capacity: 500 kg.
- Cargo van capacity: 250 kg.
- Starter crew size: 2.
- Nearby warehouse expedition duration: 2 in-game hours.
- Expedition base cost: 90 credits.
- First sorting job duration: 30 in-game minutes.

The economy must be tuned through playtesting. These numbers are not a promise of final difficulty.

## 4. First-session guided flow

The first session should teach through contextual prompts, not a long tutorial wall.

1. **Welcome to the yard:** show cash, storage, and the small starting plot.
2. **Inspect the stock:** open inventory and inspect mixed scrap.
3. **Visit the market:** explain estimated value versus current buyer price.
4. **Prepare an expedition:** choose the nearby warehouse, assign the driver and van, review cost, duration, capacity, and risk.
5. **Resolve the trip:** show a concise report with recovered goods, expenses, and any delay or vehicle wear.
6. **Sort salvage:** convert mixed salvage into useful categories at the sorting station.
7. **Make a business decision:** sell now or hold materials for a better opportunity.
8. **Reinvest:** demonstrate a small optional yard improvement or equipment purchase.
9. **Save:** explain autosave/manual save status and backup export.

The player should be able to skip tutorial prompts. No irreversible tutorial choice should consume important resources without clear confirmation.

## 5. Core prototype loop

**Prepare → Dispatch → Recover → Inspect → Sort → Sell → Reinvest**

Every stage must affect the same authoritative inventory, cash, time, and business state. The expedition report must explain its outcome; sorting must consume the mixed input and create explicit outputs; selling must reduce stock and add a visible ledger transaction.

## 6. Expedition model

The first destination is an abandoned warehouse. It should have:
- Low-to-moderate risk.
- Common metal, mechanical parts, and occasional electronics.
- Limited salvage availability that recovers over time.
- A clear expected duration and cost.

Possible non-combat expedition events:
- **Clear shelves:** ordinary salvage recovered.
- **Blocked access:** expedition takes longer.
- **Fragile stock:** some goods arrive damaged.
- **Useful find:** a rare but modestly valuable component is recovered.
- **Vehicle trouble:** return is delayed and condition decreases slightly.

Do not use combat or graphic danger. A poor expedition should normally return partial salvage or useful information rather than simply deleting the trip's cost.

## 7. First processing chain

The prototype uses a simple sorting operation:

**Mixed Scrap → Sorted Metal / Mechanical Parts / Low-value Residue**

The exact output mix can vary within defined ranges, using the simulation's seeded random source. The UI must show the expected output range before the player commits. Inputs are reserved when the job starts and consumed according to the documented process rule. No output may appear without the corresponding input transaction.

Do not add repair or manufacturing until sorting and inventory accounting are reliable.

## 8. Economy rules

- Prices are shown before a sale or purchase.
- Estimated item value and actual buyer offer are visibly different.
- Every transaction creates a cash-ledger entry.
- The player cannot sell more units than are available and unreserved.
- The player cannot exceed storage or vehicle capacity silently.
- Price movement is modest in the prototype; one simple demand modifier is enough.
- No hidden fees. Expedition cost and any expected upkeep are shown before dispatch.
- Keep a recovery path: the player should be able to sell remaining stock or choose a cheaper activity if cash becomes low.

## 9. Prototype completion criteria

The prototype passes only when all of these are true:
- A new game starts with the documented starting state.
- Inventory quantities, conditions, weights, and values are inspectable.
- An expedition can be prepared, dispatched, resolved, and unloaded.
- Expedition costs and recovered cargo are accounted for.
- Sorting consumes its inputs and creates outputs correctly.
- A sale updates stock, cash, and the ledger exactly once.
- Storage and vehicle capacity checks prevent overflow or silent loss.
- Pause and time speed affect all active jobs consistently.
- Save/load preserves the complete prototype state.
- Export/import restores a save into a separate slot without overwriting another slot.
- A refresh does not duplicate rewards, sales, or expedition outcomes.
- The core loop can be repeated without a softlock.

## 10. Playtest questions

Record observations rather than guessing:
- Does the player understand what to do next without constant prompting?
- Is an expedition exciting enough to justify its cost and wait?
- Is sorting meaningfully better than immediately selling mixed scrap?
- Can the player understand why an item has its current price?
- Does the yard feel like a place that is gradually becoming a business?
- Is any management action repetitive without adding a decision?
- Can a new player recover from a poor first expedition?

Do not expand the prototype until the core loop is understandable, reliable, and enjoyable.
