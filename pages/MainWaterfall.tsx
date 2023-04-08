"use client";
import styles from "@/styles/MainWaterfall.module.css";
import { Inter } from "next/font/google";
import * as d3 from 'd3';
import * as Plot from "@observablehq/plot";

const inter = Inter({ subsets: ["latin"] });

export default function MainWaterfall(props: any) {
  return (
    <div className={styles.mainWaterfall}>
      
    </div>
  );
}

function make_gantt_chart(data) {
  // Unpack data here

  let p = Plot.plot({
      width: 900,
      height: 500,
      y: { domain: [traceIds|TraceNames] },
      marks: [
        Plot.barX(UnpackedDataArray, {
          x1: "Start Time",
          x2: "End Time",
          y: "TraceID",
          rx: 5,
          // Swap the fill functions...Use color picker function? 
          fill: function (d) {
            if (d.status == "RUNNING") {
              return "#669900";
            } else if (d.status == "FAILED") {
              return "#CC0000";
            } else if (d.status == "KILLED") {
              return "#ffbb33";
            } else if (d.status == "SUCCEEDED") {
              return "#33b5e5";
            } else {
              return "#33b5e5";
            }
          }
        }),
        Plot.ruleY(["FINAL TRACE ID"]),
        Plot.ruleX([d3.min(DATADURATIONARRAY.map((t) => t.startDate))])
      ]
    });

    d3.select(p)
      .select('g[aria-label="rule"]')
      .attr("transform", `translate(0,${p.scale("y").bandwidth})`);    
   d3.select('#container').append(() => p)
}

