import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useMemo } from 'react'
// For resizing & auto sorting columns - Move to detail
import MaterialReactTable from 'material-react-table';
// Type import
import type { MRT_ColumnDef } from 'material-react-table'; 
//Material-UI Imports
import {
  Box,
  // Button,
  // ListItemIcon,
  // MenuItem,
  // Typography,
  // TextField,
} from '@mui/material';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  // Declare interface for typescript data type

  interface DATATYPE {
    'start-time': number;
    source: string;
    duration: number;
    'package-size': number;
    'status-code': number;
    endpoint: string;
    'request-type': string;
    'waterfall': any;
  }
  
  // Create sample data (but later on, format imported data)
  const data: DATATYPE[] = [
    {
      'start-time': 12345,
      'source': 'codesmith',
      duration: 2000,
      'package-size': 10,
      'status-code': 200,
      endpoint: '/test',
      'request-type': 'GET',
      waterfall: 1,
    },
    {
      'start-time': 23456,
      'source': 'austin',
      duration: 3000,
      'package-size': 20,
      'status-code': 200,
      endpoint: '/test2',
      'request-type': 'GET',
      waterfall: 2,
    },
    {
      'start-time': 34567,
      'source': 'thomas',
      duration: 4000,
      'package-size': 30,
      'status-code': 200,
      endpoint: '/test3',
      'request-type': 'GET',
      waterfall: 3
    },
    {
      'start-time': 45678,
      'source': 'michael',
      duration: 5000,
      'package-size': 40,
      'status-code': 200,
      endpoint: '/test4',
      'request-type': 'GET',
      waterfall: 4
    },
    {
      'start-time': 56789,
      'source': 'ben',
      duration: 6000,
      'package-size': 50,
      'status-code': 200,
      endpoint: '/test5',
      'request-type': 'GET',
      waterfall: 5
    },
    {
      'start-time': 67890,
      'source': 'giles',
      duration: 7000,
      'package-size': 60,
      'status-code': 200,
      endpoint: '/test6',
      'request-type': 'GET',
      waterfall: 6
    },
    {
      'start-time': 12345,
      'source': 'codesmith',
      duration: 2000,
      'package-size': 10,
      'status-code': 200,
      endpoint: '/test',
      'request-type': 'GET',
      waterfall: 7,
    },
    {
      'start-time': 23456,
      'source': 'austin',
      duration: 3000,
      'package-size': 20,
      'status-code': 200,
      endpoint: '/test2',
      'request-type': 'GET',
      waterfall: 1,
    },
    {
      'start-time': 34567,
      'source': 'thomas',
      duration: 4000,
      'package-size': 30,
      'status-code': 200,
      endpoint: '/test3',
      'request-type': 'GET',
      waterfall: 1
    },
    {
      'start-time': 45678,
      'source': 'michael',
      duration: 5000,
      'package-size': 40,
      'status-code': 200,
      endpoint: '/test4',
      'request-type': 'GET',
      waterfall: 1
    },
    {
      'start-time': 56789,
      'source': 'ben',
      duration: 6000,
      'package-size': 50,
      'status-code': 200,
      endpoint: '/test5',
      'request-type': 'GET',
      waterfall: 1
    },
    {
      'start-time': 67890,
      'source': 'giles',
      duration: 7000,
      'package-size': 60,
      'status-code': 200,
      endpoint: '/test6',
      'request-type': 'GET',
      waterfall: 1
    },
    {
      'start-time': 12345,
      'source': 'codesmith',
      duration: 2000,
      'package-size': 10,
      'status-code': 200,
      endpoint: '/test',
      'request-type': 'GET',
      waterfall: 1,
    },
    {
      'start-time': 23456,
      'source': 'austin',
      duration: 3000,
      'package-size': 20,
      'status-code': 200,
      endpoint: '/test2',
      'request-type': 'GET',
      waterfall: 1,
    },
    {
      'start-time': 34567,
      'source': 'thomas',
      duration: 4000,
      'package-size': 30,
      'status-code': 200,
      endpoint: '/test3',
      'request-type': 'GET',
      waterfall: 1
    },
    {
      'start-time': 45678,
      'source': 'michael',
      duration: 5000,
      'package-size': 40,
      'status-code': 200,
      endpoint: '/test4',
      'request-type': 'GET',
      waterfall: 1
    },
    {
      'start-time': 56789,
      'source': 'ben',
      duration: 6000,
      'package-size': 50,
      'status-code': 200,
      endpoint: '/test5',
      'request-type': 'GET',
      waterfall: 1
    },
    {
      'start-time': 67890,
      'source': 'giles',
      duration: 7000,
      'package-size': 60,
      'status-code': 200,
      endpoint: '/test6',
      'request-type': 'GET',
      waterfall: 1
    },
  ];

  // Create columns -> later on, we can dynamically declare this based 
  // on user options using a config file or object or state and only
  // rendering the things that are requested

  //Column declaration requires a flat array of objects with a header
  // which is the column's title, and an accessorKey, which is the
  // key in the data object. 
  const columns = useMemo<MRT_ColumnDef<DATATYPE>[]>(
    () => [
      {
        header: 'Start',
        accessorKey: 'start-time',
      },
      {
        header: 'Source',
        accessorKey: 'source',
      },
      {
        header: 'Duration',
        accessorKey: 'duration',
      },
      {
        header: 'Size',
        accessorKey: 'package-size',
      },
      {
        header: 'Status',
        accessorKey: 'status-code',
      },
      {
        header: 'Endpoint',
        accessorKey: 'endpoint',
      },
      {
        header: 'Request',
        accessorKey: 'request-type',
      },
      {
        header: 'Waterfall',
        accessorKey: 'waterfall',
        minSize: 200, //min size enforced during resizing
        maxSize: 1000, //max size enforced during resizing
        size: 200, //medium column
            //custom conditional format and styling
            Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  backgroundColor:'green',
                  borderRadius: '0.2rem',
                  color: '#fff',
                  width: `${cell.getValue<number>()*10}px`,
                  // maxWidth: '9ch',
                  // p: '0.25rem',
                })}
              >
                {cell.getValue<number>().toLocaleString()}
              </Box>
            ),
      }
    ],
    [],
  );

  return (
    <>
      <Head>
        <title>DataTrace Dashboard</title>
        <meta name="description" content="DataTrace Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* REMEMBER TO CHANGE ICON AND FAVICON LTER */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className = {styles.sidebar}>
          hello
        </div>
        <div className = {styles.networkContainer}>
          <div className = {styles.mainWaterfall}>
          </div>
          {/* Check if we can directly assign CSS to component names */}
          <div className = {styles.detailList}>
            {/* Data is passed via data, column info passed via columns */}
            <MaterialReactTable
              columns={columns}
              data={data}
              defaultColumn={{
                minSize: 50, //allow columns to get smaller than default
                maxSize: 300, //allow columns to get larger than default
                size: 150, //make columns wider by default
              }}
              // enableRowSelection
              enablePagination={false} 
              enableGlobalFilter={false}
              enableColumnResizing
              columnResizeMode='onEnd'
              layoutMode='grid'
              muiTableHeadCellProps={{
                sx: {
                  flex: '0 0 auto',
                },
              }}
              muiTableBodyCellProps={{
                sx: {
                  flex: '0 0 auto',
                },
              }}
            />
          </div>
        </div>
      </main>
    </>
  )
}
