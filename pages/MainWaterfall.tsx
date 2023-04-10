"use client";
import styles from "@/styles/MainWaterfall.module.css";
import { Inter } from "next/font/google";
import * as d3 from 'd3';
import * as Plot from "@observablehq/plot";
import { DataType } from "../types";
import { errColor } from "../errColor";
import { useEffect, useRef } from 'react';
import { width } from "@mui/system";

const inter = Inter({ subsets: ["latin"] });

export default function MainWaterfall(props: any) {

  const svgRef: any = useRef(null); 
  let svgWidth: any, svgHeight: any;

  useEffect(() => {
    if (svgRef.current) {
      const dimensions = svgRef.current.getBoundingClientRect();
      svgWidth = dimensions.width;
      svgHeight = dimensions.height
    }
    make_gantt_chart(props.data); 
  }, [props.data])

  function make_gantt_chart(data: any) {

    if (data.length === 0) {return};

    let p: any = Plot.plot({
        width: svgWidth,
        height: svgHeight,
        marks: [
          Plot.barX(data, {
            x1: "startTime",
            x2: data => data.startTime + data.duration,
            y: "traceId",
            rx: 1,
            fill: data => errColor(data.contentLength, data.statusCode)
          }),
        ], 
      });

  d3.select(svgRef.current).selectAll("*").remove();

  if (p){
   d3.select(svgRef.current).append(() => p);
  }
}


  return (
    <svg className = {styles.chart} ref = {svgRef} ></svg>
  );
}


