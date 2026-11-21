import "./styles.css";
import { itemById } from "./game/content";
import { advanceTime, buyerPrice, changeDemand, createGame, exportSave, formatGameTime, importSave, inventoryValue, inventoryWeight, sellLot, setSpeed, startExpedition, startSorting, STORAGE_CAPACITY } from "./game/simulation";
import { loadGame, saveGame } from "./game/storage";
import type { GameState } from "./game/types";

const root = document.querySelector<HTMLDivElement>("#app")!;

let state: GameState = createGame();
let lastFrame = performance.now();
let lastRenderedTime = "";
let saveTimer = 0;
let activeTab = "yard";
let searchText = "";
let notice = "";
let saving = false;

const money = (value: number) => `${Math.round(value).toLocaleString("en-US")} CR`;
const safe = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);

function showNotice(message: string): void {
  notice = message;
  render();
}

function inventoryRows(): string {
  const filtered = state.inventory.filter((lot) => {
    const item = itemById(lot.itemId);
    return item.name.toLowerCase().includes(searchText.toLowerCase()) || item.category.toLowerCase().includes(searchText.toLowerCase());
  });
  if (!filtered.length) return '<div class="empty">No matching stock. Your shelves are quieter than usual.</div>';
  return filtered.map((lot) => {
    const item = itemById(lot.itemId);
    const unit = buyerPrice(state, lot);
    return `<div class="stock-row">
      <div class="stock-name"><strong>${safe(item.name)}</strong><small>${safe(item.category)} · ${lot.condition} · ${item.weight} kg each</small></div>
      <div class="stock-qty">${lot.quantity}</div>
      <div class="stock-value"><strong>${money(unit)}</strong><small>buyer / unit</small></div>
      <button class="button button-small" data-sell="${lot.id}">Sell 1</button>
    </div>`;
  }).join("");
}

function render(): void {
  const weight = inventoryWeight(state);
  const activity = state.activity;
  const remainingMinutes = activity ? Math.max(0, activity.completesAt - ((state.day - 1) * 1440 + state.minuteOfDay)) : 0;
  const activeLabel = activity ? `${activity.description} · ${state.speed === 0 ? "paused" : `${Math.ceil(remainingMinutes / state.speed)} game minutes remaining`}` : "No active work";
  root.innerHTML = `
    <header class="topbar">
      <div class="brand"><span class="brand-mark">SK</span><div><strong>SCRAP KINGDOM</strong><small>A DEAD COUNTRY · BUSINESS PROTOTYPE</small></div></div>
      <div class="top-stats">
        <div><small>CASH</small><strong>${money(state.cash)}</strong></div>
        <div><small>REPUTATION</small><strong>${state.reputation}</strong></div>
        <div><small>YARD STORAGE</small><strong>${weight.toFixed(1)} / ${STORAGE_CAPACITY} kg</strong></div>
        <div><small>LOCAL TIME</small><strong>${formatGameTime(state)}</strong></div>
      </div>
    </header>
    <main class="layout">
      <aside class="sidebar">
        <div class="yard-label">THE ROADSIDE YARD</div>
        <nav>
          <button class="nav-button ${activeTab === "yard" ? "selected" : ""}" data-tab="yard">Overview</button>
          <button class="nav-button ${activeTab === "inventory" ? "selected" : ""}" data-tab="inventory">Inventory</button>
          <button class="nav-button ${activeTab === "expedition" ? "selected" : ""}" data-tab="expedition">Scavenging</button>
          <button class="nav-button ${activeTab === "market" ? "selected" : ""}" data-tab="market">Market</button>
          <button class="nav-button ${activeTab === "ledger" ? "selected" : ""}" data-tab="ledger">Finance ledger</button>
        </nav>
        <div class="sidebar-bottom">
          <div class="vehicle-box"><small>USED CARGO VAN</small><strong>${state.vehicleCondition}% condition</strong><div class="meter"><i style="width:${state.vehicleCondition}%"></i></div><small>250 kg capacity</small></div>
          <div class="save-actions"><button class="button button-small" id="save">Save</button><button class="button button-small" id="export">Export</button><label class="button button-small file-label">Import<input id="import" type="file" accept="application/json"></label></div>
        </div>
      </aside>
      <section class="content">
        <div class="content-heading"><div><p class="eyebrow">DAY ${state.day} · SMALL YARD</p><h1>${tabTitle(activeTab)}</h1><p class="muted">${tabDescription(activeTab)}</p></div><div class="time-controls"><span class="time-state">${state.speed === 0 ? "PAUSED" : state.speed === 1 ? "1× SPEED" : "2× SPEED"}</span><button class="button button-small" data-speed="0">${state.speed === 0 ? "Resume" : "Pause"}</button><button class="button button-small ${state.speed === 1 ? "active" : ""}" data-speed="1">1×</button><button class="button button-small ${state.speed === 2 ? "active" : ""}" data-speed="2">2×</button></div></div>
        ${notice ? `<div class="notice">${safe(notice)}<button id="dismiss-notice">×</button></div>` : ""}
        ${activeTab === "yard" ? yardView(activeLabel) : ""}
        ${activeTab === "inventory" ? inventoryView() : ""}
        ${activeTab === "expedition" ? expeditionView() : ""}
        ${activeTab === "market" ? marketView() : ""}
        ${activeTab === "ledger" ? ledgerView() : ""}
      </section>
    </main>
    <footer><span>SCRAP KINGDOM · PROTOTYPE 0.1</span><span>${saving ? "SAVING…" : "LOCAL SAVE"} · NO CLOUD REQUIRED</span></footer>
  `;
  bindEvents();
}

