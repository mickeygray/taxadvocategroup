// components/BarnabyWidget.js
import React, { useEffect, useRef, useState } from "react";
import TaxBarnaby from "./TaxBarnaby";

export default function BarnabyWidget() {
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const overlayRef = useRef(null);

  const isHomePage =
    typeof window !== "undefined" && window.location.pathname === "/";
  const isDesktop = typeof window !== "undefined" && window.innerWidth > 768;

  // Show hint on desktop home page after delay (once)
  useEffect(() => {
    if (isHomePage && isDesktop && !hintDismissed && !open) {
      const timer = setTimeout(() => {
        setShowHint(true);
        setTimeout(() => setShowHint(false), 8000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isHomePage, isDesktop, hintDismissed, open]);

  const handleBarnabyClick = () => {
    setShowHint(false);
    setHintDismissed(true);
    setOpen(true);
  };

  const dismissHint = () => {
    setShowHint(false);
    setHintDismissed(true);
  };

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Prevent background scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  const closeOnBackdrop = (e) => {
    if (e.target === overlayRef.current) setOpen(false);
  };

  return (
    <>
      {/* Barnaby FAB + Hint */}
      {!open && (
        <div className="barnaby-widget-container">
          {showHint && isDesktop && (
            <div className="barnaby-hint">
              <button className="barnaby-hint-close" onClick={dismissHint}>
                &times;
              </button>
              <p>Have a tax question?</p>
              <span>Get free expert tax guidance</span>
              <div className="barnaby-hint-arrow"></div>
            </div>
          )}

          <button
            onClick={handleBarnabyClick}
            aria-label="Open tax question chat"
            className="barnaby-fab"
          >
            <div className="barnaby-fab-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 14.99 3.06 16.26L2 22L7.74 20.94C9.01 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="barnaby-fab-text">Have A Question?</span>
          </button>
        </div>
      )}

      {/* Barnaby Modal */}
      {open && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          onMouseDown={closeOnBackdrop}
          className="barnaby-modal-overlay"
        >
          <div className="barnaby-modal">
            <div className="barnaby-modal-header">
              <div className="barnaby-modal-title">
                <div className="barnaby-avatar">C</div>
                <div>
                  <div className="barnaby-name">Have A Question?</div>
                  <div className="barnaby-subtitle">Tax help by TAG</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="barnaby-close">
                &#10005;
              </button>
            </div>
            <div className="barnaby-modal-body">
              <TaxBarnaby />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
