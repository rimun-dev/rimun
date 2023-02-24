import React from "react";

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

/*
This is a variation of the SVG spinner described in this article:
https://medium.com/@clg/animated-svg-spinner-8dff32d310fc
*/
export default function Spinner({ size = 24, color, ...props }: SpinnerProps) {
  const halfSize = size / 2;
  return (
    <>
      <style>
        {`@keyframes spinner {
            0% {
                stroke-dashoffset: calc(0.66 * ${size}px);
                transform: rotate(0deg);
            } 50% {
                stroke-dashoffset: calc(3.14 * ${size}px);
                transform: rotate(720deg);
            } 100% {
                stroke-dashoffset: calc(0.66 * ${size}px);
                transform: rotate(1080deg);
            }
        }`}
      </style>
      <svg
        {...props}
        className={`mx-auto ${color ? `text-${color}` : "text-brand"} ${
          props.className
        }`}
        width={size}
        height={size}
        x={0}
        y={0}
        viewBox={`0 0 ${size} ${size}`}
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      >
        <circle
          cx={halfSize}
          cy={halfSize}
          r={halfSize - 2}
          fill="transparent"
          style={{
            strokeDasharray: `calc(3.14 * ${size}px)`,
            transformOrigin: `calc(0.5px * ${size}) calc(0.5px * ${size}) 0`,
            animation: "spinner 2s linear infinite",
          }}
        ></circle>
      </svg>
    </>
  );
}
