# Test strategy

Testing protects the economic simulation first, then the browser presentation. The simulation should be testable without launching Phaser or a browser.

## Automated checks

Run these checks for every meaningful change:

1. TypeScript type-check (`tsc --noEmit`).
2. Production build (`vite build`).
3. Relevant Vitest unit and integration tests.
4. Browser smoke tests for critical flows once Playwright is introduced.

Vite transpiles TypeScript but does not perform full type-checking, so type-checking must remain a separate command.

## Unit tests

Prioritize:
- Inventory quantities, reservations, transfers, and capacity.
- Money arithmetic, ledger entries, price calculations, and transaction costs.
- Recipe input/output validation and production duration.
- Worker eligibility and assignment constraints.
- Expedition preparation requirements and deterministic outcome resolution.
- Contract/order state transitions.
- Save schema validation, migration, and import rejection behavior.

## Integration tests

Verify complete flows:
- Acquire → store → process → sell.
- Prepare → dispatch → resolve → unload scavenging.
- Accept order → reserve stock → deliver → reward/reputation.
- Queue production → reserve/consume inputs → create outputs.
- Save → reload → compare state.
- Export → import into a separate slot → compare state.

## Simulation tests

Check:
- Pause and speed controls.
- Simultaneous jobs and deadlines.
- Payroll and operating expenses.
- Market changes and regional modifiers.
- Deterministic results from a fixed random seed.
- No duplicate reservations, negative stock, or unexplained money changes.
- Simulation results do not depend on render-frame rate.

## Browser and manual platform checks

- Desktop mouse/keyboard navigation.
- Yard camera pan/zoom and object selection.
- UI panels remain usable at the target desktop resolution.
- No essential action requires hover.
- Clear feedback for invalid actions and failed saves.
- Refresh/reopen and load saved state.
- Offline launch after a successful initial cache.
- Service-worker update does not strand the app on mismatched assets.
- Modest-hardware performance and bounded memory use.

Mobile touch and responsive layout checks become release gates after the desktop prototype is stable.
