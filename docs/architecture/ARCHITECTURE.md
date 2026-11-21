# Architecture plan

## Core architectural rule
Rendering must remain separate from the business simulation. The simulation should be testable without drawing the yard or opening UI panels.

## Planned domains
- **Application:** startup, screen flow, configuration, platform adaptation.
- **Core:** simulation clock, pause/speed controls, event dispatch, identifiers, shared types.
- **Simulation:** time advancement and coordination of concurrent jobs.
- **Inventory:** item stacks, condition, quantities, reservations, storage capacity.
- **Economy:** prices, supply/demand, transactions, expenses, market events.
- **Scavenging:** location availability, expedition planning, crew/vehicle fit, outcome resolution.
- **Processing:** sorting, dismantling, repair, manufacturing, production queues.
- **Discovery:** experimentation, recipe unlocks, notebook, mastery, expertise.
- **Workforce:** recruitment, skills, assignments, experience, wages, automation.
- **Business:** customers, orders, contracts, negotiation, reputation, tiers.
- **Yard:** property grid, placement rules, facilities, upgrades, construction.
- **Rendering and UI:** isometric yard, camera, input, panels, touch interaction.
- **Persistence:** validated, versioned saves and safe migration.
- **Audio:** music, effects, ambience, independent volume controls.

## Data-driven content
Items, buildings, workers, vehicles, recipes, locations, customers, and progression content should be defined as data wherever practical. Definitions should be validated before use.

## Simulation integrity
- Time-dependent activities should advance consistently under pause and 1x/2x/3x speeds.
- Parallel activities must not overwrite each other's state.
- Inventory reservations must prevent the same stock from being committed twice.
- Storage capacity must never silently delete valuable inventory.
- Save/load must preserve all important business state and support future migrations.

## Decisions still open
- Runtime/framework and rendering library
- Language and build tooling
- Data serialization format
- Isometric coordinate/grid representation
- Save storage strategy and browser compatibility
- Automated test runner

These choices are intentionally deferred until a feasibility review of target browsers and modest hardware is complete.
