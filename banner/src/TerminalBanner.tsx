import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const TerminalBanner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Window entrance spring
  const windowSpring = spring({
    frame,
    fps,
    config: {
      damping: 14,
      mass: 0.8,
      stiffness: 100,
    },
  });

  const windowScale = interpolate(windowSpring, [0, 1], [0.94, 1]);
  const windowOpacity = interpolate(windowSpring, [0, 1], [0, 1]);

  // Command typing animation (frames 14 to 42)
  const fullCommand = "npx bruhhm@latest";
  const typedLength = Math.min(
    fullCommand.length,
    Math.max(0, Math.floor(interpolate(frame, [14, 40], [0, fullCommand.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })))
  );
  const currentTyped = fullCommand.slice(0, typedLength);

  // Blinking cursor
  const cursorOpacity = Math.floor(frame / 8) % 2 === 0 ? 1 : 0;

  // Step visibility
  const showInitMsg = frame >= 46;
  const initMsgOpacity = interpolate(frame, [46, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Progress bar animation (frames 54 to 74)
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.floor(interpolate(frame, [54, 72], [0, 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })))
  );
  const progressChars = Math.floor(progressPercent / 5); // 20 chars max
  const progressBarStr = "=".repeat(progressChars) + "-".repeat(20 - progressChars);

  // Output card slide-in (frame 78+)
  const cardSpring = spring({
    frame: frame - 78,
    fps,
    config: { damping: 16, stiffness: 120 },
  });
  const showCard = frame >= 78;
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const cardTranslateY = interpolate(cardSpring, [0, 1], [10, 0]);

  // Final prompt (frame 145+)
  const showFinalPrompt = frame >= 145;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#080B10",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, Monaco, monospace",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      {/* Terminal Window */}
      <div
        style={{
          width: "920px",
          height: "360px",
          backgroundColor: "#0D1117",
          borderRadius: 12,
          border: "1px solid #30363D",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 30px rgba(31, 111, 235, 0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transform: `scale(${windowScale})`,
          opacity: windowOpacity,
        }}
      >
        {/* Title Bar */}
        <div
          style={{
            height: 38,
            backgroundColor: "#161B22",
            borderBottom: "1px solid #21262D",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 14px",
          }}
        >
          {/* macOS Action Buttons */}
          <div style={{ display: "flex", gap: 7 }}>
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                backgroundColor: "#FF5F56",
              }}
            />
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                backgroundColor: "#FFBD2E",
              }}
            />
            <div
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                backgroundColor: "#27C93F",
              }}
            />
          </div>

          {/* Terminal Title */}
          <div
            style={{
              fontSize: 12,
              color: "#8B949E",
              fontWeight: 500,
              letterSpacing: 0.5,
            }}
          >
            bruhhm@workstation: ~ (zsh)
          </div>

          {/* Right Status */}
          <div
            style={{
              fontSize: 11,
              color: "#58A6FF",
              backgroundColor: "rgba(88, 166, 255, 0.1)",
              padding: "2px 8px",
              borderRadius: 4,
              border: "1px solid rgba(88, 166, 255, 0.2)",
            }}
          >
            node v24.19.0
          </div>
        </div>

        {/* Terminal Body */}
        <div
          style={{
            flex: 1,
            padding: "16px 20px",
            color: "#C9D1D9",
            fontSize: 13.5,
            lineHeight: 1.55,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {/* Line 1: Command prompt */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#2EA043", fontWeight: 600 }}>❯</span>
            <span style={{ color: "#79C0FF", fontWeight: 500 }}>~</span>
            <span style={{ color: "#E6EDF3" }}>{currentTyped}</span>
            {frame < 44 && (
              <span
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 15,
                  backgroundColor: "#58A6FF",
                  marginLeft: 2,
                  opacity: cursorOpacity,
                }}
              />
            )}
          </div>

          {/* Line 2: Initializing environment */}
          {showInitMsg && (
            <div
              style={{
                opacity: initMsgOpacity,
                display: "flex",
                gap: 8,
                alignItems: "center",
                color: "#8B949E",
                fontSize: 12.5,
              }}
            >
              <span style={{ color: "#58A6FF" }}>[info]</span>
              <span>resolving environment &amp; mounting modules...</span>
            </div>
          )}

          {/* Line 3: Progress bar */}
          {frame >= 54 && (
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                fontSize: 12,
                color: "#8B949E",
              }}
            >
              <span style={{ color: "#58A6FF", fontFamily: "monospace" }}>
                [{progressBarStr}]
              </span>
              <span style={{ color: progressPercent === 100 ? "#3FB950" : "#58A6FF", fontWeight: 600 }}>
                {progressPercent}%
              </span>
              {progressPercent === 100 && (
                <span style={{ color: "#3FB950" }}>(ready)</span>
              )}
            </div>
          )}

          {/* Line 4: Developer Object Box */}
          {showCard && (
            <div
              style={{
                marginTop: 4,
                backgroundColor: "rgba(22, 27, 34, 0.85)",
                border: "1px solid #21262D",
                borderLeft: "3px solid #58A6FF",
                borderRadius: 6,
                padding: "10px 14px",
                opacity: cardOpacity,
                transform: `translateY(${cardTranslateY}px)`,
                display: "grid",
                gridTemplateColumns: "100px 1fr",
                rowGap: 4,
                columnGap: 10,
                fontSize: 12.5,
              }}
            >
              <span style={{ color: "#8B949E" }}>developer:</span>
              <span style={{ color: "#79C0FF", fontWeight: 600 }}>Abram Unabia (@bruhhm)</span>

              <span style={{ color: "#8B949E" }}>role:</span>
              <span style={{ color: "#FFA657" }}>Full-Stack Engineer & Creative Technologist</span>

              <span style={{ color: "#8B949E" }}>stack:</span>
              <span style={{ color: "#D2A8FF" }}>TypeScript, Dart, Python, React, Flutter, Next.js, Figma, Rive</span>

              <span style={{ color: "#8B949E" }}>status:</span>
              <span style={{ color: "#3FB950", fontWeight: 500 }}>
                Building scalable systems &amp; interactive motion
              </span>
            </div>
          )}

          {/* Line 5: Final Prompt */}
          {showFinalPrompt && (
            <div
              style={{
                marginTop: 6,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: "#2EA043", fontWeight: 600 }}>❯</span>
              <span style={{ color: "#79C0FF", fontWeight: 500 }}>~</span>
              <span style={{ color: "#8B949E" }}>listening on port 3000</span>
              <span
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 15,
                  backgroundColor: "#58A6FF",
                  marginLeft: 2,
                  opacity: cursorOpacity,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
