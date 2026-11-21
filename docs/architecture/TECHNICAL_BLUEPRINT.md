# Scrap Kingdom — Technical Blueprint

**Status:** Approved project direction; implementation not yet started  
**Target:** Desktop-first browser game, with mobile support planned after the desktop prototype  
**Design authority:** `docs/design/GDD_SOURCE.md`, supplemented by the project decisions recorded in this repository

## 1. Product direction

Scrap Kingdom is a single-player scrapyard management and industrial business simulation. The player begins with a small yard and grows it into an industrial operation by acquiring, sorting, storing, processing, and selling useful materials and goods.

The defining experience is the connected business loop—not combat, open-world exploration, or worker-life simulation.

### Confirmed presentation decisions

- Top-down 2D pixel-art presentation, using an orthogonal grid rather than the GDD's original isometric camera.
- The yard is the primary playable space.
- Other regions and scavenging destinations are accessed through map/menu interfaces; the player does not freely explore those locations.
- Expeditions are simulated management activities with preparation, duration, costs, risks, encounters, and recovered cargo.
- Desktop browser is the first target. Mobile adaptation follows once the desktop interaction model is stable.
- English UI and text.
- Offline play is a goal after the first successful load and asset cache.

## 2. Recommended technology stack

| Layer | Choice | Responsibility |
|---|---|---|
| Language | TypeScript | Main application and simulation code |
| Build/dev server | Vite | Local development and production bundling |
| 2D rendering | Phaser 4 | Yard scene, camera, sprites, animation, pointer/keyboard input |
| Interface | HTML + CSS + TypeScript | Management panels, inventory, market, reports, settings |
| Local persistence | IndexedDB | Multiple local save slots and settings |
| Offline application shell | PWA service worker using `vite-plugin-pwa` | Cache the app shell and approved static assets |
| Unit/integration tests | Vitest | Simulation rules, data validation, save logic |
| Browser-level tests | Playwright, introduced after the first stable vertical slice | Critical user flows and regression checks |

### Why this stack

Phaser is designed for 2D browser games and supports WebGL/Canvas rendering, cameras, scenes, animations, and browser input. TypeScript provides stronger contracts for a simulation with many related data types. Vite supplies the development server and production build pipeline. IndexedDB is designed for larger structured client-side data and uses asynchronous transactions. A Vite PWA plugin can generate a service worker and support offline asset caching.

This is a practical fit for a 2D management game; it is not a promise that every future feature will be effortless. The first milestone must prove the Phaser rendering/input approach on the target browser and modest hardware before content production expands.

## 3. Runtime architecture

Keep the application in three clear layers:

1. **Presentation:** Phaser yard rendering plus HTML/CSS management interface.
2. **Application orchestration:** navigation, commands, notifications, settings, save coordination, and UI state.
3. **Simulation domain:** authoritative business state and rules. This layer must run without Phaser or DOM access.

The simulation is the source of truth. Rendering reads state and displays it; it must not independently decide prices, production results, inventory ownership, or expedition outcomes.

### Core flow

`User action → Application command → Simulation validation → State change → Domain event → UI/render update → Scheduled save`

Examples:
- A sale command validates stock and buyer eligibility, changes inventory and cash, then emits a sale event.
- A production command reserves required inputs, checks facility/worker requirements, and creates a job.
- An expedition command validates crew, vehicle, equipment, budget, and capacity before it starts.

### Simulation time

Use a central simulation clock with pause and 1x/2x/3x speed controls. Systems advance from simulation time, not from the number of rendered frames. Use fixed simulation steps and controlled catch-up limits so a slow browser tab does not create huge update spikes. Rendering may run at a different frame rate.

All random outcomes should use a seeded random source owned by the simulation. This improves reproducibility and makes economy/expedition bugs easier to test.

## 4. Domain boundaries

