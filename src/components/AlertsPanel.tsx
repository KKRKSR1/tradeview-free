"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { X, Plus, Trash2, Bell, BellOff } from "lucide-react";

export default function AlertsPanel() {
  const { alerts, addAlert, removeAlert, toggleAlert, alertsOpen, toggleAlerts, symbol } = useStore();
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"above" | "below">("above");

  const handleAdd = () => {
    if (!price || isNaN(Number(price))) return;
    addAlert({
      id: Date.now().toString(),
      symbol,
      type,
      price: Number(price),
      active: true,
      createdAt: Date.now(),
    });
    setPrice("");
  };

  if (!alertsOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={toggleAlerts} />
      <div className="fixed right-0 top-0 h-full w-80 bg-[#0f0f0f] border-l border-[#1a1a1a] z-50 overflow-y-auto">
        <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between">
          <h2 className="text-white font-semibold">Price Alerts</h2>
          <button onClick={toggleAlerts} className="text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-[#1a1a1a] rounded-lg p-3 mb-4">
            <div className="text-xs text-zinc-400 mb-2">New Alert for {symbol}</div>
            <div className="flex gap-2 mb-2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "above" | "below")}
                className="bg-[#0f0f0f] text-white text-sm px-2 py-1.5 rounded border border-[#252525] focus:outline-none"
              >
                <option value="above">Price Above</option>
                <option value="below">Price Below</option>
              </select>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price..."
                className="flex-1 bg-[#0f0f0f] text-white text-sm px-3 py-1.5 rounded border border-[#252525] focus:border-blue-600 focus:outline-none"
              />
            </div>
            <button
              onClick={handleAdd}
              className="w-full bg-blue-600 text-white text-sm py-1.5 rounded hover:bg-blue-700 flex items-center justify-center gap-1"
            >
              <Plus size={14} /> Add Alert
            </button>
          </div>

          <div className="space-y-2">
            {alerts.length === 0 && (
              <div className="text-zinc-500 text-sm text-center py-4">No alerts set</div>
            )}
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-[#1a1a1a] rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-white text-sm">{alert.symbol}</div>
                  <div className="text-zinc-400 text-xs">
                    {alert.type === "above" ? "↑" : "↓"} {alert.price}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={alert.active ? "text-yellow-400" : "text-zinc-600"}
                  >
                    {alert.active ? <Bell size={16} /> : <BellOff size={16} />}
                  </button>
                  <button onClick={() => removeAlert(alert.id)} className="text-zinc-500 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
