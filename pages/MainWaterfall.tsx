'use client';

import { Bar } from 'react-chartjs-2';
import styles from '@/styles/MainWaterfall.module.css';
// import { Inter } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] });

export default function MainWaterfall({ barData }: any) {
  return (
    <div className={styles.mainWaterfall}>
      {/* Bar component from react-chartjs with all options/plugins */}
      <Bar
        data={barData}
        // width={400}
        // height={200}
        options={{
          maintainAspectRatio: false,
          aspectRatio: 1,
          indexAxis: 'y',
          borderSkipped: false,
          borderWidth: 1,
          barPercentage: 0.1,
          categoryPercentage: 1,
          scales: {
            x: {
              position: 'top',
              // @ts-ignore
              type: 'time',
              // stacked: true,
              grid: {
                // display: false,
                // drawBorder: true,
                drawTicks: false,
                color: '#495057',
                // @ts-ignore
                borderColor: 'red',
              },
              ticks: {
                // autoSkip: true,
                color: '#6c757d',
                maxTicksLimit: 10,
                // eslint-disable-next-line
                callback: (value, index, values) => `${value} ms`,
              },
            },
            y: {
              // beginAtZero: true,
              stacked: true,
              grid: {
                display: false,
                // drawBorder: false,
                // drawTicks: false,
              },
              ticks: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
}
