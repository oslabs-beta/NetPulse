// import styles from '@/styles/Sidebar.module.css';
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

export default function Sidebar() {
  return (
    <>
      <div id="sidebar" /*className={styles.sidebar}*/>
        <div /*className={styles.sbContent}*/>
          <div /*className={styles.mainLogo}*/>
            <div>
              <span /*className={styles.Data}*/>Data</span>
              <span>Trace</span>
            </div>
            <img
              src="/images/black.png"
              /*className={styles.sbLogo} */
              alt="DataTrace Logo"
              width="190"
              height="190"
            />
          </div>
          <div /*className={styles.textLinks}*/>
            <a href="/datatrace-splash" /*className={styles.sbLinks}*/ >
              Main
            </a>
            <a href="/about" /*className={styles.sbLinks}*/ >
              About
            </a>
            <a href="/blog" /*className={styles.sbLinks}*/ >
              Blog
            </a>
          </div>
          <div /*className={styles.logoLinks}*/ >
            <a href="https://www.medium.com">
              <img
                alt="medium icon"
                src="https://pluspng.com/img-png/medium-logo-vector-png-medium-icon-white-on-black-1600.png"
                /*className={styles.mediumLogo} */
              />
            </a>
            <a href="https://www.npmjs.com">
              <img
                alt="npm icon"
                src="https://andrejgajdos.com/wp-content/uploads/2019/11/npm-logo.png?x24361"
                /*className={styles.npmLogo} */
              />
            </a>
            <a href="https://www.github.com">
              <img
                alt="github icon"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngarts.com%2Ffiles%2F8%2FBlack-Github-Logo-PNG-Image.png&f=1&nofb=1&ipt=5c5906974e2cddb181d36fd5edbce6b3ae5528f9e5ee595828a539ded9f52efb&ipo=images"
                /*className={styles.githubLogo} */
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