function tabTitle(tab: string): string {
  return ({ yard: "Your yard", inventory: "Stock & materials", expedition: "Scavenging operations", market: "The buyer", ledger: "Money trail" } as Record<string, string>)[tab] ?? "Your yard";
}
function tabDescription(tab: string): string {
  return ({ yard: "A small plot, a used van, and a chance to build something.", inventory: "Every kilogram has a place and every item has a value.", expedition: "Send your crew to recover useful material from abandoned sites.", market: "Sell stock at today's offer. Demand changes what buyers are willing to pay.", ledger: "Every credit earned or spent is recorded here." } as Record<string, string>)[tab] ?? "";
}
function yardView(activeLabel: string): string {
  const mixed = state.inventory.filter((lot) => lot.itemId === "mixed-scrap").reduce((sum, lot) => sum + lot.quantity, 0);
  return `
    <div class="yard-summary">
      <div class="yard-scene">
        <div class="scene-top"><span>YARD MAP · SECTOR 01</span><span>ROAD ACCESS</span></div>
        <div class="yard-grid">
          <div class="yard-road"><span>ROAD</span><span>↓</span></div>
          <div class="yard-building office"><b>OFFICE</b><small>OPEN</small></div>
          <div class="yard-building storage"><b>STORAGE</b><small>${weightLabel()} STORED</small></div>
          <div class="yard-building sorting"><b>SORTING</b><small>${mixed > 0 ? `${mixed} BUNDLES READY` : "NO INPUT"}</small></div>
          <div class="scrap-pile pile-one">SCRAP</div><div class="scrap-pile pile-two">METAL</div>
          <div class="van">▰ VAN</div>
        </div>
        <div class="scene-bottom"><span>THE ROADSIDЕ YARD</span><span>FACILITIES: 3 · VEHICLES: 1</span></div>
      </div>
      <div class="side-stack">
        <article class="panel activity-panel"><div class="panel-head"><h2>Current operation</h2><span class="status-dot ${state.activity ? "working" : ""}"></span></div><strong>${safe(activeLabel)}</strong><p class="muted">${state.activity ? "The operation advances with game time. Pause or change speed whenever you like." : "Your crew and sorting station are available."}</p>${state.activity ? '<div class="meter"><i class="indeterminate"></i></div>' : '<div class="quiet-line">READY FOR ORDERS</div>'}</article>
        <article class="panel"><div class="panel-head"><h2>Business snapshot</h2><span class="tag">START-UP</span></div><div class="metric-list"><div><span>Estimated stock value</span><strong>${money(inventoryValue(state))}</strong></div><div><span>Mixed bundles</span><strong>${mixed}</strong></div><div><span>Warehouse status</span><strong>${absoluteTimeLabel(state.destinationReadyAt)}</strong></div><div><span>Buyer demand</span><strong>${state.demand}</strong></div></div></article>
      </div>
    </div>
    <div class="section-heading"><div><h2>What needs doing?</h2><p class="muted">The business loop starts with small, deliberate decisions.</p></div></div>
    <div class="action-grid">
      <article class="action-card"><span class="action-index">01 / SORT</span><h3>Turn mixed scrap into stock</h3><p>Process one mixed bundle into categorized materials. Outputs are weighed; any loss is recorded.</p><button class="button" id="sort" ${mixed === 0 || state.activity ? "disabled" : ""}>Start sorting · 30 min</button></article>
      <article class="action-card"><span class="action-index">02 / SCAVENGE</span><h3>Send the van out</h3><p>Spend 90 CR to search the abandoned warehouse. The trip takes two in-game hours.</p><button class="button" id="dispatch" ${state.activity || state.cash < 90 || absoluteTime() < state.destinationReadyAt || state.vehicleCondition < 20 ? "disabled" : ""}>Dispatch · 90 CR</button></article>
      <article class="action-card"><span class="action-index">03 / SELL</span><h3>Turn stock into cash</h3><p>Check the buyer's offer and sell individual lots. You can keep rare materials for later.</p><button class="button button-secondary" data-tab="market">Open market</button></article>
    </div>
    <div class="section-heading"><div><h2>Recent yard activity</h2><p class="muted">The latest events in your business.</p></div></div>
    <div class="panel notification-list">${state.notifications.slice(0, 5).map((message) => `<div><span class="bullet"></span>${safe(message)}</div>`).join("")}</div>
  `;
}
function absoluteTime(): number { return (state.day - 1) * 1440 + state.minuteOfDay; }
function absoluteTimeLabel(time: number): string { return time <= absoluteTime() ? "AVAILABLE" : `RECOVERS IN ${Math.ceil((time - absoluteTime()) / 60)} H`; }
function weightLabel(): string { return `${inventoryWeight(state).toFixed(0)} KG`; }

