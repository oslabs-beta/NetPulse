"use client";
import styles from "@/styles/MainWaterfall.module.css";
import { Inter } from "next/font/google";
import * as d3 from 'd3';
import * as Plot from "@observablehq/plot";
import { DataType } from "../types";
import { errColor } from "../errColor";
import { useEffect, useRef } from 'react';

const inter = Inter({ subsets: ["latin"] });

export default function MainWaterfall(props: any) {

  const svgRef: any = useRef(); 

  useEffect(() => {
    make_gantt_chart(props.data); 
  }, [props.data])

  function make_gantt_chart(data: any) {
    console.log('in gantt chart');
    
    if (data.length === 0) {console.log('cant find data');return};
    console.log(data[0].endTime);
    let p: any = Plot.plot({
        marks: [
          Plot.barX(data, {
            x1: "startTime",
            x2: "endTime",
            y: "spanId",
            rx: 5,
            fill: errColor("contentLength", "statusCode")
          }),
        ]
      });
    
  if (p){
   d3.select(p)
      .select('g[aria-label="rule"]')
      .attr("transform", `translate(0,${p.scale("y").bandwidth})`);    
   d3.select('svg').append(() => p);
  }
}


  return (
    <svg ref = {svgRef} width = "900"></svg>
  );
}


