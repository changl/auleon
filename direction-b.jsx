// Direction B — "Chapter Snap"
// Full-page snap sections — each scroll = one chapter beat. Side chapter dots. Chat = pulsing orb fullscreen overlay.

const DirectionB = () => {
  const chapters = [
    'crumpled', 'unfolding', 'on the desk',
    'red scan', 'blue scan', 'digital twin',
    'the work', 'submission', 'awarded',
  ];

  return (
    <SketchSheet
      label="Direction B — Chapter Snap"
      sub="One screen per beat · scroll-snap · side chapter dots · cinematic chapters"
      tilt={0.15}
    >
      <p className="sk-intro-text">
        <Note color="gold" arrow="down">scroll = next chapter</Note>
        &nbsp; — each chapter is a fullscreen panel that snaps into place. Side rail shows chapter
        dots. Lighter on continuous scroll-jacking; user can jump.
      </p>

      <SectionTitle no="B.01" title="Chapter rail" sub="navigable beats" />
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <ScrollRail steps={chapters} active={3} />
        <div style={{ flex: 1, paddingLeft: 12 }}>
          <Note color="gray">↰ rail sticks to right edge during scroll</Note>
          <div style={{ height: 10 }} />
          <Note color="gold">tap a dot to jump · keyboard ↑↓ also</Note>
          <div style={{ height: 10 }} />
          <Note color="gray">progress fills the line as you descend</Note>
        </div>
      </div>

      <SectionTitle no="B.02" title="Chapter wireframes" sub="9 fullscreen panels" />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18,
      }}>
        <Viewport label="CH 01 · CRUMPLED" tag="hero — paper LEFT · copy RIGHT">
          <div style={{
            position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: 70, height: 70, borderRadius: '50%',
                background: 'rgba(228,185,74,0.25)',
                border: '1.5px dashed rgba(228,185,74,0.6)',
              }} />
            </div>
            <div style={{ padding: '16px 18px 16px 0', display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
              <div style={{ height: 10, background: 'rgba(228,185,74,0.55)', width: '85%', borderRadius: 2 }} />
              <div style={{ height: 6, background: 'rgba(244,236,219,0.3)', width: '70%' }} />
              <div style={{ height: 6, background: 'rgba(244,236,219,0.3)', width: '60%' }} />
              <div style={{ height: 24, width: 100, background: 'rgba(228,185,74,0.7)', marginTop: 6, borderRadius: 3 }} />
            </div>
          </div>
        </Viewport>

        <Viewport label="CH 02 · UNFOLDING" tag="paper transitions across">
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(228,185,74,0.08), transparent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '60%', height: '55%',
              background: 'rgba(244,236,219,0.15)',
              border: '1.5px dashed rgba(228,185,74,0.5)',
              transform: 'perspective(400px) rotateY(-12deg)',
            }} />
          </div>
        </Viewport>

        <Viewport label="CH 03 · ON THE DESK" tag="paper RIGHT · copy LEFT">
          <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: '16px 0 16px 18px', display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
              <div style={{ height: 10, background: 'rgba(228,185,74,0.55)', width: '85%', borderRadius: 2 }} />
              <div style={{ height: 6, background: 'rgba(244,236,219,0.3)', width: '75%' }} />
              <div style={{ height: 6, background: 'rgba(244,236,219,0.3)', width: '60%' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '78%', height: '70%',
                background: 'rgba(244,236,219,0.18)',
                border: '1.5px solid rgba(228,185,74,0.5)',
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 12, right: 16, width: 18, height: 18, borderRadius: '50%', background: 'rgba(101,68,28,0.4)' }} />
                <div style={{ position: 'absolute', top: 30, right: 22, width: 10, height: 10, borderRadius: '50%', background: 'rgba(101,68,28,0.3)' }} />
              </div>
            </div>
          </div>
        </Viewport>

        <Viewport label="CH 04 · RED SCAN" tag="laser sweep top → bottom">
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '70%', height: '70%',
              background: 'rgba(244,236,219,0.12)',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 2, background: '#e0533a', boxShadow: '0 0 16px #e0533a' }} />
            </div>
          </div>
        </Viewport>

        <Viewport label="CH 05 · BLUE SCAN" tag="particles lift off the paper">
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '70%', height: '70%',
              background: 'rgba(244,236,219,0.12)',
              position: 'relative',
            }}>
              {Array.from({ length: 26 }).map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  left: `${(i * 13) % 95}%`, top: `${(i * 17) % 90}%`,
                  width: 3, height: 3, borderRadius: '50%',
                  background: '#5aa8ff', boxShadow: '0 0 6px #5aa8ff',
                }} />
              ))}
            </div>
          </div>
        </Viewport>

        <Viewport label="CH 06 · DIGITAL TWIN" tag="paper → blank screen → filled">
          <div style={{ position: 'absolute', inset: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 14, background: 'rgba(228,185,74,0.55)', width: '40%' }} />
            <div style={{ height: 6, background: 'rgba(244,236,219,0.3)', width: '85%' }} />
            <div style={{ height: 6, background: 'rgba(244,236,219,0.3)', width: '70%' }} />
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <div style={{ flex: 1, height: 28, background: 'rgba(228,185,74,0.18)', border: '1px dashed rgba(228,185,74,0.5)' }} />
              <div style={{ flex: 1, height: 28, background: 'rgba(228,185,74,0.18)', border: '1px dashed rgba(228,185,74,0.5)' }} />
            </div>
          </div>
        </Viewport>

        <Viewport label="CH 07 · THE WORK" tag="emails / calls / sheets cascade">
          <div style={{ position: 'absolute', inset: 6 }}>
            {['email', 'call', 'sheet', 'email'].map((k, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: 6 + i * 16, left: 8 + i * 14, right: 12 - i * 4,
                height: 26,
                background: 'rgba(43,36,26,0.7)',
                border: '1px solid rgba(228,185,74,0.4)',
                color: 'rgba(244,236,219,0.7)',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                padding: '4px 8px',
              }}>{k} · #{i + 1}</div>
            ))}
          </div>
        </Viewport>

        <Viewport label="CH 08 · SUBMISSION" tag="docs assembled · sent">
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              fontFamily: 'Caveat, cursive', fontSize: 26, color: 'var(--gold-2)',
              textAlign: 'center',
            }}>RFQ submitted ✓<br />
              <span style={{ fontSize: 14, color: 'rgba(244,236,219,0.5)' }}>receipt #4827</span>
            </div>
          </div>
        </Viewport>

        <Viewport label="CH 09 · AWARDED" tag="contract award · CTA">
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{
              fontFamily: 'Architects Daughter, cursive', fontSize: 22, color: 'var(--gold-2)',
            }}>contract awarded.</div>
            <div style={{ height: 6, background: 'rgba(244,236,219,0.3)', width: '60%' }} />
            <div style={{
              marginTop: 8, padding: '6px 18px',
              background: 'var(--gold-2)', color: 'var(--bg)',
              fontFamily: 'Patrick Hand', fontSize: 14, fontWeight: 700,
              borderRadius: 4,
            }}>book a meeting</div>
          </div>
        </Viewport>
      </div>

      <SectionTitle no="B.03" title="Chat trigger" sub="orb · pulsing · opens fullscreen overlay" />
      <div style={{
        display: 'flex', alignItems: 'center', gap: 36, padding: '20px 0',
      }}>
        <ChatTrigger kind="orb" />
        <div style={{ flex: 1 }}>
          <Note color="gold">↰ orb lives in bottom-right with subtle gold pulse</Note><br />
          <Note color="gray">tap → fullscreen takeover w/ waveform · mic-first</Note><br />
          <Note color="gray">complements the cinematic feel of chapter snaps</Note>
        </div>
      </div>

      <div className="pc">
        <div className="pros">
          <h4>strengths</h4>
          <ul>
            <li>jump-able — no fatigue if user already knows</li>
            <li>each beat is a polished hero shot</li>
            <li>natural fit for keyboard / arrow / swipe nav</li>
          </ul>
        </div>
        <div className="cons">
          <h4>watch-outs</h4>
          <ul>
            <li>can feel slide-deck-y; needs care w/ inter-chapter motion</li>
            <li>9 chapters is a lot — consider collapsing 2 pairs</li>
            <li>scroll-snap on iOS can be twitchy</li>
          </ul>
        </div>
      </div>
    </SketchSheet>
  );
};

window.DirectionB = DirectionB;