function inventoryView(): string {
  return `<div class="panel"><div class="panel-head"><div><h2>Stored materials</h2><p class="muted">${state.inventory.length} separate stock lots · ${inventoryWeight(state).toFixed(1)} kg total</p></div><div class="capacity-label">${(inventoryWeight(state) / STORAGE_CAPACITY * 100).toFixed(0)}% CAPACITY</div></div><div class="meter"><i style="width:${Math.min(100, inventoryWeight(state) / STORAGE_CAPACITY * 100)}%"></i></div><input class="search" id="search" placeholder="Search materials or categories…" value="${safe(searchText)}"><div class="stock-table"><div class="stock-header"><span>ITEM / CONDITION</span><span>QTY</span><span>BUYER OFFER</span><span>ACTION</span></div>${inventoryRows()}</div></div>`;
}
function expeditionView(): string {
  return `<div class="expedition-banner"><div><span class="eyebrow">NEARBY SALVAGE LOCATION</span><h2>Abandoned Warehouse</h2><p>Rows of storage bays remain sealed. Common metals and mechanical parts are likely; electronics are less common.</p></div><span class="risk">LOW–MODERATE RISK</span></div>
  <div class="three-metrics"><div class="panel"><small>DISPATCH COST</small><strong>90 CR</strong><span>Paid before departure</span></div><div class="panel"><small>EXPECTED DURATION</small><strong>2 HOURS</strong><span>In-game time</span></div><div class="panel"><small>VAN CAPACITY</small><strong>250 KG</strong><span>Current condition: ${state.vehicleCondition}%</span></div></div>
  <div class="panel expedition-details"><h2>Before you dispatch</h2><ul><li>One driver and one general worker are available.</li><li>Recovered cargo is added to your yard inventory.</li><li>Events may delay the return or reduce the condition of goods.</li><li>The warehouse needs four in-game hours to recover after dispatch.</li></ul><button class="button" id="dispatch" ${state.activity || state.cash < 90 || absoluteTime() < state.destinationReadyAt || state.vehicleCondition < 20 ? "disabled" : ""}>Dispatch the van · 90 CR</button><p class="muted">${absoluteTime() < state.destinationReadyAt ? "This destination is recovering from the last expedition." : state.activity ? "Your crew must finish its current operation first." : "You will receive a report when the van returns."}</p></div>`;
}
function marketView(): string {
  return `<div class="market-banner"><div><span class="eyebrow">GENERAL SCRAP BUYER</span><h2>Today's buying desk</h2><p>Offers are based on reference value, item condition, and current demand. The buyer pays 90% of adjusted value.</p></div><div class="demand-control"><small>CURRENT DEMAND</small><strong>${state.demand.toUpperCase()}</strong><button class="button button-small" id="demand">Simulate market shift</button></div></div><div class="panel"><div class="panel-head"><h2>Your saleable stock</h2><span class="tag">NO HIDDEN FEES</span></div><div class="stock-table"><div class="stock-header"><span>ITEM / CONDITION</span><span>QTY</span><span>BUYER OFFER</span><span>ACTION</span></div>${inventoryRows()}</div></div>`;
}
function ledgerView(): string {
  return `<div class="panel"><div class="panel-head"><h2>Transaction history</h2><span class="tag">ALL AMOUNTS IN CR</span></div>${state.ledger.map((entry) => `<div class="ledger-row"><div><strong>${safe(entry.description)}</strong><small>Day ${Math.floor(entry.time / 1440) + 1} · ${Math.floor(entry.time % 1440 / 60).toString().padStart(2, "0")}:${Math.floor(entry.time % 60).toString().padStart(2, "0")}</small></div><strong class="${entry.amount > 0 ? "positive" : entry.amount < 0 ? "negative" : ""}">${entry.amount === 0 ? "—" : `${entry.amount > 0 ? "+" : ""}${money(entry.amount)}`}</strong></div>`).join("")}</div>`;
}

