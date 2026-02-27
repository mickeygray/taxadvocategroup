import React, { useState, memo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const FIPS_TO_ABBR = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA",
  "08": "CO", "09": "CT", 10: "DE", 12: "FL", 13: "GA",
  15: "HI", 16: "ID", 17: "IL", 18: "IN", 19: "IA",
  20: "KS", 21: "KY", 22: "LA", 23: "ME", 24: "MD",
  25: "MA", 26: "MI", 27: "MN", 28: "MS", 29: "MO",
  30: "MT", 31: "NE", 32: "NV", 33: "NH", 34: "NJ",
  35: "NM", 36: "NY", 37: "NC", 38: "ND", 39: "OH",
  40: "OK", 41: "OR", 42: "PA", 44: "RI", 45: "SC",
  46: "SD", 47: "TN", 48: "TX", 49: "UT", 50: "VT",
  51: "VA", 53: "WA", 54: "WV", 55: "WI", 56: "WY",
  11: "DC",
};

const getAbbr = (geo) => {
  const id = geo.id || geo.properties?.STATEFP || "";
  return FIPS_TO_ABBR[String(id).padStart(2, "0")] || "";
};

const USMapSVG = memo(
  ({
    activeState = null,
    onStateClick,
    interactive = true,
    compact = false,
    className = "",
  }) => {
    const [hovered, setHovered] = useState(null);

    return (
      <div
        className={`us-map ${compact ? "us-map--compact" : ""} ${className}`}
        role="navigation"
        aria-label="Interactive US state map"
      >
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: compact ? 800 : 1000 }}
          width={980}
          height={compact ? 500 : 600}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const abbr = getAbbr(geo);
                if (!abbr) return null;

                const isActive = abbr === activeState;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      if (interactive && onStateClick) onStateClick(abbr);
                    }}
                    onMouseEnter={() => interactive && setHovered(abbr)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      default: {
                        fill: isActive ? "#c9a227" : "#0f2440",
                        stroke: "#fff",
                        strokeWidth: isActive ? 1.8 : 0.6,
                        outline: "none",
                        cursor: interactive ? "pointer" : "default",
                        transition: "fill 0.15s ease",
                      },
                      hover: {
                        fill: isActive ? "#b8922a" : "#c9a227",
                        stroke: "#fff",
                        strokeWidth: 1.2,
                        outline: "none",
                        cursor: interactive ? "pointer" : "default",
                      },
                      pressed: {
                        fill: "#b8922a",
                        stroke: "#fff",
                        strokeWidth: 1.5,
                        outline: "none",
                      },
                    }}
                    data-state={abbr}
                    aria-label={abbr}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {interactive && hovered && (
          <div className="us-map__hover-label" aria-live="polite">
            {hovered}
          </div>
        )}
      </div>
    );
  },
);

USMapSVG.displayName = "USMapSVG";

export default USMapSVG;
