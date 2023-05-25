'use client';

// import react and nextjs packages
import Head from 'next/head';
import React, { useCallback, useMemo, useState, useEffect } from 'react';

// import types
import type { MRT_ColumnDef } from 'material-react-table';

// Material-UI Imports
import { Box } from '@mui/material';

// import socket client
import { io } from 'socket.io-client';
import styles from '@/styles/Home.module.css';

// import child components
// import { Inter } from 'next/font/google';
import Sidebar from './_Sidebar';
import MainWaterfall from './_MainWaterfall';
import DetailList from './_DetailList';

// import type
import { DataType } from '../types';

// import functions
import errColor from './functions/errColor';

// const inter = Inter({ subsets: ['latin'] });

// Main Component - Home
export default function Home() {
  // Hook for updating overall time and tying it to state
  // Time is determined by the difference between the final index's start+duration minus the initial index's start
  let initialStartTime: number;
  const [data, setData] = useState<DataType[]>([]);
  
  // Function to be passed down as props to reset data button
  const resetData = () => {
    setData([]); 
  }

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

  // Create columns -> later on, we can dynamically declare this based
  // on user options using a config file or object or state and only
  // rendering the things that are requested

  // Column declaration requires a flat array of objects with a header
  // which is the column's title, and an accessorKey, which is the
  // key in the data object.
  const columns = useMemo<MRT_ColumnDef<DataType>[]>(
    () => [
      {
        header: 'Endpoint',
        accessorKey: 'endPoint',
      },
      {
        header: 'Status',
        accessorKey: 'statusCode',
      },
      {
        header: 'Type',
        accessorKey: 'requestType',
      },
      {
        header: 'Method',
        accessorKey: 'requestMethod',
      },
      {
        header: 'Size (B)',
        accessorKey: 'contentLength',
      },
      {
        header: 'Start (ms)',
        accessorKey: 'startTime',
      },
      {
        header: 'Duration (ms)',
        accessorKey: 'duration',
      },
      {
        header: 'TraceID',
        accessorKey: 'traceId',
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
              color: 'transparent',
              // We first select the cell, then determine the left and right portions and make it a percentage
              //
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
            {/* The | mark is required to mount & render the boxes  */}|
          </Box>
        ),
      },
    ],
    [data]
  );

  return (
    <>
      <Head>
        <title>NetPulse Dashboard</title>
        <meta name="description" content="DataTrace Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className={styles.main}>
        <Sidebar resetData={resetData} />
        <div className={styles.networkContainer}>
          <MainWaterfall data={data} />
          <DetailList data={data} columns={columns} />
        </div>
      </main>
    </>
  );
}
