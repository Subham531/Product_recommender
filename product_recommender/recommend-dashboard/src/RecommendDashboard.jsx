import { useState, useEffect } from "react";

const DEMO_USERS = ["A3OXHLG6DIBRW8", "ADLVFFE4VBT8", "A3QNKF7DTPBXMR", "A1MSKMM61LYY6C"];

const MOCK_DATA = {
  "A3OXHLG6DIBRW8": [
    { "Product ID": "B00004ZCJE", SVD_Prediction: 4.81, Weighted_Rating: 4.76, Final_Score: 4.785 },
    { "Product ID": "B0002L5R78", SVD_Prediction: 4.74, Weighted_Rating: 4.65, Final_Score: 4.695 },
    { "Product ID": "B000BQ7GW8", SVD_Prediction: 4.69, Weighted_Rating: 4.60, Final_Score: 4.645 },
    { "Product ID": "B00007E7JU", SVD_Prediction: 4.55, Weighted_Rating: 4.59, Final_Score: 4.570 },
    { "Product ID": "B000HPV3RW", SVD_Prediction: 4.49, Weighted_Rating: 4.52, Final_Score: 4.505 },
  ],
  "ADLVFFE4VBT8": [
    { "Product ID": "B000HPV3RW", SVD_Prediction: 4.88, Weighted_Rating: 4.76, Final_Score: 4.820 },
    { "Product ID": "B00004ZCJE", SVD_Prediction: 4.71, Weighted_Rating: 4.65, Final_Score: 4.680 },
    { "Product ID": "B000BQ7GW8", SVD_Prediction: 4.63, Weighted_Rating: 4.60, Final_Score: 4.615 },
    { "Product ID": "B0002L5R78", SVD_Prediction: 4.52, Weighted_Rating: 4.59, Final_Score: 4.555 },
    { "Product ID": "B00007E7JU", SVD_Prediction: 4.41, Weighted_Rating: 4.52, Final_Score: 4.465 },
  ],
};

const getMockRecs = (uid) => {
  return MOCK_DATA[uid] || MOCK_DATA["A3OXHLG6DIBRW8"].map(r => ({
    ...r, Final_Score: +(r.Final_Score - Math.random() * 0.1).toFixed(3)
  }));
};

const ScoreBar = ({ value, max = 5, color }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${pct}%`, background: color,
        borderRadius: 2, transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)"
      }} />
    </div>
  );
};

const RankBadge = ({ rank }) => {
  const colors = ["#FFD700", "#C0C0C0", "#CD7F32", "#6B7280", "#6B7280"];
  const labels = ["1st", "2nd", "3rd", "4th", "5th"];
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      border: `1.5px solid ${colors[rank - 1]}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 700, color: colors[rank - 1],
      fontFamily: "'DM Mono', monospace", flexShrink: 0,
      background: `${colors[rank - 1]}12`
    }}>
      {labels[rank - 1]}
    </div>
  );
};

