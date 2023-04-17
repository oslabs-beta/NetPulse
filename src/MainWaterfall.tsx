import styles from './styles/MainWaterfall.module.css';

import * as d3 from 'd3';
import * as Plot from '@observablehq/plot';
import { useEffect, useRef } from 'react';
import { DataType } from './types';
import errColor from './functions/errColor';
import tooltips from './functions/tooltip';

// Component renders the main timeline chart
export default function MainWaterfall(props: any) {
  const svgRef: any = useRef(null);

  let svgWidth: any;
  let svgHeight: any;

  // Function to create gantt chart - takes in the data passed down from state
  function makeGanttChart(data: DataType[]) {
    if (data.length === 0) {
      return;
    }

    // p Creates the plot object - is wrapped in another function that creates tooltip behavior based on info in 'title'
    const p: any = tooltips(
      Plot.plot({
        width: svgWidth,
        height: svgHeight,
        marks: [
          Plot.axisX({ color: '#ced4da', anchor: 'top' }),
          Plot.barX(data, {
            x1: (d) => d.startTime,
            x2: (d) => d.startTime + d.duration,
            y: (d) => d.spanId,
            rx: 1,
            fill: (d) => errColor(d.contentLength, d.statusCode),
            title: (d) => `${d.endPoint} | ${d.duration}ms`,
            stroke: '#212529',
            strokeWidth: 1,
          }),
          Plot.gridX({ stroke: '#ced4da', strokeOpacity: 0.2 }),
        ],
        x: { label: 'ms', tickFormat: (e) => `${e} ms` },
        y: { axis: null, paddingOuter: 5 }, // 10 is as large as you should go for the padding base - if there are large numbers of the bars gets too small
      })
    );

    // Selects current timeline, removes it, then adds the newly created one on state updates
    d3.select(svgRef.current).selectAll('*').remove();
    if (p) {
      d3.select(svgRef.current).append(() => p);
    }
  }
  // Bases size of svg from observable on the current div size
  useEffect(() => {
    const { data } = props;
    if (svgRef.current) {
      const dimensions = svgRef.current.getBoundingClientRect();
      svgWidth = dimensions.width;
      svgHeight = dimensions.height;
    }
    makeGanttChart(data);
  }, [props?.data]);

  return <svg className={styles.chart} ref={svgRef} />;
}
