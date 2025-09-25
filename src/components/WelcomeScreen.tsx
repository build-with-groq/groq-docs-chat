import styles from "../styles.module.css";

export function WelcomeScreen() {
  return (
    <div className={styles.welcomeScreen}>
      <div className={styles.logoContainer}>
        <div className={`${styles.logoCircle} ${styles.groqLogo}`}>
          <img src="/favicon.png" alt="Groq" width={40} height={40} className={styles.logoImage} />
        </div>
        <div className={`${styles.logoCircle} ${styles.cloudflareLogo}`}>
          <img src="/cloudflare.webp" alt="Cloudflare" width={40} height={40} className={styles.logoImage} />
        </div>
      </div>
      <div className={styles.welcomeContent}>
        <h1 className={styles.welcomeTitle}>Chat with Docs - Groq x Cloudflare</h1>
        <p className={styles.welcomeDescription}>
          Chat with any website using Groq's fast inference and Cloudflare's AI Search. Ask any question about Groq and get answers directly from the documentation.
        </p>
      </div>
      <div className={styles.welcomePrompt}>Start typing to begin your conversation</div>
    </div>
  )
} 