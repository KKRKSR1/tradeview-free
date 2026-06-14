"use client";

export default function ChartControls() {
  return (
    <div className="absolute bottom-16 right-2 z-20 flex flex-col gap-1">
      <button
        className="w-7 h-7 flex items-center justify-center rounded border transition-all"
        style={{ background: 'var(--bg3)', borderColor: 'var(--border2)', color: 'var(--text2)' }}
        title="Zoom In"
        onClick={() => window.dispatchEvent(new CustomEvent("chart:zoomIn"))}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--bg4)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'var(--bg3)'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </button>
      <button
        className="w-7 h-7 flex items-center justify-center rounded border transition-all"
        style={{ background: 'var(--bg3)', borderColor: 'var(--border2)', color: 'var(--text2)' }}
        title="Zoom Out"
        onClick={() => window.dispatchEvent(new CustomEvent("chart:zoomOut"))}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--bg4)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'var(--bg3)'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </button>
      <button
        className="w-7 h-7 flex items-center justify-center rounded border transition-all"
        style={{ background: 'var(--bg3)', borderColor: 'var(--border2)', color: 'var(--text2)' }}
        title="Reset Chart"
        onClick={() => window.dispatchEvent(new CustomEvent("chart:fitContent"))}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--bg4)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'var(--bg3)'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
      </button>
    </div>
  );
}
