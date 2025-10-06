import React from "react";

interface BloomRotatingProps {
  speed: string;
  styles: string;
}

type CSSWithVars = React.CSSProperties & {
  "--spin-duration"?: string;
};

const BloomRotating = ({ speed, styles }: BloomRotatingProps) => {
  const style: CSSWithVars = { "--spin-duration": speed || "3s" };
  return (
    <div className={`animate-spin-custom ${styles}`} style={style}>
      <img
        src="/bloom_aira_3.webp"
        alt="bloom image effect that represent AI and technology"
        className="w-full h-full"
      />
    </div>
  );
};

export default BloomRotating;
