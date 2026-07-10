import {useCallback, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {Preloader} from '~/components/Preloader';
import type {Route} from './+types/dev.preloader-scene';

export const meta: Route.MetaFunction = () => [
  {title: 'Isla Suds — Preloader Scene Viewer'},
];

/**
 * Chrome-free scene viewer for the Preloader animation.
 *
 * Portals into <body> so the fixed overlay escapes the app-shell header's
 * stacking context and previews as a true full-viewport hero.
 *
 * Modes:
 *  - Play  — the Preloader runs normally with a long min-display time.
 *  - Scrub — animations are paused and the timeline is seek-able ms by ms.
 *
 * Keyboard: Space play/pause · ←/→ step · Shift+←/→ big step · P toggle pop · R replay.
 */

// Covers intro (logo slide 0.3s + 1s, float 4s + 1.3s delay) and full exit
// (bathtub 0.6s, bubble pop 0.6s + 0.35s stagger, overlay fade 0.4s at 0.7s).
const MAX_MS = 6000;
const STEP_MS = 100;
const BIG_STEP_MS = 500;

export default function DevPreloaderScene() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'play' | 'scrub'>('play');
  const [scrubMs, setScrubMs] = useState(0);
  const [pop, setPop] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => setMounted(true), []);

  const play = useCallback(() => {
    setMode('play');
    setKey((k) => k + 1);
  }, []);

  const pause = useCallback(() => {
    setMode('scrub');
  }, []);

  const step = useCallback((delta: number) => {
    setMode('scrub');
    setScrubMs((v) => Math.max(0, Math.min(MAX_MS, v + delta)));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      // Ignore when the user is typing in a form control.
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (mode === 'play') pause();
        else play();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        step(e.shiftKey ? BIG_STEP_MS : STEP_MS);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        step(e.shiftKey ? -BIG_STEP_MS : -STEP_MS);
      } else if (e.key === 'p' || e.key === 'P') {
        setPop((v) => !v);
      } else if (e.key === 'r' || e.key === 'R') {
        play();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mounted, mode, play, pause, step]);

  if (!mounted) return null;

  const btn: React.CSSProperties = {
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 6,
    padding: '6px 12px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  };

  const btnActive: React.CSSProperties = {
    ...btn,
    background: 'rgba(79,70,229,0.6)',
    borderColor: 'rgba(79,70,229,0.9)',
  };

  return createPortal(
    <div style={{position: 'fixed', inset: 0, zIndex: 2147483647}}>
      {mode === 'play' ? (
        // A very long min-display keeps the loop running for inspection until
        // the user hits pause; remounting via `key` restarts the intro.
        <Preloader key={key} minDisplayTime={999999} />
      ) : (
        <Preloader scrubMs={scrubMs} forcePopping={pop} />
      )}

      {/* Video-player-style control bar — must sit above the Preloader
          overlay (z-index 9999) inside this portal's stacking context. */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          background: 'rgba(0,0,0,0.72)',
          color: '#fff',
          padding: '10px 16px',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 13,
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          flexWrap: 'wrap',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <button style={mode === 'play' ? btnActive : btn} onClick={play}>
          ▶ Play
        </button>
        <button style={mode === 'scrub' ? btnActive : btn} onClick={pause}>
          ❚❚ Scrub
        </button>

        <span style={{opacity: 0.4}}>|</span>

        <button style={btn} onClick={() => step(-BIG_STEP_MS)} title="Shift+←">
          ◀◀
        </button>
        <button style={btn} onClick={() => step(-STEP_MS)} title="←">
          ◀ −{STEP_MS}
        </button>
        <button style={btn} onClick={() => step(STEP_MS)} title="→">
          +{STEP_MS} ▶
        </button>
        <button style={btn} onClick={() => step(BIG_STEP_MS)} title="Shift+→">
          ▶▶
        </button>

        <input
          type="range"
          min={0}
          max={MAX_MS}
          step={STEP_MS}
          value={mode === 'scrub' ? scrubMs : 0}
          disabled={mode === 'play'}
          onChange={(e) => {
            setMode('scrub');
            setScrubMs(Number(e.target.value));
          }}
          style={{flex: 1, minWidth: 180, accentColor: '#4f46e5'}}
        />
        <span style={{opacity: 0.85, minWidth: 70, textAlign: 'right', fontVariantNumeric: 'tabular-nums'}}>
          {mode === 'scrub' ? `${scrubMs} ms` : 'live'}
        </span>

        <span style={{opacity: 0.4}}>|</span>

        <label style={{display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer'}}>
          <input
            type="checkbox"
            checked={pop}
            onChange={(e) => {
              setPop(e.target.checked);
              setMode('scrub');
            }}
          />
          Popping
        </label>

        <span style={{opacity: 0.5, fontSize: 11, marginLeft: 'auto'}}>
          Space · ←/→ · Shift+←/→ · P · R
        </span>
      </div>
    </div>,
    document.body,
  );
}
