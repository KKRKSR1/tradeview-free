"use client";

import { useStore } from "@/store/useStore";
import { DrawingToolType } from "@/types";

type ToolType = "cursor" | "crosshair" | DrawingToolType | "text";

export default function LeftToolbar() {
  const { drawingMode, setDrawingMode, clearDrawings } = useStore();

  const tools: { type: ToolType | null; icon: React.ReactNode; label: string; separator?: boolean }[] = [
    { type: "cursor", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>, label: "Cursor" },
    { type: "crosshair", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>, label: "Crosshair" },
    { type: null, icon: <div className="w-5 h-px" style={{ background: 'var(--border)' }} />, label: "", separator: true },
    { type: "trendline", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="19" x2="19" y2="5"/></svg>, label: "Trend Line" },
    { type: "rectangle", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>, label: "Rectangle" },
    { type: "fibonacci", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>, label: "Fibonacci" },
    { type: null, icon: <div className="w-5 h-px" style={{ background: 'var(--border)' }} />, label: "", separator: true },
    { type: "text", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>, label: "Text" },
  ];

  return (
    <div className="flex flex-col items-center py-1.5 gap-0.5 border-r" style={{ width: '44px', background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      {tools.map((tool, i) => {
        if (tool.separator) {
          return <div key={`sep-${i}`} className="w-5.5 h-px my-0.5" style={{ background: 'var(--border)' }} />;
        }

        const isActive = drawingMode === tool.type;
        return (
          <button
            key={tool.type}
            onClick={() => setDrawingMode(isActive ? null : tool.type as string)}
            className="w-[34px] h-[34px] flex items-center justify-center rounded-lg transition-all border"
            style={{
              background: isActive ? 'var(--accent)' : 'transparent',
              color: isActive ? '#fff' : 'var(--text3)',
              borderColor: isActive ? 'var(--accent)' : 'transparent',
            }}
            onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'var(--bg4)'; e.currentTarget.style.color = 'var(--text)'; }}}
            onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text3)'; }}}
            title={tool.label}
          >
            {tool.icon}
          </button>
        );
      })}

      <div className="flex-1" />

      {/* Clear Drawings */}
      <button
        onClick={clearDrawings}
        className="w-[34px] h-[34px] flex items-center justify-center rounded-lg transition-all"
        style={{ color: 'var(--text3)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg4)'; e.currentTarget.style.color = 'var(--red)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text3)'; }}
        title="Clear Drawings"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    </div>
  );
}
