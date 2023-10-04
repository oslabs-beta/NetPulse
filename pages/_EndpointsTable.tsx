'use client';

import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import styles from '@/styles/EndpointsTable.module.css';
import { useMemo } from 'react';
import { DataType } from '@/types';
import { Box } from '@mui/material';
import errColor from './_Timeline/helperFunctions/errColor';

export default function EndpointsTable({ data }: any) {
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
        minSize: 200,
        maxSize: 1000,
        size: 300,
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
    <div className={styles.detailList}>
      <MaterialReactTable
        columns={columns}
        data={data}
        defaultColumn={{
          minSize: 50,
          maxSize: 300,
          size: 70,
        }}
        initialState={{ columnVisibility: { traceId: false }, density: 'compact' }}
        enablePagination={false}
        enableGlobalFilter={false}
        enableColumnResizing
        columnResizeMode="onEnd"
        layoutMode="grid"
        enableStickyHeader
      />
    </div>
  );
}
