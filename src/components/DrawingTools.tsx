"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Minus, TrendingUp, Square, Trash2, X } from "lucide-react";

interface Point {
  time: number;
  price: number;
}

export default function DrawingTools() {
  const { drawings, addDrawing, removeDrawing, clearDrawings, drawingMode, setDrawingMode } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState("#3b82f6");

  const tools = [
    { type: "horizontal", icon: Minus, label: "Horizontal Line" },
    { type: "trendline", icon: TrendingUp, label: "Trendline" },
    { type: "rectangle", icon: Square, label: "Rectangle" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          drawingMode ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white hover:bg-[#1a1a1a]"
        }`}
      >
        Draw
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-[#252525] rounded-lg shadow-xl z-50 w-48">
          <div className="p-2 border-b border-[#252525]">
            <div className="text-[10px] text-zinc-500 mb-1">Tools</div>
            <div className="space-y-1">
              {tools.map((tool) => (
                <button
                  key={tool.type}
                  onClick={() => setDrawingMode(drawingMode === tool.type ? null : tool.type)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded ${
                    drawingMode === tool.type
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-zinc-300 hover:bg-[#252525]"
                  }`}
                >
                  <tool.icon size={14} />
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-2 border-b border-[#252525]">
            <div className="text-[10px] text-zinc-500 mb-1">Color</div>
            <div className="flex gap-1">
              {["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ffffff"].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full border-2 ${
                    color === c ? "border-white" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {drawings.length > 0 && (
            <div className="p-2 border-b border-[#252525]">
              <div className="text-[10px] text-zinc-500 mb-1">Drawings ({drawings.length})</div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {drawings.map((d) => (
                  <div key={d.id} className="flex items-center justify-between text-xs text-zinc-300">
                    <span>{d.type}</span>
                    <button onClick={() => removeDrawing(d.id)} className="text-zinc-500 hover:text-red-400">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-2 flex gap-2">
            {drawings.length > 0 && (
              <button
                onClick={clearDrawings}
                className="flex-1 text-xs text-red-400 hover:bg-red-400/10 py-1 rounded"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 text-xs text-zinc-400 hover:bg-[#252525] py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
