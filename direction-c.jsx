// Direction C — "Continuous Theatre"
// Paper rides along on a continuous scroll, parallax layers behind, text boxes drift in/out.
// Chat = persistent bottom dock with "Talk to Leo".

const DirectionC = () => {
  return (
    <SketchSheet
      label="Direction C — Continuous Theatre"
      sub="No pinning · paper rides scroll · parallax layers · text drifts in/out"
      tilt={-0.1}
    >
      <p className="sk-intro-text">
        <Note color="gold" arrow="down">paper is the cursor</Note>
        &nbsp; — instead of pinning the hero, the paper itself follows scroll position. Background
        layers move at different speeds for depth. Most "natural" scroll feel of the three.
      </p>

      <SectionTitle no="C.01" title="Parallax layer stack" sub="how depth is built" />
      <div className="stage">
        <div className="stage-grain" />
        <div className="stage-stage-label">3 PARALLAX LAYERS · sticky paper · drifting copy</div>
        <div style={{
          position: 'absolute', inset: 24,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {[
            { sp: '0.3×', label: 'BACK · gold particles + grain', col: 'rgba(228,185,74,0.15)' },
            { sp: '0.6×', label: 'MID · soft shapes (desk surface, light cone)', col: 'rgba(228,185,74,0.3)' },
            { sp: '1.0×', label: 'FRONT · paper itself + scan effects', col: 'rgba(228,185,74,0.6)' },
            { sp: '1.2×', label: 'OVER · drifting text blocks (faster than scroll)', col: 'rgba(244,236,219,0.5)' },
          ].map((l, i) => (
            <div key={i} style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 14,
              padding: '6px 14px',
              border: '1.5px dashed rgba(228,185,74,0.35)', borderRadius: 4,
              background: 'rgba(0,0,0,0.25)',
            }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                color: l.col, minWidth: 36,
              }}>{l.sp}</span>
              <span style={{
                fontFamily: 'Caveat, cursive', fontSize: 18, color: l.col,
              }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <SectionTitle no="C.02" title="Vertical scroll storyboard" sub="continuous strip · roughly 6× viewport" />
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
      }}>
        {[
          { vh: '0vh', title: 'Hero load', frame: 1, vrt: 'ball', side: 'L', body: 'paper LEFT · headline + sub RIGHT · Leo dock idle' },
          { vh: '60vh', title: 'Scroll begins', frame: 2, vrt: 'ball', side: 'C', body: 'ball drifts toward center · first text dissolves up · second text drifts in from below' },
          { vh: '140vh', title: 'Lands & unfolds', frame: 4, vrt: 'unfolded', side: 'R', body: 'paper settles RIGHT · stains/notes annotated with hover pins · text LEFT' },
          { vh: '230vh', title: 'Red laser scan', frame: 5, vrt: 'scan-red', side: 'R', body: 'beam syncs to scroll · annotations reveal as beam crosses them' },
          { vh: '300vh', title: 'Blue particle lift', frame: 6, vrt: 'scan-blue', side: 'R', body: 'paper edges become particles · scatter into background field' },
          { vh: '380vh', title: 'Digital RFQ blank', frame: 7, vrt: 'screen', side: 'C', body: 'screen materializes from particle cloud · empty form' },
          { vh: '450vh', title: 'Requirements gathered', frame: 7, vrt: 'screen', side: 'L', body: 'fields populate as you scroll · text RIGHT names the framework' },
          { vh: '520vh', title: 'Outreach montage', frame: 7, vrt: 'screen', side: 'R', body: 'emails, call cards, sheets cascade in from sides · text LEFT' },
          { vh: '600vh', title: 'Submitted · received · awarded', frame: 8, vrt: 'screen', side: 'C', body: 'three quick stamps · final CTA reveal' },
        ].map((s, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12,
            padding: 12,
            border: '1.5px dashed rgba(43,36,26,0.25)', borderRadius: 6,
            background: 'rgba(228,185,74,0.04)',
          }}>
            <FrameStub frameNo={s.frame} title={s.title} variant={s.vrt} h={130} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'space-between' }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                color: 'var(--gold)',
              }}>SCROLL · {s.vh} · paper {s.side}</div>
              <div style={{
                fontFamily: 'Architects Daughter, cursive', fontSize: 17, color: 'var(--ink)',
              }}>{s.title}</div>
              <div style={{
                fontFamily: 'Caveat, cursive', fontSize: 16, color: 'var(--ink-soft)',
                lineHeight: 1.3,
              }}>{s.body}</div>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle no="C.03" title="Drifting text blocks" sub="how copy enters and leaves" />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
      }}>
        <div style={{ padding: 12, border: '1.5px dashed rgba(43,36,26,0.3)' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--gold)' }}>ENTER</div>
          <div style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: 'var(--ink)' }}>↑ from below</div>
          <Note color="gray">y: 80 → 0 · opacity 0 → 1</Note>
        </div>
        <div style={{ padding: 12, border: '1.5px dashed rgba(43,36,26,0.3)' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--gold)' }}>EXIT</div>
          <div style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: 'var(--ink)' }}>↑ keep going</div>
          <Note color="gray">faster than scroll · y: 0 → -120</Note>
        </div>
        <div style={{ padding: 12, border: '1.5px dashed rgba(43,36,26,0.3)' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--gold)' }}>SIDE-SWAP</div>
          <div style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: 'var(--ink)' }}>L ↔ R</div>
          <Note color="gray">when paper crosses center</Note>
        </div>
        <div style={{ padding: 12, border: '1.5px dashed rgba(43,36,26,0.3)' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--gold)' }}>CALLOUTS</div>
          <div style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: 'var(--ink)' }}>pin → arrow</div>
          <Note color="gray">on stains, notes, fields</Note>
        </div>
      </div>

      <SectionTitle no="C.04" title="Chat trigger" sub="persistent dock · talk-first" />
      <div style={{ padding: '20px 0' }}>
        <ChatTrigger kind="dock" />
        <div style={{ marginTop: 16 }}>
          <Note color="gold">↑ floats above content · slightly transparent · expands on focus</Note><br />
          <Note color="gray">mic icon initiates voice · text input always visible · feels conversational</Note>
        </div>
      </div>

      <div className="pc">
        <div className="pros">
          <h4>strengths</h4>
          <ul>
            <li>most natural scroll feel — no jacking</li>
            <li>parallax depth gives the dark bg something to do</li>
            <li>easiest to add/remove beats without restructuring</li>
          </ul>
        </div>
        <div className="cons">
          <h4>watch-outs</h4>
          <ul>
            <li>pacing depends on user's scroll speed — needs guardrails</li>
            <li>fast scrollers may miss key beats — consider mini-pins on big reveals</li>
            <li>more total scroll (~6vh) — keep CTAs reachable</li>
          </ul>
        </div>
      </div>
    </SketchSheet>
  );
};

window.DirectionC = DirectionC;
