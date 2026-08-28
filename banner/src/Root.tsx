import React from "react";
import { Composition } from "remotion";
import { TerminalBanner } from "./TerminalBanner";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="TerminalBanner"
        component={TerminalBanner}
        durationInFrames={180}
        fps={30}
        width={960}
        height={400}
      />
    </>
  );
};
