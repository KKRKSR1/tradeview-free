"use client";

import { useStore } from "@/store/useStore";
import { X } from "lucide-react";

export default function SettingsPanel() {
  const { indicators, updateIndicator, settingsOpen, toggleSettings } = useStore();

  if (!settingsOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={toggleSettings} />
      <div className="fixed right-0 top-0 h-full w-80 bg-[#0f0f0f] border-l border-[#1a1a1a] z-50 overflow-y-auto">
        <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between">
          <h2 className="text-white font-semibold">Indicator Settings</h2>
          <button onClick={toggleSettings} className="text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {indicators.map((ind) => (
            <div key={ind.type} className="bg-[#1a1a1a] rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium uppercase">{ind.type}</span>
                <button
                  onClick={() => updateIndicator(ind.type, { visible: !ind.visible })}
                  className={`w-10 h-5 rounded-full transition-colors ${
                    ind.visible ? "bg-blue-600" : "bg-zinc-600"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      ind.visible ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {ind.period !== undefined && (
                <div>
                  <label className="text-zinc-400 text-xs">Period</label>
                  <input
                    type="number"
                    value={ind.period}
                    onChange={(e) => updateIndicator(ind.type, { period: Number(e.target.value) })}
                    className="w-full bg-[#0f0f0f] text-white text-sm px-3 py-1.5 rounded border border-[#252525] focus:border-blue-600 focus:outline-none"
                    min={1}
                    max={200}
                  />
                </div>
              )}

              <div>
                <label className="text-zinc-400 text-xs">Color</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={ind.color || "#ffffff"}
                    onChange={(e) => updateIndicator(ind.type, { color: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <span className="text-zinc-500 text-xs">{ind.color}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