const RecCard = ({ item, rank, visible }) => {
  const score = item.Final_Score ?? item.final_score ?? 0;
  const svd = item.SVD_Prediction ?? item.svd_prediction ?? 0;
  const wr = item.Weighted_Rating ?? item.weighted_rating ?? 0;
  const pid = item["Product ID"] ?? item.product_id ?? "—";

  return (
    <div style={{
      display: "flex", gap: 16, alignItems: "flex-start",
      padding: "20px 24px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 0.5s ease ${rank * 80}ms, transform 0.5s ease ${rank * 80}ms`,
    }}>
      <RankBadge rank={rank} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 13,
            color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em"
          }}>
            {pid}
          </span>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 22,
            fontWeight: 700, color: "#E2F0FF", letterSpacing: "-0.02em"
          }}>
            {score.toFixed(3)}
          </span>
        </div>
        <ScoreBar value={score} color="rgba(99,179,237,0.7)" />
        <div style={{ display: "flex", gap: 24, marginTop: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 4 }}>SVD PREDICT</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{svd.toFixed(3)}</div>
            <div style={{ marginTop: 4 }}><ScoreBar value={svd} color="rgba(154,117,255,0.6)" /></div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 4 }}>BAYESIAN WR</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{wr.toFixed(3)}</div>
            <div style={{ marginTop: 4 }}><ScoreBar value={wr} color="rgba(72,213,151,0.6)" /></div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 4 }}>HYBRID SCORE</div>
            <div style={{
              display: "inline-block",
              padding: "2px 10px", borderRadius: 20,
              background: "rgba(99,179,237,0.12)",
              border: "1px solid rgba(99,179,237,0.25)",
              fontSize: 12, color: "#63b3ed", fontWeight: 600
            }}>
              {score >= 4.7 ? "Top Pick" : score >= 4.5 ? "Recommended" : "Suggested"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [userId, setUserId] = useState("");
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardsVisible, setCardsVisible] = useState(false);
  const [mode, setMode] = useState("idle");
  const [coldStart, setColdStart] = useState(false);

  const fetchRecs = async (uid) => {
    if (!uid.trim()) return;
    setLoading(true);
    setError("");
    setCardsVisible(false);
    setMode("loading");
    setColdStart(false);

    try {
      const res = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: uid.trim() }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const recList = data.recommendations ?? data;
      if (data.cold_start) setColdStart(true);
      setRecs(recList);
    } catch {
      setRecs(getMockRecs(uid.trim()));
      setError("demo");
    } finally {
      setLoading(false);
      setMode("results");
      setTimeout(() => setCardsVisible(true), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchRecs(userId);
  };

  const dots = [0, 1, 2];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0B0F1A",
      fontFamily: "'Inter', sans-serif",
      padding: "0 0 80px 0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; }
        ::selection { background: rgba(99,179,237,0.3); }
        input::placeholder { color: rgba(255,255,255,0.2); }
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%{opacity:0.4} 50%{opacity:0.8} 100%{opacity:0.4} }
      `}</style>

      <div style={{
        maxWidth: 720, margin: "0 auto", padding: "0 24px",
      }}>

        {/* Header */}
        <div style={{ padding: "56px 0 48px", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(99,179,237,0.08)",
            border: "1px solid rgba(99,179,237,0.2)",
            borderRadius: 20, padding: "4px 14px",
            fontSize: 11, color: "#63b3ed",
            fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em",
            marginBottom: 20,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#48d593", animation: "pulse 2s ease-in-out infinite" }} />
            SVD HYBRID ENGINE · LIVE
          </div>
          <h1 style={{
            fontSize: 38, fontWeight: 600, color: "#E2F0FF",
            letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 10,
          }}>
            Recommendation<br />
            <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>Dashboard</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, fontWeight: 400, lineHeight: 1.6 }}>
            Matrix factorization + Bayesian quality scoring.<br />
            77 products · 6,234 interactions · 0.99 RMSE
          </p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: "flex", gap: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14, padding: 6,
          }}>
            <input
              value={userId}
              onChange={e => setUserId(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter user ID  e.g. A3OXHLG6DIBRW8"
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "#E2F0FF", fontSize: 14, padding: "10px 14px",
                fontFamily: "'DM Mono', monospace", letterSpacing: "0.03em",
              }}
            />
            <button
              onClick={() => fetchRecs(userId)}
              disabled={loading || !userId.trim()}
              style={{
                background: loading ? "rgba(99,179,237,0.1)" : "rgba(99,179,237,0.15)",
                border: "1px solid rgba(99,179,237,0.3)",
                borderRadius: 10, color: "#63b3ed",
                padding: "10px 22px", fontSize: 13, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s", whiteSpace: "nowrap",
                opacity: !userId.trim() ? 0.4 : 1,
              }}
            >
              {loading ? "Fetching…" : "Get Recs →"}
            </button>
          </div>

          {/* Quick user pills */}
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", lineHeight: "26px" }}>TRY:</span>
            {DEMO_USERS.map(u => (
              <button key={u} onClick={() => { setUserId(u); fetchRecs(u); }} style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20, padding: "3px 12px", fontSize: 11,
                color: "rgba(255,255,255,0.4)", cursor: "pointer",
                fontFamily: "'DM Mono', monospace", transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.target.style.borderColor = "rgba(99,179,237,0.4)"; e.target.style.color = "#63b3ed"; }}
                onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "rgba(255,255,255,0.4)"; }}
              >
                {u.substring(0, 10)}…
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
              {dots.map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#63b3ed",
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
                }} />
              ))}
            </div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>
              Running SVD inference across 77 products…
            </div>
          </div>
        )}

        {/* Demo mode notice */}
        {!loading && error === "demo" && mode === "results" && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,180,0,0.06)", border: "1px solid rgba(255,180,0,0.2)",
            borderRadius: 10, padding: "10px 16px", marginBottom: 20,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FBBF24", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "rgba(255,191,36,0.8)", fontFamily: "'DM Mono', monospace" }}>
              DEMO MODE — Flask API not reachable. Showing mock data. Start your server: <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 4 }}>python app.py</code>
            </span>
          </div>
        )}

        {/* Cold start notice */}
        {!loading && coldStart && mode === "results" && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(154,117,255,0.06)", border: "1px solid rgba(154,117,255,0.2)",
            borderRadius: 10, padding: "10px 16px", marginBottom: 20,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#9a75ff", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "rgba(154,117,255,0.8)", fontFamily: "'DM Mono', monospace" }}>
              COLD START — Unknown user. Showing popularity-based fallback recommendations.
            </span>
          </div>
        )}

        {/* Results header */}
        {!loading && mode === "results" && recs.length > 0 && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 16,
            opacity: cardsVisible ? 1 : 0, transition: "opacity 0.4s ease",
          }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>
              TOP {recs.length} RECOMMENDATIONS
            </div>
            <div style={{
              fontSize: 11, color: "rgba(255,255,255,0.2)",
              fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em"
            }}>
              USER · {userId.substring(0, 14)}
            </div>
          </div>
        )}

        {/* Rec cards */}
        {!loading && recs.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recs.map((item, i) => (
              <RecCard key={i} item={item} rank={i + 1} visible={cardsVisible} />
            ))}
          </div>
        )}

        {/* Idle state */}
        {mode === "idle" && (
          <div style={{
            textAlign: "center", padding: "60px 0",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.15)", lineHeight: 2, fontFamily: "'DM Mono', monospace" }}>
              SVD · Bayesian Avg · Exponential Decay<br />
              Flask API · Surprise Library · Hybrid Re-ranking
            </div>
          </div>
        )}

        {/* Legend */}
        {!loading && mode === "results" && recs.length > 0 && (
          <div style={{
            display: "flex", gap: 20, marginTop: 32, justifyContent: "center",
            opacity: cardsVisible ? 1 : 0, transition: "opacity 0.4s ease 0.4s",
          }}>
            {[
              { color: "rgba(99,179,237,0.7)", label: "Final score" },
              { color: "rgba(154,117,255,0.6)", label: "SVD prediction" },
              { color: "rgba(72,213,151,0.6)", label: "Bayesian rating" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 20, height: 3, borderRadius: 2, background: color }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" }}>{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
