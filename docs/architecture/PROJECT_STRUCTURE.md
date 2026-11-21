# Planned project structure

The folders below establish ownership boundaries. They are intentionally empty until the technology stack and implementation approach are chosen.

```text
.
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
│   ├── app/ core/ simulation/ data/ rendering/ ui/
│   ├── systems/{inventory,economy,scavenging,processing,workforce,contracts,progression,persistence,audio}/
│   └── shared/
├── tests/{unit,integration,simulation,fixtures}/
└── tools/{content,development}/
```

## Boundary rules
- `core`: lifecycle, clock, events, shared primitives; no game-specific UI.
- `simulation`: deterministic business and world rules.
- `systems`: focused gameplay domains that coordinate simulation behavior.
- `data`: definitions and balance values, not executable game logic.
- `rendering`: camera, world drawing, sprites, and visual feedback.
- `ui`: panels, navigation, input presentation, and player-facing feedback.
- `persistence`: versioned save format, validation, and migrations.
- `assets`: source media organized by purpose and license.
