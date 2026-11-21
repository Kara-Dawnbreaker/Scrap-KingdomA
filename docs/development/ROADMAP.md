# Development roadmap

The roadmap follows the GDD while enforcing the technical boundaries in [Technical Blueprint](../architecture/TECHNICAL_BLUEPRINT.md). Each phase must pass its acceptance checks before scope expands.

## Phase 0 — Technical foundation

- Lock TypeScript, Vite, Phaser 4, IndexedDB, and PWA direction.
- Create package scripts, strict TypeScript configuration, and production build.
- Prove a Phaser canvas beside a responsive HTML/CSS management panel.
- Prove top-down orthogonal yard rendering, camera pan/zoom, and object selection.
- Confirm acceptable performance on a modest desktop browser.
- Establish Vitest and a basic automated check workflow.

**Gate:** app starts, production build succeeds, and the yard interaction spike works without console errors.

## Phase 1 — First playable business loop

- Main menu and new/continue game flow.
- Small yard with a few selectable facilities.
- Starter money and a compact item catalogue.
- Inventory search/filter and item inspection.
- Basic market with clear buy/sell transactions and cash ledger.
- One simulated scavenging destination and expedition report.
- One simple processing chain.
- Pause, 1x, and 2x simulation time.
- Local save/load plus backup export/import foundation.

**Gate:** a player can acquire or scavenge, store, process, sell, reinvest, save, reload, and continue without item/money duplication or silent data loss.

## Phase 2 — Core business depth

- More item categories and item conditions.
- Storage types, weight/volume capacity, reservations.
- Additional buyers and price variation.
- Visible operating expenses and financial reports.
- Multiple save slots and autosave checkpoints.

## Phase 3 — Scavenging depth

- More locations and distinct loot tables.
- Crew and vehicle suitability.
- Equipment choices, expedition costs, duration, wear, and recovery outcomes.
- Varied non-combat encounters and rare discoveries.
- Regional map access.

## Phase 4 — Processing and discovery

- Sorting, dismantling, repair, and manufacturing.
- Production queues and input reservation.
- Research workbench, experimentation, recipes, notebook, and mastery.
- Clear bottleneck and profitability feedback.

## Phase 5 — Workforce and business

- Recruitment, skills, strengths/weaknesses, assignments, wages, and experience.
- Customers, orders, contracts, reputation, and business tiers.
- Automation where it reduces repetitive management rather than hiding important decisions.

## Phase 6 — Economy and expansion

- Regional supply/demand and shortages.
- Market events and regional price differences.
- Loans and recovery options with safeguards against permanently unwinnable states.
- Yard expansion, building upgrades, vehicles, advanced production chains.

## Phase 7 — Content and polish

- Larger data-driven item/building/recipe/location catalogue.
- Visual yard growth and worker/vehicle activity.
- Pixel-art refinement, soundscape, accessibility, settings.
- Balance passes and save migration tests.

## Phase 8 — Mobile adaptation and release readiness

- Touch-friendly controls and responsive panel layouts.
- Performance checks on lower-powered devices.
- Offline cache/update testing.
- Cross-browser smoke tests and accessibility pass.
- Export/import recovery tests and release checklist.

## Delivery rule

Build vertical slices that prove connected gameplay. Do not implement every menu, building, item, or system before the core loop works. Every phase must include type-check, production build, relevant automated tests, and a manual smoke test.
