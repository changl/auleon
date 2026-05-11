// Story Beats Timeline — director's-cut overview shared by all three directions

const TimelineView = () => {
  const beats = [
    { no: '01', title: 'Crumpled ball', frame: 1, vrt: 'ball', who: 'paper LEFT · text RIGHT', copy: '"every enterprise deal starts as a mess."' },
    { no: '02', title: 'Ball travels', frame: 2, vrt: 'ball', who: 'text fades', copy: '— transition —' },
    { no: '03', title: 'Lands & unfolds — coffee, notes', frame: 4, vrt: 'unfolded', who: 'paper RIGHT · text LEFT', copy: '"hand-offs between teams. annotations everywhere. nothing structured."' },
    { no: '04', title: 'Red laser scan', frame: 5, vrt: 'scan-red', who: 'paper RIGHT · narration', copy: '"we read every line — typed and handwritten."' },
    { no: '05', title: 'Blue particle scan', frame: 6, vrt: 'scan-blue', who: 'paper dissolves', copy: '"then we lift it into a structured form."' },
    { no: '06', title: 'Blank digital RFQ', frame: 7, vrt: 'screen', who: 'screen takes over', copy: '"a clean schema."' },
    { no: '07', title: 'Requirements gathered', frame: 7, vrt: 'screen', who: 'screen fills', copy: '"every line item, owner, deadline, dependency."' },
    { no: '08', title: 'Outreach: emails, calls, sheets', frame: 7, vrt: 'screen', who: 'cascade', copy: '"the work behind the bid — done by agents, not analysts."' },
    { no: '09', title: 'RFQ submission', frame: 8, vrt: 'screen', who: 'final stamp', copy: '"submitted on time."' },
    { no: '10', title: 'Receipt confirmation', frame: 8, vrt: 'screen', who: 'final stamp', copy: '"acknowledged."' },
    { no: '11', title: 'Contract award', frame: 8, vrt: 'screen', who: 'CTA reveal', copy: '"awarded — let\'s talk about yours."' },
  ];
  return (
    <SketchSheet
      label="Story Beats — director's cut"
      sub="The 11 narrative beats · shared across A / B / C · drop your stop-frames into the slots"
      tilt={0.1}
    >
      <p className="sk-intro-text">
        <Note color="gold" arrow="down">your raw material</Note>
        &nbsp; — these are the beats every direction tells. Each direction is just a different
        scroll mechanic for getting through them. The frame slots below are where your stop-motion PNGs go.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {beats.map((b) => (
          <div key={b.no} style={{
            display: 'grid', gridTemplateColumns: '70px 200px 1fr 1.4fr', gap: 16,
            alignItems: 'center',
            padding: '12px 14px',
            background: 'rgba(228,185,74,0.04)',
            border: '1.5px dashed rgba(43,36,26,0.25)',
            borderRadius: 6,
          }}>
            <div style={{
              fontFamily: 'Architects Daughter, cursive', fontSize: 30,
              color: 'var(--gold)', textAlign: 'center',
            }}>{b.no}</div>
            <FrameStub frameNo={parseInt(b.no, 10)} title={b.title} variant={b.vrt} h={110} />
            <div>
              <div style={{ fontFamily: 'Architects Daughter, cursive', fontSize: 18, color: 'var(--ink)' }}>{b.title}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--ink-soft)', marginTop: 4 }}>{b.who.toUpperCase()}</div>
            </div>
            <div style={{ fontFamily: 'Caveat, cursive', fontSize: 19, color: 'var(--ink)', lineHeight: 1.3 }}>
              {b.copy}
            </div>
          </div>
        ))}
      </div>

      <SectionTitle no="X" title="Sections that follow the scroll story" sub="below the narrative · normal flow" />
      <div className="row row-3">
        <TextStub label="01 · INDUSTRIES" headline="who we serve" lines={3}
          note="financial · real estate · high tech · traditional" />
        <TextStub label="02 · HOW IT WORKS" headline="our agent harness" lines={3}
          note="basic framework + custom adapters" />
        <TextStub label="03 · CASE STUDIES" headline="proof" lines={3}
          note="3-4 mid-market wins · dollars saved" />
      </div>
      <div style={{ height: 14 }} />
      <div className="row row-3">
        <TextStub label="04 · FAQ" headline="common questions" lines={3} />
        <TextStub label="05 · CTA" headline="book a meeting" lines={2} accent />
        <TextStub label="06 · FOOTER" headline="contact · social · legal" lines={3} />
      </div>
    </SketchSheet>
  );
};

window.TimelineView = TimelineView;
