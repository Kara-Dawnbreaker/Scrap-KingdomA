# UI and UX Specification — Prototype

**Status:** Pre-production specification  
**Visual direction:** Clean management interface combined with restrained retro-industrial details.  
**Primary input:** Desktop mouse and keyboard.  
**Future input:** Touch, without hover-only actions.

## 1. Interface goals

- Keep money, time, reputation, storage, and active work visible.
- Make costs, risks, requirements, and outcomes understandable before commitment.
- Avoid deep nested menus.
- Use readable text and consistent icons.
- Separate the yard view from information-heavy management panels.
- Keep important actions reversible where possible; confirm expensive or irreversible actions.

## 2. Main screen layout

### Persistent top status bar
Always show:
- Current cash.
- Business tier.
- Reputation.
- Game day/time.
- Pause / 1x / 2x controls.
- Storage usage.
- Save status indicator.

### Main workspace
- **Yard view:** top-down pixel-art yard occupies the central workspace.
- **Context panel:** opens when a building, stockpile, worker, vehicle, or yard object is selected.
- **Notification area:** short messages for completed jobs, market changes, warnings, and save status.
- **Navigation rail:** Yard, Scavenging, Inventory, Market, Production, Finance, Settings.

For the prototype, Customers, Orders, Workers, Construction, and Recipe Notebook can appear as visibly marked future sections only if they are non-interactive; preferably hide them until implemented to avoid implying unfinished features exist.

## 3. Main navigation

| Section | Prototype purpose |
|---|---|
| Yard | View and select the storage/sorting facilities |
| Scavenging | Inspect destination and prepare/track expedition |
| Inventory | Search, filter, inspect, and manage stock |
| Market | View current buyer prices and sell eligible stock |
| Production | View the sorting job and its progress |
| Finance | View cash ledger, expedition expenses, and sales |
| Settings | Audio, display, save, export/import, and accessibility options |

Navigation should preserve the current game state and not interrupt active jobs.

## 4. Important panel specifications

### Inventory
Show item name, category, quantity, condition, weight, estimated value, current buyer price, and storage location. Include search and category filters. Item details should explain why condition or demand affects value. Reserved quantities must be visibly marked.

### Scavenging
Show destination description, expected salvage categories, risk label with explanation, duration, vehicle requirement, crew requirement, estimated cost, capacity, and available salvage. Before dispatch, present a final summary and require confirmation.

### Expedition report
Show elapsed time, recovered items, item condition, expenses, vehicle wear, event encountered, and a short explanation. Make the result easy to compare against the expedition cost.

### Market
Show buyer, item, current offer, recent trend indicator, available quantity, and sale quantity. Display the total proceeds before confirmation. A successful sale should have one clear confirmation and one ledger entry.

### Production
Show selected sorting recipe, required input, expected output range, duration, assigned facility/worker if relevant, progress, and status. Do not allow starting a job if inputs or facility requirements are missing.

### Finance
Show current cash, income, expenses, net change, and a chronological transaction ledger. Use clear labels for expedition cost, sale revenue, purchase cost, and upkeep.

## 5. Interaction rules

- Click a yard building to open its context panel.
- Escape closes the topmost panel/dialog.
- Keyboard focus must be visible.
- Buttons have clear disabled states and explain why an action is unavailable.
- Destructive or expensive actions require a confirmation summary.
- Do not rely on hover for essential information.
- Avoid double-submit: disable the action while a transaction is being processed.
- Show progress and a clear completion state for time-based jobs.
- Never use color alone to communicate risk, condition, or status.

## 6. Visual language

Use the GDD palette: rust orange, dark brown, dusty green, concrete grey, faded blue, and muted yellow. Reserve the strongest contrast for important actions and warnings. Panels should be clean and readable, with industrial texture used as subtle framing rather than behind dense text.

## 7. Accessibility and readability

- Use readable body text at desktop scale.
- Maintain sufficient contrast.
- Pair status colors with text or icons.
- Support keyboard navigation for all management panels.
- Provide text labels for important icons.
- Avoid rapid flashing and excessive screen shake.
- Provide independent music and sound-effect volume controls when audio is added.

## 8. Responsive direction

Desktop is the initial target. Keep the layout flexible enough that a future mobile version can stack panels, use touch-sized controls, and provide touch camera gestures. Do not compromise the desktop management experience to prematurely simulate a mobile layout.