- **Core:** IDs, money/quantity helpers, clock, seeded randomness, event contracts, shared result/error types.
- **Simulation:** state container, tick coordinator, command handling, deterministic progression.
- **Inventory:** item lots, attributes, storage, capacity, reservations, transfers, sale quantities.
- **Economy:** market state, price calculation, regional modifiers, expenses, cash ledger, loans/recovery.
- **Scavenging:** destinations, expedition planning, crew/vehicle suitability, encounter tables, outcomes, cargo return.
- **Processing:** sorting, dismantling, repair, manufacturing jobs and input/output rules.
- **Discovery:** experimentation, recipe unlocks, notebook, mastery.
- **Workforce:** worker profiles, skills, strengths/weaknesses, assignments, wages, experience.
- **Business:** customers, orders, contracts, reputation, business tiers.
- **Yard:** orthogonal grid, plot limits, building footprints, placement validation, upgrades.
- **Persistence:** save schema, validation, version migration, autosave, manual save, export/import.
- **Rendering:** Phaser scenes, camera, tiles, sprites, animation, visual effects.
- **UI:** HTML/CSS panels, navigation, inventory tables, dialogs, tooltips, accessibility.
- **Audio:** music, ambience, effects, volume settings.

A domain system must not import Phaser classes or manipulate DOM elements. UI code must not directly mutate simulation state; it sends commands.

## 5. World and yard representation

Use a top-down orthogonal tile grid. Each building has a footprint, placement constraints, cost, construction duration, and operational data. The yard scene should initially show a small fixed plot with a road entrance, a basic storage area, a sorting station, and a few scrap piles.

Avoid physics simulation for ordinary objects. Use simple tile occupancy and interaction zones. Workers and vehicles can be represented with lightweight visual states and short route animations; complex pathfinding is not required for the prototype.

The yard's visual density should grow as facilities and operations are added. This is a presentation goal, not a requirement to simulate every individual scrap object.

## 6. Data and save model

Keep balance/content definitions separate from simulation logic. Store item, building, worker, vehicle, recipe, region, customer, and event definitions as JSON data, validated at load time against TypeScript-facing schemas.

Use stable string IDs for content references. Never rely on array position as an item's identity.

### Important simulation entities

- `GameState`: schema version, simulation time, money, reputation, progression, market state, and references to owned entities.
- `ItemDefinition`: category, base value, weight/volume, storage rules, allowed operations.
- `InventoryLot`: definition ID, quantity, condition, quality, origin, reservations.
- `BuildingInstance`: definition ID, grid position, footprint, level, construction/operational status.
- `WorkerInstance`: profile ID, skills, strengths/weaknesses, experience, assignment, wage.
- `VehicleInstance`: definition ID, condition, capacity, fuel, maintenance state.
- `ProductionJob`: recipe ID, reserved inputs, assigned facility/worker, progress, output plan.
- `Expedition`: destination, crew, vehicle, equipment, budget, state, expected return, outcome seed.
- `CustomerOrder`: customer, requested goods, quantity, quality/condition constraints, deadline, reward, status.
- `MarketState`: regional supply/demand modifiers, current prices, active events, last update time.

Money should use integer minor units (or another explicit fixed-point representation), not floating-point currency arithmetic. Quantities and weights should use documented units and validation limits.

### Persistence rules

- IndexedDB stores separate save slots and settings.
- Autosave at safe checkpoints and after important transactions; do not write the entire save every render frame.
- Manual save is always available when the game is in a consistent state.
- Keep a versioned save schema and explicit migrations.
- Validate imported saves before replacing any existing slot.
- Provide export/import backup because browser storage can be cleared or evicted by the browser.
- If saving fails, show a clear warning and preserve the in-memory session; never silently claim that data was saved.
- Do not promise cloud synchronization in the first version.

Offline support means the app shell and required local assets are cached after the first successful online load. It does not mean first-time use can happen without downloading the game, nor does it guarantee that browser storage can never be removed.

## 7. First playable prototype — strict scope

The first prototype proves one complete, understandable economic loop. It is not the full game.

