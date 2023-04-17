import MaterialReactTable from 'material-react-table'; // For resizing & auto sorting columns - Move to detail

import styles from './styles/DetailList.module.css';

export default function DetailList({ columns, data }: any) {
  return (
    <div className={styles.detailList}>
      {/* Data is passed via data, column info passed via columns */}
      <MaterialReactTable
        columns={columns}
        data={data}
        defaultColumn={{
          minSize: 50, // allow columns to get smaller than default
          maxSize: 300, // allow columns to get larger than default
          size: 70, // make columns wider by default
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
