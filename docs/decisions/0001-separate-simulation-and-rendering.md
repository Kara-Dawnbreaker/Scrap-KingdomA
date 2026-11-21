# ADR 0001: Separate simulation from rendering

- Status: Accepted (design constraint from GDD)
- Context: The game combines a visible isometric yard with deep economic and production simulation.
- Decision: Keep business rules and simulation state independent from rendering and UI.
- Consequences: Simulation systems can be tested independently; rendering can change without rewriting economic rules; interfaces between layers must be explicit.
