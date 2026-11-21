# ADR 0003: Select TypeScript, Vite, and Phaser 4

- Status: Accepted
- Date: 2026-11-21

## Context

Scrap Kingdom is a 2D, top-down, desktop-first browser management game. It needs a lightweight yard renderer, a substantial simulation that can be tested independently, a rich management interface, local saves, and offline support after initial loading. The project should remain modular and approachable for iterative development.

## Decision

Adopt the following initial stack:

- TypeScript for application and simulation code.
- Vite for development and production builds.
- Phaser 4 for the 2D yard scene, camera, sprites, animation, and input.
- HTML/CSS for management panels and forms.
- IndexedDB for local save slots and settings.
- `vite-plugin-pwa` for service-worker-based application-shell and asset caching.
- Vitest for unit and integration tests.
- Add Playwright browser tests after the first stable vertical slice.

Pin tested dependency versions in the package lockfile when implementation begins. Do not use floating or unpinned dependency versions in release builds.

## Rationale

Phaser is purpose-built for 2D browser games and provides WebGL/Canvas rendering and browser input/camera/scene facilities. Vite offers a focused development server and optimized build pipeline with TypeScript support. IndexedDB is an asynchronous transactional store for structured browser data. The Vite PWA plugin can generate a service worker and support offline caching.

The stack allows the game canvas and management UI to evolve independently while the simulation remains renderer-agnostic.

## Consequences

- The main yard uses a top-down orthogonal grid, not the original GDD's isometric view.
- The first milestone must validate Phaser 4 camera, pixel rendering, pointer/keyboard input, and performance on the target desktop browser.
- Simulation systems must not import Phaser or DOM modules.
- Vite transpilation alone is not a type check; run `tsc --noEmit` as a separate check.
- Offline play is expected after the first successful load and cache; first-time download is still required.
- Browser storage can be cleared or evicted. Provide save export/import and clear save-status feedback.
- Cloud sync is out of scope for the first release.
- If the Phaser 4 technical spike reveals a blocking compatibility or performance issue, record evidence and propose a revised ADR before changing engines.
