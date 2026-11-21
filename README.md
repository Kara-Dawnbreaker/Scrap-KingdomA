# Scrap Kingdom: A Dead Country

A single-player scrapyard management and industrial business simulation set in a fictional country recovering from industrial collapse.

> **Current stage:** First functional gameplay prototype implemented. The current build focuses on management systems and readable interface blocks; final pixel-art rendering is intentionally deferred.

## Project direction

- Top-down 2D pixel-art scrapyard.
- Desktop browser first; mobile adaptation later.
- A connected acquire → sort/store → process → sell → reinvest loop.
- Simulated scavenging expeditions accessed through maps and menus.
- Detailed item attributes and a dynamic, understandable economy.
- Visible yard growth from a small scrapyard to an industrial operation.
- Offline play after the first successful load, with local saves and backup export/import.

## Technology direction

- TypeScript
- Vite
- Phaser 4 for the yard renderer
- HTML/CSS for management interfaces
- IndexedDB for local saves
- `vite-plugin-pwa` for offline application caching
- Vitest for automated tests

The first implementation milestone will validate the rendering/input approach and performance before expanding the game systems.

## Start here

1. [Complete GDD](docs/design/GDD_SOURCE.md)
2. [Technical Blueprint](docs/architecture/TECHNICAL_BLUEPRINT.md)
3. [First Playable Prototype Specification](docs/design/PROTOTYPE_SPEC.md)
4. [UI/UX Specification](docs/design/UI_UX_SPEC.md)
5. [Starter Content Catalogue](docs/design/STARTER_CONTENT_CATALOG.md)
6. [Asset Plan](docs/production/ASSET_PLAN.md)
7. [Architecture](docs/architecture/ARCHITECTURE.md)
8. [Project Structure](docs/architecture/PROJECT_STRUCTURE.md)
9. [Development Roadmap](docs/development/ROADMAP.md)

## Repository map

- `docs/design/` — original GDD, prototype scope, interface, and content definitions
- `docs/architecture/` — architecture and technical blueprint
- `docs/development/` — roadmap and milestones
- `docs/testing/` — testing strategy
- `docs/production/` — asset and release planning
- `src/` — modular application and game systems (implementation pending)
- `data/` — data-driven game definitions
- `assets/` — visual, audio, font, and UI resources
- `tests/` — automated test organization

## Development phases

0. Technical foundation
1. First playable business loop
2. Core business depth
3. Scavenging depth
4. Processing and discovery
5. Workforce and business
6. Economy and expansion
7. Content and polish
8. Mobile adaptation and release readiness

## Current status

- [x] Original GDD stored in repository
- [x] Repository structure prepared
- [x] Technology direction selected
- [x] Technical blueprint and architecture recorded
- [x] Prototype scope and acceptance criteria defined
- [x] UI/UX behavior specified
- [x] Starter items, workers, vehicle, facility, and destination specified
- [x] Initial economy and processing balance values proposed
- [x] Asset direction and sourcing rules documented
- [x] Application scaffold created
- [x] First playable business-loop prototype implemented
- [x] Inventory, sorting, expedition, market, ledger, time controls, and local save/export/import foundation implemented
- [ ] Automated tests and browser playtest verified

**Development boundary:** Do not create or modify gameplay code until the project owner explicitly authorizes coding.
