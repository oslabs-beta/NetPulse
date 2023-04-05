"use client";
import styles from "@/styles/MainWaterfall.module.css";
import { Bar } from "react-chartjs-2";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Sidebar(props: any) {

    return (
        <div className={styles.mainWaterfall}>
            {/* Bar component from react-chartjs with all options/plugins */}
            <Bar
            data={props.barData}
            // width={400}
            // height={200}
            options={{
                maintainAspectRatio: false,
                aspectRatio: 1,
                indexAxis: "y",
                borderSkipped: false,
                borderWidth: 1,
                barPercentage: 0.1,
                categoryPercentage: 1,
                scales: {
                x: {
                    position: "top",
                    type: "time",
                    // stacked: true,
                    grid: {
                    // display: false,
                    // drawBorder: false,
                    drawTicks: false,
                    },
                    ticks: {
                    // autoSkip: true,
                    maxTicksLimit: 10,
                    callback: (value, index, values) => {
                        return `${value} ms`;
                    },
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
    )
}