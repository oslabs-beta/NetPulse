'use client';

// import react and nextjs packages
import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import React, { useCallback, useMemo, useState, useEffect } from 'react';

// import types
import type { MRT_ColumnDef } from 'material-react-table';

// Material-UI Imports
// import { CellTower } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Chart, registerables } from 'chart.js'; // import chart.js & react-chartjs components
import 'chartjs-adapter-date-fns'; // register chart.js elements due to webpack tree-shaking, else error

// import socket client
import { io } from 'socket.io-client';

// import child components
// import { Inter } from 'next/font/google';
import Sidebar from './Sidebar';
import MainWaterfall from './MainWaterfall';
import DetailList from './DetailList';

// import fonts
import { DataType } from '../types';

Chart.register(...registerables);
// const inter = Inter({ subsets: ['latin'] });

// Main Component - Home
export default function Home() {
  // Hook for updating overall time and tying it to state
  // Time is determined by the difference between the final index's start+duration minus the initial index's start
  let initialStartTime: number;
  const [data, setData] = useState<DataType[]>([]);

  // intialize socket connection
  // when data recieved update state here
  const socketInitializer = useCallback(async () => {
    const socket = await io('http://localhost:4000/');
    socket.on('connect', () => {
      console.log('socket connected.');
    });
    socket.on('message', (msg) => {
      // when data recieved concat messages state with inbound traces
      const serverTraces: DataType[] = JSON.parse(msg);
      serverTraces.forEach((el: DataType) => {
        const newEl = { ...el };
        // TODO: change the below to check for equal to 0 when we get rid of starter data
        if (initialStartTime === undefined) {
          initialStartTime = el.startTime;
        }
        if (el.contentLength === null) newEl.contentLength = 1;
        newEl.startTime -= initialStartTime;
        setData((prev: DataType[]) => [...prev, newEl]);
      });
    });
  }, [setData]);

  // when home component mounts initialize socket connection
  useEffect(() => {
    socketInitializer();
  }, []);

  // an empty array that collects barData objects in the below for loop
  const barDataSet = [];

  // generates barData object for each sample data from data array with label being the endpoint
  // data takes in the exact start-time and total time
  for (let i = 0; i < data.length; i++) {
    barDataSet.push({
      label: [data[i].endPoint],
      data: [
        {
          x: [data[i].startTime, data[i].startTime + data[i].duration],
          y: 1,
        },
      ],
      backgroundColor: ['green'],
      borderColor: ['limegreen'],
    });
  }

  // final data for Bar chartjs component
  const barData = {
    labels: ['trace1'],
    datasets: barDataSet,
  };

  // Create columns -> later on, we can dynamically declare this based
  // on user options using a config file or object or state and only
  // rendering the things that are requested

  // Column declaration requires a flat array of objects with a header
  // which is the column's title, and an accessorKey, which is the
  // key in the data object.
  const columns = useMemo<MRT_ColumnDef<DataType>[]>(
    () => [
      {
        header: 'Start',
        accessorKey: 'startTime',
      },
      {
        header: 'TraceID',
        accessorKey: 'traceId',
      },
      {
        header: 'Duration',
        accessorKey: 'duration',
      },
      {
        header: 'Size',
        accessorKey: 'contentLength',
      },
      {
        header: 'Status',
        accessorKey: 'statusCode',
      },
      {
        header: 'Endpoint',
        accessorKey: 'endPoint',
      },
      {
        header: 'Request',
        accessorKey: 'requestType',
      },
      {
        header: 'Waterfall',
        accessorKey: 'spanId',
        enablePinning: true,
        minSize: 200, // min size enforced during resizing
        maxSize: 1000, // max size enforced during resizing
        size: 300, // medium column
        // custom conditional format and styling
        // eslint-disable-next-line
        Cell: ({ cell, row }) => (
          <Box
            component="span"
            sx={() => ({
              // eslint-disable-next-line
              backgroundColor: errColor(row.original.contentLength!, row.original.statusCode),
              borderRadius: '0.1rem',
              color: 'white',
              // Proof of concept for the displays - these still must be tied to state.  We first select the
              // cell, then determine the left and right portions and make it a percentage
              marginLeft: (() => {
                const cellStartTime = row.original.startTime;
                const totalTime = data.length
                  ? data[data.length - 1].startTime + data[data.length - 1].duration
                  : cellStartTime;
                const pCellTotal = (cellStartTime / totalTime) * 100;
                return `${pCellTotal}%`;
              })(),
              width: (() => {
                const cellDuration = row.original.duration;
                const totalTime = data.length
                  ? data[data.length - 1].startTime + data[data.length - 1].duration
                  : cellDuration;
                const pCellDuration = (cellDuration / totalTime) * 100;
                return `${pCellDuration}%`;
              })(),
            })}
          >
            {/* below is the duration in seconds displayed as text in the waterfall bar */}
            {/* {row.original["duration"] / 1000} */}|
          </Box>
        ),
      },
    ],
    [data]
  );

  function errColor(contentLength: number, statusCode: number): string {
    if (!statusCode) return 'red';
    const strStatus: string = statusCode.toString();
    if (contentLength > 1 && strStatus[0] === '2') return 'green';
    if (strStatus[0] === '3') return '#34dbeb';
    if (strStatus[0] === '4') return 'red';
    if (strStatus[0] === '5') return 'red';
    return 'red';
  }

  return (
    <>
      <Head>
        <title>DataTrace Dashboard</title>
        <meta name="description" content="DataTrace Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* REMEMBER TO CHANGE ICON AND FAVICON LTER */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Sidebar />
        <div className={styles.networkContainer}>
          <MainWaterfall barData={barData} />
          <DetailList data={data} columns={columns} />
        </div>
      </main>
    </>
  );
}
