# Scrap Kingdom: A Dead Country

A single-player scrapyard management and industrial business simulation set in a fictional country recovering from industrial collapse.

> **Current stage:** Repository and technical planning are complete. Gameplay implementation has not started yet.

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

## Repository map

- `docs/design/` — original GDD and design decisions
- `docs/architecture/` — architecture and technical blueprint
- `docs/development/` — roadmap and milestones
- `src/` — modular application and game systems (implementation pending)
- `data/` — data-driven game definitions
- `assets/` — visual, audio, font, and UI resources
- `tests/` — automated test organization

## Start here

1. [Complete GDD](docs/design/GDD_SOURCE.md)
2. [Technical Blueprint](docs/architecture/TECHNICAL_BLUEPRINT.md)
3. [Architecture](docs/architecture/ARCHITECTURE.md)
4. [Project Structure](docs/architecture/PROJECT_STRUCTURE.md)
5. [Development Roadmap](docs/development/ROADMAP.md)

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
- [x] Architecture boundaries documented
- [x] Technology direction selected
- [x] Technical blueprint written
- [x] Prototype scope and acceptance gate defined
- [ ] Application scaffold created
- [ ] First playable prototype implemented
