// Shared sketchy wireframe primitives — boxes, frame stubs, arrows, annotations.
// All components are exported to window at the bottom for cross-script use.

const { useState, useEffect, useRef } = React;

// ---------- Sketch sheet (page of "paper" mounted on the dark backdrop) ----------
function SketchSheet({ children, label, sub, height = 'auto', tilt = 0 }) {
  return (
    <div className="sk-sheet" style={{ minHeight: height, transform: `rotate(${tilt}deg)` }}>
      {label && (
        <div className="sk-sheet-tab">
          <span className="sk-sheet-tab-label">{label}</span>
          {sub && <span className="sk-sheet-tab-sub">{sub}</span>}
        </div>
      )}
      <div className="sk-sheet-body">{children}</div>
    </div>
  );
}

// ---------- Frame stub: placeholder for a stop-frame animation image ----------
function FrameStub({ frameNo, title, w = '100%', h = 220, variant = 'paper', note }) {
  // variant: paper, scan-red, scan-blue, screen, ball, unfolded
  return (
    <div className={`sk-frame sk-frame-${variant}`} style={{ width: w, height: h }}>
      <div className="sk-frame-corner sk-frame-corner-tl" />
      <div className="sk-frame-corner sk-frame-corner-tr" />
      <div className="sk-frame-corner sk-frame-corner-bl" />
      <div className="sk-frame-corner sk-frame-corner-br" />
      <div className="sk-frame-meta">
        <span className="sk-frame-no">FRAME {String(frameNo).padStart(2, '0')}</span>
        <span className="sk-frame-title">{title}</span>
      </div>
      <FrameGlyph variant={variant} />
      {note && <div className="sk-frame-note">{note}</div>}
    </div>
  );
}

