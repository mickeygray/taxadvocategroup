// hooks/useAutoSaveProgress.js
import { useEffect, useRef } from "react";

export function useAutoSaveProgress(form, phase, enabled = true) {
  const saveTimeoutRef = useRef(null);
  const lastSavedRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      const dataToSave = {
        ...form,
        lastPhase: phase,
        startedAt: form.startedAt || Date.now(),
      };

      const dataStr = JSON.stringify(dataToSave);
      if (dataStr === lastSavedRef.current) return;

      fetch("/api/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: dataStr,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.ok) lastSavedRef.current = dataStr;
        })
        .catch(() => {});
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [form, phase, enabled]);
}

export async function restoreProgress() {
  try {
    const response = await fetch("/api/restore-progress", {
      credentials: "include",
    });
    const result = await response.json();
    if (result.ok && result.hasProgress) return result.data;
    return null;
  } catch {
    return null;
  }
}
