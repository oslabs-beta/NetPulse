import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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
          <div className = {styles.detailList}>
            
          </div>
        </div>
      </main>
    </>
  )
}
