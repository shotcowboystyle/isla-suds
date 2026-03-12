import {useState, useCallback} from 'react';
import {Preloader} from '~/components/Preloader';

/**
 * Dev-only route for iterating on the Preloader animation.
 * Visit /dev/preloader to preview and replay the animation on demand.
 *
 * Controls:
 * - "Replay" button restarts the full animation cycle
 * - "Freeze" checkbox prevents the pop/exit so you can study the float
 * - "Min Display" slider adjusts the minDisplayTime prop
 */
export default function DevPreloader() {
  const [key, setKey] = useState(0);
  const [freeze, setFreeze] = useState(false);
  const [minDisplay, setMinDisplay] = useState(2500);
  const [status, setStatus] = useState('playing');

  const handleComplete = useCallback(() => {
    if (!freeze) {
      setStatus('completed');
    }
  }, [freeze]);

  const replay = () => {
    setStatus('playing');
    setKey((k) => k + 1);
  };

  return (
    <div style={{background: '#1a1a2e', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui'}}>
      {/* Controls panel - always visible above the preloader */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10000,
          background: 'rgba(0,0,0,0.9)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          borderTop: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <button
          onClick={replay}
          style={{
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Replay
        </button>

        <label style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px'}}>
          <input
            type="checkbox"
            checked={freeze}
            onChange={(e) => {
              setFreeze(e.target.checked);
              if (e.target.checked) replay();
            }}
          />
          Freeze (no pop/exit)
        </label>

        <label style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px'}}>
          Min Display: {minDisplay}ms
          <input
            type="range"
            min={0}
            max={10000}
            step={500}
            value={minDisplay}
            onChange={(e) => setMinDisplay(Number(e.target.value))}
            style={{width: '120px'}}
          />
        </label>

        <span
          style={{
            fontSize: '13px',
            opacity: 0.6,
            marginLeft: 'auto',
          }}
        >
          Status: {status}
        </span>
      </div>

      {/* Preloader instance */}
      {status === 'playing' && (
        <Preloader
          key={key}
          minDisplayTime={freeze ? 999999 : minDisplay}
          onComplete={handleComplete}
        />
      )}

      {/* Background content to confirm overlay covers everything */}
      <div style={{padding: '40px 24px', maxWidth: '600px', margin: '0 auto'}}>
        <h1 style={{fontSize: '24px', marginBottom: '16px'}}>Preloader Dev Sandbox</h1>
        <p style={{opacity: 0.7, lineHeight: 1.6}}>
          This page lets you iterate on the Preloader animation without refreshing.
          Use the controls at the bottom to replay, freeze the float state, or adjust timing.
        </p>
        <p style={{opacity: 0.5, marginTop: '12px', fontSize: '14px'}}>
          If you can see this text, the preloader has completed or is not mounted.
        </p>
      </div>
    </div>
  );
}
