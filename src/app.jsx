import { useState, useEffect } from "react";

// ============================================================
// ⚙️  CONFIG SUPABASE — Remplace ces 2 valeurs
// ============================================================
const SUPABASE_URL = "https://nleerfuyjgvxbczymmna.supabase.co";   // ← ton URL Supabase
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZWVyZnV5amd2eGJjenltbW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTIwMjYzNiwiZXhwIjoyMDk0Nzc4NjM2fQ.DRtYfEFcGPcxm0u5vYSWR4KFcgcemkdVEdMF08PJrbs";   // ← ta clé SERVICE (secret)
const ADMIN_PASSWORD = "picsous2026";                       // ← change ce mot de passe

// ============================================================
// SUPABASE CLIENT LÉGER
// ============================================================
async function supabase(method, table, body = null, filters = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}${filters}`;
  const res = await fetch(url, {
    method,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": method === "POST" ? "return=representation" : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return method === "DELETE" ? null : res.json();
}

const db = {
  get: (table, filters = "") => supabase("GET", table, null, `?order=created_at.desc${filters}`),
  insert: (table, data) => supabase("POST", table, data),
  update: (table, id, data) => supabase("PATCH", table, data, `?id=eq.${id}`),
  delete: (table, id) => supabase("DELETE", table, null, `?id=eq.${id}`),
};

// ============================================================
// COULEURS & CONSTANTES
// ============================================================
const C = {
  bg: "#07080f", card: "#0f1019", border: "#1c1c2e",
  red: "#e94560", gold: "#f5a623", green: "#25d366",
  blue: "#4a9eff", text: "#fff", muted: "#8892a4", dim: "#2a2a3a",
};
const SPORTS = ["football", "basketball", "tennis"];
const SPORT_EMOJI = { football: "⚽", basketball: "🏀", tennis: "🎾" };

// ============================================================
// STYLES
// ============================================================
const S = {
  app: { fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, minHeight: "100vh", color: C.text },
  loginWrap: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 20 },
  loginCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40, width: "100%", maxWidth: 380, textAlign: "center" },
  loginTitle: { fontSize: 28, fontWeight: 800, color: C.red, marginBottom: 4 },
  loginSub: { fontSize: 13, color: C.muted, marginBottom: 28 },
  layout: { display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" },
  sidebar: { background: "#0a0a14", borderRight: `1px solid ${C.border}`, padding: "24px 0", position: "sticky", top: 0, height: "100vh", overflowY: "auto" },
  sidebarLogo: { padding: "0 20px 20px", borderBottom: `1px solid ${C.border}` },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", cursor: "pointer", background: active ? "rgba(233,69,96,0.1)" : "transparent", borderLeft: active ? `3px solid ${C.red}` : "3px solid transparent", color: active ? C.red : C.muted, fontSize: 13, fontWeight: 600, transition: "all 0.15s" }),
  main: { padding: 28, overflowY: "auto", maxWidth: 900 },
  pageTitle: { fontSize: 22, fontWeight: 800, marginBottom: 4 },
  pageSub: { fontSize: 13, color: C.muted, marginBottom: 24 },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16 },
  cardTitle: { fontSize: 14, fontWeight: 700, marginBottom: 14, color: C.gold },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  label: { fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 5, display: "block", letterSpacing: 0.5 },
  input: { width: "100%", background: "#0b0b14", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 13, outline: "none", marginBottom: 0, fontFamily: "inherit", boxSizing: "border-box" },
  textarea: { width: "100%", background: "#0b0b14", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit", resize: "vertical", minHeight: 90, boxSizing: "border-box" },
  select: { width: "100%", background: "#0b0b14", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 13, outline: "none", fontFamily: "inherit" },
  btn: (color = C.red) => ({ background: color, color: "#fff", border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5, transition: "opacity 0.2s" }),
  btnSm: (color = C.red) => ({ background: color, color: "#fff", border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }),
  btnOutline: { background: "transparent", color: C.red, border: `1px solid ${C.red}`, borderRadius: 8, padding: "9px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  divider: { height: 1, background: C.border, margin: "18px 0" },
  alert: (c) => ({ background: c + "18", border: `1px solid ${c}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: c, marginBottom: 14 }),
  badge: (c) => ({ background: c + "22", color: c, border: `1px solid ${c}44`, borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 700 }),
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: 1, borderBottom: `1px solid ${C.border}`, background: "#0a0a14" },
  td: { padding: "11px 12px", fontSize: 12, borderBottom: `1px solid ${C.border}55`, verticalAlign: "middle" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 },
  statCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 14px", textAlign: "center" },
  statVal: { fontSize: 26, fontWeight: 900, display: "block", marginBottom: 2 },
  statLbl: { fontSize: 10, color: C.muted, letterSpacing: 1 },
};

