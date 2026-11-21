# Planned project structure

The repository is organized around the selected TypeScript + Vite + Phaser 4 stack. Keep modules small and preserve the separation between simulation, presentation, and content data.

```text
.
├── index.html
├── public/
│   ├── icons/
│   └── assets/
├── assets/
│   ├── audio/{music,sfx,ambience}/
│   ├── fonts/
│   ├── sprites/{environment,items,buildings,vehicles,workers,ui}/
│   ├── tilesets/
│   └── ui/
├── data/
│   ├── buildings/ customers/ events/ items/ locations/
│   ├── recipes/ vehicles/ workers/ economy/
│   └── progression/
├── docs/
│   ├── design/ architecture/ development/ decisions/
│   ├── testing/ production/
├── src/
│   ├── app/                 # Startup, navigation, commands, app state
│   ├── core/                # IDs, clock, random source, events, shared types
│   ├── simulation/          # Authoritative state and tick coordination
│   ├── data/                # Loading and validation of content definitions
│   ├── rendering/           # Phaser game config, scenes, camera, sprites
│   ├── ui/                  # HTML/CSS interface and view controllers
│   ├── shared/              # Small cross-layer utilities and contracts
│   ├── systems/
│   │   ├── inventory/
│   │   ├── economy/
│   │   ├── scavenging/
│   │   ├── processing/
│   │   ├── discovery/
│   │   ├── workforce/
│   │   ├── business/
│   │   ├── yard/
│   │   ├── persistence/
│   │   └── audio/
│   └── styles/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── simulation/
│   └── fixtures/
├── tools/
│   ├── content/
│   └── development/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## Boundary rules

- `app`: startup, navigation, command dispatch, and orchestration.
- `core`: lifecycle-independent primitives; no game-specific UI.
- `simulation`: authoritative state and deterministic business rules; no Phaser or DOM imports.
- `systems`: focused domain rules, invoked through simulation/application contracts.
- `data`: content definitions and balance values, not executable gameplay logic.
- `rendering`: Phaser scenes, camera, world drawing, sprites, and visual feedback.
- `ui`: management panels, forms, dialogs, navigation, and player-facing feedback.
- `persistence`: IndexedDB adapter, save validation, migrations, and backup import/export.
- `assets`: source media organized by purpose and license.
- `tests`: verify rules and critical flows; simulation tests should not require a browser renderer.

## Import direction

`ui / rendering → app contracts → simulation / systems → core`

Simulation and systems must never import UI, rendering, or browser presentation modules. Content data is loaded through a validation boundary. Persistence serializes validated domain state through explicit save DTOs; it must not serialize Phaser objects or DOM nodes.

## File organization rule

Prefer multiple focused TypeScript modules over a monolithic `index.html` or one giant application file. The HTML entry point should remain small and load the application module.
