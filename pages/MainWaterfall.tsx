"use client";
import styles from "@/styles/MainWaterfall.module.css";
import { Inter } from "next/font/google";
import * as d3 from 'd3';
import * as Plot from "@observablehq/plot";
import { DataType } from "../types";
import { errColor } from "../errColor";
import { useEffect, useRef } from 'react';
import { width } from "@mui/system";
import { DataThresholding } from "@mui/icons-material";

const inter = Inter({ subsets: ["latin"] });

export default function MainWaterfall(props: any) {

  const svgRef: any = useRef(null); 
  let svgWidth: any, svgHeight: any;
  const maxBarHeight = 20;
  let pOld;

  useEffect(() => {
    if (svgRef.current) {
      const dimensions = svgRef.current.getBoundingClientRect();
      svgWidth = dimensions.width;
      svgHeight = dimensions.height
    }
    make_gantt_chart(props.data); 
  }, [props.data])

  function make_gantt_chart(data: DataType[]) {

    if (data.length === 0) {return};
    
    let p: any = Plot.plot({
        width: svgWidth,
        height: svgHeight,
        marks: [
          Plot.axisX({color: '#ced4da', anchor: 'top'}),
          Plot.barX(data, {
            x1: data => data.startTime,
            x2: data => data.startTime + data.duration,
            y: data => data.traceId,
            rx: 1,
            fill: data => errColor(data.contentLength, data.statusCode),
            stroke: "#212529",
            strokeWidth: 1,
          }),
          Plot.gridX({ stroke: '#ced4da', strokeOpacity: .2})
        ],
        x: { label: 'ms', tickFormat: e => `${e} ms` },
        y: { axis: null, paddingOuter: 5}, // 10 is a good base, but if there are large numbers of traces it gets too small
      });
  

  if (p){
    d3.select(svgRef.current).selectAll("*").remove();
    d3.select(svgRef.current).append(() => p);
  }
}


  return (
    <svg className = {styles.chart} ref = {svgRef} ></svg>
  );
}


