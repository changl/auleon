// AuLeon wireframes — main app (tabs + tweaks)

const { useState: useS, useEffect: useE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "annotations": true,
  "chatTrigger": "bubble",
  "bgTreatment": "charcoal-grain",
  "showSwatches": true
}/*EDITMODE-END*/;

const TABS = [
  { id: 'timeline', label: 'Story beats' },
  { id: 'a', label: 'Pinned cinematic' },
  { id: 'b', label: 'Chapter snap' },
  { id: 'c', label: 'Continuous theatre' },
];

function App() {
  const [tab, setTab] = useS('timeline');
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply bg treatment via body class
  useE(() => {
    document.body.classList.toggle('no-annotations', !t.annotations);
    document.body.dataset.bg = t.bgTreatment;
  }, [t.annotations, t.bgTreatment]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <img src="assets/logo.png" alt="AuLeon" />
          <div className="app-brand-meta">
            <span className="ttl">Parallax site — wireframes</span>
            <span className="sub">v0.1 · low-fi · 3 directions + beats</span>
          </div>
        </div>
        <nav className="app-tabs">
          {TABS.map((x, i) => (
            <button
              key={x.id}
              className={`app-tab ${tab === x.id ? 'is-active' : ''}`}
              onClick={() => setTab(x.id)}
            >
              <span className="tab-no">{String(i).padStart(2, '0')}</span>{x.label}
            </button>
          ))}
        </nav>
      </header>

      <p className="app-intro">
        a quick exploration of <b>three scroll mechanics</b> for the RFQ-to-contract paper story —
        crumpled ball → unfold → laser → particle → digital → outreach → award.
        each direction tells the same beats with a different rhythm. flip between tabs to compare,
        or open the <b>Tweaks</b> panel to swap chat trigger / background / annotation density live.
      </p>

      <div>
        {tab === 'timeline' && <TimelineView />}
        {tab === 'a' && <DirectionA />}
        {tab === 'b' && <DirectionB />}
        {tab === 'c' && <DirectionC />}
      </div>

      <footer style={{
        textAlign: 'center', padding: '40px 0 0',
        fontFamily: 'Caveat, cursive', fontSize: 18, color: 'rgba(244,236,219,0.4)',
      }}>
        — drop stop-frame PNGs into <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--gold-2)' }}>assets/frames/</code> and we'll wire them into the picked direction —
      </footer>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Annotations">
          <TweakToggle
            label="Show handwritten notes"
            value={t.annotations}
            onChange={(v) => setTweak('annotations', v)}
          />
        </TweakSection>

        <TweakSection label="Chat trigger style">
          <TweakSelect
            label="Style"
            value={t.chatTrigger}
            onChange={(v) => setTweak('chatTrigger', v)}
            options={[
              { value: 'bubble', label: 'Floating bubble (A default)' },
              { value: 'orb', label: 'Pulsing orb (B default)' },
              { value: 'dock', label: 'Bottom dock (C default)' },
              { value: 'nav', label: 'Nav button — Talk to Leo' },
            ]}
          />
          <div style={{
            marginTop: 14, padding: 18, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.3)', borderRadius: 6,
            minHeight: 120,
          }}>
            <ChatTrigger kind={t.chatTrigger} />
          </div>
        </TweakSection>

        <TweakSection label="Background swatches">
          <TweakToggle
            label="Show site bg in this preview"
            value={t.showSwatches}
            onChange={(v) => setTweak('showSwatches', v)}
          />
          {t.showSwatches && (
            <TweakRadio
              label="Treatment"
              value={t.bgTreatment}
              onChange={(v) => setTweak('bgTreatment', v)}
              options={[
                { value: 'charcoal-grain', label: 'Charcoal grain' },
                { value: 'navy-grid', label: 'Navy grid' },
                { value: 'film-vignette', label: 'Film vignette' },
              ]}
            />
          )}
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
