// Direction A — "Pinned Cinematic"
// Hero pins. Scroll scrubs the paper animation through all stages, then releases into vertical sections.
// Chat trigger: floating bubble.

const DirectionA = () => {
  return (
    <SketchSheet
      label="Direction A — Pinned Cinematic"
      sub="Hero pins · scroll scrubs · then releases · 1 chapter, 1 reveal"
      tilt={-0.2}
    >
      <p className="sk-intro-text">
        <Note color="gold" arrow="down">single uninterrupted hero scene</Note>
        &nbsp; — viewer scrolls through ~5 viewport-heights while the paper animation plays in place.
        Body releases into normal flow afterward.
      </p>

      <SectionTitle no="A.01" title="Stage map" sub="what's pinned vs what scrolls" />
      <div className="stage">
        <div className="stage-grain" />
        <div className="stage-stage-label">PINNED HERO · 100vh · ~500vh of scroll inside</div>

        {/* schematic of pinned stage */}
        <div style={{
          position: 'absolute', inset: 30, display: 'grid',
          gridTemplateColumns: '1fr 1fr', gap: 20,
        }}>
          <div style={{
            border: '2px dashed rgba(228,185,74,0.5)',
            borderRadius: 8, padding: 12,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              color: 'rgba(228,185,74,0.7)',
            }}>LEFT TRACK · paper</div>
            <div style={{
              fontFamily: 'Caveat, cursive', fontSize: 18, color: 'var(--gold-soft)',
              textAlign: 'center', lineHeight: 1.2,
            }}>
              ball slides right + unfolds<br />
              (concurrent) ➝ scanned ➝ dissolves into screens
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
              color: 'rgba(244,236,219,0.4)',
            }}>x: 0% → 100% · 0–80% scroll</div>
          </div>
          <div style={{
            border: '2px dashed rgba(228,185,74,0.5)',
            borderRadius: 8, padding: 12,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              color: 'rgba(228,185,74,0.7)',
            }}>RIGHT TRACK · text</div>
            <div style={{
              fontFamily: 'Caveat, cursive', fontSize: 18, color: 'var(--gold-soft)',
              textAlign: 'center', lineHeight: 1.2,
            }}>
              hero copy ➝ fades ➝ <br />
              swap to LEFT side as paper lands ➝<br />
              new copy fades through
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
              color: 'rgba(244,236,219,0.4)',
            }}>opacity, x-shift, swap-side</div>
          </div>
        </div>
      </div>

      <SectionTitle no="A.02" title="Scroll beats" sub="what happens at each scroll percentage" />
      <div className="scroll-strip">
        {[
          { no: '01', pct: '0–10%', t: 'Crumpled ball, hero copy', a: ['paper · LEFT, ball form', 'text · RIGHT, headline + sub', 'Leo bubble · idle bottom-right'] },
          { no: '02', pct: '10–25%', t: 'Ball travels right AND unfolds simultaneously', a: ['paper translates X → while crumple opens', 'first text fades out', 'subtle parallax dust drifts left'] },
          { no: '03', pct: '25–40%', t: 'Paper lands RIGHT, fully flat — coffee stains, notes', a: ['new text block enters from LEFT', '“the messy reality of an RFQ”', 'callout pins on stains/notes'] },
          { no: '04', pct: '40–55%', t: 'Red laser scan top → bottom', a: ['paper stays put', 'red beam sweeps', 'text: “we read every annotation”'] },
          { no: '05', pct: '55–65%', t: 'Blue particle beam — paper lifts into pixels', a: ['edges of paper dissolve into points', 'text: “then we digitize it”'] },
          { no: '06', pct: '65–80%', t: 'Cross-fade: paper → blank digital RFQ → processed RFQ', a: ['screen mocks tile in', 'text: “requirements, structured”'] },
          { no: '07', pct: '80–95%', t: 'Outreach montage — emails, calls, sheets', a: ['screens stack/cascade', 'text: “the work behind the bid”'] },
          { no: '08', pct: '95–100%', t: 'Submission → confirmation → contract award', a: ['final stamp animates in', 'text: “contract awarded.”', 'CTA reveal: book a meeting'] },
        ].map((b) => (
          <div key={b.no} className="beat">
            <div className="beat-no">{b.no}<span className="scroll-pct">{b.pct}</span></div>
            <div className="beat-body">
              <div className="beat-title">{b.t}</div>
              <div className="beat-actions">{b.a.map((x, i) => <span key={i}>{x}</span>)}</div>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle no="A.03" title="Frame inventory" sub="stop-motion stub slots — drop your PNGs in" />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14,
      }}>
        <FrameStub frameNo={1} title="ball, idle wobble" variant="ball" h={170} note="loop · 2s" />
        <FrameStub frameNo={2} title="ball travels + opens" variant="ball" h={170} note="x: 0→60vw · unfold: 0→40%" />
        <FrameStub frameNo={3} title="mid-flight, half open" variant="paper" h={170} note="travel + crumple in parallel" />
        <FrameStub frameNo={4} title="full unfold + stains" variant="unfolded" h={170} note="hero shot" />
        <FrameStub frameNo={5} title="red laser scan" variant="scan-red" h={170} note="top → bottom" />
        <FrameStub frameNo={6} title="blue particle scan" variant="scan-blue" h={170} note="paper dissolves" />
        <FrameStub frameNo={7} title="blank digital RFQ" variant="screen" h={170} />
        <FrameStub frameNo={8} title="contract award" variant="screen" h={170} note="final beat" />
      </div>

      <SectionTitle no="A.04" title="Below the pin" sub="normal vertical flow continues" />
      <div className="row row-3">
        <TextStub label="SECTION" headline="how we work" lines={4} />
        <TextStub label="SECTION" headline="industries" lines={4} />
        <TextStub label="SECTION" headline="case studies" lines={4} />
      </div>

      <SectionTitle no="A.05" title="Chat trigger" sub="floating bubble · always visible · expands to side panel" />
      <div style={{
        display: 'flex', alignItems: 'center', gap: 36, padding: '16px 0',
      }}>
        <ChatTrigger kind="bubble" />
        <div style={{ flex: 1 }}>
          <Note color="gold">↰ stays in bottom-right at all scroll positions</Note><br />
          <Note color="gray">tap → expands to 380px side panel · voice toggle in header</Note>
        </div>
      </div>

      <div className="pc">
        <div className="pros">
          <h4>strengths</h4>
          <ul>
            <li>most cinematic, most impressive on first load</li>
            <li>controlled pacing — viewer can't miss beats</li>
            <li>great for case-study moments later</li>
          </ul>
        </div>
        <div className="cons">
          <h4>watch-outs</h4>
          <ul>
            <li>scroll-jacking — must respect prefers-reduced-motion</li>
            <li>heavy on assets · needs preloader</li>
            <li>mobile fallback = tap-through chapters</li>
          </ul>
        </div>
      </div>
    </SketchSheet>
  );
};

window.DirectionA = DirectionA;
