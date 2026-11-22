import "./styles.css";
import { itemById } from "./game/content";
import { advanceTime, buyerPrice, changeDemand, createGame, exportSave, formatGameTime, importSave, inventoryWeight, sellLot, setSpeed, startExpedition, startSorting, STORAGE_CAPACITY } from "./game/simulation";
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
      <div class="brand"><span class="brand-mark">SK</span><div><strong>SCRAP KINGDOM</strong><small>A DEAD COUNTRY</small></div></div>
      <div class="top-stats">
        <div><small>CASH</small><strong>${money(state.cash)}</strong></div>
        <div><small>REPUTATION</small><strong>${state.reputation}</strong></div>
        <div><small>STORAGE</small><strong>${weight.toFixed(1)} / ${STORAGE_CAPACITY} kg</strong></div>
        <div><small>DAY / TIME</small><strong>${state.day} · ${formatGameTime(state)}</strong></div>
      </div>
      <div class="top-tools">
        <span class="time-state">${state.speed === 0 ? "PAUSED" : state.speed === 1 ? "1×" : "2×"}</span>
        <button class="button button-small" data-speed="0">${state.speed === 0 ? "Resume" : "Pause"}</button>
        <button class="button button-small ${state.speed === 1 ? "active" : ""}" data-speed="1">1×</button>
        <button class="button button-small ${state.speed === 2 ? "active" : ""}" data-speed="2">2×</button>
        <button class="button button-small" id="save" title="Save game">${saving ? "Saving…" : "Save"}</button>
        <button class="button button-small" id="export">Export</button>
        <label class="button button-small file-label">Import<input id="import" type="file" accept="application/json"></label>
      </div>
    </header>
    <main class="layout">
      <aside class="sidebar">
        <div class="yard-label">OPERATIONS</div>
        <nav>
          <button class="nav-button ${activeTab === "yard" ? "selected" : ""}" data-tab="yard"><span>▦</span> Yard</button>
          <button class="nav-button ${activeTab === "inventory" ? "selected" : ""}" data-tab="inventory"><span>▤</span> Inventory</button>
          <button class="nav-button ${activeTab === "expedition" ? "selected" : ""}" data-tab="expedition"><span>⇢</span> Scavenging</button>
          <button class="nav-button ${activeTab === "market" ? "selected" : ""}" data-tab="market"><span>¤</span> Market</button>
          <button class="nav-button ${activeTab === "ledger" ? "selected" : ""}" data-tab="ledger"><span>≡</span> Finance</button>
        </nav>
        <div class="sidebar-bottom">
          <div class="vehicle-box"><small>USED CARGO VAN</small><strong>${state.vehicleCondition}% condition</strong><div class="meter"><i style="width:${state.vehicleCondition}%"></i></div><small>250 kg capacity</small></div>
          <div class="save-state">${saving ? "SAVING…" : "● LOCAL SAVE ACTIVE"}</div>
        </div>
      </aside>
      <section class="content ${activeTab === "yard" ? "yard-content" : "management-content"}">
        ${activeTab !== "yard" ? `<div class="content-heading"><div><p class="eyebrow">DAY ${state.day} · SMALL YARD</p><h1>${tabTitle(activeTab)}</h1><p class="muted">${tabDescription(activeTab)}</p></div></div>` : ""}
        ${notice ? `<div class="notice">${safe(notice)}<button id="dismiss-notice">×</button></div>` : ""}
        ${activeTab === "yard" ? yardView(activeLabel) : ""}
        ${activeTab === "inventory" ? inventoryView() : ""}
        ${activeTab === "expedition" ? expeditionView() : ""}
        ${activeTab === "market" ? marketView() : ""}
        ${activeTab === "ledger" ? ledgerView() : ""}
      </section>
    </main>
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
    <div class="yard-toolbar">
      <div><span class="eyebrow">YOUR PROPERTY · SECTOR 01</span><strong>THE ROADSIDE YARD</strong></div>
      <div class="yard-status"><span class="status-dot ${state.activity ? "working" : ""}"></span>${safe(activeLabel)}</div>
    </div>
    <div class="yard-world" aria-label="Top-down view of your scrapyard">
      <div class="yard-fence">
        <div class="yard-ground">
          <div class="yard-road road-west"><span>ACCESS ROAD</span></div>
          <div class="yard-road road-east"></div>
          <div class="yard-road road-south"><span>GATE / ROAD ACCESS</span></div>
          <div class="yard-lane lane-horizontal"></div>
          <div class="yard-lane lane-vertical"></div>
          <div class="yard-zone zone-office">ADMINISTRATION</div>
          <button class="yard-building office" data-yard-action="office" aria-label="Open yard office">
            <span class="building-roof"><i>▦</i></span><b>YARD OFFICE</b><small>BUSINESS RECORDS</small>
          </button>
          <button class="yard-building storage" data-yard-action="storage" aria-label="Open storage inventory">
            <span class="building-roof"><i>▤</i></span><b>STORAGE SHED</b><small>${weightLabel()} STORED</small>
          </button>
          <button class="yard-building sorting" data-yard-action="sorting" aria-label="Use sorting station">
            <span class="building-roof"><i>⚒</i></span><b>SORTING BAY</b><small>${mixed > 0 ? `${mixed} BUNDLES READY` : "NO INPUT STOCK"}</small>
          </button>
          <div class="yard-pile pile-one"><span>▰ ▪ ▰</span><b>MIXED SCRAP</b><small>${mixed} BUNDLES</small></div>
          <div class="yard-pile pile-two"><span>▰ ▰</span><b>METAL STACK</b><small>IRON / STEEL</small></div>
          <div class="yard-pile pile-three"><span>▪ ▰ ▪</span><b>RECOVERY LOT</b><small>UNSORTED</small></div>
          <div class="yard-pallet"><span>▦ ▦</span><small>PALLETS</small></div>
          <button class="yard-vehicle" data-yard-action="van" aria-label="Dispatch cargo van">
            <span class="van-cab"></span><span class="van-body"></span><b>VAN</b>
          </button>
          <div class="yard-tree tree-one">♣</div><div class="yard-tree tree-two">♣</div>
          <div class="yard-sign">SCRAP KINGDOM <small>EST. DAY 01</small></div>
          <div class="yard-gate">MAIN GATE</div>
        </div>
      </div>
    </div>
    <div class="yard-hint"><span>SELECT A BUILDING OR VEHICLE TO INTERACT</span><span>YARD VIEW · OVERHEAD</span></div>
  `;
}
function absoluteTime(): number { return (state.day - 1) * 1440 + state.minuteOfDay; }
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
  root.querySelectorAll<HTMLButtonElement>("[data-yard-action]").forEach((button) => button.addEventListener("click", () => {
    const action = button.dataset.yardAction;
    if (action === "storage") { activeTab = "inventory"; render(); return; }
    if (action === "office") { activeTab = "ledger"; render(); return; }
    if (action === "sorting") {
      const lot = state.inventory.find((entry) => entry.itemId === "mixed-scrap");
      if (!lot) { showNotice("There are no mixed scrap bundles waiting to be sorted."); return; }
      if (state.activity) { showNotice("Finish the current operation before starting another."); return; }
      const result = startSorting(state, lot.id); showNotice(result.message); persist(); return;
    }
    if (action === "van") {
      const result = startExpedition(state); showNotice(result.message); persist(); return;
    }
  }));
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