function bindEvents(): void {
  root.querySelectorAll<HTMLElement>("[data-tab]").forEach((button) => button.addEventListener("click", () => { activeTab = button.dataset.tab ?? "yard"; notice = ""; render(); }));
  root.querySelectorAll<HTMLButtonElement>("[data-speed]").forEach((button) => button.addEventListener("click", () => { setSpeed(state, Number(button.dataset.speed) as 0 | 1 | 2); render(); }));
  root.querySelectorAll<HTMLButtonElement>("[data-sell]").forEach((button) => button.addEventListener("click", () => { const result = sellLot(state, button.dataset.sell ?? "", 1); showNotice(result.message); persist(); }));
  root.querySelector<HTMLButtonElement>("#sort")?.addEventListener("click", () => { const lot = state.inventory.find((entry) => entry.itemId === "mixed-scrap"); if (lot) { const result = startSorting(state, lot.id); showNotice(result.message); persist(); } });
  root.querySelectorAll<HTMLButtonElement>("#dispatch").forEach((button) => button.addEventListener("click", () => { const result = startExpedition(state); showNotice(result.message); persist(); }));
  root.querySelector<HTMLButtonElement>("#demand")?.addEventListener("click", () => { changeDemand(state); render(); persist(); });
  root.querySelector<HTMLInputElement>("#search")?.addEventListener("input", (event) => { searchText = (event.target as HTMLInputElement).value; const position = searchText.length; render(); const input = root.querySelector<HTMLInputElement>("#search"); input?.focus(); input?.setSelectionRange(position, position); });
  root.querySelector<HTMLButtonElement>("#save")?.addEventListener("click", async () => { await persist(true); });
  root.querySelector<HTMLButtonElement>("#export")?.addEventListener("click", () => { const blob = new Blob([exportSave(state)], { type: "application/json" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "scrap-kingdom-save.json"; anchor.click(); URL.revokeObjectURL(url); showNotice("Save backup exported."); });
  root.querySelector<HTMLInputElement>("#import")?.addEventListener("change", async (event) => { const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return; try { const imported = importSave(await file.text()); if (confirm("Import this save and replace the current local save?")) { state = imported; await persist(); showNotice("Save imported successfully."); } } catch (error) { showNotice(error instanceof Error ? error.message : "Import failed."); } });
  root.querySelector<HTMLButtonElement>("#dismiss-notice")?.addEventListener("click", () => { notice = ""; render(); });
}

async function persist(manual = false): Promise<void> {
  try { saving = true; if (manual) render(); await saveGame(state); saving = false; if (manual) showNotice("Game saved on this device."); }
  catch { saving = false; showNotice("Save failed. Your current session is still running; export a backup before closing."); }
}

async function boot(): Promise<void> {
  try { const saved = await loadGame(); if (saved) { state = saved; notice = "Local save loaded."; } }
  catch { notice = "Local storage could not be opened. You can still play, but export backups regularly."; }
  render();
  lastFrame = performance.now();
  lastRenderedTime = formatGameTime(state);
  window.setInterval(() => {
    const now = performance.now();
    const elapsed = Math.min(1, (now - lastFrame) / 1000);
    lastFrame = now;
    const before = JSON.stringify(state.activity);
    advanceTime(state, elapsed);
    const currentTime = formatGameTime(state);
    if (before !== JSON.stringify(state.activity) || currentTime !== lastRenderedTime) { render(); lastRenderedTime = currentTime; }
    saveTimer += elapsed;
    if (saveTimer >= 15) { saveTimer = 0; void persist(); }
    if (state.speed !== 0 && !state.activity && state.minuteOfDay % 5 === 0 && elapsed > 0) render();
  }, 250);
}
void boot();