// ---------- Quick visual glyph inside a frame stub ----------
function FrameGlyph({ variant }) {
  if (variant === 'ball') {
    return (
      <svg className="sk-glyph" viewBox="0 0 120 120">
        <path d="M30,55 Q22,38 38,30 Q55,18 72,28 Q92,32 90,52 Q98,68 82,82 Q66,98 48,90 Q28,84 30,55 Z"
          fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M40,50 L55,45 M58,40 L65,55 M70,48 L80,60 M45,65 L60,70 M65,72 L78,75 M50,80 L62,82" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }
  if (variant === 'unfolded') {
    return (
      <svg className="sk-glyph" viewBox="0 0 160 110">
        <rect x="20" y="10" width="120" height="90" fill="none" stroke="currentColor" strokeWidth="1.5"
          strokeDasharray="3 2" />
        <line x1="30" y1="25" x2="120" y2="25" stroke="currentColor" strokeWidth="1" />
        <line x1="30" y1="35" x2="100" y2="35" stroke="currentColor" strokeWidth="1" />
        <line x1="30" y1="45" x2="115" y2="45" stroke="currentColor" strokeWidth="1" />
        <circle cx="105" cy="65" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="110" cy="68" r="5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <text x="35" y="78" fontFamily="Caveat" fontSize="11" fill="currentColor">handwritten note</text>
        <line x1="60" y1="86" x2="120" y2="92" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }
  if (variant === 'scan-red') {
    return (
      <svg className="sk-glyph" viewBox="0 0 160 110">
        <rect x="20" y="10" width="120" height="90" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="55" x2="140" y2="55" stroke="#e0533a" strokeWidth="2" />
        <text x="68" y="50" fontFamily="JetBrains Mono" fontSize="9" fill="#e0533a">SCAN</text>
      </svg>
    );
  }
  if (variant === 'scan-blue') {
    return (
      <svg className="sk-glyph" viewBox="0 0 160 110">
        <rect x="20" y="10" width="120" height="90" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {Array.from({ length: 18 }).map((_, i) => (
          <circle key={i} cx={25 + (i * 7) % 110} cy={20 + (i * 11) % 75} r="1.5" fill="#5aa8ff" />
        ))}
        <line x1="80" y1="10" x2="80" y2="100" stroke="#5aa8ff" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    );
  }
  if (variant === 'screen') {
    return (
      <svg className="sk-glyph" viewBox="0 0 160 110">
        <rect x="10" y="8" width="140" height="94" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="8" width="140" height="14" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="18" cy="15" r="1.5" fill="currentColor" />
        <circle cx="24" cy="15" r="1.5" fill="currentColor" />
        <circle cx="30" cy="15" r="1.5" fill="currentColor" />
        <line x1="20" y1="35" x2="80" y2="35" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="45" x2="120" y2="45" stroke="currentColor" strokeWidth="1" />
        <line x1="20" y1="52" x2="100" y2="52" stroke="currentColor" strokeWidth="1" />
        <rect x="20" y="65" width="50" height="22" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="78" y="65" width="50" height="22" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }
  // default paper
  return (
    <svg className="sk-glyph" viewBox="0 0 160 110">
      <rect x="20" y="10" width="120" height="90" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="25" x2="120" y2="25" stroke="currentColor" strokeWidth="1" />
      <line x1="30" y1="35" x2="100" y2="35" stroke="currentColor" strokeWidth="1" />
      <line x1="30" y1="45" x2="115" y2="45" stroke="currentColor" strokeWidth="1" />
      <line x1="30" y1="55" x2="90" y2="55" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// ---------- Text stub: a placeholder block of "copy" with handwritten label ----------
function TextStub({ label, lines = 3, headline, w = '100%', accent = false, note }) {
  return (
    <div className={`sk-text ${accent ? 'sk-text-accent' : ''}`} style={{ width: w }}>
      {label && <div className="sk-text-label">{label}</div>}
      {headline && <div className="sk-text-headline">{headline}</div>}
      <div className="sk-text-lines">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="sk-text-line" style={{ width: `${88 - i * 8 + (i % 2) * 6}%` }} />
        ))}
      </div>
      {note && <div className="sk-text-note">{note}</div>}
    </div>
  );
}

// ---------- Annotation: handwritten note with optional arrow ----------
function Note({ children, arrow, color = 'gold', style }) {
  return (
    <span className={`sk-note sk-note-${color}`} style={style}>
      {arrow === 'left' && <span className="sk-note-arrow sk-note-arrow-left">↰</span>}
      <span>{children}</span>
      {arrow === 'right' && <span className="sk-note-arrow sk-note-arrow-right">↱</span>}
      {arrow === 'down' && <span className="sk-note-arrow sk-note-arrow-down">↓</span>}
      {arrow === 'up' && <span className="sk-note-arrow sk-note-arrow-up">↑</span>}
    </span>
  );
}

// ---------- Scroll indicator (vertical) ----------
function ScrollRail({ steps, active, onPick }) {
  return (
    <div className="sk-rail">
      <div className="sk-rail-line" />
      {steps.map((s, i) => (
        <div key={i} className={`sk-rail-step ${i === active ? 'is-active' : ''}`} onClick={() => onPick && onPick(i)}>
          <span className="sk-rail-dot" />
          <span className="sk-rail-label">{s}</span>
        </div>
      ))}
    </div>
  );
}

// ---------- Section divider with handwritten title ----------
function SectionTitle({ no, title, sub }) {
  return (
    <div className="sk-section-title">
      <span className="sk-section-no">{no}</span>
      <span className="sk-section-name">{title}</span>
      {sub && <span className="sk-section-sub">— {sub}</span>}
    </div>
  );
}

// ---------- Viewport mock: shows a phone-sized "what user sees" snapshot ----------
function Viewport({ label, children, ratio = '16/10', tag, dark = true }) {
  return (
    <div className={`sk-viewport ${dark ? 'is-dark' : ''}`} style={{ aspectRatio: ratio }}>
      <div className="sk-viewport-chrome">
        <span className="sk-vp-dot" /><span className="sk-vp-dot" /><span className="sk-vp-dot" />
        <span className="sk-vp-url">auleon.com</span>
      </div>
      {label && <div className="sk-viewport-label">{label}</div>}
      {tag && <div className="sk-viewport-tag">{tag}</div>}
      <div className="sk-viewport-body">{children}</div>
    </div>
  );
}

// ---------- Chat trigger thumbnails ----------
function ChatTrigger({ kind }) {
  if (kind === 'bubble') {
    return (
      <div className="sk-chat-bubble">
        <span className="sk-chat-bubble-icon">💬</span>
        <Note color="gray" style={{ position: 'absolute', bottom: -28, right: 0, fontSize: 14 }}>
          floating bubble · bottom-right
        </Note>
      </div>
    );
  }
  if (kind === 'orb') {
    return (
      <div className="sk-chat-orb">
        <div className="sk-chat-orb-pulse" />
        <span className="sk-chat-orb-icon">🦁</span>
      </div>
    );
  }
  if (kind === 'dock') {
    return (
      <div className="sk-chat-dock">
        <span className="sk-chat-dock-mic">🎙</span>
        <span className="sk-chat-dock-input">talk to leo — type or speak…</span>
        <span className="sk-chat-dock-send">→</span>
      </div>
    );
  }
  if (kind === 'nav') {
    return (
      <div className="sk-chat-nav">talk to leo</div>
    );
  }
  return null;
}

Object.assign(window, {
  SketchSheet,
  FrameStub,
  TextStub,
  Note,
  ScrollRail,
  SectionTitle,
  Viewport,
  ChatTrigger,
});
