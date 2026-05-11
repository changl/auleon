/**
 * AuLeon Scene Engine v3 — scroll-driven parallax
 * Frames: 97 = crumpled ball → 1 = flat RFQ document
 */
(function () {
  'use strict';

  const TOTAL    = 97;
  const framePath = (n) => `assets/frames/crumble/frame_${String(n).padStart(4,'0')}.png`;

  // ── Scroll beats (normalised 0–1 over 5500vh) ────────────────────────────
  //
  //  Travel  : 0.001 → 0.29   (ball crosses screen LEFT→RIGHT)
  //  Unfold  : 0.025 → 0.38   (overlaps travel; 97→1; settles at frame~25 when travel ends)
  //  Red scan: 0.40  → 0.50
  //  Blue scan: 0.48 → 0.60
  //  Screens : 0.62  → 1.04   (7 equal, non-overlapping windows)
  //
  // Unfold sped up ~50%: window 0.025→0.38 (0.355 wide) → 0.025→0.20 (0.175 wide)
  // Screens span 0.27 → 1.00 of progress, each 0.13 wide with 0.03 cross-fade
  // overlap into the next. Step interval is a uniform 0.10 — every step holds
  // for the same duration including the closing "zero analysts" beat.
  // Red and blue scans no longer overlap — blue starts exactly when red
  // finishes its full top-to-bottom pass.
  const P = {
    travelStart:    0.001,
    unfoldStart:    0.026,
    travelEnd:      0.117,
    flatSettle:     0.117,
    scanRedStart:   0.204,
    scanRedEnd:     0.337,
    scanBlueStart:  0.337,
    scanBlueEnd:    0.424,
    paperFadeStart: 0.395,
    paperGone:      0.468,
    s1:[0.468, 0.563],
    s2:[0.541, 0.636],
    s3:[0.614, 0.708],
    s4:[0.687, 0.781],
    s5:[0.759, 0.854],
    s6:[0.832, 0.927],
    s7:[0.905, 1.000],
  };

  // Text timing [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd]
  // Each block synced to its paired screen window.
  const TXT = {
    hero:      [-0.10,  0.000, 0.058, 0.117],
    reality:   [ 0.117, 0.160, 0.189, 0.233],
    scan:      [ 0.204, 0.248, 0.395, 0.453],
    digitize:  [ 0.468, 0.490, 0.541, 0.563],
    outreach:  [ 0.541, 0.563, 0.614, 0.636],
    negotiate: [ 0.614, 0.636, 0.759, 0.781],
    submit:    [ 0.759, 0.781, 0.905, 0.927],
    award:     [ 0.905, 0.927, 0.978, 1.000],
  };

  // Slide direction (+1 = enters from right / exits right, -1 = from left)
  const TXT_DIR = { hero:1, reality:-1, scan:-1, digitize:-1, outreach:-1, negotiate:-1, submit:-1, award:-1 };

  // ── State ────────────────────────────────────────────────────────────────
  let imgs        = new Array(TOTAL + 1);
  let loaded      = 0;
  let priorityHit = 0;                 // priority frames loaded so far
  const PRIORITY  = 12;                // load this many before hiding loader (key keyframes)
  let rawProg     = 0, smoothProg = 0;
  let lastFrame   = -1;
  let blueParts   = [];
  let blueTime    = 0;
  let DOM         = {};

  // ── Init ─────────────────────────────────────────────────────────────────
  function init() {
    const $ = (id) => document.getElementById(id);
    DOM = {
      scrollSection: $('scroll-section'),
      bgVideo:       $('scroll-bg-video'),
      bgCanvas:      $('scroll-bg-canvas'),
      paperWrapper:  $('paper-wrapper'),
      paperCanvas:   $('paper-canvas'),
      scanOverlay:   $('scan-overlay'),
      scanLine:      $('scan-line'),
      blueCanvas:    $('blue-scan-canvas'),
      loader:        $('loader'),
      loaderBar:     $('loader-bar'),
      scrollPrompt:  $('scroll-prompt'),
      progressLine:  $('progress-line'),
      nav:           $('nav'),
    };

    Object.keys(TXT).forEach(k => { DOM['t_'+k] = $('text-'+k); });
    for (let i = 1; i <= 7; i++) DOM['s'+i] = $('screen-'+i);

    DOM.paperCanvas.width  = 1264;
    DOM.paperCanvas.height = 1636;
    DOM.ctx = DOM.paperCanvas.getContext('2d');

    if (DOM.blueCanvas) {
      DOM.bCtx = DOM.blueCanvas.getContext('2d');
      resizeBlue();
      window.addEventListener('resize', resizeBlue, { passive: true });
    }

    DOM.skylineCanvas = document.getElementById('skyline-canvas');
    if (DOM.skylineCanvas) initSkyline();

    window.addEventListener('scroll', onScroll,    { passive: true });
    window.addEventListener('scroll', onScrollNav, { passive: true });
    preload();
    requestAnimationFrame(tick);
    initBg();
  }

  function resizeBlue() {
    if (!DOM.blueCanvas) return;
    // 140% of viewport (matches the inline style overshoot)
    DOM.blueCanvas.width  = Math.round(window.innerWidth  * 1.4);
    DOM.blueCanvas.height = Math.round(window.innerHeight * 1.4);
  }

  // ── Preloading ───────────────────────────────────────────────────────────
  // Tiered: load a small set of priority keyframes first (start, end, milestones),
  // hide the loader as soon as those land, then continue loading the rest in the background.
  function preload() {
    // Spread 12 priority frames across the 97-frame range
    const prioritySet = new Set();
    for (let i = 0; i < PRIORITY; i++) {
      prioritySet.add(1 + Math.round(i * (TOTAL - 1) / (PRIORITY - 1)));
    }
    // Always include start & end
    prioritySet.add(1); prioritySet.add(TOTAL);

    const priorityFrames = [...prioritySet].sort((a, b) => a - b);
    const restFrames     = [];
    for (let i = 1; i <= TOTAL; i++) if (!prioritySet.has(i)) restFrames.push(i);

    let loaderHidden = false;
    function onPriorityDone() {
      if (loaderHidden) return;
      loaderHidden = true;
      hideLoader();
      // Kick off the rest after we're visible
      restFrames.forEach((i, k) => {
        // small stagger so the network isn't slammed; browsers cap concurrent anyway
        setTimeout(() => loadFrame(i), k * 8);
      });
    }

    function loadFrame(i, isPriority) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = img.onerror = () => {
        loaded++;
        if (isPriority) {
          priorityHit++;
          if (DOM.loaderBar) DOM.loaderBar.style.width = (priorityHit / priorityFrames.length * 100) + '%';
          if (priorityHit >= priorityFrames.length) onPriorityDone();
        }
      };
      img.src = framePath(i);
      imgs[i] = img;
    }

    // 1) priority first
    priorityFrames.forEach(i => loadFrame(i, true));
    // Failsafe: hide loader after 4s even if some priority frames are slow
    setTimeout(onPriorityDone, 4000);
  }

  function hideLoader() {
    const el = DOM.loader;
    if (!el) return;
    el.style.transition = 'opacity 0.9s ease';
    el.style.opacity    = '0';
    setTimeout(() => { if (el) el.style.display = 'none'; }, 1000);
  }

  // ── Scroll ───────────────────────────────────────────────────────────────
  function onScroll() {
    const s = DOM.scrollSection;
    if (!s) return;
    const scrolled = window.scrollY - s.offsetTop;
    const total    = s.offsetHeight - window.innerHeight;
    rawProg = Math.max(0, Math.min(1, scrolled / Math.max(total, 1)));
  }

  function onScrollNav() {
    if (DOM.nav) DOM.nav.classList.toggle('scrolled', window.scrollY > 30);
  }

  // ── RAF tick ──────────────────────────────────────────────────────────────
  function tick() {
    smoothProg += (rawProg - smoothProg) * 0.10;
    blueTime   += 0.016;
    updateScene(smoothProg, rawProg);
    requestAnimationFrame(tick);
  }

  // ── Math helpers ─────────────────────────────────────────────────────────
  const clamp = (v)       => Math.max(0, Math.min(1, v));
  const remap = (v, a, b) => clamp((v - a) / (b - a));
  const lerp  = (a, b, t) => a + (b - a) * t;
  const eio   = (t)       => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

  // ── Main update ───────────────────────────────────────────────────────────
  function updateScene(s, r) {
    updatePaper(s, r);
    updateScans(s);
    updateTexts(s);
    updateScreens(s);
    updateBgVideo(s);
    if (DOM.progressLine) DOM.progressLine.style.transform = `scaleX(${r})`;
    if (DOM.scrollPrompt)  DOM.scrollPrompt.style.opacity   = clamp(1 - r * 30);
  }

  // ── Scroll-synced background video ────────────────────────────────────────
  // Frame-extraction approach for buttery scrubbing:
  //   1) Load the mp4 as a Blob URL so the file is local + seekable.
  //   2) On metadata, walk the video at fixed time steps, drawImage each
  //      frame to an offscreen canvas, stash as ImageBitmap.
  //   3) Replace the <video> with a <canvas> that paints the closest cached
  //      frame on every scroll update — zero decoder seeking, no jitter.
  const BG_FRAME_COUNT = 96;        // 8s video → 12 fps cache, plenty for scrub
  let bgFrames = [];                // ImageBitmap or canvas per frame
  let bgFramesReady = false;
  let bgBlobLoaded = false;
  let bgLastDrawn = -1;
  let bgCtx = null;

  function loadBgVideoBlob() {
    const v = DOM.bgVideo;
    if (!v || bgBlobLoaded) return;
    bgBlobLoaded = true;
    const url = v.getAttribute('data-src');
    if (!url) return;
    fetch(url)
      .then(r => r.blob())
      .then(blob => {
        v.src = URL.createObjectURL(blob);
        v.load();
        v.addEventListener('loadedmetadata', () => extractBgFrames(), { once: true });
      })
      .catch(() => {});
  }

  async function extractBgFrames() {
    const v = DOM.bgVideo;
    const c = DOM.bgCanvas;
    if (!v || !c || bgFramesReady) return;
    // Match canvas size to viewport (cover style) using the video's native ratio.
    const w = v.videoWidth  || 1280;
    const h = v.videoHeight || 720;
    c.width = w; c.height = h;
    bgCtx = c.getContext('2d');
    const dur = v.duration;
    const step = dur / BG_FRAME_COUNT;
    // Pause and walk frame-by-frame.
    try { v.pause(); } catch(e) {}
    for (let i = 0; i < BG_FRAME_COUNT; i++) {
      const t = Math.min(dur - 0.01, i * step);
      await seekTo(v, t);
      // Draw to an offscreen canvas (faster blits than holding video frames).
      const off = document.createElement('canvas');
      off.width = w; off.height = h;
      off.getContext('2d').drawImage(v, 0, 0, w, h);
      bgFrames[i] = off;
      // Paint progressively so the user sees frames appear as they cache.
      if (i === 0) {
        // Hide the <video>, show the canvas (which has the first frame).
        v.style.display = 'none';
        c.style.opacity = '1';
        bgCtx.drawImage(off, 0, 0);
        bgLastDrawn = 0;
      }
    }
    bgFramesReady = true;
  }

  function seekTo(v, t) {
    return new Promise(resolve => {
      const onSeeked = () => { v.removeEventListener('seeked', onSeeked); resolve(); };
      v.addEventListener('seeked', onSeeked);
      try { v.currentTime = t; } catch (e) { resolve(); }
      // Safety: don't hang forever if the seek event never fires.
      setTimeout(() => { v.removeEventListener('seeked', onSeeked); resolve(); }, 800);
    });
  }

  function updateBgVideo(progress) {
    if (!bgBlobLoaded) loadBgVideoBlob();
    if (!bgCtx || bgFrames.length === 0) return;
    const total = bgFrames.length;
    // Pick the closest cached frame.
    let idx = Math.round(clamp(progress) * (total - 1));
    // Clamp to what we've cached so far so partial caches still scrub.
    let maxCached = total - 1;
    while (maxCached >= 0 && !bgFrames[maxCached]) maxCached--;
    if (idx > maxCached) idx = maxCached;
    if (idx < 0 || idx === bgLastDrawn) return;
    bgCtx.drawImage(bgFrames[idx], 0, 0);
    bgLastDrawn = idx;
  }

  // ── Paper ─────────────────────────────────────────────────────────────────
  // Travel phase  (travelStart → travelEnd):   X moves -27vw → +19vw
  // Unfold phase  (unfoldStart → flatSettle):   frames 97 → 1  (OVERLAPS travel)
  //   At travelEnd the paper is ~75% unfolded (frame 25); finishes last 25% at rest.

  function getFrameIdx(r) {
    if (r >= P.paperGone)    return -1;
    if (r <= P.unfoldStart)  return 97;
    if (r <= P.flatSettle) {
      const t = (r - P.unfoldStart) / (P.flatSettle - P.unfoldStart);
      return Math.max(1, Math.round(97 - t * 96));
    }
    return 1;
  }

  // Find nearest loaded frame to requested index (so the unfold still animates
  // even before every frame has finished downloading).
  function nearestLoadedFrame(target) {
    if (target < 1) return -1;
    if (imgs[target] && imgs[target].complete && imgs[target].naturalWidth > 0) return target;
    for (let d = 1; d < TOTAL; d++) {
      const a = target - d, b = target + d;
      if (a >= 1 && imgs[a] && imgs[a].complete && imgs[a].naturalWidth > 0) return a;
      if (b <= TOTAL && imgs[b] && imgs[b].complete && imgs[b].naturalWidth > 0) return b;
    }
    return -1;
  }

  function updatePaper(s, r) {
    // Frame (raw for instant response). Falls back to nearest loaded frame.
    const target = getFrameIdx(r);
    const fi = target >= 1 ? nearestLoadedFrame(target) : -1;
    if (fi >= 1 && fi !== lastFrame) {
      const img = imgs[fi];
      if (img && img.complete && img.naturalWidth > 0) {
        DOM.ctx.clearRect(0, 0, 1264, 1636);
        DOM.ctx.drawImage(img, 0, 0, 1264, 1636);
        lastFrame = fi;
      }
    }

    // Opacity
    const op = r < P.paperFadeStart ? 1
             : r < P.paperGone      ? 1 - remap(r, P.paperFadeStart, P.paperGone)
             : 0;
    DOM.paperWrapper.style.opacity    = op;
    DOM.paperWrapper.style.visibility = op < 0.005 ? 'hidden' : 'visible';

    // X translate — travel phase
    let tx;
    if      (s <= P.travelStart) tx = -27;
    else if (s <= P.travelEnd)   tx = lerp(-27, 19, eio(remap(s, P.travelStart, P.travelEnd)));
    else                         tx = 19;

    // Scale — unfold phase (overlaps with travel so ball opens while moving)
    let scale;
    if      (s <= P.unfoldStart)  scale = 0.60;
    else if (s <= P.flatSettle)   scale = lerp(0.60, 1.0, eio(remap(s, P.unfoldStart, P.flatSettle)));
    else                          scale = 1.0;

    DOM.paperWrapper.style.transform = `translateX(${tx}vw) scale(${scale})`;
  }

  // ── Scans ─────────────────────────────────────────────────────────────────
  function updateScans(s) {
    const inRed  = s >= P.scanRedStart  && s <= P.scanRedEnd  + 0.01;
    const inBlue = s >= P.scanBlueStart && s <= P.scanBlueEnd + 0.01;
    const redT   = remap(s, P.scanRedStart,  P.scanRedEnd);
    const blueT  = remap(s, P.scanBlueStart, P.scanBlueEnd);

    if (inBlue) {
      DOM.scanOverlay.style.opacity = '0';
      const g = Math.sin(clamp(blueT) * Math.PI) * 0.7;
      DOM.paperWrapper.style.filter =
        `drop-shadow(0 0 56px rgba(60,130,245,${g})) drop-shadow(0 0 100px rgba(60,130,245,${g*0.4}))`;
      drawBlueBeam(blueT);
    } else if (inRed) {
      DOM.scanOverlay.style.opacity  = '1';
      DOM.scanOverlay.dataset.mode   = 'red';
      DOM.scanLine.style.top         = (redT * 100) + '%';
      const g = Math.sin(clamp(redT) * Math.PI) * 0.5;
      DOM.paperWrapper.style.filter  = `drop-shadow(0 0 32px rgba(220,70,40,${g}))`;
      clearBlueCanvas();
    } else {
      DOM.scanOverlay.style.opacity = '0';
      if (s < P.scanRedStart || s > P.scanBlueEnd + 0.03) {
        DOM.paperWrapper.style.filter = '';
      }
      clearBlueCanvas();
    }
  }

  function clearBlueCanvas() {
    if (DOM.bCtx && DOM.blueCanvas) {
      DOM.bCtx.clearRect(0, 0, DOM.blueCanvas.width, DOM.blueCanvas.height);
    }
    blueParts = [];
  }

  function drawBlueBeam(t) {
    if (!DOM.bCtx || !DOM.blueCanvas || !DOM.paperWrapper) return;
    const ctx = DOM.bCtx;
    const W   = DOM.blueCanvas.width;
    const H   = DOM.blueCanvas.height;
    ctx.clearRect(0, 0, W, H);

    // Canvas is positioned at -20% of viewport with 140% size; translate page coords
    // into canvas-local coords so beams drawn well outside the paper still fit on-canvas.
    const offsetX = window.innerWidth  * 0.20;
    const offsetY = window.innerHeight * 0.20;

    // Edge-feather mask: any draw operation will be additionally faded near canvas edges
    // so beam tails dissolve smoothly inside the (oversized) frame.
    const rect    = DOM.paperWrapper.getBoundingClientRect();
    const beamY   = rect.top  + offsetY + t * rect.height;
    // Extend beams far past paper so the visible portion always tapers within canvas
    const reach   = Math.max(rect.width * 1.4, window.innerWidth * 0.6);
    const x1      = rect.left  + offsetX - reach;
    const x2      = rect.right + offsetX + reach;

    // 1. Wide diffuse glow halo (vertical fade) + horizontal taper so ends fade to 0
    const haloH = 90;
    const halo  = ctx.createLinearGradient(0, beamY - haloH, 0, beamY + haloH);
    halo.addColorStop(0,    'rgba(40,100,230,0)');
    halo.addColorStop(0.30, 'rgba(60,150,255,0.10)');
    halo.addColorStop(0.50, 'rgba(90,170,255,0.30)');
    halo.addColorStop(0.70, 'rgba(60,150,255,0.10)');
    halo.addColorStop(1,    'rgba(40,100,230,0)');

    // Build a horizontal taper as an alpha mask via a temporary off-screen canvas
    const haloX1 = x1 - 60, haloX2 = x2 + 60;
    const haloW  = haloX2 - haloX1;
    ctx.save();
    const taper = ctx.createLinearGradient(haloX1, 0, haloX2, 0);
    taper.addColorStop(0,    'rgba(0,0,0,0)');
    taper.addColorStop(0.18, 'rgba(0,0,0,1)');
    taper.addColorStop(0.82, 'rgba(0,0,0,1)');
    taper.addColorStop(1,    'rgba(0,0,0,0)');
    // Draw halo, then composite-clip with horizontal taper
    ctx.fillStyle = halo;
    ctx.fillRect(haloX1, beamY - haloH, haloW, haloH * 2);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = taper;
    ctx.fillRect(haloX1, beamY - haloH, haloW, haloH * 2);
    ctx.restore();

    // 2. Fuzzy / jagged beam — 5 passes with different jitter & opacity
    // Per-segment alpha tapered toward 0 at both ends so the beam fades within bounds.
    const segs = 80;
    const segW = (x2 - x1) / segs;
    const alphas = [0.85, 0.55, 0.35, 0.20, 0.10];
    const widths = [2.5,  1.8,  1.2,  0.8,  0.5];
    const blurs  = [24,   16,   10,   6,    3];
    for (let pass = 0; pass < 5; pass++) {
      ctx.shadowColor = '#5ab4ff';
      ctx.shadowBlur  = blurs[pass];
      ctx.lineWidth   = widths[pass];
      // Draw beam as many short segments so we can vary alpha per segment
      for (let i = 0; i < segs; i++) {
        const t0 = i / segs, t1 = (i + 1) / segs;
        // smooth-step taper: 0 at edges, 1 in the middle 60%
        const taperA = (u) => {
          const e = 0.20;
          if (u < e)        return (u / e) * (u / e);
          if (u > 1 - e)    return ((1 - u) / e) * ((1 - u) / e);
          return 1;
        };
        const a0 = alphas[pass] * taperA(t0);
        const a1 = alphas[pass] * taperA(t1);
        const a  = (a0 + a1) * 0.5;
        if (a < 0.01) continue;
        const xa = x1 + t0 * (x2 - x1);
        const xb = x1 + t1 * (x2 - x1);
        const na = Math.sin(i * 2.1 + blueTime * 5 + pass * 1.9) * (4 + pass * 3)
                 + Math.cos(i * 3.9 + blueTime * 3.1 + pass * 0.7) * (2 + pass);
        const nb = Math.sin((i+1) * 2.1 + blueTime * 5 + pass * 1.9) * (4 + pass * 3)
                 + Math.cos((i+1) * 3.9 + blueTime * 3.1 + pass * 0.7) * (2 + pass);
        ctx.strokeStyle = `rgba(140,195,255,${a})`;
        ctx.beginPath();
        ctx.moveTo(xa, beamY + na);
        ctx.lineTo(xb, beamY + nb);
        ctx.stroke();
      }
    }
    ctx.shadowBlur = 0;

    // 3. Spawn particles from the beam (canvas-local coords)
    if (t > 0.03 && t < 0.97) {
      const count = 7;
      for (let i = 0; i < count; i++) {
        blueParts.push({
          x:     rect.left + offsetX + Math.random() * rect.width,
          y:     beamY + (Math.random() - 0.5) * 14,
          vx:    (Math.random() - 0.5) * 2.8,
          vy:    -(Math.random() * 3.8 + 0.6),
          r:     Math.random() * 2.8 + 0.6,
          a:     0.65 + Math.random() * 0.35,
          life:  1.0,
          decay: 0.010 + Math.random() * 0.018,
        });
      }
    }
    if (blueParts.length > 500) blueParts.splice(0, 60);

    // 4. Render particles
    blueParts.forEach(p => {
      p.x    += p.vx;
      p.y    += p.vy;
      p.vy   *= 0.975;
      p.life -= p.decay;
    });
    blueParts = blueParts.filter(p => p.life > 0);
    blueParts.forEach(p => {
      const alpha = p.a * p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle   = `rgba(110,185,255,${alpha})`;
      ctx.shadowColor = '#4fa8ff';
      ctx.shadowBlur  = 10;
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  // ── Text: slide motion (not pure fade) ───────────────────────────────────
  // Enter: slides in from TXT_DIR side.
  // Exit:  slides out to OPPOSITE side (away from paper).
  function updateTexts(s) {
    Object.entries(TXT).forEach(([k, [ia, ib, oa, ob]]) => {
      const el  = DOM['t_'+k];
      if (!el) return;
      const dir   = TXT_DIR[k] || -1;
      const enter = clamp(remap(s, ia, ib));
      const exit  = clamp(remap(s, oa, ob));
      const op    = enter * (1 - exit);

      // Translation: enter from dir×90px, exit to -dir×90px
      let tx;
      if (exit > 0.001) {
        tx = -dir * 90 * eio(exit);        // exits to opposite side
      } else {
        tx = dir * 90 * (1 - eio(enter));  // enters from dir side
      }

      el.style.opacity       = op;
      el.style.transform     = `translateX(${tx}px)`;
      el.style.pointerEvents = op > 0.05 ? 'auto' : 'none';
      el.style.visibility    = op < 0.005 ? 'hidden' : 'visible';
    });
  }

  // ── Screens: equal non-overlapping windows ───────────────────────────────
  function updateScreens(s) {
    const screens = [P.s1, P.s2, P.s3, P.s4, P.s5, P.s6, P.s7];
    const FD = 0.030;
    screens.forEach(([inn, out], i) => {
      const el = DOM['s' + (i + 1)];
      if (!el) return;
      const op = clamp(Math.min(
        remap(s, inn,       inn + FD),
        1 - remap(s, out - FD, out)
      ));
      el.style.opacity       = op;
      el.style.transform     = `translateY(${lerp(26, 0, op)}px) scale(${lerp(0.95, 1, op)})`;
      el.style.pointerEvents = op > 0.05 ? 'auto' : 'none';
    });
  }

  // ── NYC skyline parallax (faint, subtle 3D flythrough) ───────────────────
  function initSkyline() {
    const canvas = DOM.skylineCanvas;
    const ctx = canvas.getContext('2d');
    let W, H;

    // Three depth layers of building silhouettes; each is a list of
    // {x: 0..1 base position, w: width frac, h: height frac}
    const layers = [];
    function buildLayers() {
      layers.length = 0;
      // far layer (small, dense, subtle)
      const far = [];
      let fx = 0;
      while (fx < 1.6) {
        const w = 0.018 + Math.random() * 0.028;
        far.push({ x: fx, w, h: 0.10 + Math.random() * 0.18, lit: Math.random() < 0.5 });
        fx += w + 0.004;
      }
      // mid layer
      const mid = [];
      let mx = -0.05;
      while (mx < 1.6) {
        const w = 0.03 + Math.random() * 0.05;
        mid.push({ x: mx, w, h: 0.18 + Math.random() * 0.28, lit: Math.random() < 0.55 });
        mx += w + 0.006;
      }
      // near layer (taller, fewer, foreground)
      const near = [];
      let nx = -0.1;
      while (nx < 1.7) {
        const w = 0.05 + Math.random() * 0.08;
        near.push({ x: nx, w, h: 0.30 + Math.random() * 0.42, lit: Math.random() < 0.6 });
        nx += w + 0.008;
      }
      layers.push(
        { speed: 0.06,  amp: 0.04, color: 'rgba(80,55,18,0.55)',  windows: 'rgba(228,185,74,0.32)', baseY: 0.78, b: far },
        { speed: 0.13,  amp: 0.07, color: 'rgba(50,32,10,0.75)',  windows: 'rgba(228,185,74,0.45)', baseY: 0.84, b: mid },
        { speed: 0.22,  amp: 0.10, color: 'rgba(20,14,6,0.92)',   windows: 'rgba(243,220,148,0.55)', baseY: 0.92, b: near },
      );
    }

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // soft horizon glow (warm city haze)
      const horizon = ctx.createLinearGradient(0, H * 0.55, 0, H);
      horizon.addColorStop(0,    'rgba(40,30,12,0)');
      horizon.addColorStop(0.55, 'rgba(80,55,20,0.18)');
      horizon.addColorStop(1,    'rgba(120,80,30,0.10)');
      ctx.fillStyle = horizon;
      ctx.fillRect(0, H * 0.55, W, H * 0.45);

      // scrollY drives parallax shift; scroll progress (smoothProg) drives a
      // slight forward push (scale) so it feels like flying forward down Broadway.
      const sy   = window.scrollY || 0;
      const fwd  = smoothProg; // 0..1
      layers.forEach((L, idx) => {
        const shiftX = (sy * L.speed) % W;
        // forward zoom: each layer scales up slightly with forward motion
        const zoom = 1 + fwd * (0.04 + idx * 0.05);
        // vertical bob from scroll for subtle altitude change
        const bob  = Math.sin(sy * 0.0008 + idx) * 6;
        const baseY = H * L.baseY + bob;
        ctx.save();
        // origin shift for zoom toward vanishing point (slightly above center)
        const cx = W * 0.5, cy = H * 0.45;
        ctx.translate(cx, cy);
        ctx.scale(zoom, zoom);
        ctx.translate(-cx, -cy);

        L.b.forEach(b => {
          const bx = ((b.x * W) - shiftX) % (W * 1.6);
          const x  = bx < -W * 0.3 ? bx + W * 1.6 : bx;
          const w  = b.w * W;
          const h  = b.h * H;
          const y  = baseY - h;
          if (x + w < -50 || x > W + 50) return;

          ctx.fillStyle = L.color;
          ctx.fillRect(x, y, w, h);

          // window dots — sparse grid
          if (b.lit) {
            ctx.fillStyle = L.windows;
            const cols = Math.max(1, Math.floor(w / 6));
            const rows = Math.max(2, Math.floor(h / 8));
            for (let r = 1; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                if (((r * 7 + c * 3 + Math.floor(b.x * 100)) % 5) !== 0) continue;
                ctx.fillRect(x + 2 + c * 6, y + 2 + r * 8, 2, 2);
              }
            }
          }
        });
        ctx.restore();
      });

      requestAnimationFrame(draw);
    }

    resize();
    buildLayers();
    draw();
    window.addEventListener('resize', () => { resize(); buildLayers(); }, { passive: true });
  }

  // ── Background canvas — richer, more visible particles ───────────────────
  function initBg() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const N   = 220;
    let pts   = [];
    let W, H;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function makePts() {
      pts = Array.from({ length: N }, () => ({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     Math.random() * 2.8 + 0.5,
        vx:    (Math.random() - 0.5) * 0.20,
        vy:    -(Math.random() * 0.15 + 0.04),
        a:     Math.random() * 0.65 + 0.18,
        f:     Math.random() * Math.PI * 2,
        layer: Math.floor(Math.random() * 3),
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      pts.forEach(p => {
        const spd = [0.28, 0.55, 1.0][p.layer];
        p.x += p.vx * spd;
        p.y += p.vy * spd;
        p.f += 0.017;
        if (p.y < -8) p.y = H + 8;
        if (p.x < -4) p.x = W + 4;
        if (p.x > W + 4) p.x = -4;

        const parallax = (window.scrollY * [-0.12, -0.22, -0.38][p.layer]);
        const sy = ((p.y + parallax) % H + H) % H;
        if (sy < -8 || sy > H + 8) return;

        const alpha = p.a * (0.50 + 0.50 * Math.sin(p.f));
        const r     = p.r * (0.85 + 0.15 * Math.sin(p.f * 1.4));

        ctx.beginPath();
        ctx.arc(p.x, sy, r, 0, Math.PI * 2);
        if (r > 1.6) {
          ctx.shadowColor = 'rgba(228,185,74,0.7)';
          ctx.shadowBlur  = 8;
        }
        ctx.fillStyle = `rgba(228,185,74,${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(draw);
    }

    resize();
    makePts();
    draw();
    window.addEventListener('resize', () => { resize(); makePts(); }, { passive: true });
  }

  // ── Boot ──────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
