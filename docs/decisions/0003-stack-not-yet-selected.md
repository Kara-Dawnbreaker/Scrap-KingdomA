# ADR 0003: Defer technology stack selection

- Status: Proposed
- Context: The game targets desktop and mobile browsers and should remain efficient on modest hardware.
- Decision: Do not create framework-specific source files during repository setup. Compare practical options and test the isometric rendering/input approach first.
- Consequences: The initial repository remains implementation-neutral; the first development milestone must finalize the stack before code is introduced.
