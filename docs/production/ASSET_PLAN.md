# Asset Plan — Scrap Kingdom

**Status:** Pre-production asset direction  
**Goal:** Establish a consistent, lightweight art and audio plan before assets are produced or imported.

## 1. Art direction

Use top-down 2D pixel art with a worn industrial atmosphere. The yard should feel improvised at the beginning and increasingly organized as the business grows.

Palette from the GDD:
- Rust orange
- Dark brown
- Dusty green
- Concrete grey
- Faded blue
- Muted yellow
- Warm industrial lighting

Avoid excessive texture behind text or management panels. The UI must remain readable.

## 2. Prototype asset priorities

### Essential visual assets
1. Ground tiles: dirt, cracked concrete, worn asphalt.
2. Yard boundaries: chain-link fence, gate, road edge.
3. Scrap props: small metal pile, mixed scrap pile, pallet, barrel, crate.
4. Facilities: small storage shed and sorting station.
5. Vehicle: used cargo van, top-down view.
6. Workers: two simple top-down characters with readable silhouettes.
7. UI icons: metal, electronics, mechanical parts, vehicle, storage, cash, time, warning, save.
8. Selection states: building highlight, placement/interaction outline, disabled state.

### Can wait until after the prototype
- Detailed forklifts and multiple vehicle variants.
- Large animated machinery.
- Extensive worker animation sets.
- Weather and particle effects.
- Large regional environment art.
- Decorative signage and extensive background storytelling.

## 3. Sprite consistency rules

- Use a consistent pixel scale and outline treatment.
- Keep top-down orientation consistent; do not mix isometric assets into the yard.
- Use transparent backgrounds for individual props and characters.
- Keep collision/selection footprints separate from decorative sprite pixels.
- Avoid tiny details that disappear at normal zoom.
- Provide clear selected/active states.
- Use simple animation loops only when they communicate an operation.

## 4. Asset sourcing and licensing

Prefer original assets or clearly licensed free assets. Record the source, author, license, download date, and any attribution requirement for each third-party asset. Do not assume an asset is free to redistribute just because it is visible online.

Keep source files where practical and retain license text in the repository. Avoid mixing assets with incompatible licenses.

## 5. Audio priorities

Prototype stage:
- One subtle industrial ambience loop.
- UI click/confirm sound.
- Transaction confirmation.
- Expedition dispatch/return cue.
- Sorting machine loop or completion cue.

Later:
- Yard ambience that becomes richer as facilities grow.
- Vehicle engine and loading sounds.
- Distinct machine loops.
- Optional low-key background music.
- Independent music, ambience, and effects volume controls.

Audio must be optional and never required to understand an important event.

## 6. Performance budget

- Prefer sprite sheets/atlases for related pixel art.
- Keep animation frame counts modest.
- Avoid large full-screen particle effects.
- Avoid continuously animating every object.
- Use static art for distant/decorative objects.
- Test at the target desktop resolution on modest hardware before adding visual complexity.

## 7. Asset checklist

Before an asset is added:
- Does it match the top-down pixel-art perspective?
- Is its license recorded?
- Is it readable at the intended zoom?
- Does it have a clear gameplay purpose?
- Is its footprint/interaction area defined if selectable?
- Is its file size reasonable?
