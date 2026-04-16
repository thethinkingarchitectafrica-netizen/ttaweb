"use client";

import { createContext, useContext, useCallback, useRef, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++counter.current;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismiss = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
    error: <XCircle size={18} className="text-red-400 shrink-0" />,
    info: <AlertCircle size={18} className="text-accent shrink-0" />,
  };

  const bars = {
    success: "bg-emerald-400",
    error: "bg-red-400",
    info: "bg-accent",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Stack — bottom-right, stacked */}
      <div
        role="region"
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 items-end pointer-events-none"
      >
        {toasts.map(t => (
          <div
            key={t.id}
            role="alert"
            className="pointer-events-auto flex items-center gap-3 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl px-5 py-4 min-w-64 max-w-sm animate-in slide-in-from-right-4 fade-in duration-300 relative overflow-hidden"
          >
            {/* Progress bar */}
            <div className={`absolute bottom-0 left-0 h-0.5 ${bars[t.type]} animate-[shrink_4s_linear_forwards]`} style={{ width: "100%" }} />
            {icons[t.type]}
            <p className="text-sm text-white/80 font-medium flex-1 leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-white/20 hover:text-white/60 transition-colors p-1 rounded-lg hover:bg-white/5 ml-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}
