# Architecture plan

The implementation direction is recorded in [Technical Blueprint](TECHNICAL_BLUEPRINT.md). This document defines the architectural rules that all future code must follow.

## Core architectural rule

Rendering and interface code must remain separate from the authoritative business simulation. The simulation must be testable without drawing the yard, starting Phaser, or opening UI panels.

## Selected application layers

1. **Presentation:** Phaser 4 top-down yard scene; HTML/CSS management interface.
2. **Application orchestration:** navigation, commands, notifications, settings, and save coordination.
3. **Simulation domain:** authoritative state, time advancement, and business rules.

The simulation must not import Phaser or access the DOM. UI components must send commands rather than mutate simulation state directly.

## Planned domains

- **Application:** startup, screen flow, configuration, platform adaptation.
- **Core:** simulation clock, pause/speed controls, seeded randomness, event contracts, identifiers, shared types.
- **Simulation:** authoritative state, command validation, time advancement, coordination of concurrent jobs.
- **Inventory:** item lots, condition, quantities, reservations, storage capacity, transfers.
- **Economy:** prices, supply/demand, transactions, expenses, cash ledger, regional modifiers.
- **Scavenging:** destination data, expedition planning, crew/vehicle fit, simulated encounters, outcome resolution.
- **Processing:** sorting, dismantling, repair, manufacturing, production queues.
- **Discovery:** experimentation, recipe unlocks, notebook, mastery, expertise.
- **Workforce:** recruitment, skills, strengths/weaknesses, assignments, experience, wages, automation.
- **Business:** customers, orders, contracts, negotiation, reputation, tiers.
- **Yard:** orthogonal tile grid, placement rules, footprints, facilities, upgrades, construction.
- **Rendering:** Phaser scenes, camera, sprites, tile drawing, animation, visual feedback.
- **UI:** HTML/CSS panels, navigation, inventory views, dialogs, accessibility, touch-friendly controls.
- **Persistence:** IndexedDB adapter, validated versioned saves, migrations, export/import.
- **Audio:** music, effects, ambience, independent volume controls.

## Data-driven content

Items, buildings, workers, vehicles, recipes, locations, customers, events, and progression should be defined as data wherever practical. Definitions must be validated before use. Use stable IDs rather than array positions.

## Simulation integrity

- Time-dependent activities advance from a central simulation clock, not render-frame count.
- Pause and speed settings affect all time-dependent systems consistently.
- Random outcomes use a simulation-owned seeded random source.
- Parallel activities must not overwrite each other's state.
- Inventory reservations prevent the same stock from being committed twice.
- Storage capacity must never silently delete valuable inventory.
- Every cash change must have an explicit transaction/ledger reason.
- Save/load must preserve important business state and support future migrations.
- Failed saves must be visible to the player.

## Yard representation

Use a top-down orthogonal tile grid. Buildings have footprints and placement constraints. The yard is the primary rendered location; external regions are represented through map/menu interfaces and simulated expeditions. Avoid physics simulation for ordinary scrap objects.

## Persistence and offline behavior

Use IndexedDB for local save slots and settings. Use a service worker to cache the app shell and approved local assets after first load. Provide save export/import backups; do not promise cloud sync in the first release.

## Technology choices

- TypeScript
- Vite
- Phaser 4
- HTML/CSS UI
- IndexedDB
- `vite-plugin-pwa`
- Vitest; Playwright after the first stable vertical slice

See ADR 0003 and the Technical Blueprint for rationale, limitations, and implementation order.
