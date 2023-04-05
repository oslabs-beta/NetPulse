"use client";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Sidebar() {

    return (
        <div className={styles.sidebar}>
          <Image
            src={"/Goblins.png"}
            className={styles.sbLogo}
            alt="DataTrace Logo"
            width="190"
            height="190"
          />
          <div className={styles.sbContent}>
            <button className={styles.splashButton}>SplashPage</button>
            <button className={styles.secondButton}>SecondButton</button>
            <button className={styles.thirdButton}>ThirdButton</button>
            <Link href="/datatrace-splash" className={styles.sbLinks}>
              DataTrace Splash Page
            </Link>
            <Link href="/about" className={styles.sbLinks}>
              About Us
            </Link>
            <Link href="/blog/hello-world" className={styles.sbLinks}>
              Blog Post
            </Link>
          </div>
        </div>
    )
}