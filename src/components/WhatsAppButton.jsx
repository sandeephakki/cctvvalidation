import styles from './WhatsAppButton.module.css'

function WAIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4C9.373 4 4 9.373 4 16c0 2.385.668 4.612 1.826 6.504L4 28l5.65-1.8A11.935 11.935 0 0016 28c6.627 0 12-5.373 12-12S22.627 4 16 4z" fill="white"/>
      <path d="M22.5 19.5c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" fill="#25D366"/>
    </svg>
  )
}

export default function WhatsAppButton({ text }) {
  return (
    <button
      type="button"
      className={styles.btn}
      onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank')}
    >
      <WAIcon />
      <span>Share on WhatsApp</span>
    </button>
  )
}
