# Contribution and project conventions

This repository is being prepared before implementation. Keep this document as the shared working agreement.

## Before implementation
- Read the game design document and the architecture plan.
- Preserve the management-simulation focus and explicit scope boundaries.
- Do not add combat, multiplayer, full survival gameplay, rival-company simulation, or unrestricted crafting systems without a deliberate GDD revision.
- Keep simulation rules independent from rendering and UI.
- Prefer data-driven definitions for content that is expected to expand.

## Code conventions (to finalize with the selected stack)
- Use clear, descriptive names.
- Keep modules focused and avoid oversized files.
- Validate external and persisted data at boundaries.
- Add tests for economy, inventory, production, and save/load rules.
- Document non-obvious design decisions.

## Change workflow
1. Make one coherent change at a time.
2. Run relevant checks and tests.
3. Update documentation when architecture or behavior changes.
4. Keep commits focused and descriptive.
