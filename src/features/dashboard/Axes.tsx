import { useMemo } from "react";
import * as d3 from "d3";

export function BottomAxis({
  width,
  height,
  domain = [new Date("01 01 2021"), new Date("12 01 2021")],
}) {
  const range = [0, width];
  const ticks = useMemo(() => {
    const xScale = d3.scaleTime().domain(domain).range(range);
    const width = range[1] - range[0];
    const pixelsPerTick = 120;
    const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));
    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value),
    }));
  }, [domain.join("-"), range.join("-")]);

  return (
    <>
      <path
        d={["M", range[0], 6, "v", -6, "H", range[1], "v", 6].join(" ")}
        fill="none"
        stroke="black"
      />
      {ticks.map(({ value, xOffset }) => (
        <g key={value.toDateString()} transform={`translate(${xOffset}, 0)`}>
          <line y2="6" stroke="currentColor" />
          <text
            key={value.toDateString()}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)",
            }}
          >
            {`${value.getDate()}/${
              value.getMonth() + 1
            }/${value.getFullYear()}`}
          </text>
        </g>
      ))}
    </>
  );
}

/* export function LeftAxis({
  width,
  height,
  domain = [new Date("01 01 2022"), new Date("12 01 2022")],
}) {
  const range = [0, height];
  const ticks = useMemo(() => {
    const scale = d3.scaleOrdinal().domain(domain).range(range);
    const width = range[1] - range[0];
    const pixelsPerTick = 60;
    const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));
    return scale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      offset: scale(value),
    }));
  }, [domain.join("-"), range.join("-")]);

  return (
    <>
      <path
        d={["M", 0, range[0], "V", -range[1]].join(" ")}
        fill="none"
        stroke="black"
      />
      {ticks.map(({ value, offset }) => (
        <g key={value.toDateString()} transform={`translate(0, -${offset})`}>
          <line x2="6" stroke="currentColor" />
          <text
            key={value.toDateString()}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateX(-20px)",
            }}
          >
            {`${value.getMonth() + 1}/${value.getFullYear()}`}
          </text>
        </g>
      ))}
    </>
  );
} */

export function LeftAxis({
  width,
  height,
  domain = ["asd1", "asd2", "asd3", "asd4", "asd5"],
}) {
  const margin = 40;
  const pixelsPerTick = (height - margin * 2) / (domain.length - 1);
  const ticks = useMemo(() => {
    const scale = d3
      .scaleOrdinal(Array.from(new Array(domain.length), (_, idx) => idx))
      .domain(domain);
    return domain.map((value) => ({
      value,
      offset: margin + scale(value) * pixelsPerTick,
    }));
  }, [domain.join("-")]);

  return (
    <>
      <path
        d={["M", 0, 0, "V", -height].join(" ")}
        fill="none"
        stroke="black"
      />
      {ticks.map(({ value, offset }) => (
        <g key={value} transform={`translate(0, -${offset})`}>
          <line x2="6" stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateX(-20px)",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
}
