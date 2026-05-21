import { useState, useEffect, useCallback, useRef } from "react";

// ── STYLES ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0c10;
    --surface: #11141b;
    --surface2: #181d27;
    --border: #1e2433;
    --accent: #00d4aa;
    --accent2: #3b82f6;
    --gold: #f59e0b;
    --red: #ef4444;
    --yellow: #eab308;
    --green: #22c55e;
    --text: #e2e8f0;
    --muted: #64748b;
    --mono: 'IBM Plex Mono', monospace;
    --sans: 'Syne', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--sans); min-height: 100vh; }

  .app { display: flex; flex-direction: column; min-height: 100vh; max-width: 1200px; margin: 0 auto; padding: 0 12px 80px; }

  /* NAV */
  .nav { position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface); border-top: 1px solid var(--border); display: flex; z-index: 100; }
  .nav-btn { flex: 1; padding: 10px 4px 12px; background: none; border: none; color: var(--muted); cursor: pointer; font-family: var(--sans); font-size: 9px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; display: flex; flex-direction: column; align-items: center; gap: 4px; transition: color .2s; }
  .nav-btn svg { width: 18px; height: 18px; }
  .nav-btn.active { color: var(--accent); }
  .nav-btn.active svg { filter: drop-shadow(0 0 6px var(--accent)); }

  /* HEADER */
  .header { padding: 20px 0 12px; display: flex; align-items: center; justify-content: space-between; }
  .header h1 { font-size: 22px; font-weight: 800; color: var(--accent); letter-spacing: -.02em; }
  .header span { font-family: var(--mono); font-size: 11px; color: var(--muted); }

  /* CARDS */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
  .card-title { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }

  /* INPUTS */
  .input-row { display: flex; gap: 8px; margin-bottom: 12px; }
  .input { flex: 1; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; color: var(--text); font-family: var(--mono); font-size: 14px; outline: none; transition: border-color .2s; }
  .input:focus { border-color: var(--accent); }
  .input::placeholder { color: var(--muted); }

  /* BUTTONS */
  .btn { background: var(--accent); color: #000; border: none; border-radius: 8px; padding: 10px 18px; font-family: var(--sans); font-weight: 700; font-size: 13px; cursor: pointer; transition: opacity .2s, transform .1s; white-space: nowrap; }
  .btn:hover { opacity: .85; }
  .btn:active { transform: scale(.97); }
  .btn:disabled { opacity: .4; cursor: not-allowed; }
  .btn-ghost { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-sm { padding: 6px 12px; font-size: 11px; border-radius: 6px; }
  .btn-red { background: var(--red); color: #fff; }

  /* DOTS */
  .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
  .dot.green { background: var(--green); box-shadow: 0 0 6px var(--green); }
  .dot.yellow { background: var(--yellow); box-shadow: 0 0 6px var(--yellow); }
  .dot.red { background: var(--red); box-shadow: 0 0 6px var(--red); }
  .dot.gray { background: var(--muted); }

  /* SCORE BADGE */
  .score-badge { font-family: var(--mono); font-weight: 600; font-size: 20px; }
  .score-badge.high { color: var(--green); }
  .score-badge.mid { color: var(--yellow); }
  .score-badge.low { color: var(--red); }

  /* METRIC GRID */
  .metric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .metric-row { display: flex; align-items: center; gap: 8px; background: var(--surface2); border-radius: 6px; padding: 7px 10px; }
  .metric-label { font-size: 11px; color: var(--muted); flex: 1; font-family: var(--mono); }
  .metric-value { font-family: var(--mono); font-size: 11px; color: var(--text); }

  /* PROGRESS */
  .progress-bar { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; margin: 8px 0; }
  .progress-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width .3s; }

  /* TABLE */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; font-family: var(--mono); }
  th { text-align: left; padding: 8px 10px; color: var(--muted); font-size: 10px; letter-spacing: .06em; text-transform: uppercase; border-bottom: 1px solid var(--border); }
  td { padding: 8px 10px; border-bottom: 1px solid var(--border); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--surface2); }

  /* TICKER CARD */
  .ticker-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 10px; }
  .ticker-card .top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .ticker-card .sym { font-size: 18px; font-weight: 800; color: var(--accent); }
  .ticker-card .price { font-family: var(--mono); font-size: 16px; font-weight: 600; }
  .ticker-card .chg { font-family: var(--mono); font-size: 12px; }
  .chg.pos { color: var(--green); }
  .chg.neg { color: var(--red); }

  /* DOTS ROW */
  .dots-row { display: flex; gap: 4px; flex-wrap: wrap; }

  /* PILLS */
  .pill { display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface2); cursor: pointer; font-size: 11px; font-weight: 600; transition: all .2s; margin: 3px; }
  .pill.active { background: var(--accent); color: #000; border-color: var(--accent); }
  .pill .count { font-family: var(--mono); font-size: 10px; opacity: .7; }

  /* RANK BADGES */
  .rank-gold { color: #f59e0b; }
  .rank-silver { color: #94a3b8; }
  .rank-bronze { color: #b45309; }

  /* ERROR / INFO */
  .error { color: var(--red); font-size: 12px; font-family: var(--mono); padding: 8px 0; }
  .info { color: var(--muted); font-size: 12px; font-family: var(--mono); text-align: center; padding: 24px 0; }

  /* JOURNAL PNL */
  .pnl-pos { color: var(--green); }
  .pnl-neg { color: var(--red); }

  /* SECTION DIVIDER */
  .divider { height: 1px; background: var(--border); margin: 16px 0; }

  /* SIGNAL BAR */
  .signal-bar-wrap { height: 6px; background: var(--border); border-radius: 3px; width: 80px; overflow: hidden; display: inline-block; vertical-align: middle; margin-left: 6px; }
  .signal-bar-fill { height: 100%; border-radius: 3px; }

  /* PATTERN LAB */
  .freq-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .freq-label { font-size: 11px; font-family: var(--mono); width: 120px; flex-shrink: 0; color: var(--muted); }
  .freq-track { flex: 1; height: 16px; background: var(--border); border-radius: 4px; overflow: hidden; }
  .freq-fill { height: 100%; background: var(--accent2); border-radius: 4px; display: flex; align-items: center; padding-left: 6px; font-size: 10px; font-family: var(--mono); color: #fff; transition: width .6s; }

  /* TEXTAREA */
  textarea { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; color: var(--text); font-family: var(--mono); font-size: 12px; outline: none; resize: vertical; min-height: 80px; }
  textarea:focus { border-color: var(--accent); }

  /* SELECT */
  select { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; color: var(--text); font-family: var(--mono); font-size: 13px; outline: none; }
  select:focus { border-color: var(--accent); }

  .loading { display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 13px; font-family: var(--mono); }
  .spin { width: 16px; height: 16px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .stat-box { background: var(--surface2); border-radius: 8px; padding: 12px; text-align: center; }
  .stat-box .val { font-family: var(--mono); font-size: 20px; font-weight: 600; }
  .stat-box .lbl { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; margin-top: 2px; }

  .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-family: var(--mono); font-weight: 600; }
  .tag.green { background: rgba(34,197,94,.15); color: var(--green); }
  .tag.red { background: rgba(239,68,68,.15); color: var(--red); }
  .tag.yellow { background: rgba(234,179,8,.15); color: var(--yellow); }

  .winner-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 10px; }
  .winner-card .wc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }

  .insight-box { background: var(--surface2); border-left: 3px solid var(--accent); border-radius: 0 8px 8px 0; padding: 12px; margin-bottom: 8px; font-size: 12px; line-height: 1.6; color: var(--text); }
`;

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const METRIC_NAMES = [
  "RSI < 35", "MACD Cross", "Price > 50MA", "Price > 200MA",
  "Golden Cross", "Vol > 20avg", "Price < VWAP", "BB Bottom 20%",
  "Near 52wk Low", "Support Hold", "RS vs SPY"
];

const METRIC_KEYS = [
  "rsi","macd","ma50","ma200","golden","vol","vwap","bb","wk52","support","rs"
];

const SECTORS = {
  "Mega Cap": ["AAPL","MSFT","NVDA","AMZN","GOOGL","META","TSLA","BRK-B","LLY","AVGO"],
  "Technology": ["CRM","ORCL","AMD","INTC","QCOM","TXN","NOW","SNOW","PLTR","SHOP"],
  "Healthcare": ["JNJ","UNH","PFE","ABBV","MRK","TMO","ABT","DHR","BMY","GILD"],
  "Financials": ["JPM","BAC","WFC","GS","MS","BLK","AXP","SCHW","USB","PNC"],
  "Consumer": ["WMT","AMZN","COST","TGT","HD","LOW","MCD","SBUX","NKE","PG"],
  "Energy": ["XOM","CVX","COP","SLB","EOG","MPC","PSX","VLO","OXY","HAL"],
  "Industrials": ["GE","BA","HON","CAT","RTX","UPS","FDX","DE","LMT","NOC"],
  "Biotech": ["MRNA","BNTX","REGN","VRTX","BIIB","ALNY","SGEN","EXEL","RARE","IONS"],
  "Small Cap": ["SMCI","CROX","BOOT","CALF","SFIX","RKT","SOFI","OPEN","CLSK","MARA"],
  "ETFs": ["SPY","QQQ","IWM","GLD","SLV","USO","TLT","HYG","XLF","XLE"],
};

const PROXY_BASE = "https://stock-proxy-y3qu.onrender.com";
const PROXIES = [
  (t,r) => `${PROXY_BASE}/stock?ticker=${t}&range=${r}`,
];

// ── DATA FETCHING ─────────────────────────────────────────────────────────────
async function fetchYahoo(ticker, range = "1y", onWaking) {
  const urls = PROXIES.map(p => p(ticker, range));
  for (let attempt = 0; attempt < urls.length; attempt++) {
    const url = urls[attempt];
    let wakingTimer = null;
    try {
      if (onWaking) wakingTimer = setTimeout(() => onWaking(true), 2500);
      const r = await fetch(url, { headers: { "Accept": "application/json" } });
      if (wakingTimer) { clearTimeout(wakingTimer); onWaking && onWaking(false); }
      if (!r.ok) continue;
      const j = await r.json();
      const res = j?.chart?.result?.[0];
      if (!res) continue;
      const ts = res.timestamp || res.timestamps;
      const q = res.indicators?.quote?.[0];
      if (!ts || !q) continue;
      const data = ts.map((t, i) => ({
        date: new Date(t * 1000).toISOString().split("T")[0],
        open: q.open[i], high: q.high[i], low: q.low[i],
        close: q.close[i], volume: q.volume[i],
      })).filter(d => d.close != null);
      const meta = res.meta || {};
      return { data, meta };
    } catch(e) {
      if (wakingTimer) { clearTimeout(wakingTimer); onWaking && onWaking(false); }
      throw new Error(`Fetch error for ${ticker}: ${e.message}`);
    }
  }
  throw new Error(`No data returned for ${ticker}`);
}

// ── INDICATORS ────────────────────────────────────────────────────────────────
function sma(arr, n) {
  return arr.map((_, i) => i < n - 1 ? null : arr.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0) / n);
}

function ema(arr, n) {
  const k = 2 / (n + 1); const out = Array(arr.length).fill(null);
  let s = arr.slice(0, n).reduce((a, b) => a + b, 0) / n; out[n - 1] = s;
  for (let i = n; i < arr.length; i++) { s = arr[i] * k + s * (1 - k); out[i] = s; }
  return out;
}

function calcRSI(closes, n = 14) {
  const out = Array(closes.length).fill(null);
  for (let i = n; i < closes.length; i++) {
    const slice = closes.slice(i - n, i + 1);
    let g = 0, l = 0;
    for (let j = 1; j < slice.length; j++) {
      const d = slice[j] - slice[j - 1];
      if (d > 0) g += d; else l -= d;
    }
    const ag = g / n, al = l / n;
    out[i] = al === 0 ? 100 : 100 - 100 / (1 + ag / al);
  }
  return out;
}

function calcMetrics(data, spyData) {
  const closes = data.map(d => d.close);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);
  const vols = data.map(d => d.volume);
  const n = closes.length;
  const i = n - 1;

  const ma50arr = sma(closes, 50);
  const ma200arr = sma(closes, 200);
  const rsiArr = calcRSI(closes);
  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);
  const macdLine = ema12.map((v, j) => v && ema26[j] ? v - ema26[j] : null);
  const validMacd = macdLine.filter(v => v != null);
  const signalArr = ema(validMacd, 9);
  const sigIdx = (k) => { let c = 0; for (let j = 0; j <= k; j++) if (macdLine[j] != null) c++; return c - 1; };

  // VWAP cumulative
  let cumTV = 0, cumV = 0;
  const vwapArr = data.map(d => {
    const tp = (d.high + d.low + d.close) / 3;
    cumTV += tp * d.volume; cumV += d.volume;
    return cumV > 0 ? cumTV / cumV : null;
  });

  // Bollinger
  const ma20 = sma(closes, 20);
  const stddev = closes.map((_, j) => {
    if (j < 19) return null;
    const sl = closes.slice(j - 19, j + 1);
    const m = sl.reduce((a, b) => a + b) / 20;
    return Math.sqrt(sl.reduce((a, b) => a + (b - m) ** 2, 0) / 20);
  });
  const bbUpper = ma20.map((m, j) => m && stddev[j] ? m + 2 * stddev[j] : null);
  const bbLower = ma20.map((m, j) => m && stddev[j] ? m - 2 * stddev[j] : null);

  const price = closes[i];
  const vol20 = vols.slice(Math.max(0, i - 20), i).reduce((a, b) => a + b, 0) / Math.min(20, i);
  const wk52High = Math.max(...highs.slice(Math.max(0, i - 251)));
  const wk52Low = Math.min(...lows.slice(Math.max(0, i - 251)));
  const low20 = Math.min(...lows.slice(Math.max(0, i - 19), i + 1));

  // MACD crossover
  let macdGreen = false;
  for (let j = i; j >= 1; j--) {
    const si = sigIdx(j); const sip = sigIdx(j - 1);
    if (macdLine[j] != null && si >= 0 && sip >= 0 && si < signalArr.length && sip < signalArr.length) {
      macdGreen = macdLine[j] > (signalArr[si] ?? 0) && macdLine[j - 1] <= (signalArr[sip] ?? 0);
      if (macdGreen) break;
      if (j < i - 5) break;
    }
  }

  // SPY relative strength
  let rsGreen = false;
  if (spyData && spyData.length >= 2) {
    const spyClose = spyData.map(d => d.close);
    const stockRet = (price - closes[i - 1]) / closes[i - 1];
    const spyRet = (spyClose[spyClose.length - 1] - spyClose[spyClose.length - 2]) / spyClose[spyClose.length - 2];
    rsGreen = stockRet > spyRet;
  }

  const bbRange = bbUpper[i] && bbLower[i] ? bbUpper[i] - bbLower[i] : 1;
  const bbPos = bbLower[i] ? (price - bbLower[i]) / bbRange : 0.5;

  const metrics = {
    rsi: rsiArr[i] != null && rsiArr[i] < 35,
    macd: macdGreen,
    ma50: ma50arr[i] != null && price > ma50arr[i],
    ma200: ma200arr[i] != null && price > ma200arr[i],
    golden: ma50arr[i] != null && ma200arr[i] != null && ma50arr[i] > ma200arr[i],
    vol: vols[i] > vol20 * 1.2,
    vwap: vwapArr[i] != null && price < vwapArr[i],
    bb: bbPos < 0.2,
    wk52: price <= wk52Low * 1.2,
    support: price <= low20 * 1.08,
    rs: rsGreen,
  };

  const score = Object.values(metrics).filter(Boolean).length;
  const values = {
    rsiVal: rsiArr[i]?.toFixed(1),
    ma50Val: ma50arr[i]?.toFixed(2),
    ma200Val: ma200arr[i]?.toFixed(2),
    vwapVal: vwapArr[i]?.toFixed(2),
    bbUpperVal: bbUpper[i]?.toFixed(2),
    bbLowerVal: bbLower[i]?.toFixed(2),
    wk52High: wk52High?.toFixed(2),
    wk52Low: wk52Low?.toFixed(2),
    volRatio: vol20 > 0 ? (vols[i] / vol20 * 100).toFixed(0) + "%" : "N/A",
  };

  return { metrics, score, values, price, prevClose: closes[i - 1] };
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const scoreColor = s => s >= 7 ? "high" : s >= 4 ? "mid" : "low";
const dotClass = v => v ? "green" : "red";
const pct = (a, b) => b ? ((a - b) / b * 100).toFixed(2) : "0.00";
const fmt = n => n != null ? Number(n).toFixed(2) : "—";

function ScoreBadge({ score }) {
  return <span className={`score-badge ${scoreColor(score)}`}>{score}/11</span>;
}

function MetricDots({ metrics }) {
  return (
    <div className="dots-row">
      {METRIC_KEYS.map(k => (
        <div key={k} title={METRIC_NAMES[METRIC_KEYS.indexOf(k)]} className={`dot ${dotClass(metrics[k])}`} />
      ))}
    </div>
  );
}

function MetricGrid({ metrics, values }) {
  const extras = [
    values?.rsiVal, null, values?.ma50Val, values?.ma200Val,
    null, values?.volRatio, values?.vwapVal,
    `${values?.bbLowerVal}–${values?.bbUpperVal}`,
    values?.wk52Low, null, null
  ];
  return (
    <div className="metric-grid">
      {METRIC_KEYS.map((k, i) => (
        <div key={k} className="metric-row">
          <div className={`dot ${dotClass(metrics[k])}`} />
          <span className="metric-label">{METRIC_NAMES[i]}</span>
          {extras[i] && <span className="metric-value">{extras[i]}</span>}
        </div>
      ))}
    </div>
  );
}

function Spinner() { return <div className="loading"><div className="spin" /><span>Loading…</span></div>; }

// ── STORAGE ───────────────────────────────────────────────────────────────────
const LS = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ══════════════════════════════════════════════════════════════════════════════
// TAB 1 — SCANNER
// ══════════════════════════════════════════════════════════════════════════════
function ScannerTab() {
  const [ticker, setTicker] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [waking, setWaking] = useState(false);
  const [error, setError] = useState("");

  const scan = async () => {
    if (!ticker.trim()) return;
    setLoading(true); setWaking(false); setError(""); setResult(null);
    try {
      const [{ data }, { data: spyData }] = await Promise.all([
        fetchYahoo(ticker.toUpperCase(), "1y", setWaking),
        fetchYahoo("SPY", "1y"),
      ]);
      const r = calcMetrics(data, spyData);
      setResult({ ...r, ticker: ticker.toUpperCase(), data });
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const markPurchased = () => {
    if (!result) return;
    const j = LS.get("journal", []);
    j.unshift({
      id: Date.now(), ticker: result.ticker, entryPrice: result.price,
      entryDate: new Date().toISOString().split("T")[0],
      metrics: result.metrics, exitPrice: null,
      score: result.score,
    });
    LS.set("journal", j);
    alert(`${result.ticker} logged to Journal at $${fmt(result.price)}`);
  };

  return (
    <div>
      <div className="header"><h1>Scanner</h1><span>Technical Analysis</span></div>
      <div className="input-row">
        <input className="input" placeholder="TICKER" value={ticker}
          onChange={e => setTicker(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && scan()} />
        <button className="btn" onClick={scan} disabled={loading}>Scan</button>
      </div>
      {loading && !waking && <Spinner />}
      {waking && (
        <div className="loading" style={{flexDirection:"column",alignItems:"flex-start",gap:6}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}><div className="spin"/><span>Waking up server…</span></div>
          <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--mono)"}}>Free servers sleep after inactivity. First request takes ~20–30 seconds.</div>
        </div>
      )}
      {error && <div className="error">⚠ {error}</div>}
      {result && (
        <>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)" }}>{result.ticker}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 600 }}>${fmt(result.price)}</div>
                <div className={`chg ${result.price >= result.prevClose ? "pos" : "neg"}`}>
                  {result.price >= result.prevClose ? "▲" : "▼"} {Math.abs(pct(result.price, result.prevClose))}%
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <ScoreBadge score={result.score} />
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Signal Score</div>
              </div>
            </div>
            <div className="dots-row" style={{ marginBottom: 12 }}>
              {METRIC_KEYS.map(k => (
                <div key={k} title={METRIC_NAMES[METRIC_KEYS.indexOf(k)]} className={`dot ${dotClass(result.metrics[k])}`} />
              ))}
            </div>
            <button className="btn btn-sm" style={{ marginRight: 8 }} onClick={markPurchased}>Mark as Purchased</button>
          </div>
          <div className="card">
            <div className="card-title">Metric Breakdown</div>
            <MetricGrid metrics={result.metrics} values={result.values} />
          </div>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 2 — BACKTEST
// ══════════════════════════════════════════════════════════════════════════════
function BacktestTab() {
  const [ticker, setTicker] = useState("");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!ticker.trim()) return;
    setLoading(true); setError(""); setRows([]); setSummary(null);
    try {
      const [{ data: allData }, { data: spyData }] = await Promise.all([
        fetchYahoo(ticker.toUpperCase(), "2y"),
        fetchYahoo("SPY", "2y"),
      ]);
      const filtered = allData.filter(d => d.date >= startDate && d.date <= endDate);
      const startIdx = allData.findIndex(d => d.date >= startDate);
      const results = [];
      for (let i = 0; i < filtered.length; i++) {
        const idx = startIdx + i;
        if (idx < 200) continue;
        const slice = allData.slice(0, idx + 1);
        const spySlice = spyData.slice(0, Math.min(spyData.length, idx + 1));
        const r = calcMetrics(slice, spySlice);
        const price = filtered[i].close;
        const fwd5 = allData[idx + 5]?.close;
        const fwd10 = allData[idx + 10]?.close;
        const fwd20 = allData[idx + 20]?.close;
        results.push({
          date: filtered[i].date, price,
          metrics: r.metrics, score: r.score,
          fwd5: fwd5 ? pct(fwd5, price) : null,
          fwd10: fwd10 ? pct(fwd10, price) : null,
          fwd20: fwd20 ? pct(fwd20, price) : null,
        });
      }
      setRows(results);

      // Summary
      const highScore = results.filter(r => r.score >= 7);
      const allFwd10 = results.filter(r => r.fwd10 != null).map(r => parseFloat(r.fwd10));
      const hsFwd10 = highScore.filter(r => r.fwd10 != null).map(r => parseFloat(r.fwd10));
      const avg = arr => arr.length ? (arr.reduce((a, b) => a + b) / arr.length).toFixed(2) : "N/A";
      setSummary({
        totalDays: results.length, highScoreDays: highScore.length,
        avgAll10: avg(allFwd10), avgHS10: avg(hsFwd10),
      });
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div>
      <div className="header"><h1>Backtest</h1><span>Historical Analysis</span></div>
      <div className="input-row">
        <input className="input" placeholder="TICKER" value={ticker}
          onChange={e => setTicker(e.target.value.toUpperCase())} style={{ maxWidth: 100 }} />
        <input type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" className="input" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <button className="btn" onClick={run} disabled={loading}>Run</button>
      </div>
      {loading && <Spinner />}
      {error && <div className="error">⚠ {error}</div>}
      {summary && (
        <div className="card">
          <div className="card-title">Summary — 10-Day Forward Returns</div>
          <div className="two-col">
            <div className="stat-box">
              <div className="val" style={{ color: "var(--accent)" }}>{summary.avgHS10}%</div>
              <div className="lbl">Avg when 7+ green</div>
            </div>
            <div className="stat-box">
              <div className="val">{summary.avgAll10}%</div>
              <div className="lbl">Avg all days</div>
            </div>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}>
            {summary.highScoreDays} high-signal days out of {summary.totalDays} total
          </div>
        </div>
      )}
      {rows.length > 0 && (
        <div className="card">
          <div className="card-title">Day-by-Day Results</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th><th>Price</th><th>Score</th><th>Metrics</th>
                  <th>+5d</th><th>+10d</th><th>+20d</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 200).map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td>${fmt(r.price)}</td>
                    <td><ScoreBadge score={r.score} /></td>
                    <td><MetricDots metrics={r.metrics} /></td>
                    <td className={r.fwd5 > 0 ? "pnl-pos" : "pnl-neg"}>{r.fwd5 != null ? `${r.fwd5}%` : "—"}</td>
                    <td className={r.fwd10 > 0 ? "pnl-pos" : "pnl-neg"}>{r.fwd10 != null ? `${r.fwd10}%` : "—"}</td>
                    <td className={r.fwd20 > 0 ? "pnl-pos" : "pnl-neg"}>{r.fwd20 != null ? `${r.fwd20}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 3 — WATCHLIST
// ══════════════════════════════════════════════════════════════════════════════
function WatchlistTab({ onScanTicker }) {
  const [watchlist, setWatchlist] = useState(() => LS.get("watchlist", []));
  const [input, setInput] = useState("");
  const [cardData, setCardData] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const save = (list) => { setWatchlist(list); LS.set("watchlist", list); };

  const add = () => {
    const t = input.trim().toUpperCase();
    if (!t || watchlist.includes(t)) return;
    save([...watchlist, t]); setInput("");
  };

  const remove = (t) => save(watchlist.filter(x => x !== t));

  const refresh = async () => {
    setRefreshing(true);
    const spyRes = await fetchYahoo("SPY").catch(() => ({ data: [] }));
    const updates = {};
    await Promise.all(watchlist.map(async t => {
      try {
        const { data } = await fetchYahoo(t);
        const r = calcMetrics(data, spyRes.data);
        updates[t] = r;
      } catch { updates[t] = null; }
    }));
    setCardData(prev => ({ ...prev, ...updates }));
    setRefreshing(false);
  };

  useEffect(() => { if (watchlist.length) refresh(); }, [watchlist.length]);

  return (
    <div>
      <div className="header"><h1>Watchlist</h1>
        <button className="btn btn-sm btn-ghost" onClick={refresh} disabled={refreshing}>
          {refreshing ? "…" : "↻ Refresh"}
        </button>
      </div>
      <div className="input-row">
        <input className="input" placeholder="Add ticker" value={input}
          onChange={e => setInput(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && add()} />
        <button className="btn" onClick={add}>Add</button>
      </div>
      {watchlist.length === 0 && <div className="info">No tickers in watchlist yet</div>}
      {watchlist.map(t => {
        const d = cardData[t];
        return (
          <div key={t} className="ticker-card">
            <div className="top">
              <div>
                <div className="sym">{t}</div>
                {d && (
                  <>
                    <div className="price">${fmt(d.price)}</div>
                    <div className={`chg ${d.price >= d.prevClose ? "pos" : "neg"}`}>
                      {d.price >= d.prevClose ? "▲" : "▼"} {Math.abs(pct(d.price, d.prevClose))}%
                    </div>
                  </>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                {d && <ScoreBadge score={d.score} />}
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button className="btn btn-sm" onClick={() => onScanTicker(t)}>Scan</button>
                  <button className="btn btn-sm btn-ghost btn-red" onClick={() => remove(t)}>✕</button>
                </div>
              </div>
            </div>
            {d && <MetricDots metrics={d.metrics} />}
            {!d && <div className="loading"><div className="spin" /></div>}
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 4 — TOP 10
// ══════════════════════════════════════════════════════════════════════════════
function Top10Tab({ onScanTicker }) {
  const [active, setActive] = useState(new Set(["Mega Cap"]));
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const toggle = s => setActive(prev => {
    const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n;
  });

  const tickers = [...new Set([...active].flatMap(s => SECTORS[s] || []))];

  const run = async () => {
    if (!tickers.length) return;
    setRunning(true); setError(""); setResults([]); setProgress(0);
    try {
      const spyRes = await fetchYahoo("SPY").catch(() => ({ data: [] }));
      const out = [];
      for (let i = 0; i < tickers.length; i++) {
        const t = tickers[i];
        try {
          const { data } = await fetchYahoo(t);
          const r = calcMetrics(data, spyRes.data);
          out.push({ ticker: t, ...r });
        } catch {}
        setProgress(Math.round((i + 1) / tickers.length * 100));
      }
      out.sort((a, b) => b.score - a.score);
      setResults(out.slice(0, 10));
    } catch (e) { setError(e.message); }
    setRunning(false);
  };

  const rankBadge = i => {
    if (i === 0) return <span className="rank-gold">🥇</span>;
    if (i === 1) return <span className="rank-silver">🥈</span>;
    if (i === 2) return <span className="rank-bronze">🥉</span>;
    return <span style={{ fontFamily: "var(--mono)", color: "var(--muted)" }}>#{i + 1}</span>;
  };

  return (
    <div>
      <div className="header"><h1>Top 10</h1><span>Bulk Scanner</span></div>
      <div className="card">
        <div className="card-title">Select Sectors ({tickers.length} tickers)</div>
        <div style={{ marginBottom: 8 }}>
          <button className="btn btn-sm btn-ghost" style={{ marginRight: 6 }}
            onClick={() => setActive(new Set(Object.keys(SECTORS)))}>All</button>
          <button className="btn btn-sm btn-ghost" onClick={() => setActive(new Set())}>None</button>
        </div>
        <div>
          {Object.entries(SECTORS).map(([s, ts]) => (
            <span key={s} className={`pill ${active.has(s) ? "active" : ""}`} onClick={() => toggle(s)}>
              {s} <span className="count">{ts.length}</span>
            </span>
          ))}
        </div>
      </div>
      <button className="btn" style={{ width: "100%", marginBottom: 12 }} onClick={run} disabled={running || !tickers.length}>
        {running ? `Scanning… ${progress}%` : `Run Scan (${tickers.length} tickers)`}
      </button>
      {running && (
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      )}
      {error && <div className="error">⚠ {error}</div>}
      {results.length > 0 && (
        <div className="card">
          <div className="card-title">Top 10 Results</div>
          {results.map((r, i) => (
            <div key={r.ticker} style={{ borderBottom: i < 9 ? "1px solid var(--border)" : "none", padding: "12px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {rankBadge(i)}
                  <span style={{ fontSize: 16, fontWeight: 800, color: "var(--accent)" }}>{r.ticker}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 13 }}>${fmt(r.price)}</span>
                  <span className={`chg ${r.price >= r.prevClose ? "pos" : "neg"}`}>
                    {r.price >= r.prevClose ? "▲" : "▼"}{Math.abs(pct(r.price, r.prevClose))}%
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ScoreBadge score={r.score} />
                  <button className="btn btn-sm" onClick={() => onScanTicker(r.ticker)}>Scan</button>
                </div>
              </div>
              <MetricDots metrics={r.metrics} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 5 — WINNERS
// ══════════════════════════════════════════════════════════════════════════════
function WinnersTab() {
  const [tickerList, setTickerList] = useState("");
  const [minPct, setMinPct] = useState("7");
  const [days, setDays] = useState("10");
  const [lookback, setLookback] = useState("1y");
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    const tickers = tickerList.split(/[\s,]+/).map(t => t.trim().toUpperCase()).filter(Boolean);
    if (!tickers.length) return;
    setRunning(true); setError(""); setResults([]); setProgress(0);
    const spyRes = await fetchYahoo("SPY", "2y").catch(() => ({ data: [] }));
    const all = [];
    const minMove = parseFloat(minPct) / 100;
    const fwdDays = parseInt(days);

    for (let ti = 0; ti < tickers.length; ti++) {
      const t = tickers[ti];
      try {
        const { data } = await fetchYahoo(t, "2y");
        for (let i = 200; i < data.length - fwdDays; i++) {
          const slice = data.slice(0, i + 1);
          const r = calcMetrics(slice, spyRes.data);
          const entryPrice = data[i].close;
          const exitPrice = data[i + fwdDays]?.close;
          if (!exitPrice) continue;
          const move = (exitPrice - entryPrice) / entryPrice;
          if (move >= minMove) {
            all.push({
              ticker: t, entryDate: data[i].date, entryPrice,
              exitPrice, movePct: (move * 100).toFixed(2),
              metrics: r.metrics, score: r.score,
            });
          }
        }
      } catch {}
      setProgress(Math.round((ti + 1) / tickers.length * 100));
    }
    all.sort((a, b) => parseFloat(b.movePct) - parseFloat(a.movePct));
    setResults(all);

    // Save to pattern lab
    if (all.length) {
      LS.set("winners_data", all);
      alert(`${all.length} winning setups saved to Pattern Lab`);
    }
    setRunning(false);
  };

  return (
    <div>
      <div className="header"><h1>Winners</h1><span>Historical Win Finder</span></div>
      <div className="card">
        <div className="card-title">Configuration</div>
        <textarea placeholder="Paste ticker list (one per line or comma separated)&#10;AAPL, MSFT, NVDA..."
          value={tickerList} onChange={e => setTickerList(e.target.value)} />
        <div className="input-row" style={{ marginTop: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Min Move %</div>
            <input className="input" type="number" value={minPct} onChange={e => setMinPct(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Within Days</div>
            <input className="input" type="number" value={days} onChange={e => setDays(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Lookback</div>
            <select value={lookback} onChange={e => setLookback(e.target.value)} className="input">
              <option value="6mo">6 months</option>
              <option value="1y">1 year</option>
              <option value="2y">2 years</option>
            </select>
          </div>
        </div>
        <button className="btn" style={{ width: "100%" }} onClick={run} disabled={running}>
          {running ? `Scanning… ${progress}%` : "Find Winners"}
        </button>
        {running && <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>}
      </div>
      {error && <div className="error">⚠ {error}</div>}
      {results.length > 0 && (
        <>
          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 13 }}>
              Found <span style={{ color: "var(--accent)" }}>{results.length}</span> winning setups — saved to Pattern Lab
            </div>
          </div>
          {results.slice(0, 50).map((r, i) => (
            <div key={i} className="winner-card">
              <div className="wc-top">
                <div>
                  <span style={{ fontWeight: 800, color: "var(--accent)", fontSize: 16 }}>{r.ticker}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>{r.entryDate}</span>
                </div>
                <span className="tag green">+{r.movePct}%</span>
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 12, marginBottom: 8 }}>
                Entry ${fmt(r.entryPrice)} → Exit ${fmt(r.exitPrice)} &nbsp;
                <ScoreBadge score={r.score} />
              </div>
              <MetricDots metrics={r.metrics} />
            </div>
          ))}
          {results.length > 50 && <div className="info">Showing 50 of {results.length} results</div>}
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 6 — PATTERN LAB
// ══════════════════════════════════════════════════════════════════════════════
function PatternLabTab() {
  const [data, setData] = useState(() => LS.get("winners_data", []));
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const d = LS.get("winners_data", []);
    setData(d);
    if (d.length) analyze(d);
  }, []);

  const analyze = (winners) => {
    // Metric frequencies
    const freq = {};
    METRIC_KEYS.forEach(k => { freq[k] = 0; });
    winners.forEach(w => METRIC_KEYS.forEach(k => { if (w.metrics[k]) freq[k]++; }));
    const total = winners.length;
    const freqPct = Object.fromEntries(METRIC_KEYS.map(k => [k, (freq[k] / total * 100).toFixed(1)]));

    // Pair combos
    const pairs = {};
    winners.forEach(w => {
      const greenKeys = METRIC_KEYS.filter(k => w.metrics[k]);
      for (let a = 0; a < greenKeys.length; a++) {
        for (let b = a + 1; b < greenKeys.length; b++) {
          const key = `${greenKeys[a]}+${greenKeys[b]}`;
          pairs[key] = (pairs[key] || 0) + 1;
        }
      }
    });
    const topPairs = Object.entries(pairs).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Weighted custom score
    const weights = Object.fromEntries(METRIC_KEYS.map(k => [k, parseFloat(freqPct[k])]));
    LS.set("custom_weights", weights);

    // Insights
    const topMetric = METRIC_KEYS.reduce((a, b) => freq[a] > freq[b] ? a : b);
    const insights = [
      `Most frequent green metric: ${METRIC_NAMES[METRIC_KEYS.indexOf(topMetric)]} appeared in ${freqPct[topMetric]}% of winners.`,
      `Analyzed ${total} winning setups across all tickers.`,
      `Custom Golden Signal weights saved — Scanner will now use personalized scoring.`,
      topPairs[0] ? `Top metric pair: ${topPairs[0][0].split("+").map(k => METRIC_NAMES[METRIC_KEYS.indexOf(k)]).join(" + ")} (${topPairs[0][1]} co-occurrences).` : "",
    ].filter(Boolean);

    setAnalysis({ freqPct, topPairs, insights, total });
  };

  if (!data.length) return (
    <div>
      <div className="header"><h1>Pattern Lab</h1></div>
      <div className="info">Run the Winners tab first to generate data</div>
    </div>
  );

  return (
    <div>
      <div className="header"><h1>Pattern Lab</h1><span>{analysis?.total} setups</span></div>
      {analysis && (
        <>
          <div className="card">
            <div className="card-title">Metric Frequency in Winners</div>
            {METRIC_KEYS.map((k, i) => (
              <div key={k} className="freq-bar">
                <div className="freq-label">{METRIC_NAMES[i].slice(0, 14)}</div>
                <div className="freq-track">
                  <div className="freq-fill" style={{ width: `${analysis.freqPct[k]}%` }}>
                    {parseFloat(analysis.freqPct[k]) > 20 ? `${analysis.freqPct[k]}%` : ""}
                  </div>
                </div>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", minWidth: 32 }}>
                  {analysis.freqPct[k]}%
                </span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">Top Metric Pairs</div>
            {analysis.topPairs.map(([pair, count], i) => {
              const [a, b] = pair.split("+");
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--text)" }}>
                    {METRIC_NAMES[METRIC_KEYS.indexOf(a)]?.slice(0, 12)} + {METRIC_NAMES[METRIC_KEYS.indexOf(b)]?.slice(0, 12)}
                  </span>
                  <span className="tag green">{count}x</span>
                </div>
              );
            })}
          </div>

          <div className="card">
            <div className="card-title">AI Insights</div>
            {analysis.insights.map((ins, i) => (
              <div key={i} className="insight-box">{ins}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 7 — JOURNAL
// ══════════════════════════════════════════════════════════════════════════════
function JournalTab() {
  const [journal, setJournal] = useState(() => LS.get("journal", []));
  const [exitInputs, setExitInputs] = useState({});

  const save = (j) => { setJournal(j); LS.set("journal", j); };

  const logExit = (id) => {
    const price = parseFloat(exitInputs[id]);
    if (isNaN(price)) return;
    save(journal.map(e => e.id === id ? { ...e, exitPrice: price } : e));
    setExitInputs(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const remove = (id) => save(journal.filter(e => e.id !== id));

  return (
    <div>
      <div className="header"><h1>Journal</h1><span>{journal.length} trades</span></div>
      {journal.length === 0 && <div className="info">No trades logged yet. Use Scanner → Mark as Purchased</div>}
      {journal.map(e => {
        const pnl = e.exitPrice ? pct(e.exitPrice, e.entryPrice) : null;
        return (
          <div key={e.id} className="ticker-card">
            <div className="top">
              <div>
                <div className="sym">{e.ticker}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>{e.entryDate}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 14, marginTop: 4 }}>Entry: ${fmt(e.entryPrice)}</div>
                {e.exitPrice && (
                  <div style={{ fontFamily: "var(--mono)", fontSize: 14 }}>Exit: ${fmt(e.exitPrice)}</div>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <ScoreBadge score={e.score} />
                {pnl !== null && (
                  <div className={`score-badge ${parseFloat(pnl) >= 0 ? "high" : "low"}`} style={{ fontSize: 16, display: "block", marginTop: 4 }}>
                    {parseFloat(pnl) >= 0 ? "+" : ""}{pnl}%
                  </div>
                )}
                <button className="btn btn-sm btn-ghost btn-red" style={{ marginTop: 8 }} onClick={() => remove(e.id)}>Remove</button>
              </div>
            </div>
            <MetricDots metrics={e.metrics} />
            {!e.exitPrice && (
              <div className="input-row" style={{ marginTop: 10 }}>
                <input className="input" type="number" placeholder="Exit price"
                  value={exitInputs[e.id] || ""}
                  onChange={ev => setExitInputs(prev => ({ ...prev, [e.id]: ev.target.value }))} />
                <button className="btn btn-sm" onClick={() => logExit(e.id)}>Log Exit</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NAV ICONS
// ══════════════════════════════════════════════════════════════════════════════
const Icons = {
  Scanner: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Backtest: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Watchlist: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Top10: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Winners: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Patterns: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h.01M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg>,
  Journal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
};

const TABS = ["Scanner","Backtest","Watchlist","Top10","Winners","Patterns","Journal"];
const TAB_LABELS = ["Scanner","Backtest","Watch","Top 10","Winners","Patterns","Journal"];

// ══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("Scanner");
  const [scanTicker, setScanTicker] = useState("");

  const goScan = (ticker) => { setScanTicker(ticker); setTab("Scanner"); };

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  return (
    <div className="app">
      {tab === "Scanner" && <ScannerTab key={scanTicker} initialTicker={scanTicker} />}
      {tab === "Backtest" && <BacktestTab />}
      {tab === "Watchlist" && <WatchlistTab onScanTicker={goScan} />}
      {tab === "Top10" && <Top10Tab onScanTicker={goScan} />}
      {tab === "Winners" && <WinnersTab />}
      {tab === "Patterns" && <PatternLabTab />}
      {tab === "Journal" && <JournalTab />}

      <nav className="nav">
        {TABS.map((t, i) => (
          <button key={t} className={`nav-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {Icons[t]}
            {TAB_LABELS[i]}
          </button>
        ))}
      </nav>
    </div>
  );
}
