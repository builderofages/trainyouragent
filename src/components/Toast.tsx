// src/components/Toast.tsx
// Minimal toast system. Use the imperative `toast()` from anywhere after mounting <ToastHost />.

import { useEffect, useState } from "react";

type ToastItem = { id: number; kind: "ok" | "err" | "info"; msg: string };

let push: ((t: Omit<ToastItem, "id">) => void) | null = null;

export function toast(msg: string, kind: ToastItem["kind"] = "info") {
  if (push) push({ kind, msg });
}

export default function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    push = (t) => {
      const id = Date.now() + Math.random();
      setItems((xs) => [...xs, { ...t, id }]);
      setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 4200);
    };
    return () => { push = null; };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none" style={{ fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      {items.map((it) => (
        <div key={it.id}
             className={`pointer-events-auto rounded-2xl px-5 py-3 shadow-[0_10px_30px_-10px_rgba(4,44,83,0.4)] border text-[14px] font-medium max-w-sm
               ${it.kind === "ok" ? "bg-white border-[#22A36C]/30 text-[#042C53]" : ""}
               ${it.kind === "err" ? "bg-white border-[#B23]/30 text-[#B23]" : ""}
               ${it.kind === "info" ? "bg-[#042C53] border-[#042C53] text-white" : ""}`}>
          {it.kind === "ok" && <span className="inline-block w-2 h-2 rounded-full bg-[#22A36C] mr-2 align-middle" />}
          {it.msg}
        </div>
      ))}
    </div>
  );
}