### Included

1. Main menu with New Game, Continue, Save Slots, and Settings.
2. One small top-down yard scene with camera pan/zoom and selectable facilities.
3. Starter cash and a small initial inventory.
4. A compact item catalogue (roughly 10–15 items) across a few categories.
5. Inventory panel with search/filter, quantity, condition, weight, and estimated value.
6. One simple market with a handful of buyers/prices and clear transaction confirmation.
7. One simulated scavenging destination with crew/vehicle preparation, cost, duration, outcome report, and recovered items.
8. One basic processing chain, such as mixed scrap → sorted metal → saleable material.
9. Basic time controls: pause, 1x, 2x.
10. One save slot initially, with tested save/load and export/import foundation.
11. Basic sound toggles and readable feedback for success/failure.

### Explicitly deferred

- Multiple regions with deep regional economies.
- Large item catalogue and advanced rarity systems.
- Complex manufacturing chains and research mastery.
- Full workforce progression and automation.
- Contracts with branching negotiations.
- Loans, credit systems, and complex financial recovery.
- Large yard expansions and many building tiers.
- Advanced weather/world events.
- Mobile-specific layout and touch tuning.
- Extensive animation, elaborate soundscape, achievements, and endgame balancing.

### Prototype success criteria

A new player can:
- Start a new game.
- Inspect and manage stock.
- Send one expedition and receive a clear report.
- Process a recovered material.
- Sell goods and see money/inventory update correctly.
- Save, refresh/reopen, and load the same state.
- Export a backup and import it into an empty test slot.
- Continue the core loop without console errors or unexplained loss of stock/cash.

## 8. Build and quality gates

Every milestone must pass:
- TypeScript type-check.
- Production build.
- Unit tests for changed simulation rules.
- Save/load round-trip test when state shape changes.
- No duplicate item reservations or negative inventory.
- No silent inventory deletion.
- No transaction that creates or removes money without a ledger entry.
- No simulation outcome dependent on render frame rate.
- A manual browser smoke test at the target desktop resolution.

Add browser automation after the core vertical slice stabilizes. Test a lower-end desktop profile early; keep sprite counts, effects, UI redraws, and simulation work bounded.

## 9. Main technical risks and mitigations

| Risk | Mitigation |
|---|---|
| Phaser 4 integration details or API changes | Pin a tested version; build a small rendering/input spike first |
| Management UI becomes cramped | Keep HTML/CSS panels separate from the canvas; establish panel layouts before mobile work |
| Simulation becomes one large tangled system | Enforce domain boundaries and command/event flow |
| Economy balancing becomes opaque | Use data-driven values, visible price factors, and deterministic tests |
| Save corruption or browser storage loss | Versioned saves, validation, backups, and explicit save status |
| Offline cache serves mismatched versions | Use generated service-worker update flow and test upgrade/reload behavior |
| Scope expands before the core loop works | Enforce prototype exclusions and milestone acceptance checks |
| AI-generated code creates duplicate or inconsistent systems | Ask for small scoped changes, inspect touched files, run type-check/build/tests after each phase |

## 10. Development workflow

1. Establish the stack and project scripts.
2. Create the smallest Phaser + HTML UI shell.
3. Prove top-down grid drawing, camera, selection, and input.
4. Implement the simulation core independently of rendering.
5. Add inventory and a market transaction.
6. Connect one expedition and one processing chain.
7. Add persistence and test reload/backup behavior.
8. Only then broaden content and systems.

Keep each change focused. Do not replace the repository with a single giant HTML file. Keep source code modular, content data separate, and tests beside the systems they protect.

## 11. Reference documentation

- [Phaser documentation](https://www.phaser.io/oss/docs)
- [Vite guide](https://vite.dev/guide/)
- [Vite TypeScript features](https://vite.dev/guide/features)
- [vite-plugin-pwa documentation](https://github.com/vite-pwa/vite-plugin-pwa)
- [MDN IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