// ============================================================
// COMPOSANT : CONNEXION
// ============================================================
function Login({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  function attempt() {
    if (pw === ADMIN_PASSWORD) onLogin();
    else setErr("Mot de passe incorrect.");
  }
  return (
    <div style={S.loginWrap}>
      <div style={S.loginCard}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>⚡</div>
        <div style={S.loginTitle}>PicsousBet</div>
        <div style={S.loginSub}>Panel d'administration</div>
        {err && <div style={S.alert(C.red)}>{err}</div>}
        <input style={{ ...S.input, marginBottom: 12 }} type="password" placeholder="Mot de passe"
          value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && attempt()} />
        <button style={{ ...S.btn(), width: "100%" }} onClick={attempt}>CONNEXION →</button>
      </div>
    </div>
  );
}

// ============================================================
// COMPOSANT : DASHBOARD
// ============================================================
function Dashboard({ counts }) {
  return (
    <div>
      <div style={S.pageTitle}>Tableau de bord</div>
      <div style={S.pageSub}>Vue d'ensemble de PicsousBet</div>
      <div style={S.statsRow}>
        <div style={S.statCard}><span style={{ ...S.statVal, color: C.blue }}>{counts.matches}</span><span style={S.statLbl}>MATCHS PUBLIÉS</span></div>
        <div style={S.statCard}><span style={{ ...S.statVal, color: C.gold }}>{counts.articles}</span><span style={S.statLbl}>ARTICLES</span></div>
        <div style={S.statCard}><span style={{ ...S.statVal, color: C.green }}>{counts.coupons}</span><span style={S.statLbl}>COUPONS</span></div>
      </div>
      <div style={{ ...S.card, borderColor: C.gold + "44" }}>
        <div style={S.cardTitle}>📖 Guide d'utilisation rapide</div>
        {[
          { icon: "⚽", title: "Matchs & Pronostics", desc: "Ajoutez les matchs du jour avec vos pronostics. Ils apparaissent immédiatement sur l'app client." },
          { icon: "🎯", title: "Coupons", desc: "Publiez vos coupons du jour. Après les matchs, revenez marquer ✅ Gagné ou ❌ Perdu." },
          { icon: "📰", title: "Articles", desc: "Rédigez vos articles chaque matin. Ils seront visibles dans la section Articles de l'app client." },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <div><strong style={{ color: C.text, fontSize: 13 }}>{item.title}</strong><br /><span style={{ color: C.muted, fontSize: 12 }}>{item.desc}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// COMPOSANT : MATCHS
// ============================================================
function MatchesPanel() {
  const blank = { sport: "football", league: "", home_team: "", away_team: "", home_logo: "🔴", away_logo: "🔵", match_date: "", match_time: "", home_odds: "", draw_odds: "", away_odds: "", prediction: "", predicted_score: "", confidence: "", reasoning: "", tip: "", stars: "4" };
  const [form, setForm] = useState(blank);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  function notify(text, color = C.green) { setMsg({ text, color }); setTimeout(() => setMsg(null), 3000); }
  function setF(k, v) { setForm(f => ({ ...f, [k]: v })); }

  useEffect(() => { db.get("matches").then(setRows).catch(console.error).finally(() => setLoading(false)); }, []);

  async function handleAdd() {
    if (!form.home_team || !form.away_team || !form.league || !form.match_date) return notify("Remplis les champs obligatoires (équipes, ligue, date).", C.red);
    setSaving(true);
    try {
      const payload = { ...form, home_odds: Number(form.home_odds) || null, draw_odds: Number(form.draw_odds) || null, away_odds: Number(form.away_odds) || null, confidence: Number(form.confidence) || null, stars: Number(form.stars) };
      const [created] = await db.insert("matches", payload);
      setRows(r => [created, ...r]);
      setForm(blank);
      notify("✅ Match publié sur l'app client !");
    } catch (e) { notify("Erreur : " + e.message, C.red); }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer ce match ?")) return;
    await db.delete("matches", id);
    setRows(r => r.filter(x => x.id !== id));
    notify("Match supprimé.");
  }

  return (
    <div>
      <div style={S.pageTitle}>Matchs & Pronostics</div>
      <div style={S.pageSub}>Saisie manuelle — publiés immédiatement sur l'app</div>
      {msg && <div style={S.alert(msg.color)}>{msg.text}</div>}

      <div style={S.card}>
        <div style={S.cardTitle}>➕ Ajouter un match</div>
        <div style={S.grid3}>
          <div><label style={S.label}>Sport *</label>
            <select style={S.select} value={form.sport} onChange={e => setF("sport", e.target.value)}>
              {SPORTS.map(s => <option key={s} value={s}>{SPORT_EMOJI[s]} {s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select></div>
          <div><label style={S.label}>Ligue / Compétition *</label>
            <input style={S.input} placeholder="Ex: Champions League" value={form.league} onChange={e => setF("league", e.target.value)} /></div>
          <div><label style={S.label}>Date *</label>
            <input style={S.input} type="date" value={form.match_date} onChange={e => setF("match_date", e.target.value)} /></div>
        </div>
        <div style={{ ...S.grid3, marginTop: 10 }}>
          <div><label style={S.label}>Équipe domicile *</label>
            <input style={S.input} placeholder="Ex: Real Madrid" value={form.home_team} onChange={e => setF("home_team", e.target.value)} /></div>
          <div><label style={S.label}>Heure</label>
            <input style={S.input} placeholder="21:00" value={form.match_time} onChange={e => setF("match_time", e.target.value)} /></div>
          <div><label style={S.label}>Équipe extérieur *</label>
            <input style={S.input} placeholder="Ex: Barcelona" value={form.away_team} onChange={e => setF("away_team", e.target.value)} /></div>
        </div>
        <div style={{ ...S.grid3, marginTop: 10 }}>
          <div><label style={S.label}>Cote 1 (domicile)</label>
            <input style={S.input} type="number" step="0.01" placeholder="2.10" value={form.home_odds} onChange={e => setF("home_odds", e.target.value)} /></div>
          <div><label style={S.label}>Cote X (nul — foot uniquement)</label>
            <input style={S.input} type="number" step="0.01" placeholder="3.40" value={form.draw_odds} onChange={e => setF("draw_odds", e.target.value)} /></div>
          <div><label style={S.label}>Cote 2 (extérieur)</label>
            <input style={S.input} type="number" step="0.01" placeholder="3.20" value={form.away_odds} onChange={e => setF("away_odds", e.target.value)} /></div>
        </div>
        <div style={S.divider} />
        <div style={{ ...S.cardTitle, color: C.green }}>🔮 Ton Pronostic</div>
        <div style={{ ...S.grid3, marginBottom: 10 }}>
          <div><label style={S.label}>Prédiction</label>
            <input style={S.input} placeholder="Ex: Victoire Domicile" value={form.prediction} onChange={e => setF("prediction", e.target.value)} /></div>
          <div><label style={S.label}>Score prédit</label>
            <input style={S.input} placeholder="Ex: 2-1" value={form.predicted_score} onChange={e => setF("predicted_score", e.target.value)} /></div>
          <div><label style={S.label}>Confiance (%)</label>
            <input style={S.input} type="number" min="0" max="100" placeholder="78" value={form.confidence} onChange={e => setF("confidence", e.target.value)} /></div>
        </div>
        <div style={{ marginBottom: 10 }}><label style={S.label}>Analyse (raisonnement)</label>
          <textarea style={S.textarea} placeholder="Ton analyse en 2-3 phrases..." value={form.reasoning} onChange={e => setF("reasoning", e.target.value)} /></div>
        <div style={S.grid2}>
          <div><label style={S.label}>Tip pari</label>
            <input style={S.input} placeholder="Ex: Miser sur le 1X en double chance" value={form.tip} onChange={e => setF("tip", e.target.value)} /></div>
          <div><label style={S.label}>Note qualité (étoiles)</label>
            <select style={S.select} value={form.stars} onChange={e => setF("stars", e.target.value)}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{"★".repeat(n)} ({n}/5)</option>)}
            </select></div>
        </div>
        <button style={{ ...S.btn(C.green), marginTop: 14, opacity: saving ? 0.6 : 1 }} onClick={handleAdd} disabled={saving}>
          {saving ? "Publication en cours..." : "✅ PUBLIER CE MATCH"}
        </button>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>📋 Matchs publiés ({rows.length})</div>
        {loading ? <div style={{ color: C.muted, fontSize: 13 }}>Chargement...</div> : rows.length === 0 ? <div style={{ color: C.muted, fontSize: 13 }}>Aucun match pour l'instant.</div> : (
          <div style={{ overflowX: "auto" }}>
            <table style={S.table}>
              <thead><tr>
                <th style={S.th}>SPORT</th><th style={S.th}>MATCH</th><th style={S.th}>LIGUE</th>
                <th style={S.th}>DATE</th><th style={S.th}>PRONOSTIC</th><th style={S.th}>ACTION</th>
              </tr></thead>
              <tbody>
                {rows.map(m => (
                  <tr key={m.id}>
                    <td style={S.td}>{SPORT_EMOJI[m.sport]}</td>
                    <td style={S.td}><strong>{m.home_team}</strong> vs <strong>{m.away_team}</strong></td>
                    <td style={S.td}><span style={S.badge(C.blue)}>{m.league}</span></td>
                    <td style={S.td}>{m.match_date} {m.match_time}</td>
                    <td style={S.td}><span style={S.badge(C.green)}>{m.prediction || "—"}</span></td>
                    <td style={S.td}><button style={S.btnSm(C.red)} onClick={() => handleDelete(m.id)}>🗑 Supprimer</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// COMPOSANT : COUPONS
// ============================================================
function CouponsPanel() {
  const blank = { sport: "football", home_team: "", away_team: "", league: "", match_date: "", prediction: "", odds: "", status: "pending", note: "" };
  const [form, setForm] = useState(blank);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  function notify(text, color = C.green) { setMsg({ text, color }); setTimeout(() => setMsg(null), 3000); }
  function setF(k, v) { setForm(f => ({ ...f, [k]: v })); }

  useEffect(() => { db.get("coupons").then(setRows).catch(console.error).finally(() => setLoading(false)); }, []);

  async function handleAdd() {
    if (!form.home_team || !form.away_team || !form.prediction) return notify("Remplis les équipes et le pronostic.", C.red);
    setSaving(true);
    try {
      const [created] = await db.insert("coupons", { ...form, odds: Number(form.odds) || null });
      setRows(r => [created, ...r]);
      setForm(blank);
      notify("✅ Coupon publié !");
    } catch (e) { notify("Erreur : " + e.message, C.red); }
    setSaving(false);
  }

  async function changeStatus(id, status) {
    try {
      await db.update("coupons", id, { status });
      setRows(r => r.map(x => x.id === id ? { ...x, status } : x));
      notify(status === "won" ? "✅ Marqué comme Gagné !" : status === "lost" ? "❌ Marqué comme Perdu." : "⏳ Remis en attente.", status === "won" ? C.green : status === "lost" ? C.red : C.gold);
    } catch (e) { notify("Erreur : " + e.message, C.red); }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer ce coupon ?")) return;
    await db.delete("coupons", id);
    setRows(r => r.filter(x => x.id !== id));
  }

  const statusColor = { won: C.green, lost: C.red, pending: C.gold };
  const statusLabel = { won: "✅ Gagné", lost: "❌ Perdu", pending: "⏳ En attente" };

  return (
    <div>
      <div style={S.pageTitle}>Coupons & Résultats</div>
      <div style={S.pageSub}>Publie tes coupons puis mets à jour leur résultat après les matchs</div>
      {msg && <div style={S.alert(msg.color)}>{msg.text}</div>}

      <div style={S.card}>
        <div style={S.cardTitle}>➕ Nouveau coupon</div>
        <div style={S.grid3}>
          <div><label style={S.label}>Sport</label>
            <select style={S.select} value={form.sport} onChange={e => setF("sport", e.target.value)}>
              {SPORTS.map(s => <option key={s}>{s}</option>)}
            </select></div>
          <div><label style={S.label}>Équipe 1 *</label>
            <input style={S.input} placeholder="Domicile" value={form.home_team} onChange={e => setF("home_team", e.target.value)} /></div>
          <div><label style={S.label}>Équipe 2 *</label>
            <input style={S.input} placeholder="Extérieur" value={form.away_team} onChange={e => setF("away_team", e.target.value)} /></div>
        </div>
        <div style={{ ...S.grid3, marginTop: 10 }}>
          <div><label style={S.label}>Ligue</label>
            <input style={S.input} placeholder="Champions League" value={form.league} onChange={e => setF("league", e.target.value)} /></div>
          <div><label style={S.label}>Date du match</label>
            <input style={S.input} type="date" value={form.match_date} onChange={e => setF("match_date", e.target.value)} /></div>
          <div><label style={S.label}>Cote totale du coupon</label>
            <input style={S.input} type="number" step="0.01" placeholder="3.25" value={form.odds} onChange={e => setF("odds", e.target.value)} /></div>
        </div>
        <div style={{ ...S.grid2, marginTop: 10 }}>
          <div><label style={S.label}>Pronostic *</label>
            <input style={S.input} placeholder="Ex: 1X + Over 1.5 + Victoire PSG" value={form.prediction} onChange={e => setF("prediction", e.target.value)} /></div>
          <div><label style={S.label}>Statut</label>
            <select style={S.select} value={form.status} onChange={e => setF("status", e.target.value)}>
              <option value="pending">⏳ En attente</option>
              <option value="won">✅ Gagné</option>
              <option value="lost">❌ Perdu</option>
            </select></div>
        </div>
        <div style={{ marginTop: 10 }}><label style={S.label}>Note / Commentaire (optionnel)</label>
          <input style={S.input} placeholder="Ex: Combiné 3 sélections, confiance haute" value={form.note} onChange={e => setF("note", e.target.value)} /></div>
        <button style={{ ...S.btn(C.gold), marginTop: 14, opacity: saving ? 0.6 : 1 }} onClick={handleAdd} disabled={saving}>
          {saving ? "Enregistrement..." : "📋 PUBLIER CE COUPON"}
        </button>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>🎯 Tous les coupons ({rows.length})</div>
        {loading ? <div style={{ color: C.muted }}>Chargement...</div> : rows.length === 0 ? <div style={{ color: C.muted, fontSize: 13 }}>Aucun coupon.</div> : (
          <div style={{ overflowX: "auto" }}>
            <table style={S.table}>
              <thead><tr>
                <th style={S.th}>MATCH</th><th style={S.th}>PRONOSTIC</th><th style={S.th}>COTE</th>
                <th style={S.th}>DATE</th><th style={S.th}>STATUT</th><th style={S.th}>CHANGER</th><th style={S.th}>SUP</th>
              </tr></thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id}>
                    <td style={S.td}>{SPORT_EMOJI[r.sport]} {r.home_team} vs {r.away_team}</td>
                    <td style={S.td}>{r.prediction}</td>
                    <td style={S.td}><strong style={{ color: C.gold }}>×{r.odds}</strong></td>
                    <td style={S.td}>{r.match_date}</td>
                    <td style={S.td}><span style={S.badge(statusColor[r.status])}>{statusLabel[r.status]}</span></td>
                    <td style={S.td}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button style={S.btnSm(C.green)} onClick={() => changeStatus(r.id, "won")}>✅</button>
                        <button style={S.btnSm(C.red)} onClick={() => changeStatus(r.id, "lost")}>❌</button>
                        <button style={S.btnSm(C.gold)} onClick={() => changeStatus(r.id, "pending")}>⏳</button>
                      </div>
                    </td>
                    <td style={S.td}><button style={S.btnSm(C.dim)} onClick={() => handleDelete(r.id)}>🗑</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// COMPOSANT : ARTICLES (rédaction manuelle)
// ============================================================
function ArticlesPanel() {
  const blank = { title: "", sport: "football", intro: "", body: "", conclusion: "", tags: "", read_time: "3", status: "published" };
  const [form, setForm] = useState(blank);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [editing, setEditing] = useState(null);

  function notify(text, color = C.green) { setMsg({ text, color }); setTimeout(() => setMsg(null), 3000); }
  function setF(k, v) { setForm(f => ({ ...f, [k]: v })); }

  useEffect(() => { db.get("articles").then(setRows).catch(console.error).finally(() => setLoading(false)); }, []);

  async function handleSave() {
    if (!form.title || !form.intro) return notify("Le titre et l'introduction sont obligatoires.", C.red);
    setSaving(true);
    try {
      const payload = { ...form, read_time: Number(form.read_time) || 3 };
      if (editing) {
        await db.update("articles", editing, payload);
        setRows(r => r.map(x => x.id === editing ? { ...x, ...payload } : x));
        notify("✅ Article mis à jour !");
        setEditing(null);
      } else {
        const [created] = await db.insert("articles", payload);
        setRows(r => [created, ...r]);
        notify("✅ Article publié sur l'app client !");
      }
      setForm(blank);
    } catch (e) { notify("Erreur : " + e.message, C.red); }
    setSaving(false);
  }

  function startEdit(a) {
    setEditing(a.id);
    setForm({ title: a.title, sport: a.sport, intro: a.intro || "", body: a.body || "", conclusion: a.conclusion || "", tags: a.tags || "", read_time: String(a.read_time || 3), status: a.status || "published" });
    window.scrollTo(0, 0);
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer cet article ?")) return;
    await db.delete("articles", id);
    setRows(r => r.filter(x => x.id !== id));
    notify("Article supprimé.");
  }

  return (
    <div>
      <div style={S.pageTitle}>Articles</div>
      <div style={S.pageSub}>Rédige et publie tes articles directement depuis ce panel</div>
      {msg && <div style={S.alert(msg.color)}>{msg.text}</div>}

      <div style={S.card}>
        <div style={S.cardTitle}>{editing ? "✏️ Modifier l'article" : "✍️ Nouvel article"}</div>
        <div style={S.grid2}>
          <div><label style={S.label}>Titre de l'article *</label>
            <input style={S.input} placeholder="Ex: Analyse PSG vs Real Madrid — Quart UCL" value={form.title} onChange={e => setF("title", e.target.value)} /></div>
          <div><label style={S.label}>Sport</label>
            <select style={S.select} value={form.sport} onChange={e => setF("sport", e.target.value)}>
              {SPORTS.map(s => <option key={s}>{s}</option>)}
            </select></div>
        </div>
        <div style={{ marginTop: 10 }}><label style={S.label}>Introduction *  <span style={{ color: C.muted, fontWeight: 400 }}>(1-2 phrases d'accroche)</span></label>
          <textarea style={S.textarea} placeholder="Ex: Le choc de la semaine approche. PSG et Real Madrid s'affrontent pour une place en demi-finale..." value={form.intro} onChange={e => setF("intro", e.target.value)} /></div>
        <div style={{ marginTop: 10 }}><label style={S.label}>Corps de l'article  <span style={{ color: C.muted, fontWeight: 400 }}>(développe ton analyse)</span></label>
          <textarea style={{ ...S.textarea, minHeight: 160 }} placeholder="Développe ici ton analyse complète, les statistiques, la forme des équipes, les absences, etc." value={form.body} onChange={e => setF("body", e.target.value)} /></div>
        <div style={{ marginTop: 10 }}><label style={S.label}>Conclusion  <span style={{ color: C.muted, fontWeight: 400 }}>(ton verdict final)</span></label>
          <textarea style={S.textarea} placeholder="Ex: En définitive, nous conseillons de miser sur... avec le code PICSOUS sur 1xbet pour profiter du bonus 200%." value={form.conclusion} onChange={e => setF("conclusion", e.target.value)} /></div>
        <div style={{ ...S.grid3, marginTop: 10 }}>
          <div><label style={S.label}>Tags  <span style={{ color: C.muted, fontWeight: 400 }}>(séparés par virgule)</span></label>
            <input style={S.input} placeholder="Ex: UCL, PSG, analyse" value={form.tags} onChange={e => setF("tags", e.target.value)} /></div>
          <div><label style={S.label}>Temps de lecture (minutes)</label>
            <input style={S.input} type="number" min="1" placeholder="3" value={form.read_time} onChange={e => setF("read_time", e.target.value)} /></div>
          <div><label style={S.label}>Statut</label>
            <select style={S.select} value={form.status} onChange={e => setF("status", e.target.value)}>
              <option value="published">🟢 Publié</option>
              <option value="draft">⚪ Brouillon</option>
            </select></div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button style={{ ...S.btn(C.green), opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement..." : editing ? "💾 METTRE À JOUR" : "📢 PUBLIER L'ARTICLE"}
          </button>
          {editing && <button style={S.btnOutline} onClick={() => { setEditing(null); setForm(blank); }}>Annuler</button>}
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>📚 Articles publiés ({rows.length})</div>
        {loading ? <div style={{ color: C.muted }}>Chargement...</div> : rows.length === 0 ? <div style={{ color: C.muted, fontSize: 13 }}>Aucun article.</div> : (
          <div style={{ overflowX: "auto" }}>
            <table style={S.table}>
              <thead><tr>
                <th style={S.th}>TITRE</th><th style={S.th}>SPORT</th>
                <th style={S.th}>STATUT</th><th style={S.th}>DATE</th><th style={S.th}>ACTIONS</th>
              </tr></thead>
              <tbody>
                {rows.map(a => (
                  <tr key={a.id}>
                    <td style={S.td}>{a.title}</td>
                    <td style={S.td}><span style={S.badge(C.gold)}>{SPORT_EMOJI[a.sport]} {a.sport}</span></td>
                    <td style={S.td}><span style={S.badge(a.status === "published" ? C.green : C.muted)}>{a.status === "published" ? "🟢 Publié" : "⚪ Brouillon"}</span></td>
                    <td style={S.td}>{new Date(a.created_at).toLocaleDateString("fr-FR")}</td>
                    <td style={S.td}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={S.btnSm(C.blue)} onClick={() => startEdit(a)}>✏️ Modifier</button>
                        <button style={S.btnSm(C.red)} onClick={() => handleDelete(a.id)}>🗑 Suppr.</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// APP PRINCIPALE ADMIN
// ============================================================
export default function AdminApp() {
  const [auth, setAuth] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [counts, setCounts] = useState({ matches: 0, articles: 0, coupons: 0 });

  useEffect(() => {
    if (!auth) return;
    Promise.all([db.get("matches"), db.get("articles"), db.get("coupons")])
      .then(([m, a, c]) => setCounts({ matches: m.length, articles: a.length, coupons: c.length }))
      .catch(console.error);
  }, [auth]);

  const nav = [
    { id: "dashboard", icon: "📊", label: "Tableau de bord" },
    { id: "matches", icon: "⚽", label: "Matchs & Pronostics" },
    { id: "coupons", icon: "🎯", label: "Coupons & Résultats" },
    { id: "articles", icon: "📰", label: "Articles" },
  ];

  if (!auth) return <Login onLogin={() => setAuth(true)} />;

  return (
    <>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { background: ${C.bg}; } input, select, textarea { color: ${C.text} !important; } input::placeholder, textarea::placeholder { color: ${C.muted} !important; } input:focus, textarea:focus, select:focus { border-color: ${C.red} !important; } table tr:hover td { background: rgba(255,255,255,0.02); }`}</style>
      <div style={S.layout}>
        <div style={S.sidebar}>
          <div style={S.sidebarLogo}>
            <div style={{ fontSize: 20, fontWeight: 900, color: C.red }}>⚡ PicsousBet</div>
            <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2 }}>ADMIN PANEL</div>
          </div>
          <div style={{ marginTop: 12 }}>
            {nav.map(n => (
              <div key={n.id} style={S.navItem(page === n.id)} onClick={() => setPage(n.id)}>
                <span style={{ fontSize: 16 }}>{n.icon}</span><span>{n.label}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "20px", marginTop: 40, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>Connecté en admin</div>
            <button style={S.btnOutline} onClick={() => setAuth(false)}>Déconnexion</button>
          </div>
        </div>
        <div style={S.main}>
          {page === "dashboard" && <Dashboard counts={counts} />}
          {page === "matches" && <MatchesPanel />}
          {page === "coupons" && <CouponsPanel />}
          {page === "articles" && <ArticlesPanel />}
        </div>
      </div>
    </>
  );
}