import styles from './LoginScreen.module.css'

function PebbleStack() {
  return (
    <div className={styles.stack}>
      {/* pebble 1 — bottom, largest, dusty mauve */}
      <svg className={`${styles.stone} ${styles.stone1}`} viewBox="0 0 70 46" fill="none" aria-hidden="true">
        <path d="M35 3C47 1,62 7,67 17C72 27,68 38,57 43C46 48,28 46,14 41C0 36,-2 24,3 14C8 4,20 5,35 3Z" fill="#c8b2d4"/>
        <path d="M18 12C14 17,15 25,20 26C25 27,28 22,26 15C24 9,21 7,18 12Z" fill="#ddd0ea" opacity="0.72"/>
        <path d="M42 36C37 38,30 37,26 35" stroke="#b09ec0" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      </svg>

      {/* pebble 2 — mauve-pink */}
      <svg className={`${styles.stone} ${styles.stone2}`} viewBox="0 0 58 37" fill="none" aria-hidden="true">
        <path d="M29 3C39 1,52 7,55 16C58 25,54 34,44 37C34 40,16 38,8 32C0 26,0 15,5 9C10 3,18 5,29 3Z" fill="#d4b8cc"/>
        <path d="M14 11C11 15,12 21,16 22C20 23,22 19,20 13C18 8,16 7,14 11Z" fill="#e8d4e0" opacity="0.72"/>
      </svg>

      {/* pebble 3 — periwinkle lavender */}
      <svg className={`${styles.stone} ${styles.stone3}`} viewBox="0 0 64 41" fill="none" aria-hidden="true">
        <path d="M32 3C43 1,57 7,62 17C67 27,63 37,52 41C41 45,24 43,12 37C0 31,-1 20,4 11C9 2,20 5,32 3Z" fill="#b8aed6"/>
        <path d="M17 12C13 17,14 24,19 25C24 26,26 21,24 14C22 8,19 7,17 12Z" fill="#d0c8ea" opacity="0.7"/>
        <path d="M38 33C34 35,27 34,24 32" stroke="#a498c2" strokeWidth="1.1" strokeLinecap="round" opacity="0.48"/>
      </svg>

      {/* pebble 4 — top, smallest, pale rose-lavender */}
      <svg className={`${styles.stone} ${styles.stone4}`} viewBox="0 0 50 33" fill="none" aria-hidden="true">
        <path d="M25 3C34 1,46 7,48 16C50 25,45 32,35 33C25 34,10 31,5 24C0 17,1 8,8 5C15 2,16 5,25 3Z" fill="#dbbcd6"/>
        <path d="M13 10C10 14,11 19,15 20C19 21,20 17,18 12C17 7,15 6,13 10Z" fill="#eedaec" opacity="0.72"/>
      </svg>
    </div>
  )
}

export default function LoginScreen({ onGoogleLogin }) {
  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <PebbleStack />
        <h1 className={styles.logo}>Pebble</h1>
        <p className={styles.desc}>할 일을 어디서든 이어서</p>
        <button className={styles.googleBtn} onClick={onGoogleLogin}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615Z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
            <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332Z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58Z"/>
          </svg>
          Google로 계속하기
        </button>
      </div>
    </div>
  )
}
