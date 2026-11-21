# Test strategy

## Unit tests
Prioritize inventory quantities/reservations, storage capacity, price calculations, transaction costs, recipe input/output validation, production duration, worker eligibility, contract state transitions, and save schema validation.

## Integration tests
Verify complete flows: acquire → store → process → sell; prepare → dispatch → resolve → unload scavenging; accept order → reserve stock → deliver → reward/reputation; queue production → consume inputs → create outputs.

## Simulation tests
Check pause and speed controls, simultaneous jobs, deadlines, payroll, market changes, location recovery, and deterministic outcomes where applicable.

## Manual platform checks
Desktop mouse/keyboard, mobile touch, responsive panels, zoom/pan, readable text, no hover-only actions, save/load after refresh, and modest-hardware performance.
